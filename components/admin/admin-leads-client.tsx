"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Search,
  Download,
  Mail,
  Phone,
  X,
  Loader2,
  Trash2,
  ChevronRight,
  BarChart2,
  MessageSquare,
  TrendingUp,
  Star,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  source: string | null;
  createdAt: Date;
  questionnaire: { title: string; slug: string } | null;
}

interface LeadDetail extends Lead {
  score: number | null;
  level: string | null;
  aiReport: {
    title?: string;
    description?: string;
    recommendations?: string[];
  } | null;
  answers: {
    id: string;
    questionText: string;
    questionType: string;
    questionOrder: number;
    answer: any;
  }[];
}

interface Props {
  initialLeads: Lead[];
}

// ─── Answer display ───────────────────────────────────────────────────────────

function AnswerDisplay({ type, answer }: { type: string; answer: any }) {
  if (answer === null || answer === undefined || answer === "") {
    return <span className="text-slate-400 italic text-xs">Fără răspuns</span>;
  }

  if (Array.isArray(answer)) {
    return (
      <div className="flex flex-wrap gap-1.5 mt-1">
        {answer.map((v, i) => (
          <span key={i} className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-[11px] font-medium text-indigo-700">
            {String(v)}
          </span>
        ))}
      </div>
    );
  }

  if (type === "RATING") {
    const rating = Number(answer);
    return (
      <div className="flex items-center gap-1 mt-0.5">
        {[1, 2, 3, 4, 5].map((v) => (
          <Star
            key={v}
            className={cn("size-3.5", v <= rating ? "fill-amber-400 text-amber-400" : "text-slate-200")}
          />
        ))}
        <span className="ml-1 text-xs text-slate-500">{rating}/5</span>
      </div>
    );
  }

  if (type === "YES_NO") {
    return (
      <span className={cn(
        "rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
        String(answer).toLowerCase() === "da" || answer === true
          ? "bg-emerald-50 text-emerald-700"
          : "bg-red-50 text-red-600"
      )}>
        {String(answer)}
      </span>
    );
  }

  return <span className="text-[12px] text-slate-700">{String(answer)}</span>;
}

// ─── Lead Detail Slide-over ────────────────────────────────────────────────────

function LeadDetailPanel({
  leadId,
  onClose,
  onDelete,
}: {
  leadId: string;
  onClose: () => void;
  onDelete: (id: string) => void;
}) {
  const [detail, setDetail] = useState<LeadDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/admin/leads/${leadId}`);
        if (!cancelled && res.ok) {
          const data = await res.json();
          setDetail(data);
        } else if (!cancelled) {
          toast.error("Eroare la încărcarea lead-ului.");
          onClose();
        }
      } catch {
        if (!cancelled) {
          toast.error("Eroare de rețea.");
          onClose();
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [leadId]);

  const handleDelete = async () => {
    if (!confirm("Ești sigur că vrei să ștergi acest lead?")) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/leads/${leadId}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Lead șters.");
        onDelete(leadId);
        onClose();
      } else {
        toast.error("Eroare la ștergere.");
      }
    } catch {
      toast.error("Eroare de rețea.");
    } finally {
      setDeleting(false);
    }
  };

  const scoreColor = detail?.score
    ? detail.score <= 35
      ? "text-red-500"
      : detail.score <= 70
      ? "text-amber-500"
      : "text-emerald-500"
    : "text-slate-400";

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/25 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative w-full max-w-[500px] h-full bg-white shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
              {loading ? "…" : detail?.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-[13px] font-bold text-slate-900">{detail?.name ?? "Se încarcă..."}</p>
              <p className="text-[11px] text-slate-400">{detail?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[11px] font-medium text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
            >
              {deleting ? <Loader2 className="size-3.5 animate-spin" /> : <Trash2 className="size-3.5" />}
              Șterge
            </button>
            <button
              onClick={onClose}
              className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {loading ? (
            <div className="flex flex-col gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-14 animate-pulse rounded-lg bg-slate-100" />
              ))}
            </div>
          ) : detail ? (
            <>
              {/* Contact info */}
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Date contact
                </p>
                <div className="flex flex-col gap-2">
                  <a
                    href={`mailto:${detail.email}`}
                    className="flex items-center gap-2 text-[12px] text-indigo-600 hover:underline"
                  >
                    <Mail className="size-3.5" /> {detail.email}
                  </a>
                  {detail.phone && (
                    <div className="flex items-center gap-2 text-[12px] text-slate-600">
                      <Phone className="size-3.5 text-slate-400" /> {detail.phone}
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-[12px] text-slate-500">
                    <span className="text-slate-400">Sursă:</span>
                    <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-medium">
                      {detail.source ?? "direct"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[12px] text-slate-500">
                    <span className="text-slate-400">Data:</span>
                    {new Date(detail.createdAt).toLocaleDateString("ro-RO", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                  {detail.questionnaire && (
                    <div className="flex items-center gap-2 text-[12px] text-slate-500">
                      <span className="text-slate-400">Chestionar:</span>
                      <a
                        href={`/chestionare/${detail.questionnaire.slug}`}
                        target="_blank"
                        className="font-medium text-indigo-600 hover:underline"
                      >
                        {detail.questionnaire.title}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* AI Report */}
              {(detail.score !== null || detail.aiReport) && (
                <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-4">
                  <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-indigo-400">
                    Raport AI de maturitate
                  </p>
                  {detail.score !== null && (
                    <div className="mb-3 flex items-center gap-4">
                      <div className="flex flex-col items-center">
                        <span className={cn("text-3xl font-extrabold", scoreColor)}>
                          {detail.score}%
                        </span>
                        <span className="text-[10px] text-slate-400">Scor</span>
                      </div>
                      {detail.level && (
                        <div>
                          <p className="text-[12px] font-bold text-slate-900">{detail.level}</p>
                          {detail.aiReport?.title && (
                            <p className="text-[11px] text-slate-500">{detail.aiReport.title}</p>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                  {detail.aiReport?.description && (
                    <p className="text-[12px] text-slate-600 leading-relaxed mb-3">
                      {detail.aiReport.description}
                    </p>
                  )}
                  {detail.aiReport?.recommendations && detail.aiReport.recommendations.length > 0 && (
                    <div>
                      <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Recomandări personalizate
                      </p>
                      <div className="flex flex-col gap-2">
                        {detail.aiReport.recommendations.map((rec, i) => (
                          <div key={i} className="flex gap-2.5 rounded-lg bg-white p-3 text-[11px] text-slate-600 leading-relaxed border border-indigo-100">
                            <span className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-[9px] font-bold text-indigo-600">
                              {i + 1}
                            </span>
                            {rec}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Q&A */}
              {detail.answers.length > 0 && (
                <div>
                  <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Răspunsuri la chestionar ({detail.answers.length})
                  </p>
                  <div className="flex flex-col gap-3">
                    {detail.answers.map((a, i) => (
                      <div key={a.id} className="rounded-xl border border-slate-100 bg-white p-3.5">
                        <div className="flex items-start gap-2 mb-2">
                          <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-500">
                            {a.questionOrder}
                          </span>
                          <p className="text-[12px] font-medium text-slate-700 leading-snug">
                            {a.questionText}
                          </p>
                        </div>
                        <div className="ml-7">
                          <AnswerDisplay type={a.questionType} answer={a.answer} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {detail.answers.length === 0 && (
                <div className="flex flex-col items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 py-8 text-center">
                  <MessageSquare className="size-6 text-slate-300" />
                  <p className="text-[12px] text-slate-400">Niciun răspuns înregistrat pentru acest lead.</p>
                </div>
              )}
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

// ─── Main Leads Client ────────────────────────────────────────────────────────

export function AdminLeadsClient({ initialLeads }: Props) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [search, setSearch] = useState("");
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);

  const filtered = leads.filter(
    (l) =>
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.email.toLowerCase().includes(search.toLowerCase())
  );

  const exportCSV = () => {
    const rows = [
      ["Nume", "Email", "Telefon", "Sursă", "Chestionar", "Data"],
      ...filtered.map((l) => [
        l.name,
        l.email,
        l.phone || "",
        l.source || "",
        l.questionnaire?.title || "",
        new Date(l.createdAt).toLocaleDateString("ro-RO"),
      ]),
    ];
    const csv = rows.map((r) => r.map((v) => `"${v}"`).join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDelete = (id: string) => {
    setLeads((prev) => prev.filter((l) => l.id !== id));
  };

  return (
    <div className="min-h-full p-7" style={{ fontFamily: "'DM Sans', 'Inter', sans-serif" }}>
      {selectedLeadId && (
        <LeadDetailPanel
          leadId={selectedLeadId}
          onClose={() => setSelectedLeadId(null)}
          onDelete={handleDelete}
        />
      )}

      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-bold text-slate-900">Leads</h1>
          <p className="text-[12px] text-slate-400">
            {leads.length} leads colectate total
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-sm">
            <Search className="size-3.5 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Caută după nume sau email..."
              className="w-56 bg-transparent text-[13px] text-slate-500 outline-none"
            />
          </div>
          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-[13px] font-medium text-slate-600 shadow-sm hover:bg-slate-50 transition-colors"
          >
            <Download className="size-3.5" /> Export CSV
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-slate-100 bg-white py-20 text-center shadow-sm">
          <Users className="size-12 text-slate-200" />
          <h3 className="text-[17px] font-bold text-slate-900">
            {search ? "Niciun rezultat" : "Niciun lead încă"}
          </h3>
          <p className="text-[13px] text-slate-400">
            {search
              ? "Încearcă o altă căutare."
              : "Lead-urile vor apărea automat când utilizatorii completează chestionarele publicate."}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                {["Lead", "Contact", "Chestionar", "Scor", "Sursă", "Data", ""].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((lead) => (
                <tr
                  key={lead.id}
                  className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors cursor-pointer"
                  onClick={() => setSelectedLeadId(lead.id)}
                >
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-indigo-50 text-[12px] font-bold text-indigo-600">
                        {lead.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-[13px] font-semibold text-slate-900">
                        {lead.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex flex-col gap-0.5">
                      <a
                        href={`mailto:${lead.email}`}
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-1.5 text-[12px] text-indigo-600 hover:underline"
                      >
                        <Mail className="size-3" /> {lead.email}
                      </a>
                      {lead.phone && (
                        <span className="flex items-center gap-1.5 text-[11px] text-slate-400">
                          <Phone className="size-3" /> {lead.phone}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    {lead.questionnaire ? (
                      <span className="text-[12px] font-medium text-slate-700 line-clamp-1">
                        {lead.questionnaire.title}
                      </span>
                    ) : (
                      <span className="text-[12px] text-slate-300">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-[12px] text-slate-400">—</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500">
                      {lead.source || "direct"}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-[12px] text-slate-400">
                    {new Date(lead.createdAt).toLocaleDateString("ro-RO", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3.5">
                    <ChevronRight className="size-4 text-slate-300" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
