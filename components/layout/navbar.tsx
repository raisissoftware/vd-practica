"use client";

import { useContext } from "react";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import { useSession } from "next-auth/react";

import { docsConfig } from "@/config/docs";
import { marketingConfig } from "@/config/marketing";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { useScroll } from "@/hooks/use-scroll";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { DocsSearch } from "@/components/docs/search";
import { ModalContext } from "@/components/modals/providers";
import { Icons } from "@/components/shared/icons";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";
import { UserAccountNav } from "@/components/layout/user-account-nav";
import { Logo } from "@/components/shared/logo";

interface NavBarProps {
  scroll?: boolean;
  large?: boolean;
}

export function NavBar({ scroll = false }: NavBarProps) {
  const scrolled = useScroll(50);
  const { data: session, status } = useSession();
  const { setShowSignInModal } = useContext(ModalContext);

  const selectedLayout = useSelectedLayoutSegment();
  const documentation = selectedLayout === "docs";

  const configMap = {
    docs: docsConfig.mainNav,
  };

  const links =
    (selectedLayout && configMap[selectedLayout]) || marketingConfig.mainNav;

  return (
    <header
      className={cn(
        "sticky top-0 z-40 flex w-full justify-center transition-all duration-300",
        scroll
          ? scrolled
            ? "border-b border-slate-200/50 bg-white/70 backdrop-blur-xl dark:border-zinc-800/50 dark:bg-zinc-950/70"
            : "bg-transparent border-transparent"
          : "border-b border-slate-200/50 bg-white/70 backdrop-blur-xl dark:border-zinc-800/50 dark:bg-zinc-950/70"
      )}
    >
      <MaxWidthWrapper
        className="flex h-16 items-center justify-between py-4"
        large={documentation}
      >
        <div className="flex gap-8 md:gap-10">
          <Link href="/" className="flex items-center">
            <Logo className="h-10 md:h-12" />
          </Link>

          {links && links.length > 0 ? (
            <nav className="hidden gap-6 md:flex items-center">
              {links.map((item, index) => (
                <Link
                  key={index}
                  href={item.disabled ? "#" : item.href}
                  prefetch={true}
                  className={cn(
                    "relative py-1.5 text-sm font-semibold transition-colors duration-200 text-slate-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400",
                    "after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-indigo-600 after:transition-transform after:duration-300 hover:after:origin-bottom-left hover:after:scale-x-100 dark:after:bg-indigo-400",
                    item.href.startsWith(`/${selectedLayout}`) && "text-slate-900 dark:text-zinc-50 after:scale-x-100 after:origin-bottom-left",
                    item.disabled && "cursor-not-allowed opacity-80",
                  )}
                >
                  {item.title}
                </Link>
              ))}
            </nav>
          ) : null}
        </div>

        <div className="flex items-center space-x-3">
          {/* right header for docs */}
          {documentation ? (
            <div className="hidden flex-1 items-center space-x-4 sm:justify-end lg:flex">
              <div className="hidden lg:flex lg:grow-0">
                <DocsSearch />
              </div>
              <div className="flex lg:hidden">
                <Icons.search className="size-6 text-muted-foreground" />
              </div>
              <div className="flex space-x-4">
                <Link
                  href={siteConfig.links.github}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Icons.gitHub className="size-7" />
                  <span className="sr-only">GitHub</span>
                </Link>
              </div>
            </div>
          ) : null}

          {session ? (
            <div className="hidden items-center gap-3 md:flex">
              <Link
                href={session.user.role === "ADMIN" ? "/admin" : "/dashboard"}
              >
                <Button
                  className="gap-1.5 px-4 h-9 rounded-full bg-gradient-to-r from-indigo-600 to-blue-500 text-white shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:scale-[1.03] active:scale-[0.98] transition-all duration-200 font-semibold"
                  size="sm"
                >
                  <span>Dashboard</span>
                  <Icons.arrowRight className="size-3.5" />
                </Button>
              </Link>
              <UserAccountNav />
            </div>
          ) : status === "unauthenticated" ? (
            <div className="hidden items-center gap-3 md:flex">
              {/* Admin Sign In — secondary, premium ghost style */}
              <Link
                href="/login"
                className="inline-flex h-9 items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-700 transition-all duration-200 hover:border-indigo-400/50 hover:bg-indigo-50/50 hover:text-indigo-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-indigo-950/20 dark:hover:text-indigo-400"
              >
                <Icons.lock className="size-3.5 opacity-70" />
                Admin Sign In
              </Link>

              {/* Start Assessment — primary gradient CTA */}
              <Link
                href="/chestionare"
                className="inline-flex h-9 items-center gap-1.5 rounded-full bg-gradient-to-r from-indigo-600 to-blue-500 px-4 text-xs font-bold text-white shadow-md shadow-indigo-500/25 transition-all duration-200 hover:shadow-indigo-500/45 hover:scale-[1.04] active:scale-[0.97]"
              >
                Start Assessment
                <Icons.arrowRight className="size-3.5" />
              </Link>
            </div>
          ) : (
            <div className="hidden items-center gap-2.5 md:flex">
              <Skeleton className="h-9 w-[108px] rounded-full" />
              <Skeleton className="h-9 w-[108px] rounded-full" />
            </div>
          )}
        </div>
      </MaxWidthWrapper>
    </header>
  );
}
