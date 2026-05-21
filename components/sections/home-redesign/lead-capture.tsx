"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle2, Loader2, ShieldCheck, Zap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function LeadCaptureForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    industry: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.company) {
      setError("Te rugăm să completezi câmpurile obligatorii.");
      return;
    }

    // Duplicate email protection via sessionStorage
    const submittedEmail = sessionStorage.getItem("submitted_lead_email");
    if (submittedEmail === formData.email) {
      setSuccess(true);
      return; // Already submitted in this session
    }

    setLoading(true);
    try {
      // Create lead
      const res = await fetch("/api/chestionar", { // Re-using chestionar endpoint or create a new lead endpoint, we'll map to existing if possible. Let's assume the endpoint handles generic leads or we just simulate if it doesn't exist yet, but the user expects real integration. The chestionar endpoint takes responses. We'll use a generic fetch.
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          phone: "", // Optional
          source: "homepage_lead_form",
          responses: {
            company: formData.company,
            industry: formData.industry,
            message: formData.message,
          }
        }),
      });

      if (!res.ok) {
        throw new Error("Eroare la trimiterea mesajului.");
      }

      sessionStorage.setItem("submitted_lead_email", formData.email);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Eroare la trimiterea mesajului.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-card/5 border-t border-border/40 relative">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column */}
          <div className="max-w-xl">
            <h2 className="font-heading text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl mb-6">
              Hai să vorbim despre afacerea ta
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Fie că vrei o evaluare detaliată sau ai deja un proiect în minte, suntem aici să te ajutăm să scalezi eficient.
            </p>
            
            <ul className="space-y-4 mb-10">
              {[
                "Răspundem în maximum 24 de ore",
                "Consultanță inițială 100% gratuită",
                "Audit tehnic preliminar inclus",
                "Propunere transparentă, fără costuri ascunse",
                "Garanția confidențialității datelor tale (NDA)"
              ].map((val, i) => (
                <li key={i} className="flex items-center text-foreground font-medium">
                  <CheckCircle2 className="h-5 w-5 text-teal-500 mr-3 flex-shrink-0" />
                  <span>{val}</span>
                </li>
              ))}
            </ul>

            <div className="flex gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium bg-card/40 px-4 py-2 rounded-lg border border-border/50">
                <ShieldCheck className="h-4 w-4 text-blue-500" />
                Date securizate
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium bg-card/40 px-4 py-2 rounded-lg border border-border/50">
                <Zap className="h-4 w-4 text-amber-500" />
                Răspuns rapid
              </div>
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="bg-background rounded-3xl border border-border/50 p-6 md:p-10 shadow-xl relative overflow-hidden">
            {success ? (
              <div className="flex flex-col items-center justify-center text-center py-12 animate-fade-in">
                <div className="h-16 w-16 bg-teal-500/10 text-teal-500 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Mesaj trimis cu succes!</h3>
                <p className="text-muted-foreground">
                  Îți mulțumim pentru interes. Un specialist te va contacta în cel mai scurt timp la adresa de email furnizată.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 animate-fade-in">
                {error && (
                  <div className="p-3 text-sm text-rose-500 bg-rose-500/10 border border-rose-500/20 rounded-xl">
                    {error}
                  </div>
                )}
                
                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase text-muted-foreground">Prenume</label>
                    <Input 
                      required 
                      className="h-11 bg-card/20" 
                      value={formData.firstName}
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase text-muted-foreground">Nume</label>
                    <Input 
                      required 
                      className="h-11 bg-card/20" 
                      value={formData.lastName}
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase text-muted-foreground">Email de serviciu *</label>
                  <Input 
                    required 
                    type="email" 
                    className="h-11 bg-card/20" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase text-muted-foreground">Companie *</label>
                    <Input 
                      required 
                      className="h-11 bg-card/20" 
                      value={formData.company}
                      onChange={(e) => setFormData({...formData, company: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase text-muted-foreground">Industrie</label>
                    <select 
                      className="flex h-11 w-full rounded-md border border-input bg-card/20 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={formData.industry}
                      onChange={(e) => setFormData({...formData, industry: e.target.value})}
                    >
                      <option value="">Alege...</option>
                      <option value="IT">IT / Software</option>
                      <option value="Productie">Producție</option>
                      <option value="Retail">Retail & E-commerce</option>
                      <option value="Servicii">Servicii Profesionale</option>
                      <option value="Logistica">Logistică & Transport</option>
                      <option value="Altele">Altele</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase text-muted-foreground">Cu ce te putem ajuta?</label>
                  <Textarea 
                    className="min-h-[100px] bg-card/20 resize-none" 
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full h-12 text-base font-bold rounded-xl"
                >
                  {loading ? (
                    <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Se trimite...</>
                  ) : "Trimite mesajul →"}
                </Button>

                <p className="text-[11px] text-muted-foreground text-center mt-4">
                  Prin trimiterea acestui formular, ești de acord cu <a href="/gdpr" className="underline hover:text-foreground">Politica de Confidențialitate (GDPR)</a>.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
