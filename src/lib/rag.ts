import { KNOWLEDGE_BASE, type KnowledgeChunk } from "@/data/knowledge-base";
import { trackEvent } from "@/lib/telemetry";
import {
  groqReplySchema,
  redactPhoneNumbers,
  checkChatRateLimit,
} from "@/lib/rag-guards";

export { groqReplySchema, redactPhoneNumbers, checkChatRateLimit };

export interface ChatTurn {
  role: "user" | "assistant";
  content: string;
}

export interface StructuredReply {
  summary: string;
  points: string[];
  clarifyingQuestion: string;
  quickOptions: string[];
  sources: string[];
  telemetry: {
    durationMs: number;
    usedGroq: boolean;
    wordCount: number;
    chunkIds: string[];
  };
}

const STOP_WORDS = new Set([
  "the", "is", "are", "a", "an", "and", "or", "for", "to", "in", "of", "on", "with", "what", "how", "do", "you", "we", "me", "my", "can", "i",
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOP_WORDS.has(t));
}

export function retrieveRelevantChunks(query: string, topK = 3): KnowledgeChunk[] {
  const tokens = tokenize(query);
  if (tokens.length === 0) {
    return KNOWLEDGE_BASE.slice(0, topK);
  }

  const scored = KNOWLEDGE_BASE.map((chunk) => {
    const haystack = `${chunk.title} ${chunk.content}`.toLowerCase();
    let score = 0;

    for (const token of tokens) {
      if (chunk.tags.some((tag) => tag.includes(token) || token.includes(tag))) {
        score += 4;
      }
      if (chunk.title.toLowerCase().includes(token)) {
        score += 3;
      }
      const matches = haystack.split(token).length - 1;
      score += Math.min(matches, 3);
    }

    return { chunk, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topK).map((s) => s.chunk);
}

function clampWords(text: string, maxWords: number): string {
  const cleaned = redactPhoneNumbers(text.trim());
  const words = cleaned.split(/\s+/);
  if (words.length <= maxWords) return cleaned;
  return `${words.slice(0, maxWords).join(" ")}...`;
}

function countWords(reply: Pick<StructuredReply, "summary" | "points" | "clarifyingQuestion">): number {
  const all = [reply.summary, ...reply.points, reply.clarifyingQuestion].join(" ").trim();
  return all ? all.split(/\s+/).length : 0;
}

const CHAT_API_ENDPOINT = "/api/chat";
const CHAT_TIMEOUT_MS = 8000;

export async function askGroqWithRag(
  userQuery: string,
  history: ChatTurn[] = []
): Promise<StructuredReply> {
  const startTime = performance.now();
  const chunks = retrieveRelevantChunks(userQuery, 3);
  const contextBlock = chunks.map((c) => `[${c.title}]\n${c.content}`).join("\n\n").slice(0, 3500);
  const sources = chunks.map((c) => c.title);
  const chunkIds = chunks.map((c) => c.id);

  if (!checkChatRateLimit()) {
    trackEvent({ event: "rag_rate_limited", level: "warn" });
    return {
      summary: "Too many rapid questions. Please wait a moment or speak with our engineers directly.",
      points: ["Use Call Studio or WhatsApp above for immediate help"],
      clarifyingQuestion: "Would you like to book a free site consultation instead?",
      quickOptions: ["Residential Home", "Packages & Rates"],
      sources,
      telemetry: { durationMs: 0, usedGroq: false, wordCount: 28, chunkIds },
    };
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), CHAT_TIMEOUT_MS);

  try {
    const recentHistory = history.slice(-4).map((m) => ({
      role: m.role,
      content: m.content.slice(0, 350),
    }));

    const response = await fetch(CHAT_API_ENDPOINT, {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: userQuery.slice(0, 400),
        contextBlock,
        history: recentHistory,
      }),
    });

    if (!response.ok) {
      throw new Error(`Chat API HTTP ${response.status}`);
    }

    const parsedJson: unknown = await response.json();
    const validated = groqReplySchema.safeParse(parsedJson);
    if (!validated.success) {
      throw new Error("Invalid chat API response schema");
    }

    const normalized = {
      summary: clampWords(validated.data.summary, 24),
      points: validated.data.points.slice(0, 3).map((p) => clampWords(p, 14)),
      clarifyingQuestion: clampWords(validated.data.clarifyingQuestion, 20),
      quickOptions:
        validated.data.quickOptions.length > 0
          ? validated.data.quickOptions.slice(0, 3).map((o) => clampWords(o, 4))
          : ["Coimbatore plot", "Salem plot", "Book Site Visit"],
    };

    const durationMs = Math.round(performance.now() - startTime);
    const wordCount = countWords(normalized);

    trackEvent({
      event: "rag_query_complete",
      metadata: { durationMs, usedGroq: true, wordCount, chunkIds: chunkIds.join(",") },
    });

    return {
      ...normalized,
      sources,
      telemetry: { durationMs, usedGroq: true, wordCount, chunkIds },
    };
  } catch (err) {
    const fallback = buildStructuredFallback(userQuery, chunks);
    const durationMs = Math.round(performance.now() - startTime);
    const wordCount = countWords(fallback);
    trackEvent({
      event: "rag_groq_fallback",
      level: "warn",
      metadata: {
        durationMs,
        wordCount,
        reason: err instanceof Error ? err.message.slice(0, 80) : "unknown",
      },
    });
    return {
      ...fallback,
      sources,
      telemetry: { durationMs, usedGroq: false, wordCount, chunkIds },
    };
  } finally {
    clearTimeout(timeoutId);
  }
}

function buildStructuredFallback(
  query: string,
  chunks: KnowledgeChunk[]
): Pick<StructuredReply, "summary" | "points" | "clarifyingQuestion" | "quickOptions"> {
  const q = query.toLowerCase();
  if (q.includes("package") || q.includes("price") || q.includes("cost") || q.includes("rate")) {
    return {
      summary: "We offer Standard, Premium, and Luxury turnkey packages with written brand specs.",
      points: [
        "All cement, steel, wire & pipe brands locked upfront",
        "Stage-linked billing with 70-point quality checks",
        "Full per-sq.ft comparison on our Packages page",
      ],
      clarifyingQuestion: "Which city is your plot in, and how many floors are you planning?",
      quickOptions: ["Coimbatore G+1", "Salem Residential", "Commercial / PEB"],
    };
  }

  const primary = chunks[0];
  const sentences = primary
    ? primary.content.split(/\.\s+/).filter(Boolean).slice(0, 3)
    : ["We deliver turnkey homes, commercial builds, and DTCP approvals in Coimbatore and Salem."];

  return {
    summary: clampWords(sentences[0] || primary?.title || "Adithya Studio details:", 24),
    points: sentences.slice(1).map((s) => clampWords(s, 14)),
    clarifyingQuestion: "What is your plot location and project type so we can guide you better?",
    quickOptions: ["Residential Home", "Commercial / PEB", "DTCP Approval"],
  };
}
