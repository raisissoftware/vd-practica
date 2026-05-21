import PostCard from "@/components/blog/PostCard";
import { BlogSidebar } from "@/components/blog/BlogSidebar";
import { NewsletterSection } from "@/components/blog/NewsletterSection";
import type { BlogPost } from "@/types/blog";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────

interface BlogPageProps {
  posts: BlogPost[];
  categories: { name: string; count: number }[];
  popularTags: string[];
  totalPages: number;
  currentPage: number;
}

// ─── Placeholder data (replace with real fetch) ───────────────────────────────

const PLACEHOLDER_POSTS: BlogPost[] = [
  {
    slug: "cum-digitalizezi-procesele-interne",
    title: "Cum digitalizezi procesele interne ale companiei tale în 30 de zile",
    excerpt:
      "Un ghid practic pas cu pas pentru antreprenorii care vor să elimine hârtia și să câștige timp — fără bugete mari și fără experți IT.",
    coverImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
    category: "Strategie",
    publishedAt: "2025-05-01T10:00:00Z",
    readingTime: 7,
    author: "Ana Ionescu",
  },
  {
    slug: "chestionare-inteligente-lead-generation",
    title: "Chestionarele inteligente: cel mai subestimat tool de lead generation",
    excerpt:
      "Descoperă cum companiile de top folosesc chestionarele dinamice pentru a califica lead-uri de 3x mai rapid față de formularele tradiționale.",
    coverImage: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80",
    category: "Marketing",
    publishedAt: "2025-04-22T09:00:00Z",
    readingTime: 5,
    author: "Mihai Popa",
  },
  {
    slug: "gdpr-si-digitalizarea-date-sigure",
    title: "GDPR și digitalizarea: cum colectezi date în siguranță și legal",
    excerpt:
      "Tot ce trebuie să știi despre conformitatea GDPR atunci când implementezi formulare digitale și sisteme de colectare a datelor pentru clienții tăi.",
    coverImage: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80",
    category: "Legal",
    publishedAt: "2025-04-10T08:00:00Z",
    readingTime: 9,
    author: "Raluca Dinu",
  },
  {
    slug: "roi-transformare-digitala-imm",
    title: "ROI-ul transformării digitale pentru IMM-uri: cifre și realitate",
    excerpt:
      "Studiu de caz pe 50 de companii românești care au implementat soluții digitale în ultimii 2 ani. Ce a funcționat, ce nu și cât a costat cu adevărat.",
    coverImage: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80",
    category: "Studii de caz",
    publishedAt: "2025-03-28T11:00:00Z",
    readingTime: 12,
    author: "Dan Florea",
  },
];

const PLACEHOLDER_CATEGORIES = [
  { name: "Strategie", count: 14 },
  { name: "Marketing", count: 9 },
  { name: "Legal", count: 5 },
  { name: "Studii de caz", count: 8 },
  { name: "Tehnologie", count: 11 },
];

const PLACEHOLDER_TAGS = [
  "Digitalizare",
  "GDPR",
  "AI",
  "Chestionare",
  "Lead Generation",
  "IMM",
  "Automatizare",
  "CRM",
  "Next.js",
  "Productivitate",
];

// ─── Pagination component ─────────────────────────────────────────────────────

function Pagination({
  currentPage,
  totalPages,
}: {
  currentPage: number;
  totalPages: number;
}) {
  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  return (
    <div className="flex items-center justify-center gap-4 mt-10">
      <Link
        href={hasPrev ? `/blog?page=${currentPage - 1}` : "#"}
        aria-disabled={!hasPrev}
        className={`flex items-center gap-1.5 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
          hasPrev
            ? "border-border text-foreground hover:border-sky-500/50 hover:text-sky-500"
            : "border-border/30 text-muted-foreground/40 pointer-events-none"
        }`}
      >
        <svg className="size-4" viewBox="0 0 16 16" fill="none">
          <path
            d="M10 12L6 8l4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Anterioare
      </Link>

      <span className="text-sm text-muted-foreground">
        Pagina{" "}
        <span className="font-semibold text-foreground">{currentPage}</span> din{" "}
        <span className="font-semibold text-foreground">{totalPages}</span>
      </span>

      <Link
        href={hasNext ? `/blog?page=${currentPage + 1}` : "#"}
        aria-disabled={!hasNext}
        className={`flex items-center gap-1.5 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
          hasNext
            ? "border-border text-foreground hover:border-sky-500/50 hover:text-sky-500"
            : "border-border/30 text-muted-foreground/40 pointer-events-none"
        }`}
      >
        Următoare
        <svg className="size-4" viewBox="0 0 16 16" fill="none">
          <path
            d="M6 12l4-4-4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Link>
    </div>
  );
}

// ─── Page (Server Component) ──────────────────────────────────────────────────

export default function BlogPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  // TODO: replace with real fetch from your database / CMS
  const currentPage = Number(searchParams?.page) || 1;
  const totalPages = 3;

  const blogData: BlogPageProps = {
    posts: PLACEHOLDER_POSTS,
    categories: PLACEHOLDER_CATEGORIES,
    popularTags: PLACEHOLDER_TAGS,
    totalPages,
    currentPage,
  };

  return (
    <>
      <section className="relative py-16 text-center overflow-hidden border-b border-border/50">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_50%_at_50%_60%,rgba(14,165,233,0.07)_0%,transparent_70%)]" />
        <div className="container max-w-4xl mx-auto px-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-sky-500 mb-6">
            <span className="size-1.5 rounded-full bg-sky-500" />
            Blog & Insights
          </div>
          <h1 className="font-urban text-4xl font-extrabold tracking-tight sm:text-5xl mb-4 leading-tight">
            Cele mai recente{" "}
            <span className="text-sky-500">insights digitale</span>
          </h1>
          <p className="max-w-xl mx-auto text-muted-foreground text-base leading-relaxed">
            Ghiduri practice, studii de caz și strategii pentru companii care
            vor să crească prin digitalizare.
          </p>
        </div>
      </section>

      {/* ── Main content ── */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-[1fr_320px] gap-8">
          {/* ── Left: Articles grid ── */}
          <div>
            <div className="grid sm:grid-cols-2 gap-6">
              {blogData.posts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={blogData.currentPage}
              totalPages={blogData.totalPages}
            />
          </div>

          {/* ── Right: Sidebar ── */}
          <BlogSidebar
            categories={blogData.categories}
            popularTags={blogData.popularTags}
          />
        </div>
      </div>

      {/* ── Newsletter ── */}
      <NewsletterSection />
    </>
  );
}
