import { db } from "@/lib/db";
import {
  DEFAULT_LANDING_CONTENT,
  DEFAULT_SITE_SETTINGS,
  DEFAULT_TEAM_PAGE_CONTENT,
  landingContentSchema,
  siteSettingsSchema,
  teamPageContentSchema,
} from "@/config/landing-cms";
import type {
  AboutContent,
  ContactSectionContent,
  DivisionCardContent,
  FaqSectionContent,
  HeroContent,
  LandingPageContent,
  MarqueeContent,
  ServicesSectionContent,
  SiteSettingsContent,
  TeamPageContent,
} from "@/types/cms";
import type { DivisionId, TeamMember } from "@/data/team";

/**
 * Mengambil pengaturan global situs dan kanal kontak resmi dari database
 */
export async function getSiteSettings(): Promise<SiteSettingsContent> {
  try {
    const record = await db.siteSetting.findUnique({
      where: { key: "site_settings" },
    });

    if (!record || !record.payload) {
      return DEFAULT_SITE_SETTINGS;
    }

    const parsed = siteSettingsSchema.safeParse(record.payload);
    return parsed.success ? parsed.data : DEFAULT_SITE_SETTINGS;
  } catch (err) {
    console.error("Gagal mengambil site_settings dari DB, menggunakan default:", err);
    return DEFAULT_SITE_SETTINGS;
  }
}

/**
 * Mengambil seluruh konten dinamis landing page dari PostgreSQL
 */
export async function getLandingContent(): Promise<LandingPageContent> {
  try {
    const records = await db.siteSetting.findMany();
    const map = new Map<string, unknown>();
    for (const r of records) {
      map.set(r.key, r.payload);
    }

    // Site Settings
    const rawSettings = map.get("site_settings");
    const parsedSettings = rawSettings
      ? siteSettingsSchema.safeParse(rawSettings)
      : null;
    const siteSettings: SiteSettingsContent =
      parsedSettings && parsedSettings.success
        ? parsedSettings.data
        : DEFAULT_LANDING_CONTENT.siteSettings;

    // Hero Section
    const rawHero = map.get("home_hero");
    const parsedHero = rawHero
      ? landingContentSchema.shape.hero.safeParse(rawHero)
      : null;
    const hero: HeroContent =
      parsedHero && parsedHero.success
        ? parsedHero.data
        : DEFAULT_LANDING_CONTENT.hero;

    // Marquee
    const rawMarquee = map.get("home_marquee");
    const parsedMarquee = rawMarquee
      ? landingContentSchema.shape.marquee.safeParse(rawMarquee)
      : null;
    const marquee: MarqueeContent =
      parsedMarquee && parsedMarquee.success
        ? parsedMarquee.data
        : DEFAULT_LANDING_CONTENT.marquee;

    // About Section
    const rawAbout = map.get("about_content");
    const parsedAbout = rawAbout
      ? landingContentSchema.shape.about.safeParse(rawAbout)
      : null;
    const about: AboutContent =
      parsedAbout && parsedAbout.success
        ? parsedAbout.data
        : DEFAULT_LANDING_CONTENT.about;

    // Divisions
    const rawDivisions = map.get("divisions");
    const parsedDivisions = rawDivisions
      ? landingContentSchema.shape.divisions.safeParse(rawDivisions)
      : null;
    const divisions: DivisionCardContent[] =
      parsedDivisions && parsedDivisions.success
        ? parsedDivisions.data
        : DEFAULT_LANDING_CONTENT.divisions;

    // Services
    const rawServices = map.get("services");
    const parsedServices = rawServices
      ? landingContentSchema.shape.services.safeParse(rawServices)
      : null;
    const services: ServicesSectionContent =
      parsedServices && parsedServices.success
        ? parsedServices.data
        : DEFAULT_LANDING_CONTENT.services;

    // FAQ
    const rawFaq = map.get("faq");
    const parsedFaq = rawFaq
      ? landingContentSchema.shape.faq.safeParse(rawFaq)
      : null;
    const faq: FaqSectionContent =
      parsedFaq && parsedFaq.success
        ? parsedFaq.data
        : DEFAULT_LANDING_CONTENT.faq;

    // Contact & Footer
    const rawContact = map.get("contact");
    const parsedContact = rawContact
      ? landingContentSchema.shape.contact.safeParse(rawContact)
      : null;
    const contact: ContactSectionContent =
      parsedContact && parsedContact.success
        ? parsedContact.data
        : DEFAULT_LANDING_CONTENT.contact;

    return {
      siteSettings,
      hero,
      marquee,
      about,
      divisions,
      services,
      faq,
      contact,
    };
  } catch (err) {
    console.error("Gagal mengambil landing content dari DB, menggunakan fallback default:", err);
    return DEFAULT_LANDING_CONTENT;
  }
}

/**
 * Mengambil konten header halaman tim dan daftar anggota tim kepengurusan
 */
export async function getTeamPageContent(): Promise<{
  content: TeamPageContent;
  siteSettings: SiteSettingsContent;
}> {
  try {
    const [headerRecord, membersRecords, siteSettings] = await Promise.all([
      db.siteSetting.findUnique({ where: { key: "team_header" } }),
      db.teamMember.findMany({
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      }),
      getSiteSettings(),
    ]);

    let headerData = {
      titleLine1: DEFAULT_TEAM_PAGE_CONTENT.titleLine1,
      titleLine2: DEFAULT_TEAM_PAGE_CONTENT.titleLine2,
      subtitle: DEFAULT_TEAM_PAGE_CONTENT.subtitle,
    };

    if (headerRecord && headerRecord.payload) {
      const parsedHeader = teamPageContentSchema.safeParse(headerRecord.payload);
      if (parsedHeader.success) {
        headerData = parsedHeader.data;
      }
    }

    const members: TeamMember[] =
      membersRecords.length > 0
        ? membersRecords.map((m) => ({
            id: m.id,
            name: m.name,
            role: m.roleTitle,
            divisionId: m.divisionId as DivisionId,
            photo: m.photoUrl,
            avatar: m.avatarUrl ?? undefined,
            quoteText: m.quoteText ?? undefined,
            instagramUrl: m.instagramUrl ?? undefined,
            isLeader: m.isLeader,
          }))
        : DEFAULT_TEAM_PAGE_CONTENT.members;

    return {
      content: {
        ...headerData,
        members,
      },
      siteSettings,
    };
  } catch (err) {
    console.error("Gagal mengambil team page content dari DB, menggunakan fallback default:", err);
    return {
      content: DEFAULT_TEAM_PAGE_CONTENT,
      siteSettings: DEFAULT_SITE_SETTINGS,
    };
  }
}
