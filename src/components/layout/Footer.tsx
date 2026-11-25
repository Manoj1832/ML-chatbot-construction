import { Link } from "react-router-dom";
import { Instagram } from "lucide-react";
import { SITE_CONFIG } from "@/config/site";
import { BrandIcon } from "@/components/common/BrandIcon";

const Footer = () => {
  return (
    <footer className="bg-[#111111] text-[#FFFFFF] border-t border-[#2E2E2E]">
      <div className="container mx-auto px-4 lg:px-8 pt-10 pb-20 md:py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
          {/* Brand & Leadership */}
          <div className="lg:col-span-4 space-y-6">
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="w-11 h-11 bg-[#222222] border border-[#2E2E2E] p-1.5 flex items-center justify-center shrink-0">
                <img
                  src="/assets/logo.png"
                  alt="Adithya Constructions Logo"
                  width={36}
                  height={36}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <p className="font-display font-semibold text-base tracking-[-0.02em] text-[#FFFFFF]">
                  {SITE_CONFIG.name}
                </p>
                <p className="text-xs text-[#B5B5B5]">{SITE_CONFIG.tagline}</p>
              </div>
            </Link>

            <p className="text-sm text-[#B5B5B5] leading-relaxed max-w-sm">
              Architectural design, structural engineering, and turnkey residential and commercial construction across Coimbatore and Salem, Tamil Nadu.
            </p>

            <div className="space-y-3 pt-2 border-t border-[#2E2E2E]">
              {SITE_CONFIG.leadership.map((leader) => (
                <div key={leader.name} className="flex items-center gap-3">
                  <img
                    src={leader.image}
                    alt={leader.name}
                    width={36}
                    height={36}
                    className="w-9 h-9 object-cover border border-[#2E2E2E]"
                    loading="lazy"
                  />
                  <div>
                    <p className="text-sm font-medium text-[#FFFFFF] leading-tight">{leader.name}</p>
                    <p className="text-xs text-[#B5B5B5] leading-tight mt-0.5">{leader.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="lg:col-span-2">
            <h2 className="text-xs uppercase tracking-[0.14em] text-[#B5B5B5] font-medium mb-4">
              Studio
            </h2>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/about" className="text-[#EAEAEA] hover:text-[#FFFFFF] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/projects" className="text-[#EAEAEA] hover:text-[#FFFFFF] transition-colors">
                  Projects
                </Link>
              </li>
              <li>
                <Link to="/packages" className="text-[#EAEAEA] hover:text-[#FFFFFF] transition-colors">
                  Packages
                </Link>
              </li>
              <li>
                <Link to="/quality-checklist" className="text-[#EAEAEA] hover:text-[#FFFFFF] transition-colors">
                  Quality Checklist
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-[#EAEAEA] hover:text-[#FFFFFF] transition-colors">
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="lg:col-span-3">
            <h2 className="text-xs uppercase tracking-[0.14em] text-[#B5B5B5] font-medium mb-4">
              Capabilities
            </h2>
            <ul className="space-y-2.5 text-sm text-[#EAEAEA]">
              <li>
                <Link to="/services#turnkey" className="hover:text-[#FFFFFF] transition-colors">
                  Residential House Construction
                </Link>
              </li>
              <li>
                <Link to="/services#commercial" className="hover:text-[#FFFFFF] transition-colors">
                  Commercial Construction
                </Link>
              </li>
              <li>
                <Link to="/services#architectural" className="hover:text-[#FFFFFF] transition-colors">
                  Architectural Designing
                </Link>
              </li>
              <li>
                <Link to="/services#structural" className="hover:text-[#FFFFFF] transition-colors">
                  Structural Designing
                </Link>
              </li>
              <li>
                <Link to="/services#approval" className="hover:text-[#FFFFFF] transition-colors">
                  Building Plan Approval
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-3">
            <h2 className="text-xs uppercase tracking-[0.14em] text-[#B5B5B5] font-medium mb-4">
              Contact
            </h2>
            <ul className="space-y-3.5 text-sm text-[#EAEAEA]">
              <li className="flex items-start gap-3">
                <BrandIcon name="phone" invert className="w-4 h-4 mt-0.5" />
                <div className="space-y-1.5">
                  <a
                    href={`tel:${SITE_CONFIG.contact.primaryPhoneTel}`}
                    className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.1em] border border-[#2E2E2E] px-3 py-1.5 text-[#FFFFFF] hover:bg-[#222222] transition-colors"
                  >
                    Call Primary Line
                  </a>
                  <br />
                  <a
                    href={`tel:${SITE_CONFIG.contact.secondaryPhoneTel}`}
                    className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.1em] border border-[#2E2E2E] px-3 py-1.5 text-[#EAEAEA] hover:bg-[#222222] transition-colors"
                  >
                    Call Secondary Line
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <BrandIcon name="contact-mail" invert className="w-4 h-4 mt-0.5" />
                <a
                  href={`mailto:${SITE_CONFIG.contact.email}`}
                  className="hover:text-[#FFFFFF] break-all"
                >
                  {SITE_CONFIG.contact.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <BrandIcon name="location-pin" invert className="w-4 h-4 mt-0.5" />
                <span>{SITE_CONFIG.contact.officeAddress}</span>
              </li>
              <li className="flex items-start gap-3">
                <Instagram className="w-4 h-4 mt-0.5 text-[#FFFFFF] shrink-0" />
                <a
                  href={SITE_CONFIG.contact.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#FFFFFF]"
                >
                  {SITE_CONFIG.contact.instagramHandle}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[#2E2E2E] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#B5B5B5]">
          <p>
            © {new Date().getFullYear()} {SITE_CONFIG.name}. All rights reserved.
          </p>
          <p>Coimbatore &amp; Salem, Tamil Nadu, India</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
