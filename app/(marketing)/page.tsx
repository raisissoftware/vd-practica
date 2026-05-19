import { getHomepageData } from "@/services/cms";
import { SectionRenderer } from "@/components/sections/section-renderer";

export async function generateMetadata() {
  try {
    const pageData = await getHomepageData();
    return {
      title: pageData?.title || "Vreau Digitalizare",
      description: pageData?.description || "Platformă enterprise pentru transformare digitală.",
    };
  } catch (e) {
    return { title: "Vreau Digitalizare" };
  }
}

export default async function HomePage() {
  try {
    const pageData = await getHomepageData();

    if (!pageData || !pageData.sections || pageData.sections.length === 0) {
      return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4">
          <p className="text-slate-500 font-medium">Nicio secțiune configurată în baza de date.</p>
        </main>
      );
    }

    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 w-full">
        {pageData.sections.map((section) => (
          <SectionRenderer key={section.id} section={section} />
        ))}
      </main>
    );
  } catch (error: any) {
    // Dacă ceva crapă în baza de date sau la randare, ne va arăta eroarea exactă pe ecran!
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-red-50 p-6 text-center">
        <h2 className="text-xl font-bold text-red-700">Eroare detectată la randare server-side:</h2>
        <p className="mt-2 text-sm font-mono bg-white p-4 rounded border border-red-200 shadow-sm max-w-2xl mx-auto text-left text-red-600 overflow-auto">
          {error.message || String(error)}
        </p>
      </main>
    );
  }
}