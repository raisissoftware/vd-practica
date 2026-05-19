import { HeroLanding } from "./hero-landing";

interface SectionData {
    id: string;
    title: string;
    type: string;
    content: any;
}

interface SectionRendererProps {
    section: SectionData;
}

export function SectionRenderer({ section }: SectionRendererProps) {
    switch (section.type) {
        case "cta_block":
            return (
                <div className="bg-blue-600 py-12 text-white text-center rounded-lg my-6 w-full max-w-4xl mx-auto">
                    <h3 className="text-2xl font-bold">{section.title}</h3>
                    <p className="mt-2">{section.content?.description}</p>
                </div>
            );

        case "hero": {
            const heroContent = typeof section.content === "string" ? JSON.parse(section.content) : section.content;
            return (
                <HeroLanding
                    title={heroContent?.title || section.title}
                    description={heroContent?.description || ""}
                    primaryCtaText={heroContent?.primaryCtaText || "Începe Evaluarea"}
                    primaryCtaHref={heroContent?.primaryCtaHref || "/contact"}
                    secondaryCtaText={heroContent?.secondaryCtaText || "Află mai multe"}
                    secondaryCtaHref={heroContent?.secondaryCtaHref || "/despre-noi"}
                />
            );
        }

        default:
            return null;
    }
}