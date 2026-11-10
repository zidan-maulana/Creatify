export type LandingTabKey =
  | "hero"
  | "tentang"
  | "divisi"
  | "karya"
  | "faq"
  | "rekrutmen";

export const LANDING_FORM_IDS: Record<LandingTabKey, string> = {
  hero: "hero-editor-form",
  tentang: "marquee-about-form",
  divisi: "divisions-editor-form",
  karya: "services-editor-form",
  faq: "faq-editor-form",
  rekrutmen: "contact-footer-form",
};

export interface LandingSectionNavItem {
  key: LandingTabKey;
  formId: string;
  step: string;
  label: string;
  title: string;
  description: string;
}

export const LANDING_SECTION_NAV: LandingSectionNavItem[] = [
  {
    key: "hero",
    formId: LANDING_FORM_IDS.hero,
    step: "01",
    label: "Hero & Video",
    title: "Hero & Video Showcase",
    description:
      "Kelola badge status, headline utama hero, subheadline, tombol CTA, dan video showcase.",
  },
  {
    key: "tentang",
    formId: LANDING_FORM_IDS.tentang,
    step: "02",
    label: "Marquee & Tentang",
    title: "Marquee & Tentang Creatify",
    description:
      "Atur label kemitraan marquee serta headline gambar pil, narasi, dan tombol Tentang.",
  },
  {
    key: "divisi",
    formId: LANDING_FORM_IDS.divisi,
    step: "03",
    label: "3 Kartu Divisi",
    title: "Kartu 3 Divisi Kreatif",
    description:
      "Sunting judul, ikon, tag layanan, deskripsi, dan gambar untuk 3 kartu divisi.",
  },
  {
    key: "karya",
    formId: LANDING_FORM_IDS.karya,
    step: "04",
    label: "Karya Kami",
    title: "Karya Kami (Showcase Tab)",
    description:
      "Kelola daftar tab kategori karya beserta headline, deskripsi, dan gambar pratinjau.",
  },
  {
    key: "faq",
    formId: LANDING_FORM_IDS.faq,
    step: "05",
    label: "FAQ",
    title: "FAQ Pertanyaan Umum",
    description:
      "Atur judul section FAQ, subjudul pengantar, tombol email, dan daftar pertanyaan.",
  },
  {
    key: "rekrutmen",
    formId: LANDING_FORM_IDS.rekrutmen,
    step: "06",
    label: "Rekrutmen & Footer",
    title: "Rekrutmen & Footer",
    description:
      "Kelola status Open Recruitment, pilihan divisi formulir pendaftaran, dan deskripsi footer.",
  },
];

export function resolveLandingTabKey(rawTab: string | null): LandingTabKey {
  if (rawTab && LANDING_SECTION_NAV.some((item) => item.key === rawTab)) {
    return rawTab as LandingTabKey;
  }
  return "hero";
}
