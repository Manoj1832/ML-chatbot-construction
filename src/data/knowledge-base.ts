import { packages, packageCategories } from "@/data/pricing";
import { SITE_CONFIG } from "@/config/site";

export interface KnowledgeChunk {
  id: string;
  title: string;
  tags: string[];
  content: string;
}

const packageSummary = packages
  .map((p) => `${p.name}: Rs. ${p.pricePerSqft}/sq.ft — ${p.description}`)
  .join("\n");

const packageSpecs = packageCategories
  .slice(0, 12)
  .map(
    (cat) =>
      `${cat.name}: Standard (${cat.standard}) | Premium (${cat.premium}) | Luxury (${cat.luxury})`
  )
  .join("\n");

export const KNOWLEDGE_BASE: KnowledgeChunk[] = [
  {
    id: "studio-overview",
    title: "Studio Overview & Leadership",
    tags: ["company", "about", "adithya", "owner", "founder", "coimbatore", "salem", "contact", "phone", "call", "office"],
    content: `${SITE_CONFIG.name} serves ${SITE_CONFIG.serviceRegions.join(" and ")}, ${SITE_CONFIG.state}. Leadership: ${SITE_CONFIG.leadership
      .map((l) => `${l.name} (${l.role})`)
      .join("; ")}. Working hours: ${SITE_CONFIG.contact.workingHours}. Clients can reach the studio via the Call Studio button, WhatsApp, email (${SITE_CONFIG.contact.email}), or the Book Consultation page (/appointment). Never output raw phone digits in chat; direct the user to use the Call or WhatsApp buttons.`,
  },
  {
    id: "services-turnkey",
    title: "Residential & Commercial Construction Services",
    tags: ["service", "services", "residential", "house", "villa", "commercial", "peb", "renovation", "interior", "turnkey"],
    content: `Core services: (1) Residential House Construction — end-to-end turnkey home building with ISI-certified materials and stage-wise supervision. (2) Commercial Construction — offices, retail spaces, and Pre-Engineered Buildings (PEB). (3) Architectural Designing — floor plans, 3D elevations, daylighting, and ventilation. (4) Structural Designing — load-bearing, RCC framed, and PEB steel engineering. (5) Building Plan Approval — DTCP, Panchayat, and Municipality statutory approvals.`,
  },
  {
    id: "packages-pricing",
    title: "Construction Packages & Per Sq.Ft Pricing",
    tags: ["package", "packages", "price", "pricing", "cost", "rate", "sqft", "standard", "premium", "luxury", "budget"],
    content: `Turnkey construction packages:\n${packageSummary}\n\nKey specification comparison:\n${packageSpecs}\n\nFull package comparison is available on the Packages page (/packages).`,
  },
  {
    id: "quality-5s",
    title: "70-Point Quality Checklist & 5S Site Discipline",
    tags: ["quality", "checklist", "70", "5s", "inspection", "foundation", "concrete", "waterproofing", "electrical", "plumbing", "steel", "cement"],
    content: `Every project follows a 70-point quality checklist across Foundation Quality (soil testing, anti-termite, RCC M20+), Concrete Strength Standards (M20/M25, cube testing, 28-day curing), Waterproofing Standards (basement, roof, bathroom, terrace), Electrical Safety (ISI wires, earthing, MCB/ELCB), Plumbing Layout & Testing (pressure testing), and Interior Material Quality, alongside daily 5S site discipline (Sort, Set in Order, Shine, Standardize, Sustain).`,
  },
  {
    id: "process-workflow",
    title: "6-Step Construction Process",
    tags: ["process", "workflow", "steps", "timeline", "how", "start", "approval", "dtcp", "handover"],
    content: `Six-stage execution process: 01 Site & Brief Consultation -> 02 Architectural & Structural Planning (including DTCP/Municipal approvals) -> 03 Transparent BOQ & Estimation -> 04 Disciplined Site Execution (5S practice) -> 05 70-Point Quality Inspection -> 06 Handover & Post-Handover Support.`,
  },
  {
    id: "materials-brands",
    title: "Certified Material Brands",
    tags: ["brand", "brands", "material", "materials", "cement", "steel", "tmt", "paint", "tiles", "pipes", "switches", "ultratech", "tata", "jsw", "asian"],
    content: `Certified material partners used across projects include UltraTech Cement, Ramco Cements, Tata Steel, JSW Steel, Indrola TMT Bars, Asian Paints, Nippon Paint, Kajaria Tiles, Somany Tiles, Jaquar, Finolex Pipes, Supreme Pipes, Legrand, and GM Switches.`,
  },
];
