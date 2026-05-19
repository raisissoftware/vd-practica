import Link from "next/link";
import { Button } from "@/components/ui/button";

interface HeroProps {
  title: string;
  description?: string;
  primaryCtaText?: string;
  primaryCtaHref?: string;
  secondaryCtaText?: string;
  secondaryCtaHref?: string;
}

export function Hero({
  title,
  description,
  primaryCtaText = "Începe",
  primaryCtaHref = "#",
  secondaryCtaText,
  secondaryCtaHref,
}: HeroProps) {
  return (
    <section className="container mx-auto px-4 py-32 text-center md:py-48 lg:py-64">
      <h1 className="mx-auto max-w-4xl text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl md:text-6xl lg:text-7xl">
        {title}
      </h1>

      {description && (
        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-300 md:text-xl">
          {description}
        </p>
      )}

      <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
        <Link href={primaryCtaHref} className="w-full sm:w-auto">
          <Button size="lg" className="w-full">
            {primaryCtaText}
          </Button>
        </Link>

        {secondaryCtaText && secondaryCtaHref && (
          <Link href={secondaryCtaHref} className="w-full sm:w-auto">
            <Button variant="outline" size="lg" className="w-full">
              {secondaryCtaText}
            </Button>
          </Link>
        )}
      </div>
    </section>
  );
}