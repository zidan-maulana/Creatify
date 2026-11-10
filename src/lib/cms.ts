import {
  DEFAULT_LANDING_CONTENT,
  DEFAULT_SITE_SETTINGS,
  DEFAULT_TEAM_PAGE_CONTENT,
  siteSettingsSchema,
  teamPageContentSchema,
} from "@/config/landing-cms";
import type {
  LandingPageContent,
  SiteSettingsContent,
  TeamPageContent,
} from "@/types/cms";

// Titik integrasi data landing page (siap dihubungkan ke Prisma SiteSetting / CMS)
export async function getLandingContent(): Promise<LandingPageContent> {
  return DEFAULT_LANDING_CONTENT;
}

export async function getSiteSettings(): Promise<SiteSettingsContent> {
  const parsed = siteSettingsSchema.safeParse(DEFAULT_SITE_SETTINGS);
  return parsed.success ? parsed.data : DEFAULT_SITE_SETTINGS;
}

// Titik integrasi data halaman tim (siap dihubungkan ke Prisma TeamMember & SiteSetting)
export async function getTeamPageContent(): Promise<{
  content: TeamPageContent;
  siteSettings: SiteSettingsContent;
}> {
  const parsedHeading = teamPageContentSchema.safeParse(DEFAULT_TEAM_PAGE_CONTENT);
  const content = parsedHeading.success
    ? { ...parsedHeading.data, members: DEFAULT_TEAM_PAGE_CONTENT.members }
    : DEFAULT_TEAM_PAGE_CONTENT;

  return {
    content,
    siteSettings: await getSiteSettings(),
  };
}

