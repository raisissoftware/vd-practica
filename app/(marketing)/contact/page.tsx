import { Metadata } from "next";
import { BookingClient } from "@/components/booking/booking-client";
import { Mail, Phone, MapPin, MessageSquare } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact & Programare Apel | vreaudigitalizare.eu",
  description: "Dorești să îți digitalizezi compania? Rezervă un apel de consultanță strategică gratuită sau trimite-ne un mesaj rapid.",
};

export default function ContactPage() {
  return (
    <div className="relative min-h-screen bg-slate-50/50 py-16 dark:bg-zinc-950/40">
      {/* Background visual accents */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/4 h-[600px] w-[600px] rounded-full bg-indigo-500/5 blur-3xl" />
        <div className="absolute top-60 right-1/4 h-[400px] w-[400px] rounded-full bg-pink-500/5 blur-3xl" />
      </div>

      <div className="container relative px-4 mx-auto max-w-6xl">
        {/* Title Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-zinc-50">
            Hai să vorbim despre proiectul tău
          </h1>
          <p className="mt-4 text-base text-slate-500 dark:text-zinc-400">
            Alege o zi și o oră pentru a programa o discuție gratuită de 30 de minute cu noi, sau contactează-ne folosind informațiile de mai jos.
          </p>
        </div>

        {/* Info Grid (Email, Phone, Office) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 max-w-4xl mx-auto">
          <div className="flex items-start gap-4 rounded-xl border border-slate-200/60 bg-white p-5 shadow-sm dark:border-zinc-800/40 dark:bg-zinc-900/40">
            <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
              <Mail className="size-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-zinc-100">Scrie-ne un email</h4>
              <p className="text-xs text-slate-500 mt-1 dark:text-zinc-400">Răspundem în maximum 24 de ore.</p>
              <a href="mailto:contact@vreaudigitalizare.eu" className="text-xs font-semibold text-indigo-600 hover:underline mt-2 block dark:text-indigo-400">
                contact@vreaudigitalizare.eu
              </a>
            </div>
          </div>

          <div className="flex items-start gap-4 rounded-xl border border-slate-200/60 bg-white p-5 shadow-sm dark:border-zinc-800/40 dark:bg-zinc-900/40">
            <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
              <Phone className="size-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-zinc-100">Suna-ne direct</h4>
              <p className="text-xs text-slate-500 mt-1 dark:text-zinc-400">Luni - Vineri între 09:00 și 17:00.</p>
              <a href="tel:+40722000000" className="text-xs font-semibold text-indigo-600 hover:underline mt-2 block dark:text-indigo-400">
                +40 722 000 000
              </a>
            </div>
          </div>

          <div className="flex items-start gap-4 rounded-xl border border-slate-200/60 bg-white p-5 shadow-sm dark:border-zinc-800/40 dark:bg-zinc-900/40">
            <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
              <MapPin className="size-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-zinc-100">Locație birou</h4>
              <p className="text-xs text-slate-500 mt-1 dark:text-zinc-400">Te așteptăm la o cafea.</p>
              <span className="text-xs font-semibold text-slate-700 mt-2 block dark:text-zinc-300">
                București, România
              </span>
            </div>
          </div>
        </div>

        {/* Scheduling Core Container */}
        <div className="w-full flex justify-center">
          <BookingClient />
        </div>
      </div>
    </div>
  );
}
