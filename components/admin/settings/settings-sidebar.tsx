"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  User, 
  ShieldCheck, 
  Database, 
  Users, 
  Bell, 
  Key 
} from "lucide-react";
import { cn } from "@/lib/utils";

const settingsNav = [
  {
    title: "General",
    href: "/admin/settings/general",
    icon: User,
  },
  {
    title: "Security",
    href: "/admin/settings/security",
    icon: ShieldCheck,
  },
  {
    title: "Team",
    href: "/admin/settings/team",
    icon: Users,
  },
  {
    title: "Database",
    href: "/admin/settings/database",
    icon: Database,
  },
  {
    title: "Notifications",
    href: "/admin/settings/notifications",
    icon: Bell,
  },
  {
    title: "API",
    href: "/admin/settings/api",
    icon: Key,
  },
];

export function SettingsSidebar() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1 w-full">
      <h2 className="mb-4 px-3 text-sm font-bold uppercase tracking-wider text-slate-500">
        Settings
      </h2>
      <div className="flex flex-col gap-1">
        {settingsNav.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                isActive 
                  ? "bg-slate-100 text-slate-900 font-bold" 
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <Icon 
                className={cn(
                  "size-4 transition-colors", 
                  isActive ? "text-slate-900" : "text-slate-400 group-hover:text-slate-600"
                )} 
              />
              {item.title}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
