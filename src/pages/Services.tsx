import { Link } from "react-router-dom";
import { ArrowUpRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandIcon } from "@/components/common/BrandIcon";
import { SITE_CONTENT } from "@/data/site-content";

const Services = () => {
  const { servicesPage, services } = SITE_CONTENT;

  return (
    <div className="pt-16 min-h-screen bg-[#FFFFFF]">
      {/* Page Header */}
      <section className="py-10 md:py-16 bg-[#F5F5F5] border-b border-[#EAEAEA]">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-2xl">
            <p className="eyebrow mb-2">{servicesPage.eyebrow}</p>
            <h1
              className="font-display font-semibold text-[#111111] mb-3"
              style={{ fontSize: "var(--text-hero)" }}
            >
              {servicesPage.headline}
            </h1>
            <p className="text-sm md:text-base text-[#444444] leading-relaxed">
              {servicesPage.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Studio Banner */}
      <section className="border-b border-[#EAEAEA] bg-[#FFFFFF]">
        <div className="container mx-auto px-4 lg:px-8 py-8 md:py-10">
          <div className="border border-[#EAEAEA] overflow-hidden bg-[#F5F5F5]">
            <picture>
              <source
                media="(min-width: 768px)"
                srcSet="/assets/services/service-desktop.webp"
                type="image/webp"
              />
              <img
                src="/assets/services/service-mobile.webp"
                alt="Architectural concrete and glass structure"
                className="w-full h-[200px] md:h-[320px] object-cover object-bottom md:object-right"
                loading="eager"
              />
            </picture>
          </div>
        </div>
      </section>

      {/* Services List */}
      <section className="py-10 md:py-16">
        <div className="container mx-auto px-4 lg:px-8 space-y-14 md:space-y-20">
          {services.map((service, index) => (
            <article
              key={service.id}
              id={service.id}
              className="scroll-mt-20 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center pb-14 md:pb-20 border-b border-[#EAEAEA] last:border-b-0 last:pb-0"
            >
              <div className={`lg:col-span-6 ${index % 2 === 1 ? "lg:order-2" : ""}`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 border border-[#EAEAEA] bg-[#F5F5F5] flex items-center justify-center">
                    <BrandIcon name={service.icon} className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono text-[#777777] tabular-nums">
                    0{index + 1} / SCOPE
                  </span>
                </div>

                <h2
                  className="font-display font-semibold text-[#111111] mb-3"
                  style={{ fontSize: "var(--text-h2)" }}
                >
                  {service.title}
                </h2>
                <p className="text-sm md:text-base text-[#444444] leading-relaxed mb-5">
                  {service.detailDesc}
                </p>

                <ul className="space-y-2.5 mb-6 border-t border-[#EAEAEA] pt-5">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm text-[#111111]">
                      <Check className="w-4 h-4 mt-0.5 text-[#111111] shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-2.5">
                  <Button size="default" asChild>
                    <Link to="/appointment">
                      Book Site Visit
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  </Button>
                  <Button variant="outline-gold" size="default" asChild>
                    <Link to="/packages">View Packages</Link>
                  </Button>
                </div>
              </div>

              <div className={`lg:col-span-6 ${index % 2 === 1 ? "lg:order-1" : ""}`}>
                <div className="border border-[#EAEAEA] bg-[#F5F5F5] overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full aspect-[4/3] object-cover editorial-photo"
                    loading="lazy"
                  />
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Services;
