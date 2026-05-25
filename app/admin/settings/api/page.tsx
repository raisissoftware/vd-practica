import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { Key } from "lucide-react";

export const metadata = { title: "API Settings - Admin" };

export default async function ApiSettingsPage() {
  const sessionUser = await getCurrentUser();
  if (!sessionUser) redirect("/login");

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold tracking-tight text-slate-900">API Access</h3>
        <p className="text-sm text-slate-500 mt-1">
          Manage your API keys, webhooks, and external integrations.
        </p>
      </div>
      <div className="h-px bg-slate-200" />
      
      <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
        <div className="flex justify-center mb-4">
          <div className="flex size-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
            <Key className="size-6" />
          </div>
        </div>
        <h4 className="text-lg font-bold text-slate-900 mb-2">Developer API</h4>
        <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">
          API key generation and webhooks management is currently in closed beta.
        </p>
        <button className="rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-slate-800 disabled:opacity-70">
          Request Early Access
        </button>
      </div>
    </div>
  );
}
