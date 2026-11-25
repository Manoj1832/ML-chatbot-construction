import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Send, X, Minimize2, Phone, ArrowUpRight } from "lucide-react";
import { askGroqWithRag, type StructuredReply } from "@/lib/rag";
import { SITE_CONFIG } from "@/config/site";
import { BrandIcon } from "@/components/common/BrandIcon";
import { trackEvent } from "@/lib/telemetry";
import { chatQuerySchema, validateWithSchema } from "@/lib/validation";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  summary: string;
  points?: string[];
  clarifyingQuestion?: string;
  quickOptions?: string[];
  sources?: string[];
  telemetry?: StructuredReply["telemetry"];
}

const BotLogo = ({ size = 20, className = "" }: { size?: number; className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="9.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M7.5 16.5 L12 7 L16.5 16.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="square"
      strokeLinejoin="miter"
    />
    <path
      d="M9.5 13.5 L14.5 13.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="square"
    />
  </svg>
);

const INITIAL_MESSAGE: ChatMessage = {
  id: "welcome",
  role: "assistant",
  summary: "Vanakkam. I am the Adithya Constructions studio assistant.",
  clarifyingQuestion: "Before we share rates or timelines, what are you planning to build?",
  quickOptions: [
    "Residential Home (Coimbatore)",
    "Packages & Per-Sq.Ft Rates",
    "DTCP / Plan Approval",
    "Commercial / PEB",
  ],
};

const ConstructionChatbot = () => {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [inputError, setInputError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && !minimized) {
      endRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open, minimized]);

  const handleSend = async (promptText?: string) => {
    const rawQuery = promptText ?? input;
    const validation = validateWithSchema(chatQuerySchema, { query: rawQuery });
    if (!validation.success) {
      setInputError(validation.errors.query ?? "Enter a valid question.");
      return;
    }
    if (isLoading) return;

    setInputError(null);
    const query = validation.data.query;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      summary: query,
    };

    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    if (!promptText) setInput("");
    setIsLoading(true);

    trackEvent({ event: "chatbot_query", metadata: { queryLength: query.length } });

    const reply = await askGroqWithRag(
      query,
      nextMessages.map((m) => ({
        role: m.role,
        content: [m.summary, ...(m.points ?? [])].join(" "),
      }))
    );

    const botMsg: ChatMessage = {
      id: `a-${Date.now()}`,
      role: "assistant",
      summary: reply.summary,
      points: reply.points,
      clarifyingQuestion: reply.clarifyingQuestion,
      quickOptions: reply.quickOptions,
      sources: reply.sources,
      telemetry: reply.telemetry,
    };

    setMessages((prev) => [...prev, botMsg]);
    setIsLoading(false);
  };

  const whatsappUrl = `https://wa.me/${SITE_CONFIG.contact.whatsappNumber}?text=${encodeURIComponent(
    "Hi! I'd like to discuss a construction project."
  )}`;

  const latestAssistantId = [...messages].reverse().find((m) => m.role === "assistant")?.id;

  return (
    <>
      {/* Floating trigger button */}
      <div className="fixed bottom-[3.75rem] lg:bottom-6 right-3 lg:right-6 z-40">
        {!open && (
          <button
            type="button"
            onClick={() => {
              setOpen(true);
              setMinimized(false);
              trackEvent({ event: "chatbot_open" });
            }}
            className="w-11 h-11 lg:w-12 lg:h-12 bg-[#111111] text-[#FFFFFF] border border-[#2E2E2E] flex items-center justify-center hover:bg-[#222222] transition-colors"
            aria-label="Open Adithya assistant"
          >
            <BotLogo size={20} />
          </button>
        )}
      </div>

      {/* Chat Panel */}
      {open && (
        <div
          role="dialog"
          aria-label="Adithya Constructions Assistant"
          className="fixed bottom-16 lg:bottom-6 right-3 lg:right-6 z-50 w-[calc(100vw-1.5rem)] max-w-md bg-[#FFFFFF] border border-[#111111] flex flex-col"
        >
          {/* Header */}
          <div className="bg-[#111111] text-[#FFFFFF] px-4 py-3 flex items-center justify-between border-b border-[#2E2E2E]">
            <div className="flex items-center gap-2.5">
              <BotLogo size={18} />
              <div>
                <p className="text-sm font-display font-medium leading-tight">
                  Adithya Studio Assistant
                </p>
                <p className="text-[11px] text-[#B5B5B5] leading-tight">
                  Coimbatore &amp; Salem • Verified KB
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setMinimized((prev) => !prev)}
                aria-label={minimized ? "Expand chat" : "Minimize chat"}
                className="p-1.5 text-[#B5B5B5] hover:text-[#FFFFFF] transition-colors"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="p-1.5 text-[#B5B5B5] hover:text-[#FFFFFF] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!minimized && (
            <>
              {/* Quick Actions Strip */}
              <div className="px-4 py-2 bg-[#F5F5F5] border-b border-[#EAEAEA] flex items-center justify-between gap-2 text-xs">
                <a
                  href={`tel:${SITE_CONFIG.contact.primaryPhoneTel}`}
                  className="inline-flex items-center gap-1.5 font-medium text-[#111111] hover:underline"
                >
                  <Phone className="w-3.5 h-3.5" />
                  Call Studio
                </a>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-medium text-[#111111] hover:underline"
                >
                  <BrandIcon name="whatsapp" className="w-3.5 h-3.5" />
                  WhatsApp
                </a>
                <Link
                  to="/appointment"
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center gap-1 font-medium text-[#111111] hover:underline"
                >
                  Book Site Visit
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </div>

              {/* Messages */}
              <div className="p-4 space-y-3 max-h-[340px] overflow-y-auto bg-[#FFFFFF]">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      msg.role === "user" ? "items-end" : "items-start"
                    }`}
                  >
                    <div
                      className={`max-w-[90%] px-3.5 py-2.5 text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "bg-[#111111] text-[#FFFFFF]"
                          : "bg-[#F5F5F5] text-[#111111] border border-[#EAEAEA] space-y-2"
                      }`}
                    >
                      <p className="font-medium text-[13px]">{msg.summary}</p>

                      {msg.points && msg.points.length > 0 && (
                        <ul className="space-y-1 pl-3.5 list-disc text-xs text-[#444444]">
                          {msg.points.map((pt, i) => (
                            <li key={i}>{pt}</li>
                          ))}
                        </ul>
                      )}

                      {msg.clarifyingQuestion && (
                        <p className="text-xs text-[#111111] border-t border-[#EAEAEA] pt-2 font-medium">
                          {msg.clarifyingQuestion}
                        </p>
                      )}
                    </div>

                    {/* Quick reply chips for the latest assistant turn */}
                    {msg.role === "assistant" &&
                      msg.id === latestAssistantId &&
                      msg.quickOptions &&
                      msg.quickOptions.length > 0 && (
                        <div className="pt-2 flex flex-wrap gap-1.5">
                          {msg.quickOptions.map((q) => (
                            <button
                              key={q}
                              type="button"
                              disabled={isLoading}
                              onClick={() => handleSend(q)}
                              className="text-left text-xs px-2.5 py-1 border border-[#EAEAEA] bg-[#FFFFFF] text-[#111111] hover:border-[#111111] hover:bg-[#F5F5F5] transition-colors"
                            >
                              {q}
                            </button>
                          ))}
                        </div>
                      )}

                    {/* Observability line */}
                    {msg.telemetry && (
                      <p className="text-[10px] font-mono text-[#777777] mt-1">
                        {msg.telemetry.usedGroq ? "Live" : "KB"} • {msg.telemetry.durationMs}ms • {msg.telemetry.wordCount}w
                        {msg.sources && msg.sources.length > 0 ? ` • ${msg.sources[0]}` : ""}
                      </p>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div className="bg-[#F5F5F5] border border-[#EAEAEA] px-3.5 py-2 text-xs text-[#777777] w-fit">
                    Checking studio specifications...
                  </div>
                )}

                <div ref={endRef} />
              </div>

              {/* Input */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="p-3 border-t border-[#EAEAEA] bg-[#FFFFFF]"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => {
                      setInput(e.target.value);
                      if (inputError) setInputError(null);
                    }}
                    placeholder="Ask about plot, packages, DTCP..."
                    aria-label="Ask a question"
                    aria-invalid={Boolean(inputError)}
                    disabled={isLoading}
                    className="flex-1 h-10 px-3 text-sm border border-[#EAEAEA] bg-[#FFFFFF] text-[#111111] placeholder:text-[#777777] focus:outline-none focus:border-[#111111]"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    aria-label="Send message"
                    className="h-10 px-3.5 bg-[#111111] text-[#FFFFFF] flex items-center justify-center hover:bg-[#222222] disabled:opacity-40 transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
                {inputError && (
                  <p className="text-[11px] text-[#111111] mt-1">{inputError}</p>
                )}
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default ConstructionChatbot;
