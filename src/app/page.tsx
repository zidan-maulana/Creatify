import { HeroSection } from "@/components/public/HeroSection";
import { AboutSection } from "@/components/public/AboutSection";
import { PortfolioSection } from "@/components/public/PortfolioSection";
import { ServicesSection } from "@/components/public/ServicesSection";
import { FaqSection } from "@/components/public/FaqSection";
import { ContactSection } from "@/components/public/ContactSection";
import { getLandingContent } from "@/lib/cms";

export default async function Home() {
  const content = await getLandingContent();

  return (
    <main
      id="landing-canvas"
      className="min-h-screen w-full bg-white text-zinc-950"
    >
      {/* Hero section & video parallax */}
      <HeroSection content={content.hero} siteSettings={content.siteSettings} />

      {/* About section & akses tim */}
      <AboutSection content={content.about} />

      {/* Portofolio divisi kreatif */}
      <PortfolioSection items={content.divisions} />

      {/* Layanan & showcase karya */}
      <ServicesSection content={content.services} />

      {/* FAQ tanya jawab Creatify */}
      <FaqSection content={content.faq} siteSettings={content.siteSettings} />

      {/* Section rekrutmen, kontak & footer */}
      <ContactSection
        content={content.contact}
        siteSettings={content.siteSettings}
      />
    </main>
  );
}
