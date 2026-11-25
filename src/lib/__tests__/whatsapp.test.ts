import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  formatContactWhatsAppMessage,
  formatAppointmentWhatsAppMessage,
} from "../whatsapp.ts";

describe("formatContactWhatsAppMessage", () => {
  it("formats contact inquiry fields cleanly", () => {
    const msg = formatContactWhatsAppMessage({
      firstName: "Arun",
      lastName: "Kumar",
      email: "arun@example.com",
      phone: "9876543210",
      subject: "G+1 House",
      message: "30x40 plot in RS Puram",
    });
    assert.match(msg, /Arun Kumar/);
    assert.match(msg, /9876543210/);
    assert.match(msg, /G\+1 House/);
    assert.match(msg, /30x40 plot in RS Puram/);
  });
});

describe("formatAppointmentWhatsAppMessage", () => {
  it("maps known service keys to readable names and falls back safely", () => {
    const msg = formatAppointmentWhatsAppMessage({
      name: "Karthik",
      phone: "9842212345",
      email: "karthik@example.com",
      location: "Coimbatore",
      service: "turnkey",
      date: "2026-11-28",
      time: "10:30",
      description: "",
    });
    assert.match(msg, /Residential House Construction/);
    assert.match(msg, /No description provided/);
  });
});
