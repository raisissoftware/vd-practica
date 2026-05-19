'use client';

import { useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function ContactPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsSubmitting(true);
        setError("");

        const formData = new FormData(event.currentTarget);
        const data = {
            name: formData.get("name"),
            company: formData.get("company"),
            email: formData.get("email"),
            message: formData.get("message"),
        };

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error("Ceva nu a mers bine la trimiterea datelor.");
            }

            setIsSuccess(true);
        } catch (err: any) {
            setError(err.message || "A apărut o eroare neașteptată.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="container max-w-4xl mx-auto py-12 md:py-20 px-4">
            <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
                <h1 className="font-urban text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
                    Începe Transformarea Digitală
                </h1>
                <p className="text-muted-foreground text-lg">
                    Completează formularul de mai jos, iar specialiștii noștri vor analiza profilul companiei tale pentru a pregăti auditul inițial.
                </p>
            </div>

            <div className="bg-background border border-border rounded-2xl p-6 md:p-10 shadow-sm max-w-xl mx-auto">
                {isSuccess ? (
                    // Mesaj de Succes
                    <div className="text-center py-8 space-y-4">
                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 text-2xl">
                            ✓
                        </div>
                        <h2 className="text-2xl font-bold font-urban text-foreground">Solicitare Trimisă!</h2>
                        <p className="text-muted-foreground">
                            Îți mulțumim! Datele companiei tale au fost înregistrate. Un consultant din echipa Vreau Digitalizare te va contacta în cel mai scurt timp.
                        </p>
                    </div>
                ) : (
                    // Formularul Activ
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm font-medium">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label htmlFor="name" className="text-sm font-medium text-foreground">
                                Nume Complet
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                required
                                disabled={isSubmitting}
                                placeholder="Ex: Ion Popescu"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="company" className="text-sm font-medium text-foreground">
                                Numele Companiei
                            </label>
                            <input
                                type="text"
                                id="company"
                                name="company"
                                required
                                disabled={isSubmitting}
                                placeholder="Ex: Tech Solutions S.R.L."
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium text-foreground">
                                Email Business
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                required
                                disabled={isSubmitting}
                                placeholder="ion.popescu@companie.ro"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="message" className="text-sm font-medium text-foreground">
                                Ce procese dorești să digitalizezi?
                            </label>
                            <textarea
                                id="message"
                                name="message"
                                rows={4}
                                disabled={isSubmitting}
                                placeholder="Ex: Automatizare facturare, managementul stocurilor, integrare CRM..."
                                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={cn(
                                buttonVariants({ size: "lg" }),
                                "w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium cursor-pointer transition-all disabled:opacity-50"
                            )}
                        >
                            {isSubmitting ? "Se trimite..." : "Trimite Solicitarea"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}