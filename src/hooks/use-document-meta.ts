import { useEffect } from "react";
import { SITE_CONFIG } from "@/config/site";

interface RouteMeta {
  title: string;
  description: string;
}

const ROUTE_META: Record<string, RouteMeta> = {
  "/": {
    title: `${SITE_CONFIG.name} | Coimbatore & Salem`,
    description:
      "Turnkey residential construction, commercial buildings, architectural design, structural engineering, and DTCP approvals in Coimbatore & Salem.",
  },
  "/about": {
    title: `About Us | ${SITE_CONFIG.shortName}`,
    description:
      "Engineering-led architectural and construction studio in Coimbatore and Salem led by Er. Boobalan V. and Er. Premi T.",
  },
  "/services": {
    title: `Services | ${SITE_CONFIG.shortName}`,
    description:
      "Residential house construction, commercial construction, architectural designing, structural engineering, and building plan approvals.",
  },
  "/projects": {
    title: `Projects Portfolio | ${SITE_CONFIG.shortName}`,
    description:
      "Completed residential, commercial, PEB steel, interior, and renovation projects across Coimbatore.",
  },
  "/packages": {
    title: `Construction Packages | ${SITE_CONFIG.shortName}`,
    description:
      "Compare Standard, Premium, and Luxury turnkey residential construction packages and material specifications.",
  },
  "/quality-checklist": {
    title: `70-Point Quality Checklist | ${SITE_CONFIG.shortName}`,
    description:
      "Inspect our 70-point construction quality standards across foundation, concrete, waterproofing, electrical, and plumbing.",
  },
  "/appointment": {
    title: `Book Consultation | ${SITE_CONFIG.shortName}`,
    description:
      "Schedule a free site consultation with Adithya Constructions & Architects in Coimbatore or Salem.",
  },
  "/contact": {
    title: `Contact Us | ${SITE_CONFIG.shortName}`,
    description:
      "Contact Adithya Constructions & Architects via phone, WhatsApp, or email for residential and commercial projects.",
  },
  "/careers": {
    title: `Careers | ${SITE_CONFIG.shortName}`,
    description:
      "Explore civil engineering, architecture, and site supervision career opportunities at Adithya Constructions.",
  },
  "/blog": {
    title: `Insights & Guides | ${SITE_CONFIG.shortName}`,
    description:
      "Construction, architectural planning, and building approval guides for homeowners in Coimbatore and Salem.",
  },
};

export function useDocumentMeta(pathname: string) {
  useEffect(() => {
    const meta = ROUTE_META[pathname] ?? {
      title: `${SITE_CONFIG.name}`,
      description:
        "Architectural design, structural engineering, and turnkey construction in Coimbatore & Salem.",
    };

    document.title = meta.title;

    const descEl = document.querySelector('meta[name="description"]');
    if (descEl) {
      descEl.setAttribute("content", meta.description);
    }

    const canonicalEl = document.querySelector('link[rel="canonical"]');
    if (canonicalEl) {
      canonicalEl.setAttribute("href", `${SITE_CONFIG.domain}${pathname === "/" ? "" : pathname}`);
    }
  }, [pathname]);
}
