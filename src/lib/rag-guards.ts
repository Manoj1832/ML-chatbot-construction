import { z } from "zod";

/** Zod schema validating untrusted LLM JSON output (OWASP LLM05) */
export const groqReplySchema = z.object({
  summary: z.string().trim().min(1).max(260),
  points: z.array(z.string().trim().min(1).max(160)).max(3).default([]),
  clarifyingQuestion: z.string().trim().min(1).max(200),
  quickOptions: z.array(z.string().trim().min(1).max(48)).max(3).default([]),
});

/** Strip any accidentally leaked raw 10-digit Indian phone numbers from LLM text */
export function redactPhoneNumbers(text: string): string {
  return text.replace(/(?:\+91[\s-]?)?[6-9]\d{4}[\s-]?\d{5}/g, "[use Call Studio]");
}

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 8;

export function createRateLimiter(
  maxRequests = RATE_LIMIT_MAX_REQUESTS,
  windowMs = RATE_LIMIT_WINDOW_MS
) {
  const timestamps: number[] = [];
  return (now = Date.now()): boolean => {
    while (timestamps.length > 0 && now - timestamps[0] > windowMs) {
      timestamps.shift();
    }
    if (timestamps.length >= maxRequests) {
      return false;
    }
    timestamps.push(now);
    return true;
  };
}

export const checkChatRateLimit = createRateLimiter();
