import { cn } from "@/lib/utils";
import { Icons } from "@/components/shared/icons";

export default function ServicesLanding() {
    const services = [
        {
            title: "Evaluare Maturitate Digitală",
            description: "Chestionare dinamice adaptate pe domenii de activitate pentru a identifica rapid unde se află compania ta în procesul de transformare.",
            icon: "laptop",
        },
        {
            title: "Rapoarte AI Enterprise",
            description: "Generăm instant analize detaliate și recomandări strategice de automatizare cu ajutorul algoritmilor avansați de inteligență artificială.",
            icon: "bot",
        },
        {
            title: "Grupare & Lead Generation",
            description: "Conectăm companiile care au nevoie de tehnologie cu furnizori de soluții software potriviți bugetului și cerințelor lor.",
            icon: "arrowRight",
        },
    ];

    return (
        <section className="py-16 sm:py-24 bg-slate-50 dark:bg-slate-900/50 border-t dark:border-slate-800">
            <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header-ul secțiunii */}
                <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                    <h2 className="font-urban text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
                        Serviciile Noastre de Digitalizare
                    </h2>
                    <p className="text-muted-foreground text-lg text-balance">
                        Soluții software modulare și inteligente concepute special pentru a accelera evoluția digitală a afacerii tale.
                    </p>
                </div>

                {/* Grid-ul de Carduri Responsive (1 coloană pe mobil, 3 pe desktop) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <div
                            key={index}
                            className="p-8 rounded-2xl bg-background border border-border hover:border-indigo-500/50 shadow-sm transition-all group hover:shadow-md"
                        >
                            <div className="h-12 w-12 rounded-xl bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                {index + 1}
                            </div>
                            <h3 className="text-xl font-semibold text-foreground mb-3 font-urban">
                                {service.title}
                            </h3>
                            <p className="text-muted-foreground leading-relaxed text-sm">
                                {service.description}
                            </p>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}