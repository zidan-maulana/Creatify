import type { TeamMember } from "@/data/team";

export interface TextFieldLimit {
  readonly maxChars: number;
  readonly maxSentences: number;
}

export interface SiteSettingsContent {
  name: string;
  title: string;
  description: string;
  navbarCtaLabel: string;
  email: string;
  instagramHandle: string;
  instagramUrl: string;
  tiktokUrl: string;
  youtubeUrl: string;
  secretariat: {
    faculty: string;
    shortLabel: string;
    address: string;
  };
}

export interface HeroContent {
  badgeText: string;
  headlineLine1: string;
  headlineLine2: string;
  subheadline: string;
  primaryCtaLabel: string;
  secondaryCtaLabel: string;
  videoUrl: string;
}

export interface MarqueeContent {
  trustLabel: string;
}

export interface AboutContent {
  headlineLine1Before: string;
  headlineLine1After: string;
  headlineLine2: string;
  headlineLine3Before: string;
  headlineLine3After: string;
  headlineLine4: string;
  pillImage1Url: string;
  pillImage2Url: string;
  description: string;
  ctaLabel: string;
}

export type DivisionCardIconKey = "smile" | "video" | "share";

export interface DivisionCardContent {
  id: string;
  iconKey: DivisionCardIconKey;
  title: string;
  collapsedTitle: string;
  description: string;
  tagRow1: string;
  tagRow2: string;
  tagMore: string;
  image: string;
}

export interface WorkTabContent {
  id: string;
  tabLabel: string;
  headline: string;
  description: string;
  image: string;
}

export interface ServicesSectionContent {
  title: string;
  subtitle: string;
  ctaLabel: string;
  tabs: WorkTabContent[];
}

export interface FaqItemContent {
  id: string;
  question: string;
  answer: string;
}

export interface FaqSectionContent {
  titleLine1: string;
  titleLine2: string;
  subtitle: string;
  ctaLabel: string;
  items: FaqItemContent[];
}

export interface RecruitmentDivisionOption {
  id: string;
  label: string;
  description: string;
}

export interface ContactSectionContent {
  titleLine1: string;
  titleLine2: string;
  subtitle: string;
  isRecruitmentOpen: boolean;
  closedNotice: string;
  submitLabel: string;
  divisionOptions: RecruitmentDivisionOption[];
  footerDescription: string;
  copyrightText: string;
  facultyLabel: string;
}

export interface LandingPageContent {
  siteSettings: SiteSettingsContent;
  hero: HeroContent;
  marquee: MarqueeContent;
  about: AboutContent;
  divisions: DivisionCardContent[];
  services: ServicesSectionContent;
  faq: FaqSectionContent;
  contact: ContactSectionContent;
}

export interface TeamPageContent {
  titleLine1: string;
  titleLine2: string;
  subtitle: string;
  members: TeamMember[];
}

