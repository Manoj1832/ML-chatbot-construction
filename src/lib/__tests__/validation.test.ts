import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  normalizeIndianPhone,
  indianPhoneSchema,
  contactSchema,
  createAppointmentSchema,
  chatQuerySchema,
  validateWithSchema,
} from "../validation.ts";

describe("normalizeIndianPhone & indianPhoneSchema", () => {
  it("accepts standard 10-digit Indian mobile numbers starting with 6-9", () => {
    for (const num of ["9876543210", "8123456789", "7538880504", "6374507535"]) {
      const res = indianPhoneSchema.safeParse(num);
      assert.equal(res.success, true, `Expected ${num} to pass`);
      if (res.success) assert.equal(res.data, num);
    }
  });

  it("normalizes +91, 0 prefix, spaces, and dashes", () => {
    assert.equal(normalizeIndianPhone("+91 63745-07535"), "6374507535");
    assert.equal(normalizeIndianPhone("075388 80504"), "7538880504");
    const res = indianPhoneSchema.safeParse("+91 98765 43210");
    assert.equal(res.success, true);
    if (res.success) assert.equal(res.data, "9876543210");
  });

  it("rejects numbers starting below 6 or wrong digit length", () => {
    for (const bad of ["1234567890", "5123456789", "98765", "98765432101", "abcdefghij"]) {
      const res = indianPhoneSchema.safeParse(bad);
      assert.equal(res.success, false, `Expected ${bad} to fail`);
    }
  });
});

describe("contactSchema", () => {
  const validContact = {
    firstName: "Arun",
    lastName: "Kumar",
    phone: "+91 98765 43210",
    email: "arun.kumar@example.com",
    subject: "G+1 House in RS Puram",
    message: "Looking for turnkey construction on a 30x40 east-facing plot.",
  };

  it("passes valid contact inquiry and normalizes phone & trims strings", () => {
    const res = validateWithSchema(contactSchema, {
      ...validContact,
      firstName: "  Arun ",
      email: " arun.kumar@example.com ",
    });
    assert.equal(res.success, true);
    if (res.success) {
      assert.equal(res.data.firstName, "Arun");
      assert.equal(res.data.phone, "9876543210");
      assert.equal(res.data.email, "arun.kumar@example.com");
    }
  });

  it("reports field-level errors for missing or invalid fields", () => {
    const res = validateWithSchema(contactSchema, {
      firstName: "A",
      lastName: "",
      phone: "12345",
      email: "not-an-email",
      subject: "Hi",
      message: "Short",
    });
    assert.equal(res.success, false);
    if (!res.success) {
      assert.ok(res.errors.firstName);
      assert.ok(res.errors.lastName);
      assert.ok(res.errors.phone);
      assert.ok(res.errors.email);
      assert.ok(res.errors.subject);
      assert.ok(res.errors.message);
    }
  });
});

describe("appointmentSchema", () => {
  const schema = createAppointmentSchema("2026-11-26");

  const validAppt = {
    name: "Karthik Subramanian",
    phone: "9842212345",
    email: "karthik@example.com",
    location: "Saravanampatti, Coimbatore",
    service: "turnkey",
    date: "2026-11-28",
    time: "10:30",
    description: "40x60 corner plot",
  };

  it("passes valid appointment request", () => {
    const res = validateWithSchema(schema, validAppt);
    assert.equal(res.success, true);
  });

  it("rejects past dates and missing service", () => {
    const res = validateWithSchema(schema, {
      ...validAppt,
      date: "2026-11-20",
      service: "",
      time: "99:99",
    });
    assert.equal(res.success, false);
    if (!res.success) {
      assert.match(res.errors.date ?? "", /past/i);
      assert.ok(res.errors.service);
    }
  });
});

describe("chatQuerySchema", () => {
  it("accepts concise client questions and rejects empty or overly long queries", () => {
    assert.equal(validateWithSchema(chatQuerySchema, { query: "Packages in Coimbatore?" }).success, true);
    assert.equal(validateWithSchema(chatQuerySchema, { query: " " }).success, false);
    assert.equal(validateWithSchema(chatQuerySchema, { query: "a".repeat(401) }).success, false);
  });
});

describe("security abuse cases", () => {
  it("rejects oversized contact fields to prevent payload flooding", () => {
    const res = validateWithSchema(contactSchema, {
      firstName: "A".repeat(51),
      lastName: "Kumar",
      phone: "9876543210",
      email: "a@example.com",
      subject: "S".repeat(121),
      message: "M".repeat(1501),
    });
    assert.equal(res.success, false);
    if (!res.success) {
      assert.ok(res.errors.firstName);
      assert.ok(res.errors.subject);
      assert.ok(res.errors.message);
    }
  });
});
