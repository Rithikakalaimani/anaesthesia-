import Sidebar from "@/components/Sidebar";
import AuthGuard from "@/components/AuthGuard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
    {/* Page background – Figma: #d4deea + bg image */}
    <div
      className="flex min-h-screen justify-center p-4 pt-6 pb-6 bg-[#d4deea]"
      style={{
        backgroundImage: "url('/assets/bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Container 1: Outer – single rounded glass box (like Peri), wraps sidebar + stage */}
      <div
        className="flex h-[calc(100vh-3rem)] w-full max-w-[1691px] gap-3 rounded-[59px] border-[1.5px] border-white p-3 shadow-xl"
        style={{
          background: "rgba(255,255,255,0.2)",
          backdropFilter: "blur(11.2px)",
          WebkitBackdropFilter: "blur(11.2px)",
        }}
      >
        {/* Container 2: Sidebar – its own rounded box, more glassmorphism (like Peri) */}
        <Sidebar />

        {/* Container 3: Stage layout – its own rounded box, solid white (like Peri main content) */}
        <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden rounded-[59px] bg-white shadow-sm">
          {children}
        </main>
      </div>
    </div>
    </AuthGuard>
  );
}
