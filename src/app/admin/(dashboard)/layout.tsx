import { redirect } from "next/navigation";
import { AdminCmsProvider } from "@/components/admin/AdminCmsProvider";
import { AdminShell } from "@/components/admin/AdminShell";
import { getLandingContent, getTeamPageContent } from "@/lib/cms";
import { getCurrentAdminSession } from "@/lib/auth";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getCurrentAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  const [landingContent, teamPageData] = await Promise.all([
    getLandingContent(),
    getTeamPageContent(),
  ]);

  return (
    <AdminCmsProvider
      initialLandingContent={landingContent}
      initialTeamContent={teamPageData.content}
      initialAdminEmail={session.email}
    >
      <AdminShell>{children}</AdminShell>
    </AdminCmsProvider>
  );
}
