// app/(protected)/admin/layout.tsx
// Full-screen admin shell — bypasses the generic (protected)/layout.tsx
// Uses its own dedicated sidebar so the admin area feels distinct.

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default async function AdminShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    redirect("/login");
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#F8F9FC]">
      <AdminSidebar user={user} />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
