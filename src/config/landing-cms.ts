import { z } from "zod";
import { SITE_CONFIG } from "@/config/site";
import { TEAM_MEMBERS_DATA } from "@/data/team";
import type {
  LandingPageContent,
  SiteSettingsContent,
  TeamPageContent,
  TextFieldLimit,
} from "@/types/cms";

// Batas maksimal karakter dan kalimat tiap bagian agar layout landing page tetap presisi
export const LANDING_CONTENT_LIMITS = {
  siteSettings: {
    name: { maxChars: 20, maxSentences: 1 },
    title: { maxChars: 75, maxSentences: 1 },
    description: { maxChars: 160, maxSentences: 1 },
    navbarCtaLabel: { maxChars: 26, maxSentences: 1 },
    email: { maxChars: 120, maxSentences: 1 },
    instagramHandle: { maxChars: 40, maxSentences: 1 },
    secretariatFaculty: { maxChars: 55, maxSentences: 1 },
    secretariatShortLabel: { maxChars: 40, maxSentences: 1 },
    secretariatAddress: { maxChars: 65, maxSentences: 1 },
  },
  hero: {
    badgeText: { maxChars: 65, maxSentences: 1 },
    headlineLine1: { maxChars: 36, maxSentences: 1 },
    headlineLine2: { maxChars: 34, maxSentences: 1 },
    subheadline: { maxChars: 110, maxSentences: 1 },
    primaryCtaLabel: { maxChars: 28, maxSentences: 1 },
    secondaryCtaLabel: { maxChars: 26, maxSentences: 1 },
  },
  marquee: {
    trustLabel: { maxChars: 75, maxSentences: 1 },
  },
  about: {
    headlineLine1Before: { maxChars: 28, maxSentences: 1 },
    headlineLine1After: { maxChars: 16, maxSentences: 1 },
    headlineLine2: { maxChars: 32, maxSentences: 1 },
    headlineLine3Before: { maxChars: 26, maxSentences: 1 },
    headlineLine3After: { maxChars: 12, maxSentences: 1 },
    headlineLine4: { maxChars: 32, maxSentences: 1 },
    description: { maxChars: 350, maxSentences: 2 },
    ctaLabel: { maxChars: 32, maxSentences: 1 },
  },
  divisions: {
    count: { min: 3, max: 3 },
    title: { maxChars: 32, maxSentences: 1 },
    collapsedTitle: { maxChars: 18, maxSentences: 1 },
    description: { maxChars: 160, maxSentences: 1 },
    tagRow1: { maxChars: 22, maxSentences: 1 },
    tagRow2: { maxChars: 22, maxSentences: 1 },
    tagMore: { maxChars: 10, maxSentences: 1 },
  },
  services: {
    title: { maxChars: 22, maxSentences: 1 },
    subtitle: { maxChars: 160, maxSentences: 1 },
    ctaLabel: { maxChars: 28, maxSentences: 1 },
    tabsCount: { min: 1, max: 5 },
    tabLabel: { maxChars: 22, maxSentences: 1 },
    tabHeadline: { maxChars: 95, maxSentences: 1 },
    tabDescription: { maxChars: 320, maxSentences: 2 },
  },
  faq: {
    titleLine1: { maxChars: 18, maxSentences: 1 },
    titleLine2: { maxChars: 18, maxSentences: 1 },
    subtitle: { maxChars: 85, maxSentences: 2 },
    ctaLabel: { maxChars: 26, maxSentences: 1 },
    itemsCount: { min: 1, max: 6 },
    question: { maxChars: 85, maxSentences: 1 },
    answer: { maxChars: 260, maxSentences: 2 },
  },
  contact: {
    titleLine1: { maxChars: 20, maxSentences: 1 },
    titleLine2: { maxChars: 22, maxSentences: 1 },
    subtitle: { maxChars: 85, maxSentences: 2 },
    closedNotice: { maxChars: 120, maxSentences: 2 },
    submitLabel: { maxChars: 24, maxSentences: 1 },
    divisionOptionsCount: { min: 1, max: 5 },
    divisionLabel: { maxChars: 28, maxSentences: 1 },
    divisionDescription: { maxChars: 50, maxSentences: 1 },
    footerDescription: { maxChars: 130, maxSentences: 1 },
    copyrightText: { maxChars: 70, maxSentences: 2 },
    facultyLabel: { maxChars: 40, maxSentences: 1 },
  },
  teamPage: {
    titleLine1: { maxChars: 28, maxSentences: 1 },
    titleLine2: { maxChars: 36, maxSentences: 1 },
    subtitle: { maxChars: 140, maxSentences: 1 },
  },
} as const;

// Hitung jumlah kalimat dengan mengabaikan singkatan umum seperti "Univ.", "Jl.", "No."
export function countSentences(text: string): number {
  const normalized = text
    .trim()
    .replace(/\b(Univ|Jl|No|Dr|Prof|Ir|St)\./gi, "$1");
  if (!normalized) return 0;

  const segments = normalized
    .split(/[.!?]+(?:\s+|$)/)
    .map((part) => part.trim())
    .filter(Boolean);

  return Math.max(1, segments.length);
}

function boundedTextSchema(label: string, limit: TextFieldLimit) {
  return z
    .string()
    .trim()
    .min(1, `${label} tidak boleh kosong.`)
    .max(limit.maxChars, `${label} maksimal ${limit.maxChars} karakter.`)
    .refine(
      (val) => countSentences(val) <= limit.maxSentences,
      `${label} maksimal ${limit.maxSentences} kalimat agar tata letak tetap terjaga.`
    );
}

const mediaUrlSchema = z
  .string()
  .trim()
  .min(1, "Media gambar atau video tidak boleh kosong.")
  .refine(
    (val) =>
      val.startsWith("/") ||
      val.startsWith("https://") ||
      val.startsWith("http://") ||
      val.startsWith("data:image/"),
    "Unggah file gambar yang valid atau gunakan path media / tautan https."
  );

export const siteSettingsSchema = z.object({
  name: boundedTextSchema("Nama brand", LANDING_CONTENT_LIMITS.siteSettings.name),
  title: boundedTextSchema(
    "Judul metadata situs",
    LANDING_CONTENT_LIMITS.siteSettings.title
  ),
  description: boundedTextSchema(
    "Deskripsi metadata situs",
    LANDING_CONTENT_LIMITS.siteSettings.description
  ),
  navbarCtaLabel: boundedTextSchema(
    "Label tombol navbar",
    LANDING_CONTENT_LIMITS.siteSettings.navbarCtaLabel
  ),
  email: z
    .string()
    .trim()
    .email("Format email resmi tidak valid.")
    .max(LANDING_CONTENT_LIMITS.siteSettings.email.maxChars),
  instagramHandle: boundedTextSchema(
    "Handle Instagram",
    LANDING_CONTENT_LIMITS.siteSettings.instagramHandle
  ),
  instagramUrl: mediaUrlSchema,
  tiktokUrl: mediaUrlSchema,
  youtubeUrl: mediaUrlSchema,
  secretariat: z.object({
    faculty: boundedTextSchema(
      "Nama fakultas sekretariat",
      LANDING_CONTENT_LIMITS.siteSettings.secretariatFaculty
    ),
    shortLabel: boundedTextSchema(
      "Label singkat sekretariat",
      LANDING_CONTENT_LIMITS.siteSettings.secretariatShortLabel
    ),
    address: boundedTextSchema(
      "Alamat sekretariat",
      LANDING_CONTENT_LIMITS.siteSettings.secretariatAddress
    ),
  }),
});

export const landingContentSchema = z.object({
  siteSettings: siteSettingsSchema,
  hero: z.object({
    badgeText: boundedTextSchema("Badge Hero", LANDING_CONTENT_LIMITS.hero.badgeText),
    headlineLine1: boundedTextSchema(
      "Headline Hero baris 1",
      LANDING_CONTENT_LIMITS.hero.headlineLine1
    ),
    headlineLine2: boundedTextSchema(
      "Headline Hero baris 2",
      LANDING_CONTENT_LIMITS.hero.headlineLine2
    ),
    subheadline: boundedTextSchema(
      "Sub-headline Hero",
      LANDING_CONTENT_LIMITS.hero.subheadline
    ),
    primaryCtaLabel: boundedTextSchema(
      "Tombol CTA utama Hero",
      LANDING_CONTENT_LIMITS.hero.primaryCtaLabel
    ),
    secondaryCtaLabel: boundedTextSchema(
      "Tombol CTA sekunder Hero",
      LANDING_CONTENT_LIMITS.hero.secondaryCtaLabel
    ),
    videoUrl: mediaUrlSchema,
  }),
  marquee: z.object({
    trustLabel: boundedTextSchema(
      "Label kemitraan marquee",
      LANDING_CONTENT_LIMITS.marquee.trustLabel
    ),
  }),
  about: z.object({
    headlineLine1Before: boundedTextSchema(
      "Headline Tentang baris 1 (awal)",
      LANDING_CONTENT_LIMITS.about.headlineLine1Before
    ),
    headlineLine1After: boundedTextSchema(
      "Headline Tentang baris 1 (akhir)",
      LANDING_CONTENT_LIMITS.about.headlineLine1After
    ),
    headlineLine2: boundedTextSchema(
      "Headline Tentang baris 2",
      LANDING_CONTENT_LIMITS.about.headlineLine2
    ),
    headlineLine3Before: boundedTextSchema(
      "Headline Tentang baris 3 (awal)",
      LANDING_CONTENT_LIMITS.about.headlineLine3Before
    ),
    headlineLine3After: boundedTextSchema(
      "Headline Tentang baris 3 (akhir)",
      LANDING_CONTENT_LIMITS.about.headlineLine3After
    ),
    headlineLine4: boundedTextSchema(
      "Headline Tentang baris 4",
      LANDING_CONTENT_LIMITS.about.headlineLine4
    ),
    pillImage1Url: mediaUrlSchema,
    pillImage2Url: mediaUrlSchema,
    description: boundedTextSchema(
      "Deskripsi Tentang Creatify",
      LANDING_CONTENT_LIMITS.about.description
    ),
    ctaLabel: boundedTextSchema(
      "Tombol CTA Tentang",
      LANDING_CONTENT_LIMITS.about.ctaLabel
    ),
  }),
  divisions: z
    .array(
      z.object({
        id: z.string().trim().min(1),
        iconKey: z.enum(["smile", "video", "share"]),
        title: boundedTextSchema(
          "Judul kartu divisi",
          LANDING_CONTENT_LIMITS.divisions.title
        ),
        collapsedTitle: boundedTextSchema(
          "Label ringkas kartu divisi",
          LANDING_CONTENT_LIMITS.divisions.collapsedTitle
        ),
        description: boundedTextSchema(
          "Deskripsi kartu divisi",
          LANDING_CONTENT_LIMITS.divisions.description
        ),
        tagRow1: boundedTextSchema("Tag baris 1", LANDING_CONTENT_LIMITS.divisions.tagRow1),
        tagRow2: boundedTextSchema("Tag baris 2", LANDING_CONTENT_LIMITS.divisions.tagRow2),
        tagMore: boundedTextSchema("Tag tambahan", LANDING_CONTENT_LIMITS.divisions.tagMore),
        image: mediaUrlSchema,
      })
    )
    .min(LANDING_CONTENT_LIMITS.divisions.count.min)
    .max(LANDING_CONTENT_LIMITS.divisions.count.max),
  services: z.object({
    title: boundedTextSchema("Judul Karya Kami", LANDING_CONTENT_LIMITS.services.title),
    subtitle: boundedTextSchema(
      "Subjudul Karya Kami",
      LANDING_CONTENT_LIMITS.services.subtitle
    ),
    ctaLabel: boundedTextSchema(
      "Tombol CTA Karya Kami",
      LANDING_CONTENT_LIMITS.services.ctaLabel
    ),
    tabs: z
      .array(
        z.object({
          id: z.string().trim().min(1),
          tabLabel: boundedTextSchema(
            "Label tab karya",
            LANDING_CONTENT_LIMITS.services.tabLabel
          ),
          headline: boundedTextSchema(
            "Headline karya",
            LANDING_CONTENT_LIMITS.services.tabHeadline
          ),
          description: boundedTextSchema(
            "Deskripsi karya",
            LANDING_CONTENT_LIMITS.services.tabDescription
          ),
          image: mediaUrlSchema,
        })
      )
      .min(LANDING_CONTENT_LIMITS.services.tabsCount.min)
      .max(LANDING_CONTENT_LIMITS.services.tabsCount.max),
  }),
  faq: z.object({
    titleLine1: boundedTextSchema("Judul FAQ baris 1", LANDING_CONTENT_LIMITS.faq.titleLine1),
    titleLine2: boundedTextSchema("Judul FAQ baris 2", LANDING_CONTENT_LIMITS.faq.titleLine2),
    subtitle: boundedTextSchema("Subjudul FAQ", LANDING_CONTENT_LIMITS.faq.subtitle),
    ctaLabel: boundedTextSchema("Tombol CTA FAQ", LANDING_CONTENT_LIMITS.faq.ctaLabel),
    items: z
      .array(
        z.object({
          id: z.string().trim().min(1),
          question: boundedTextSchema("Pertanyaan FAQ", LANDING_CONTENT_LIMITS.faq.question),
          answer: boundedTextSchema("Jawaban FAQ", LANDING_CONTENT_LIMITS.faq.answer),
        })
      )
      .min(LANDING_CONTENT_LIMITS.faq.itemsCount.min)
      .max(LANDING_CONTENT_LIMITS.faq.itemsCount.max),
  }),
  contact: z.object({
    titleLine1: boundedTextSchema(
      "Judul Rekrutmen baris 1",
      LANDING_CONTENT_LIMITS.contact.titleLine1
    ),
    titleLine2: boundedTextSchema(
      "Judul Rekrutmen baris 2",
      LANDING_CONTENT_LIMITS.contact.titleLine2
    ),
    subtitle: boundedTextSchema(
      "Subjudul Rekrutmen",
      LANDING_CONTENT_LIMITS.contact.subtitle
    ),
    isRecruitmentOpen: z.boolean(),
    closedNotice: boundedTextSchema(
      "Pesan status rekrutmen tutup",
      LANDING_CONTENT_LIMITS.contact.closedNotice
    ),
    submitLabel: boundedTextSchema(
      "Label tombol kirim rekrutmen",
      LANDING_CONTENT_LIMITS.contact.submitLabel
    ),
    divisionOptions: z
      .array(
        z.object({
          id: z.string().trim().min(1),
          label: boundedTextSchema(
            "Nama opsi divisi",
            LANDING_CONTENT_LIMITS.contact.divisionLabel
          ),
          description: boundedTextSchema(
            "Deskripsi opsi divisi",
            LANDING_CONTENT_LIMITS.contact.divisionDescription
          ),
        })
      )
      .min(LANDING_CONTENT_LIMITS.contact.divisionOptionsCount.min)
      .max(LANDING_CONTENT_LIMITS.contact.divisionOptionsCount.max),
    footerDescription: boundedTextSchema(
      "Deskripsi footer",
      LANDING_CONTENT_LIMITS.contact.footerDescription
    ),
    copyrightText: boundedTextSchema(
      "Teks hak cipta footer",
      LANDING_CONTENT_LIMITS.contact.copyrightText
    ),
    facultyLabel: boundedTextSchema(
      "Label fakultas footer",
      LANDING_CONTENT_LIMITS.contact.facultyLabel
    ),
  }),
});

export const teamPageContentSchema = z.object({
  titleLine1: boundedTextSchema(
    "Judul halaman Tim baris 1",
    LANDING_CONTENT_LIMITS.teamPage.titleLine1
  ),
  titleLine2: boundedTextSchema(
    "Judul halaman Tim baris 2",
    LANDING_CONTENT_LIMITS.teamPage.titleLine2
  ),
  subtitle: boundedTextSchema(
    "Subjudul halaman Tim",
    LANDING_CONTENT_LIMITS.teamPage.subtitle
  ),
});

export const DEFAULT_SITE_SETTINGS: SiteSettingsContent = {
  name: SITE_CONFIG.name,
  title: SITE_CONFIG.title,
  description: SITE_CONFIG.description,
  navbarCtaLabel: "Jelajahi Portofolio",
  email: SITE_CONFIG.email,
  instagramHandle: SITE_CONFIG.instagramHandle,
  instagramUrl: SITE_CONFIG.instagramUrl,
  tiktokUrl: SITE_CONFIG.tiktokUrl,
  youtubeUrl: SITE_CONFIG.youtubeUrl,
  secretariat: {
    faculty: SITE_CONFIG.secretariat.faculty,
    shortLabel: SITE_CONFIG.secretariat.shortLabel,
    address: SITE_CONFIG.secretariat.address,
  },
};

export const DEFAULT_LANDING_CONTENT: LandingPageContent = {
  siteSettings: DEFAULT_SITE_SETTINGS,
  hero: {
    badgeText: "Komunitas Resmi di Bawah Naungan Fakultas Ilmu Komputer",
    headlineLine1: "Desain dan media kreatif yang",
    headlineLine2: "membangun citra fakultas.",
    subheadline:
      "Studio kreatif independen Fasilkom, merancang karya visual dari\nkonsep awal hingga publikasi.",
    primaryCtaLabel: "Tertarik Bergabung?",
    secondaryCtaLabel: "Tentang Creatify",
    videoUrl: "/videos/showcase.mp4",
  },
  marquee: {
    trustLabel: "Dipercaya oleh Fakultas Ilmu Komputer — Universitas Mercu Buana",
  },
  about: {
    headlineLine1Before: "Creatify merupakan tim",
    headlineLine1After: "kreatif",
    headlineLine2: "merancang identitas visual",
    headlineLine3Before: "hingga media digital",
    headlineLine3After: "yang",
    headlineLine4: "membangun citra fakultas.",
    pillImage1Url:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&crop=face&w=400&h=200&q=80",
    pillImage2Url:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=400&h=200&q=80",
    description:
      "Sebagai studio kreatif Fakultas Ilmu Komputer Universitas Mercu Buana, kami menghimpun mahasiswa bertalenta untuk merancang desain grafis, video sinematik, dan media digital resmi fakultas. Kolaborasi ini menjadi ruang eksplorasi guna membangun identitas visual yang solid, relevan, serta inspiratif bagi seluruh civitas akademika.",
    ctaLabel: "Lihat Seluruh Tim Creatify",
  },
  divisions: [
    {
      id: "desain-grafis",
      iconKey: "smile",
      title: "Divisi Desain Grafis",
      collapsedTitle: "Desain Grafis",
      description:
        "Merumuskan identitas visual, panduan grafis resmi, desain feed media sosial, poster event, hingga perlengkapan publikasi kreatif fakultas.",
      tagRow1: "Identitas Visual",
      tagRow2: "Poster & Banner",
      tagMore: "+more",
      image:
        "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: "video-editing",
      iconKey: "video",
      title: "Divisi Multimedia & Video",
      collapsedTitle: "Multimedia",
      description:
        "Menggarap produksi video sinematik, aftermovie kegiatan fakultas, konten video vertikal interaktif, serta motion design dinamis berstandar tinggi.",
      tagRow1: "Aftermovie Event",
      tagRow2: "Motion Graphic",
      tagMore: "+more",
      image:
        "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: "social-media",
      iconKey: "share",
      title: "Divisi Media Sosial",
      collapsedTitle: "Media Sosial",
      description:
        "Mengelola ekosistem publikasi digital, menyusun kurasi konten terstruktur, copywriting komunikatif, serta strategi interaktif bersama civitas akademika.",
      tagRow1: "Strategi Konten",
      tagRow2: "Engagement",
      tagMore: "+more",
      image:
        "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?auto=format&fit=crop&w=1200&q=80",
    },
  ],
  services: {
    title: "Karya Kami",
    subtitle:
      "Eksplorasi karya identitas visual, produksi video sinematik, dan media digital yang dirancang untuk memperkuat citra Fakultas Ilmu Komputer.",
    ctaLabel: "Gabung Tim Creatify",
    tabs: [
      {
        id: "identitas-visual",
        tabLabel: "Identitas Visual",
        headline:
          "Logos, tipografi, dan warna dengan panduan resmi yang siap diaplikasikan seluruh tim.",
        description:
          "Kami merumuskan fondasi identitas visual Fakultas Ilmu Komputer yang berkarakter, konsisten, dan mudah diimplementasikan. Mulai dari standardisasi sistem logo, hierarki tipografi, palet warna resmi, hingga pedoman grafis lengkap untuk memastikan seluruh media komunikasi tampil profesional dan selaras.",
        image:
          "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?auto=format&fit=crop&w=1200&q=80",
      },
      {
        id: "desain-grafis",
        tabLabel: "Desain Grafis",
        headline:
          "Visual kreatif yang memikat untuk poster event, banner, dan materi publikasi resmi.",
        description:
          "Menciptakan karya desain visual kreatif untuk mendukung agenda promosi, acara resmi, dan publikasi fakultas. Setiap materi dirancang dengan sentuhan modern dan dinamis, mencakup poster kegiatan, spanduk, virtual backdrop acara, infografis edukatif, hingga perlengkapan promosi kampus.",
        image:
          "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=1200&q=80",
      },
      {
        id: "produksi-video",
        tabLabel: "Produksi Video",
        headline:
          "Sinematografi dan aftermovie yang mengabadikan setiap momen prestisius fakultas.",
        description:
          "Menyajikan produksi video berkualitas tinggi yang menangkap atmosfer dan esensi setiap momen penting fakultas. Kami memproduksi aftermovie kegiatan berskala besar, konten reels dan video vertikal sinematik, video teaser, serta dokumentasi visual dengan standar audio visual yang memukau.",
        image:
          "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80",
      },
      {
        id: "media-sosial",
        tabLabel: "Media Sosial",
        headline:
          "Strategi konten interaktif untuk meningkatkan engagement dan citra civitas akademika.",
        description:
          "Mengelola ekosistem media sosial resmi fakultas secara terencana dan interaktif. Kami merancang tata kelola visual feed yang rapi, copywriting komunikatif, konten interaktif seperti Q&A dan trivia, serta jadwal publikasi terstruktur guna membangun kedekatan aktif dengan mahasiswa dan publik.",
        image:
          "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=1200&q=80",
      },
      {
        id: "dokumentasi-event",
        tabLabel: "Dokumentasi Event",
        headline:
          "Dokumentasi tajam dan berkelas di setiap agenda dan seremoni penting fakultas.",
        description:
          "Mengabadikan setiap seremoni, konferensi, seminar nasional, serta momentum penting di lingkungan kampus. Tim dokumentasi kami siap menangkap setiap momen krusial dengan komposisi terbaik, menghasilkan arsip foto beresolusi tinggi yang siap untuk kebutuhan publikasi resmi.",
        image:
          "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=80",
      },
    ],
  },
  faq: {
    titleLine1: "Yang sering",
    titleLine2: "ditanyakan",
    subtitle:
      "Belum menemukan info yang dibutuhkan? Kirim email, tim siap membalas cepat.",
    ctaLabel: "Email Tim Creatify",
    items: [
      {
        id: "peran-creatify",
        question: "Apa itu Creatify dan perannya di Fakultas Ilmu Komputer?",
        answer:
          "Creatify adalah komunitas kreatif resmi di bawah naungan Fakultas Ilmu Komputer Universitas Mercu Buana. Kami merancang identitas visual, produksi video sinematik, dan pengelolaan media digital guna memperkuat citra fakultas.",
      },
      {
        id: "layanan-kreatif",
        question: "Karya dan layanan kreatif apa saja yang dikerjakan?",
        answer:
          "Kami mencakup perumusan identitas visual, desain grafis publikasi, produksi video serta aftermovie kegiatan, liputan dokumentasi event kampus, hingga strategi konten media sosial resmi fakultas.",
      },
      {
        id: "pendaftaran-anggota",
        question: "Bagaimana cara mahasiswa bergabung menjadi bagian dari Creatify?",
        answer:
          "Rekrutmen anggota baru dibuka secara berkala pada periode Open Recruitment. Mahasiswa aktif Fakultas Ilmu Komputer dapat mendaftar melalui halaman Rekrutmen dengan melampirkan portofolio sesuai divisi pilihan.",
      },
      {
        id: "kolaborasi-kegiatan",
        question: "Apakah panitia atau organisasi mahasiswa bisa berkolaborasi?",
        answer:
          "Tentu. Kami terbuka untuk berkolaborasi bersama pihak fakultas, program studi, maupun organisasi dan kepanitiaan resmi di lingkungan Fasilkom untuk mendukung kebutuhan visual serta publikasi acara.",
      },
      {
        id: "estimasi-pengerjaan",
        question: "Berapa lama estimasi waktu pengerjaan sebuah proyek?",
        answer:
          "Durasi pengerjaan menyesuaikan kompleksitas kebutuhan, umumnya berkisar tiga hingga tujuh hari kerja untuk materi desain grafis dan satu hingga dua minggu untuk produksi video. Pengajuan ideal dilakukan minimal dua minggu sebelum publikasi.",
      },
      {
        id: "struktur-divisi",
        question: "Divisi apa saja yang ada di dalam tim Creatify?",
        answer:
          "Tim Creatify terdiri dari divisi Visual & Creative, Talent & Content, Research Development, serta Executive Committee yang berkolaborasi dari tahap perencanaan hingga rilisan akhir.",
      },
    ],
  },
  contact: {
    titleLine1: "Mari berkarya",
    titleLine2: "bersama Creatify",
    subtitle:
      "Ceritakan minat kreatif Anda. Tim kami meninjau setiap pendaftaran masuk.",
    isRecruitmentOpen: true,
    closedNotice:
      "Pendaftaran anggota baru sedang ditutup. Nantikan periode berikutnya atau hubungi kami via email.",
    submitLabel: "Kirim Pendaftaran",
    divisionOptions: [
      {
        id: "visual-creative",
        label: "Visual & Creative",
        description: "Desain Grafis, Branding & Ilustrasi",
      },
      {
        id: "talent-content",
        label: "Talent & Content",
        description: "Produksi Video, Fotografi & Media Sosial",
      },
      {
        id: "research-development",
        label: "Research Development",
        description: "Riset Tren, Konsep & Strategi Konten",
      },
    ],
    footerDescription:
      "Komunitas kreatif Fakultas Ilmu Komputer Universitas Mercu Buana untuk identitas visual dan media publikasi digital.",
    copyrightText: "© 2026 Creatify Fasilkom. Seluruh hak cipta dilindungi.",
    facultyLabel: "Fakultas Ilmu Komputer UMB",
  },
};

export const DEFAULT_TEAM_PAGE_CONTENT: TeamPageContent = {
  titleLine1: "Tim Kreatif Creatify:",
  titleLine2: "Talenta di Balik Setiap Karya",
  subtitle:
    "Mengenal para kreator di balik identitas visual dan media publikasi resmi\nFakultas Ilmu Komputer Universitas Mercu Buana.",
  members: TEAM_MEMBERS_DATA,
};

