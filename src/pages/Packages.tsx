import PackageDetailsTable from "@/components/packages/PackageDetailsTable";
import PricingPackages from "@/components/packages/PricingPackages";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowUpRight, Phone } from "lucide-react";
import { SITE_CONFIG } from "@/config/site";
import { SITE_CONTENT } from "@/data/site-content";

const Packages = () => {
  const { packagesPage } = SITE_CONTENT;

  return (
    <div className="pt-16 min-h-screen bg-[#FFFFFF]" data-testid="page-packages">
      <section className="py-10 md:py-16 bg-[#F5F5F5] border-b border-[#EAEAEA]">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-2xl">
            <p className="eyebrow mb-2" data-testid="badge-packages">
              {packagesPage.eyebrow}
            </p>
            <h1
              className="font-display font-semibold text-[#111111] mb-3"
              style={{ fontSize: "var(--text-hero)" }}
              data-testid="heading-packages"
            >
              {packagesPage.headline}
            </h1>
            <p className="text-sm md:text-base text-[#444444] leading-relaxed mb-6">
              {packagesPage.subtitle}
            </p>
            <div className="flex flex-wrap gap-2.5">
              <Button size="default" asChild data-testid="button-hero-consultation">
                <Link to="/appointment">
                  Book Site Visit
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button variant="outline-gold" size="default" asChild data-testid="button-hero-contact">
                <a href={`tel:${SITE_CONFIG.contact.primaryPhoneTel}`}>
                  <Phone className="w-4 h-4" />
                  Call Studio
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <PricingPackages />

      <PackageDetailsTable />

      <section className="py-10 md:py-14 bg-[#F5F5F5] border-t border-[#EAEAEA]">
        <div className="container mx-auto px-4 lg:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="font-display font-semibold text-xl md:text-2xl text-[#111111] mb-1">
              {packagesPage.ctaTitle}
            </h2>
            <p className="text-sm text-[#444444]">
              {packagesPage.ctaSubtitle}
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <Button size="default" asChild data-testid="button-book-appointment">
              <Link to="/appointment">
                Book Consultation
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button variant="outline-gold" size="default" asChild data-testid="button-call-now">
              <a href={`tel:${SITE_CONFIG.contact.primaryPhoneTel}`}>
                <Phone className="w-4 h-4" />
                Call Studio
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Packages;
