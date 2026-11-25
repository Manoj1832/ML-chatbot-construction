import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SITE_CONFIG } from "@/config/site";
import { SITE_CONTENT } from "@/data/site-content";

const About = () => {
  const { about } = SITE_CONTENT;

  return (
    <div className="pt-16 min-h-screen bg-[#FFFFFF]">
      {/* Page Header */}
      <section className="py-10 md:py-16 bg-[#F5F5F5] border-b border-[#EAEAEA]">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-2xl">
            <p className="eyebrow mb-2">{about.eyebrow}</p>
            <h1
              className="font-display font-semibold text-[#111111] mb-3"
              style={{ fontSize: "var(--text-hero)" }}
            >
              {about.headline}
            </h1>
            <p className="text-sm md:text-base text-[#444444] leading-relaxed">
              {about.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Practice Overview */}
      <section className="py-10 md:py-16 border-b border-[#EAEAEA]">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            <div className="lg:col-span-5">
              <p className="eyebrow mb-2">{about.practiceEyebrow}</p>
              <h2
                className="font-display font-semibold text-[#111111]"
                style={{ fontSize: "var(--text-h2)" }}
              >
                {about.practiceTitle}
              </h2>
            </div>
            <div className="lg:col-span-7 space-y-4 text-sm md:text-base text-[#444444] leading-relaxed">
              {about.paragraphs.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="py-10 md:py-16 bg-[#F5F5F5] border-b border-[#EAEAEA]">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mb-8">
            <p className="eyebrow mb-2">{about.leadershipEyebrow}</p>
            <h2
              className="font-display font-semibold text-[#111111]"
              style={{ fontSize: "var(--text-h2)" }}
            >
              {about.leadershipTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SITE_CONFIG.leadership.map((leader) => (
              <div
                key={leader.name}
                className="bg-[#FFFFFF] border border-[#EAEAEA] p-5 md:p-7 flex flex-col sm:flex-row gap-5 items-start"
              >
                <img
                  src={leader.image}
                  alt={leader.name}
                  width={96}
                  height={96}
                  className="w-20 h-20 sm:w-24 sm:h-24 object-cover border border-[#EAEAEA] shrink-0"
                  loading="lazy"
                />
                <div>
                  <h3 className="font-display font-semibold text-lg text-[#111111]">
                    {leader.name}
                  </h3>
                  <p className="text-xs uppercase tracking-[0.12em] text-[#777777] mt-0.5 mb-2.5">
                    {leader.role}
                  </p>
                  <p className="text-sm text-[#444444] leading-relaxed">
                    {leader.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="py-12 md:py-16 bg-[#111111] text-[#FFFFFF]">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.14em] text-[#B5B5B5] mb-2">
              {about.principlesEyebrow}
            </p>
            <h2
              className="font-display font-semibold text-[#FFFFFF]"
              style={{ fontSize: "var(--text-h2)" }}
            >
              {about.principlesTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#2E2E2E] border border-[#2E2E2E]">
            {about.values.map((val) => (
              <div key={val.code} className="bg-[#111111] p-6 md:p-7">
                <p className="text-xs font-mono text-[#777777] mb-4">{val.code}</p>
                <h3 className="font-display font-medium text-lg text-[#FFFFFF] mb-2">
                  {val.title}
                </h3>
                <p className="text-sm text-[#B5B5B5] leading-relaxed">
                  {val.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-10 md:py-14 bg-[#FFFFFF] border-t border-[#EAEAEA]">
        <div className="container mx-auto px-4 lg:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="font-display font-semibold text-xl md:text-2xl text-[#111111] mb-1">
              Ready to discuss your plot?
            </h2>
            <p className="text-sm text-[#444444]">
              Meet our civil engineers in Coimbatore or Salem.
            </p>
          </div>
          <Button asChild>
            <Link to="/appointment">
              Book Site Visit
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default About;
