import React from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession, destroySession } from "@/lib/auth-utils";
import {
  Swords,
  LayoutDashboard,
  FileText,
  Calendar,
  Users,
  LogOut,
  User as UserIcon,
} from "lucide-react";

interface CmsLayoutProps {
  children: React.ReactNode;
}

export default async function CmsLayout({ children }: CmsLayoutProps) {
  const session = await getSession();

  // Route security: redirect to login if session is invalid
  if (!session) {
    redirect("/cms/login");
  }

  // Logout action handler for form submission
  async function handleLogout() {
    "use server";
    await destroySession();
    redirect("/cms/login");
  }

  const menuItems = [
    { name: "Nadzorna ploča", href: "/cms", icon: LayoutDashboard },
    { name: "Članci i Kolumne", href: "/cms/clanci", icon: FileText },
    { name: "Nadolazeće Borbe", href: "/cms/dogadaji", icon: Calendar },
    { name: "Pretplatnici", href: "/cms/pretplatnici", icon: Users },
  ];

  return (
    <div className="min-h-screen bg-bg-canvas flex flex-col md:flex-row text-slate-300 font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-surface-card border-b md:border-b-0 md:border-r border-white/5 flex flex-col justify-between shrink-0 relative z-20">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Swords size={16} className="text-primary" />
            </div>
            <span className="text-xl font-extrabold italic tracking-tighter font-display text-white">
              COMBAT<span className="text-primary">CMS</span>
            </span>
          </div>

          <nav className="space-y-1" aria-label="CMS Navigacija">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-lg hover:bg-white/[0.03] hover:text-white transition-premium text-slate-400"
              >
                <item.icon size={18} className="shrink-0 text-slate-500" />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* User Profile Info & Logout */}
        <div className="p-6 border-t border-white/5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/45 flex items-center justify-center text-white font-extrabold shrink-0">
              {session.user.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={session.user.avatarUrl}
                  alt={session.user.name}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <UserIcon size={16} className="text-primary" />
              )}
            </div>
            <div className="truncate">
              <p className="text-sm font-bold text-white truncate">{session.user.name}</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">
                {session.user.role}
              </p>
            </div>
          </div>

          <form action={handleLogout}>
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-white/5 border border-white/10 hover:border-primary/20 hover:text-primary py-2.5 text-xs font-bold uppercase tracking-wider text-slate-400 transition-premium cursor-pointer"
            >
              <LogOut size={13} />
              Odjavi se
            </button>
          </form>
        </div>
      </aside>

      {/* Main CMS Viewport */}
      <main className="flex-1 p-6 md:p-10 relative z-10 overflow-y-auto max-h-screen">
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="absolute top-[5%] right-[-10%] w-[35vw] h-[35vw] rounded-full arena-glow-red blur-[110px] opacity-40" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto space-y-8">{children}</div>
      </main>
    </div>
  );
}
