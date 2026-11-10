"use client";

import React from "react";
import Link from "next/link";
import {
  Layers,
  Sparkles,
  HelpCircle,
  Users,
  Globe,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";
import { AnimatedArrowBadge } from "@/components/ui/AnimatedArrowBadge";
import { AdminSwitch } from "@/components/admin/AdminField";
import { useAdminCms } from "@/components/admin/AdminCmsProvider";

export default function AdminOverviewPage() {
  const { landingContent, teamContent, updateContact } = useAdminCms();

  const metrics = [
    {
      label: "Kartu Divisi",
      value: landingContent.divisions.length,
      caption: "Terkunci 3 kartu interaktif",
      href: "/admin/landing?tab=divisi",
      icon: Layers,
    },
    {
      label: "Tab Karya Kami",
      value: landingContent.services.tabs.length,
      caption: "Maksimal 5 tab layanan",
      href: "/admin/landing?tab=karya",
      icon: Sparkles,
    },
    {
      label: "Pertanyaan FAQ",
      value: landingContent.faq.items.length,
      caption: "Maksimal 6 item accordion",
      href: "/admin/landing?tab=faq",
      icon: HelpCircle,
    },
    {
      label: "Anggota Tim",
      value: teamContent.members.length,
      caption: "Tampil di halaman /team",
      href: "/admin/team",
      icon: Users,
    },
  ];

  const sectionShortcuts = [
    {
      step: "01",
      name: "Hero & Video Showcase",
      summary: `${landingContent.hero.headlineLine1} ${landingContent.hero.headlineLine2}`,
      limitInfo: "Headline 2 baris · 1 kalimat subheadline",
      tab: "hero",
    },
    {
      step: "02",
      name: "Marquee & Tentang Creatify",
      summary: landingContent.about.description,
      limitInfo: "Headline 4 baris · Narasi maks 2 kalimat",
      tab: "tentang",
    },
    {
      step: "03",
      name: "Kartu 3 Divisi Kreatif",
      summary: landingContent.divisions.map((d) => d.collapsedTitle).join(" · "),
      limitInfo: "3 kartu · Deskripsi 1 kalimat/kartu",
      tab: "divisi",
    },
    {
      step: "04",
      name: "Karya Kami (Showcase Tab)",
      summary: landingContent.services.tabs.map((t) => t.tabLabel).join(" · "),
      limitInfo: "1–5 tab · Deskripsi maks 2 kalimat",
      tab: "karya",
    },
    {
      step: "05",
      name: "FAQ Pertanyaan Umum",
      summary: `${landingContent.faq.items.length} pertanyaan aktif`,
      limitInfo: "1–6 item · Jawaban maks 2 kalimat",
      tab: "faq",
    },
    {
      step: "06",
      name: "Rekrutmen & Footer",
      summary: landingContent.contact.isRecruitmentOpen
        ? "Open Recruitment sedang Dibuka"
        : "Open Recruitment sedang Ditutup",
      limitInfo: "Subjudul 2 kalimat · Footer 1 kalimat",
      tab: "rekrutmen",
    },
  ];

  const quickNavItems = [
    {
      title: "Manajemen Tim & Pengurus",
      description: `${teamContent.members.length} anggota · Atur tim & header /team`,
      href: "/admin/team",
      actionLabel: "Buka",
      icon: Users,
      external: false,
    },
    {
      title: "Kontak, Brand & Media Sosial",
      description: `${landingContent.siteSettings.email}`,
      href: "/admin/settings",
      actionLabel: "Buka",
      icon: Globe,
      external: false,
    },
    {
      title: "Akun Admin & Reset Konten",
      description: "Ubah sandi admin & reset default CMS",
      href: "/admin/settings#akun",
      actionLabel: "Buka",
      icon: ShieldCheck,
      external: false,
    },
    {
      title: "Pratinjau Landing Page",
      description: "Lihat tampilan publik halaman utama",
      href: "/",
      actionLabel: "Pratinjau",
      icon: ExternalLink,
      external: true,
    },
    {
      title: "Pratinjau Halaman Tim",
      description: "Tinjau katalog tim & divisi di /team",
      href: "/team",
      actionLabel: "Pratinjau",
      icon: ExternalLink,
      external: true,
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-7">
      {/* Cobalt Spotlight Banner selaras gaya ServicesSection & HeroSection */}
      <section className="rounded-[28px] sm:rounded-[34px] bg-[#185adb] text-white p-6 sm:p-8 lg:p-10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-7 lg:gap-10">
          <div className="max-w-2xl">
            <h1 className="text-[28px] sm:text-[34px] lg:text-[40px] font-medium tracking-[-0.03em] leading-[1.12] text-white">
              {landingContent.hero.headlineLine1}{" "}
              {landingContent.hero.headlineLine2}
            </h1>
            <p className="mt-3 max-w-xl text-[14.5px] sm:text-[15.5px] font-normal leading-[1.6] text-white/80">
              Kelola seluruh bagian landing page, tim pengurus, dan kanal resmi
              dengan batas kalimat otomatis agar komposisi desain tetap konsisten.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href="/admin/landing"
                className="group inline-flex items-center gap-3 rounded-full bg-white hover:bg-zinc-100 pl-5 pr-2 py-2 text-[14px] font-medium text-[#0c0f1d] transition-colors"
              >
                <span>Kelola Konten Landing</span>
                <AnimatedArrowBadge size="sm" variant="blue" />
              </Link>

              <Link
                href="/admin/team"
                className="group inline-flex items-center gap-3 rounded-full bg-[#255fdc]/70 hover:bg-[#255fdc] border border-white/25 pl-5 pr-2 py-2 text-[14px] font-medium text-white transition-colors"
              >
                <span>Kelola Anggota Tim</span>
                <AnimatedArrowBadge size="sm" variant="white" />
              </Link>
            </div>
          </div>

          <div className="shrink-0 lg:w-[320px]">
            <div className="rounded-[20px] bg-white p-1.5 text-[#0c0f1d]">
              <AdminSwitch
                checked={landingContent.contact.isRecruitmentOpen}
                onChange={(checked) =>
                  updateContact({
                    ...landingContent.contact,
                    isRecruitmentOpen: checked,
                  })
                }
                label="Open Recruitment"
                description={
                  landingContent.contact.isRecruitmentOpen
                    ? "Formulir aktif tampil di footer"
                    : "Formulir dikunci sementara"
                }
              />
            </div>
          </div>
        </div>
      </section>

      {/* 4 Kartu Metrik */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Link
              key={metric.label}
              href={metric.href}
              className="group rounded-[24px] border border-zinc-200/80 bg-white p-5 sm:p-6 flex flex-col justify-between gap-5 hover:border-zinc-300 transition-colors"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[13.5px] font-medium text-zinc-500">
                  {metric.label}
                </span>
                <Icon className="h-5 w-5 text-[#185adb] shrink-0" />
              </div>

              <div>
                <div className="text-[36px] sm:text-[40px] font-medium tracking-[-0.03em] leading-none text-[#0c0f1d] tabular-nums">
                  {metric.value}
                </div>
                <p className="mt-2 text-[12.5px] text-zinc-500">
                  {metric.caption}
                </p>
              </div>
            </Link>
          );
        })}
      </section>

      {/* Peta Section & Navigasi Cepat */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 lg:items-stretch">
        <div className="lg:col-span-7 h-full flex flex-col rounded-[24px] sm:rounded-[28px] border border-zinc-200/80 bg-white p-5 sm:p-6">
          <div className="pb-4 border-b border-zinc-200/70">
            <h2 className="text-[20px] sm:text-[22px] font-semibold tracking-[-0.02em] text-[#0c0f1d]">
              Urutan Section Landing Page
            </h2>
            <p className="mt-1 text-[13.5px] text-zinc-500">
              Disusun berurutan dari atas ke bawah sesuai halaman utama.
            </p>
          </div>

          <div className="divide-y divide-zinc-200/70">
            {sectionShortcuts.map((item) => (
              <div
                key={item.tab}
                className="py-3.5 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f4f5f7] text-[11.5px] font-semibold text-[#185adb] tabular-nums shrink-0 mt-0.5">
                    {item.step}
                  </span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[15px] font-semibold text-[#0c0f1d]">
                        {item.name}
                      </span>
                      <span className="rounded-full bg-[#f4f5f7] px-2.5 py-0.5 text-[11px] font-medium text-zinc-600">
                        {item.limitInfo}
                      </span>
                    </div>
                    <p className="mt-1 text-[13px] text-zinc-500 truncate">
                      {item.summary}
                    </p>
                  </div>
                </div>

                <Link
                  href={`/admin/landing?tab=${item.tab}`}
                  className="inline-flex items-center justify-center rounded-full border border-zinc-200/90 bg-white hover:bg-zinc-50 hover:border-zinc-300 px-4 py-1.5 text-[12.5px] font-medium text-[#0c0f1d] transition-colors shrink-0 self-start sm:self-center"
                >
                  Sunting
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 h-full flex flex-col rounded-[24px] sm:rounded-[28px] border border-zinc-200/80 bg-white p-5 sm:p-6">
          <div className="pb-4 border-b border-zinc-200/70">
            <h2 className="text-[20px] sm:text-[22px] font-semibold tracking-[-0.02em] text-[#0c0f1d]">
              Navigasi Cepat Admin
            </h2>
            <p className="mt-1 text-[13.5px] text-zinc-500">
              Akses cepat kelola tim, situs, dan pratinjau.
            </p>
          </div>

          <div className="mt-4 flex-1 flex flex-col gap-2.5">
            {quickNavItems.map((nav) => {
              const Icon = nav.icon;
              return (
                <Link
                  key={nav.title}
                  href={nav.href}
                  target={nav.external ? "_blank" : undefined}
                  rel={nav.external ? "noopener noreferrer" : undefined}
                  className="group flex-1 flex items-center justify-between gap-3 rounded-[16px] border border-zinc-200/70 bg-[#f4f5f7]/70 hover:bg-[#f4f5f7] hover:border-zinc-300/80 px-4 py-3 transition-colors"
                >
                  <div className="flex items-start gap-3.5 min-w-0">
                    <Icon className="h-[18px] w-[18px] text-[#185adb] shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <span className="block text-[14.5px] font-semibold text-[#0c0f1d] truncate">
                        {nav.title}
                      </span>
                      <span className="mt-0.5 block text-[12.5px] text-zinc-500 truncate">
                        {nav.description}
                      </span>
                    </div>
                  </div>

                  <span className="rounded-full bg-white border border-zinc-200/90 group-hover:border-zinc-300 px-3.5 py-1 text-[12px] font-medium text-[#0c0f1d] transition-colors shrink-0">
                    {nav.actionLabel}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
