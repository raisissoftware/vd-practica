import { Metadata } from "next";
import { NavBar } from "@/components/layout/navbar";
import { SiteFooter } from "@/components/layout/site-footer";
import { NavMobile } from "@/components/layout/mobile-nav";

export const metadata: Metadata = {
  title: "Digitalizare pentru Compania Ta | Vreau Digitalizare",
  description: "Transformă-ți afacerea cu soluții software moderne, enterprise-ready. Evaluăm maturitatea digitală a companiei tale și generăm rapoarte asistate de AI.",
  openGraph: {
    title: "Digitalizare pentru Compania Ta | Vreau Digitalizare",
    description: "Evaluăm maturitatea digitală a companiei tale și generăm rapoarte asistate de AI.",
    url: "https://vreaudigitalizare.eu",
    siteName: "Vreau Digitalizare",
    locale: "ro_RO",
    type: "website",
  },
};

interface MarketingLayoutProps {
  children: React.ReactNode;
}

export default function MarketingLayout({ children }: MarketingLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <NavMobile />
      <NavBar scroll={true} />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
