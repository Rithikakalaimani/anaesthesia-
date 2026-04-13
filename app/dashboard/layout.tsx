import DashboardShell from "@/components/DashboardShell";
import AuthGuard from "@/components/AuthGuard";
import ClientDashboardProviders from "@/components/ClientDashboardProviders";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <ClientDashboardProviders>
        <DashboardShell>{children}</DashboardShell>
      </ClientDashboardProviders>
    </AuthGuard>
  );
}
