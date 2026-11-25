import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown, ArrowUpRight } from "lucide-react";
import { SITE_CONFIG } from "@/config/site";
import { trackEvent } from "@/lib/telemetry";
import { cn } from "@/lib/utils";

const serviceLinks = [
  { name: "Residential House Construction", path: "/services#turnkey" },
  { name: "Commercial Construction", path: "/services#commercial" },
  { name: "Architectural Designing", path: "/services#architectural" },
  { name: "Structural Designing", path: "/services#structural" },
  { name: "Building Plan Approval", path: "/services#approval" },
  { name: "Construction Packages", path: "/packages" },
];

const navLinks = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Projects", path: "/projects" },
  { name: "Packages", path: "/packages" },
  { name: "Quality", path: "/quality-checklist" },
  { name: "Contact", path: "/contact" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 16);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setServicesOpen(false);
  }, [location]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        setServicesOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const isPathActive = (path: string) => location.pathname === path;
  const isServicesActive =
    location.pathname.startsWith("/services") || location.pathname.startsWith("/packages");

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-colors duration-200 border-b",
        isScrolled || isOpen
          ? "bg-[#FFFFFF]/95 backdrop-blur-sm border-[#EAEAEA]"
          : "bg-[#FFFFFF]/90 backdrop-blur-sm border-[#EAEAEA]/80"
      )}
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <nav aria-label="Primary navigation" className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Official Brand Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group focus-visible:outline-none"
            aria-label={`${SITE_CONFIG.name} — Home`}
          >
            <div className="w-9 h-9 bg-[#111111] flex items-center justify-center p-1.5 shrink-0">
              <img
                src="/assets/logo.png"
                alt="Adithya Constructions Logo"
                width={32}
                height={32}
                className="w-full h-full object-contain"
                loading="eager"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-semibold text-sm md:text-[15px] tracking-[-0.02em] text-[#111111] leading-tight">
                {SITE_CONFIG.shortName}
              </span>
              <span className="text-[10px] uppercase tracking-[0.14em] text-[#777777] leading-tight hidden sm:block">
                Coimbatore &amp; Salem
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-5 xl:gap-7">
            <Link
              to="/"
              className={cn(
                "text-[13px] xl:text-sm transition-colors py-1 border-b-2 whitespace-nowrap",
                isPathActive("/")
                  ? "text-[#111111] font-medium border-[#111111]"
                  : "text-[#444444] border-transparent hover:text-[#111111]"
              )}
            >
              Home
            </Link>

            <Link
              to="/about"
              className={cn(
                "text-[13px] xl:text-sm transition-colors py-1 border-b-2 whitespace-nowrap",
                isPathActive("/about")
                  ? "text-[#111111] font-medium border-[#111111]"
                  : "text-[#444444] border-transparent hover:text-[#111111]"
              )}
            >
              About
            </Link>

            {/* Services Dropdown */}
            <div
              ref={dropdownRef}
              className="relative"
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}
            >
              <button
                type="button"
                aria-expanded={servicesOpen}
                aria-haspopup="true"
                onClick={() => setServicesOpen((prev) => !prev)}
                className={cn(
                  "flex items-center gap-1 text-[13px] xl:text-sm transition-colors py-1 border-b-2 whitespace-nowrap",
                  isServicesActive
                    ? "text-[#111111] font-medium border-[#111111]"
                    : "text-[#444444] border-transparent hover:text-[#111111]"
                )}
              >
                Services
                <ChevronDown
                  className={cn("w-3.5 h-3.5 transition-transform duration-200", servicesOpen && "rotate-180")}
                />
              </button>

              {servicesOpen && (
                <div className="absolute top-full left-0 pt-2 w-64">
                  <div className="bg-[#FFFFFF] border border-[#EAEAEA] py-1">
                    {serviceLinks.map((service) => (
                      <Link
                        key={service.name}
                        to={service.path}
                        className="block px-4 py-2.5 text-sm text-[#444444] hover:text-[#111111] hover:bg-[#F5F5F5] transition-colors"
                      >
                        {service.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {navLinks.slice(2).map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "text-[13px] xl:text-sm transition-colors py-1 border-b-2 whitespace-nowrap",
                  isPathActive(item.path)
                    ? "text-[#111111] font-medium border-[#111111]"
                    : "text-[#444444] border-transparent hover:text-[#111111]"
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Button variant="outline-gold" size="sm" asChild>
              <a
                href={`tel:${SITE_CONFIG.contact.primaryPhoneTel}`}
                onClick={() => trackEvent({ event: "cta_click", metadata: { location: "navbar_phone" } })}
              >
                Call Studio
              </a>
            </Button>
            <Button size="sm" asChild>
              <Link
                to="/appointment"
                onClick={() => trackEvent({ event: "cta_click", metadata: { location: "navbar_book" } })}
              >
                Book Consultation
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-expanded={isOpen}
            aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
            className="lg:hidden inline-flex items-center justify-center w-11 h-11 text-[#111111] border border-[#EAEAEA] bg-[#FFFFFF] hover:bg-[#F5F5F5] transition-colors"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu Panel */}
        {isOpen && (
          <div className="lg:hidden border-t border-[#EAEAEA] bg-[#FFFFFF] py-6 space-y-1">
            {navLinks.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "block px-2 py-3 text-base border-b border-[#EAEAEA]/60 transition-colors",
                  isPathActive(item.path) ? "font-semibold text-[#111111]" : "text-[#444444]"
                )}
              >
                {item.name}
              </Link>
            ))}
            <Link
              to="/services"
              className={cn(
                "block px-2 py-3 text-base border-b border-[#EAEAEA]/60 transition-colors",
                isServicesActive ? "font-semibold text-[#111111]" : "text-[#444444]"
              )}
            >
              Services
            </Link>
            <Link
              to="/quality-checklist"
              className={cn(
                "block px-2 py-3 text-base border-b border-[#EAEAEA]/60 transition-colors",
                isPathActive("/quality-checklist") ? "font-semibold text-[#111111]" : "text-[#444444]"
              )}
            >
              Quality Checklist
            </Link>

            <div className="pt-4 flex flex-col gap-3">
              <Button className="w-full" asChild>
                <Link to="/appointment">Book Free Consultation</Link>
              </Button>
              <a
                href={`tel:${SITE_CONFIG.contact.primaryPhoneTel}`}
                className="w-full h-11 inline-flex items-center justify-center border border-[#EAEAEA] text-sm font-medium text-[#111111]"
              >
                Call Studio
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
