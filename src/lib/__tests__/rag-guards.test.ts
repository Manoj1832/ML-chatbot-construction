import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  groqReplySchema,
  redactPhoneNumbers,
  createRateLimiter,
} from "../rag-guards.ts";

describe("redactPhoneNumbers", () => {
  it("redacts 10-digit and +91 formatted Indian mobile numbers", () => {
    assert.equal(
      redactPhoneNumbers("Call 63745 07535 or +91 98765-43210 now."),
      "Call [use Call Studio] or [use Call Studio] now."
    );
  });

  it("preserves ordinary numbers like sq.ft, years, or checklist counts", () => {
    const clean = "Standard package is Rs. 2150/sq.ft with a 70-point quality audit.";
    assert.equal(redactPhoneNumbers(clean), clean);
  });
});

describe("groqReplySchema", () => {
  it("accepts valid structured JSON from LLM", () => {
    const res = groqReplySchema.safeParse({
      summary: "We offer Standard, Premium, and Luxury turnkey packages.",
      points: ["Locked brand specs", "70-point quality audit"],
      clarifyingQuestion: "Is your plot in Coimbatore or Salem?",
      quickOptions: ["Coimbatore", "Salem"],
    });
    assert.equal(res.success, true);
  });

  it("rejects malformed or over-limit LLM payloads", () => {
    const res = groqReplySchema.safeParse({
      summary: "",
      points: ["1", "2", "3", "4"],
      clarifyingQuestion: "ok",
    });
    assert.equal(res.success, false);
  });
});

describe("createRateLimiter", () => {
  it("allows up to maxRequests within window and blocks excess", () => {
    const allow = createRateLimiter(3, 10_000);
    assert.equal(allow(1000), true);
    assert.equal(allow(2000), true);
    assert.equal(allow(3000), true);
    assert.equal(allow(4000), false);
    // Once window expires, requests are allowed again
    assert.equal(allow(12_000), true);
  });
});
