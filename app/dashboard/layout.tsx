import Sidebar from "@/components/Sidebar";
import AuthGuard from "@/components/AuthGuard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
    {/* Figma: bg #d4deea + bg image */}
    <div
      className="flex min-h-screen justify-center p-4 pt-6 pb-6 bg-[#d4deea]"
      style={{
        backgroundImage: "url('/assets/bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Outer wrapper – Figma glassmorphism: blur 11.2px, border 1.5px white, rounded 59px */}
      <div
        className="flex h-[calc(100vh-3rem)] w-full max-w-[1691px] overflow-hidden rounded-[59px] shadow-xl border-[1.5px] border-white"
        style={{
          background: "rgba(255,255,255,0.2)",
          backdropFilter: "blur(11.2px)",
          WebkitBackdropFilter: "blur(11.2px)",
        }}
      >
        <Sidebar />
        {/* Stage layout – solid white, rounded right (Figma) */}
        <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden rounded-r-[59px] bg-white">
          {children}
        </main>
      </div>
    </div>
    </AuthGuard>
  );
}
