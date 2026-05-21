"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  ClipboardList,
  FileText,
  Users,
  BarChart2,
  Settings,
  LogOut,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard",            icon: LayoutDashboard,  exact: true },
  { href: "/admin/questionnaires", label: "Questionnaires", icon: ClipboardList },
  { href: "/admin/content",        label: "Content",        icon: FileText },
  { href: "/admin/leads",          label: "Leads",          icon: Users },
  { href: "/admin/analytics",      label: "Analytics",      icon: BarChart2 },
  { href: "/admin/settings",       label: "Settings",       icon: Settings },
];

interface AdminSidebarProps {
  user: { name?: string | null; email?: string | null; image?: string | null };
}

export function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <aside className="flex h-full w-[220px] flex-shrink-0 flex-col border-r border-[#EEF0F4] bg-white">
      {/* Logo */}
      <div className="flex items-center gap-2.5 border-b border-[#EEF0F4] px-4 py-5">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600">
          <CheckCircle2 className="size-4 text-white" strokeWidth={2.5} />
        </div>
        <span className="text-[13px] font-semibold text-slate-900">
          vreaudigitalizare.eu
        </span>
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col gap-0.5 px-2.5 py-3">
        {NAV_ITEMS.map(({ href, label, icon: Icon, exact }) => {
          const active = isActive(href, exact);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium transition-colors",
                active
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-700",
              )}
            >
              <Icon
                className={cn("size-4", active ? "text-indigo-600" : "text-slate-400")}
              />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User row */}
      <div className="flex items-center gap-2.5 border-t border-[#EEF0F4] px-3.5 py-3">
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-indigo-600 text-[12px] font-bold text-white">
          {user?.name?.charAt(0)?.toUpperCase() ?? "A"}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[12px] font-semibold text-slate-900">
            {user?.name ?? "Admin"}
          </p>
          <p className="truncate text-[11px] text-slate-400">{user?.email}</p>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          title="Sign out"
          className="rounded-md p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
        >
          <LogOut className="size-3.5" />
        </button>
      </div>
    </aside>
  );
}
