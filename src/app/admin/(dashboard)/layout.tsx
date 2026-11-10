import { AdminCmsProvider } from "@/components/admin/AdminCmsProvider";
import { AdminShell } from "@/components/admin/AdminShell";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminCmsProvider>
      <AdminShell>{children}</AdminShell>
    </AdminCmsProvider>
  );
}

