import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";

export const metadata = { title: "Notifications - Admin" };

export default async function NotificationsSettingsPage() {
  const sessionUser = await getCurrentUser();
  if (!sessionUser) redirect("/login");

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold tracking-tight text-slate-900">Notifications</h3>
        <p className="text-sm text-slate-500 mt-1">
          Configure how you receive alerts and system emails.
        </p>
      </div>
      <div className="h-px bg-slate-200" />
      
      <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
        <h4 className="text-lg font-bold text-slate-900 mb-2">Notification Preferences</h4>
        <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">
          Email and push notification settings will be available in the next platform update.
        </p>
        <button className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-bold text-slate-500 cursor-not-allowed">
          Coming Soon
        </button>
      </div>
    </div>
  );
}
