import { HeroSection } from "@/components/public/HeroSection";
import { LogoMarquee } from "@/components/public/LogoMarquee";
import { AboutSection } from "@/components/public/AboutSection";
import { PortfolioSection } from "@/components/public/PortfolioSection";
import { ServicesSection } from "@/components/public/ServicesSection";
import { FaqSection } from "@/components/public/FaqSection";
import { ContactSection } from "@/components/public/ContactSection";

export default function Home() {
  return (
    <main
      id="landing-canvas"
      style={{
        backgroundColor: "#185adb",
      }}
      className="min-h-screen w-full text-zinc-950"
    >
      {/* Hero section & video parallax */}
      <HeroSection />

      {/* Marquee logo mitra */}
      <LogoMarquee />

      {/* About section & akses tim */}
      <AboutSection />

      {/* Portofolio divisi kreatif */}
      <PortfolioSection />

      {/* Layanan & showcase karya */}
      <ServicesSection />

      {/* FAQ tanya jawab Creatify */}
      <FaqSection />

      {/* Section rekrutmen, kontak & footer */}
      <ContactSection />
    </main>
  );
}
