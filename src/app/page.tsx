import { HeroSection } from "@/components/public/HeroSection";

export default function Home() {
  return (
    <main className="min-h-screen w-full bg-white text-zinc-950">
      {/* 1. Hero Section (Latar Biru dengan Rounded Bottom) */}
      <HeroSection />

      {/* 2. Section Baru (Latar Putih / White Canvas) */}
      <section className="relative w-full bg-white min-h-[600px] sm:min-h-[800px] px-4 sm:px-6 py-20 flex flex-col items-center justify-center">
        {/* White background canvas siap untuk section berikutnya */}
      </section>
    </main>
  );
}
