import Link from "next/link";
import { Logo } from "@/components/shared/logo";

const footerLinks = {
  platforma: [
    { label: "Chestionare Digitalizare", href: "/chestionare" },
    { label: "AI Content Generator", href: "/ai-generator" },
    { label: "Lead Management", href: "/leads" },
    { label: "Admin Dashboard", href: "/dashboard" },
  ],
  resurse: [
    { label: "Blog & News", href: "/blog" },
    { label: "Evaluare Gratuită", href: "/chestionare" },
    { label: "Documentation", href: "/docs" },
    { label: "API Reference", href: "/docs/api" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "GDPR Compliance", href: "/gdpr" },
    { label: "Contact Us", href: "/contact" },
  ],
};

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 border-t border-slate-800">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* ── Brand ── */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 group">
              <Logo showText={false} className="size-8 text-indigo-500 group-hover:text-indigo-400 transition-colors" />
              <span className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">
                vreaudigitalizare.eu
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed mt-3 max-w-[200px]">
              Empowering businesses with intelligent digital workflows, dynamic
              questionnaires, and AI-driven content solutions.
            </p>
          </div>

          {/* ── Platformă ── */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
              Platformă
            </p>
            <ul className="flex flex-col gap-2.5">
              {footerLinks.platforma.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Resurse ── */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
              Resurse
            </p>
            <ul className="flex flex-col gap-2.5">
              {footerLinks.resurse.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Legal ── */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
              Legal
            </p>
            <ul className="flex flex-col gap-2.5">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="border-t border-slate-800 mt-10 pt-6 text-xs text-slate-500">
          © {year} vreaudigitalizare.eu. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
