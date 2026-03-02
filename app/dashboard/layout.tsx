import Sidebar from "@/components/Sidebar";
import AuthGuard from "@/components/AuthGuard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
    <div
      className="flex min-h-screen justify-center p-4 pt-6 pb-6"
      style={{
        backgroundImage: "url('/assets/bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Outer wrapper – glassmorphism, rounded */}
      <div
        className="flex h-[calc(100vh-3rem)] w-full max-w-[1600px] overflow-hidden rounded-3xl shadow-xl"
        style={{
          background: "var(--glass-bg)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: "1px solid var(--glass-border)",
        }}
      >
        <Sidebar />
        {/* Stage layout – solid white, rounded right */}
        <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden rounded-r-3xl bg-white">
          {children}
        </main>
      </div>
    </div>
    </AuthGuard>
  );
}
