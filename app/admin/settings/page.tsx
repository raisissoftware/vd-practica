import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";

export const metadata = { title: "Settings Admin – VreauDigitalizare" };

export default async function AdminSettingsPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") redirect("/login");

  return (
    <div className="min-h-full p-7" style={{ fontFamily: "'DM Sans', 'Inter', sans-serif" }}>
      <h1 className="mb-6 text-[20px] font-bold text-slate-900">Setări</h1>

      <div className="flex flex-col gap-4 max-w-2xl">
        <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
          <h2 className="mb-2 text-[14px] font-bold text-slate-900">Contul tău</h2>
          <div className="flex flex-col gap-2 text-[13px] text-slate-600">
            <div className="flex items-center gap-2">
              <span className="font-medium text-slate-400 w-20">Nume:</span>
              <span>{user.name ?? "—"}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-slate-400 w-20">Email:</span>
              <span>{user.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-slate-400 w-20">Rol:</span>
              <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-bold text-indigo-600">
                {user.role}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
          <h2 className="mb-2 text-[14px] font-bold text-slate-900">Autentificare 2FA</h2>
          <p className="text-[13px] text-slate-400">
            Autentificarea în doi pași este activată automat pentru conturile de admin. Codul este trimis pe email la fiecare autentificare de pe un dispozitiv necunoscut.
          </p>
        </div>

        <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
          <h2 className="mb-2 text-[14px] font-bold text-slate-900">Baza de date</h2>
          <p className="text-[13px] text-slate-400">
            Datele sunt stocate în PostgreSQL prin Prisma ORM. Chestionarele, lead-urile și răspunsurile sunt gestionate direct în baza de date.
          </p>
        </div>
      </div>
    </div>
  );
}
