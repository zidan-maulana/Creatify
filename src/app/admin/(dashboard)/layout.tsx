import { AdminCmsProvider } from "@/components/admin/AdminCmsProvider";
import { AdminShell } from "@/components/admin/AdminShell";
import { getLandingContent, getTeamPageContent } from "@/lib/cms";
import { getCurrentAdminSession } from "@/lib/auth";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [landingContent, teamPageData, session] = await Promise.all([
    getLandingContent(),
    getTeamPageContent(),
    getCurrentAdminSession(),
  ]);

  return (
    <AdminCmsProvider
      initialLandingContent={landingContent}
      initialTeamContent={teamPageData.content}
      initialAdminEmail={session?.email}
    >
      <AdminShell>{children}</AdminShell>
    </AdminCmsProvider>
  );
}
