import { Link } from "react-router-dom";
import { SITE_CONFIG } from "@/config/site";
import { BrandIcon } from "@/components/common/BrandIcon";
import { trackEvent } from "@/lib/telemetry";

const StickyContactBar = () => {
  const whatsappUrl = `https://wa.me/${SITE_CONFIG.contact.whatsappNumber}?text=${encodeURIComponent(
    "Hi! I'd like to discuss a construction project."
  )}`;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-[#FFFFFF] border-t border-[#EAEAEA]"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="grid grid-cols-3 divide-x divide-[#EAEAEA]">
        <a
          href={`tel:${SITE_CONFIG.contact.primaryPhoneTel}`}
          onClick={() => trackEvent({ event: "cta_click", metadata: { location: "mobile_sticky_call" } })}
          className="h-12 flex items-center justify-center gap-2 text-xs font-medium text-[#111111] hover:bg-[#F5F5F5] transition-colors"
        >
          <BrandIcon name="phone" className="w-4 h-4" />
          <span>Call</span>
        </a>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent({ event: "cta_click", metadata: { location: "mobile_sticky_whatsapp" } })}
          className="h-12 flex items-center justify-center gap-2 text-xs font-medium text-[#111111] hover:bg-[#F5F5F5] transition-colors"
        >
          <BrandIcon name="whatsapp" className="w-4 h-4" />
          <span>WhatsApp</span>
        </a>

        <Link
          to="/appointment"
          onClick={() => trackEvent({ event: "cta_click", metadata: { location: "mobile_sticky_book" } })}
          className="h-12 flex items-center justify-center text-xs font-medium bg-[#111111] text-[#FFFFFF] hover:bg-[#222222] transition-colors"
        >
          Book Consult
        </Link>
      </div>
    </div>
  );
};

export default StickyContactBar;
