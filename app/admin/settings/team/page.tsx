import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { Users, Shield } from "lucide-react";
import { prisma } from "@/lib/db";

export const metadata = { title: "Team Settings - Admin" };

export default async function TeamSettingsPage() {
  const sessionUser = await getCurrentUser();
  if (!sessionUser) redirect("/login");

  // Fetch all admins/users with role ADMIN
  const teamMembers = await prisma.user.findMany({
    where: { role: "ADMIN" },
    select: { id: true, name: true, email: true, role: true, image: true }
  });

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold tracking-tight text-slate-900">Team Management</h3>
        <p className="text-sm text-slate-500 mt-1">
          Manage your workspace members and their roles.
        </p>
      </div>
      <div className="h-px bg-slate-200" />
      
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-slate-900">Administrators</h4>
            <p className="text-[13px] text-slate-500 mt-0.5">Users with full access to this project.</p>
          </div>
          <button className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white hover:bg-slate-800 transition-colors">
            Invite Member
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {teamMembers.map((member) => (
            <div key={member.id} className="flex items-center justify-between p-4 px-6 hover:bg-slate-50/50 transition-colors">
              <div className="flex items-center gap-4">
                {member.image ? (
                   // eslint-disable-next-line @next/next/no-img-element
                  <img src={member.image} alt="Avatar" className="size-10 rounded-full object-cover" />
                ) : (
                  <div className="flex size-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 font-bold uppercase">
                    {member.name?.charAt(0) || "U"}
                  </div>
                )}
                <div>
                  <p className="text-sm font-bold text-slate-900">{member.name}</p>
                  <p className="text-xs text-slate-500">{member.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-700">
                  <Shield className="size-3" />
                  {member.role}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
