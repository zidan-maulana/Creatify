import { TeamPageClient } from "@/components/public/TeamPageClient";
import { getTeamPageContent } from "@/lib/cms";

export default async function TeamPage() {
  const { content, siteSettings } = await getTeamPageContent();

  return <TeamPageClient content={content} siteSettings={siteSettings} />;
}
