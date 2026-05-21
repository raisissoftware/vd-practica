"use client";

import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  TrendingUp,
  Users,
  ClipboardList,
  CheckCircle2,
  BarChart2,
  Download,
  Calendar,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Summary {
  totalQuestionnaires: number;
  publishedQuestionnaires: number;
  totalLeads: number;
  recentLeads7d: number;
  recentLeads30d: number;
}

interface QuestWithLeads {
  id: string;
  title: string;
  slug: string;
  status: string;
  leadCount: number;
  questionCount: number;
}

interface SourceData {
  source: string;
  count: number;
}

interface DayData {
  date: string;
  count: number;
}

interface Props {
  summary: Summary;
  questionnairesWithLeads: QuestWithLeads[];
  leadsBySource: SourceData[];
  dailySeries: DayData[];
}

// ─── Colors ──────────────────────────────────────────────────────────────────

const PIE_COLORS = ["#4F46E5", "#818CF8", "#A5B4FC", "#C7D2FE", "#E0E7FF", "#EEF2FF"];

const SOURCE_LABELS: Record<string, string> = {
  direct: "Direct",
  organic: "Căutare organică",
  referral: "Referral",
  social: "Social media",
  email: "Email",
  questionnaire: "Chestionar",
};

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const d = new Date(label);
  const formatted = d.toLocaleDateString("ro-RO", { day: "2-digit", month: "short" });
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-3 shadow-lg">
      <p className="mb-1 text-[11px] font-semibold text-slate-500">{formatted}</p>
      <p className="text-[14px] font-bold text-indigo-600">{payload[0].value} leads</p>
    </div>
  );
}

// ─── Stat card ────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  trend,
}: {
  label: string;
  value: number | string;
  sub?: string;
  icon: React.ElementType;
  trend?: "up" | "down" | "neutral";
}) {
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-start justify-between">
        <span className="text-[12px] font-semibold text-slate-500">{label}</span>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50">
          <Icon className="size-4 text-indigo-600" />
        </div>
      </div>
      <div className="text-[30px] font-bold leading-none text-slate-900">
        {typeof value === "number" ? value.toLocaleString("ro-RO") : value}
      </div>
      {sub && (
        <div className="mt-2 flex items-center gap-1.5">
          {trend && (
            <span
              className={cn(
                "rounded-full px-1.5 py-0.5 text-[11px] font-bold",
                trend === "up"
                  ? "bg-emerald-50 text-emerald-700"
                  : trend === "down"
                  ? "bg-red-50 text-red-600"
                  : "bg-slate-100 text-slate-500"
              )}
            >
              {trend === "up" ? "↑" : trend === "down" ? "↓" : "–"}
            </span>
          )}
          <span className="text-[11px] text-slate-400">{sub}</span>
        </div>
      )}
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyChart({ message }: { message: string }) {
  return (
    <div className="flex h-full items-center justify-center text-center">
      <div>
        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl border border-slate-100 bg-slate-50">
          <BarChart2 className="size-5 text-slate-300" />
        </div>
        <p className="text-[12px] text-slate-400">{message}</p>
      </div>
    </div>
  );
}

// ─── Analytics Client ─────────────────────────────────────────────────────────

export function AdminAnalyticsClient({
  summary,
  questionnairesWithLeads,
  leadsBySource,
  dailySeries,
}: Props) {
  const [period, setPeriod] = useState<"7d" | "30d">("30d");

  const filteredSeries =
    period === "7d" ? dailySeries.slice(-7) : dailySeries;

  const hasData = summary.totalLeads > 0;
  const hasChartData = filteredSeries.some((d) => d.count > 0);

  // Format date for x-axis
  const formatDate = (date: string) => {
    const d = new Date(date);
    return d.toLocaleDateString("ro-RO", { day: "2-digit", month: "short" });
  };

  // CSV export
  const exportCSV = () => {
    const rows = [
      ["Data", "Leads"],
      ...dailySeries.map((d) => [d.date, d.count.toString()]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `analytics-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const completionRate =
    summary.totalLeads > 0 && summary.totalQuestionnaires > 0
      ? Math.min(100, Math.round((summary.totalLeads / summary.totalQuestionnaires) * 10))
      : 0;

  return (
    <div
      className="min-h-full p-7"
      style={{ fontFamily: "'DM Sans', 'Inter', sans-serif" }}
    >
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-bold text-slate-900">Analytics & Rapoarte</h1>
          <p className="text-[12px] text-slate-400">
            Date în timp real din baza de date
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex gap-0.5 rounded-lg bg-slate-100 p-0.5">
            {(["7d", "30d"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={cn(
                  "rounded-md px-3 py-1.5 text-[12px] font-medium transition-all",
                  period === p
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                )}
              >
                {p === "7d" ? "7 zile" : "30 zile"}
              </button>
            ))}
          </div>
          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-[12px] font-medium text-slate-600 shadow-sm hover:bg-slate-50 transition-colors"
          >
            <Download className="size-3.5" /> Export CSV
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="mb-5 grid grid-cols-4 gap-3.5">
        <StatCard
          label="Total Leads"
          value={summary.totalLeads}
          sub={`+${summary.recentLeads30d} în 30 zile`}
          icon={Users}
          trend={summary.recentLeads30d > 0 ? "up" : "neutral"}
        />
        <StatCard
          label="Chestionare"
          value={summary.totalQuestionnaires}
          sub={`${summary.publishedQuestionnaires} publicate`}
          icon={ClipboardList}
          trend="neutral"
        />
        <StatCard
          label="Lead-uri săptămână"
          value={summary.recentLeads7d}
          sub="ultimele 7 zile"
          icon={TrendingUp}
          trend={summary.recentLeads7d > 0 ? "up" : "neutral"}
        />
        <StatCard
          label="Chestionare active"
          value={summary.publishedQuestionnaires}
          sub="publicate live"
          icon={CheckCircle2}
          trend="neutral"
        />
      </div>

      {/* Main charts row */}
      <div className="mb-5 grid grid-cols-3 gap-4">
        {/* Area chart — submissions over time */}
        <div className="col-span-2 rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-[14px] font-semibold text-slate-900">Submisii în timp</p>
              <p className="text-[12px] text-slate-400">
                Leads colectate în ultimele {period === "7d" ? "7" : "30"} zile
              </p>
            </div>
            <Calendar className="size-4 text-slate-300" />
          </div>
          {hasChartData ? (
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={filteredSeries} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis
                  dataKey="date"
                  tickFormatter={formatDate}
                  tick={{ fontSize: 10, fill: "#94A3B8" }}
                  axisLine={false}
                  tickLine={false}
                  interval={period === "7d" ? 0 : 4}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "#94A3B8" }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#4F46E5"
                  strokeWidth={2.5}
                  fill="url(#colorLeads)"
                  dot={{ fill: "#4F46E5", r: 3, strokeWidth: 0 }}
                  activeDot={{ r: 5 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[180px]">
              <EmptyChart message="Nicio submisie în această perioadă. Colectarea va apărea automat." />
            </div>
          )}
        </div>

        {/* Pie chart — lead sources */}
        <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="mb-4">
            <p className="text-[14px] font-semibold text-slate-900">Surse lead-uri</p>
            <p className="text-[12px] text-slate-400">De unde provin lead-urile</p>
          </div>
          {leadsBySource.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={130}>
                <PieChart>
                  <Pie
                    data={leadsBySource}
                    dataKey="count"
                    nameKey="source"
                    cx="50%"
                    cy="50%"
                    innerRadius={35}
                    outerRadius={60}
                    paddingAngle={2}
                  >
                    {leadsBySource.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [
                      `${value} leads`,
                      SOURCE_LABELS[String(name)] ?? String(name),
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-2 flex flex-col gap-1.5">
                {leadsBySource.map((s, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <span
                      className="size-2 rounded-full flex-shrink-0"
                      style={{ background: PIE_COLORS[i % PIE_COLORS.length] }}
                    />
                    <span className="flex-1 text-slate-500">
                      {SOURCE_LABELS[s.source] ?? s.source}
                    </span>
                    <span className="font-semibold text-slate-900">{s.count}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-[180px]">
              <EmptyChart message="Nu există date de sursă încă." />
            </div>
          )}
        </div>
      </div>

      {/* Bar chart + Table row */}
      <div className="grid grid-cols-2 gap-4">
        {/* Bar chart — per questionnaire */}
        <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="mb-4">
            <p className="text-[14px] font-semibold text-slate-900">Leads pe chestionar</p>
            <p className="text-[12px] text-slate-400">Top chestionare după număr de leads</p>
          </div>
          {questionnairesWithLeads.some((q) => q.leadCount > 0) ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart
                data={questionnairesWithLeads.filter((q) => q.leadCount > 0).slice(0, 6).map((q) => ({
                  name: q.title.length > 18 ? q.title.slice(0, 16) + "…" : q.title,
                  leads: q.leadCount,
                }))}
                margin={{ top: 4, right: 4, bottom: 24, left: -20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 9, fill: "#94A3B8" }}
                  axisLine={false}
                  tickLine={false}
                  interval={0}
                  angle={-20}
                  textAnchor="end"
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "#94A3B8" }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  formatter={(v) => [`${v} leads`]}
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #F1F5F9" }}
                />
                <Bar dataKey="leads" fill="#4F46E5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[200px]">
              <EmptyChart message="Nicio submisie pentru chestionare. Distribuie un chestionar pentru a colecta date." />
            </div>
          )}
        </div>

        {/* Table — questionnaire breakdown */}
        <div className="rounded-xl border border-slate-100 bg-white shadow-sm">
          <div className="border-b border-slate-50 p-5">
            <p className="text-[14px] font-semibold text-slate-900">Detalii chestionare</p>
            <p className="text-[12px] text-slate-400">Leads colectate per chestionar</p>
          </div>
          {questionnairesWithLeads.length === 0 ? (
            <div className="flex h-[200px] items-center justify-center text-center">
              <div>
                <p className="text-[13px] font-semibold text-slate-500">Niciun chestionar</p>
                <p className="mt-1 text-[12px] text-slate-400">Creează primul chestionar din panoul Questionnaires.</p>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {questionnairesWithLeads.map((q) => (
                <div key={q.id} className="flex items-center gap-3 px-5 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-[12px] font-semibold text-slate-700 line-clamp-1">{q.title}</p>
                    <p className="mt-0.5 text-[10px] text-slate-400">
                      {q.questionCount} întrebări · /chestionare/{q.slug}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                        q.status === "PUBLISHED"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-amber-50 text-amber-700"
                      )}
                    >
                      {q.status === "PUBLISHED" ? "Live" : "Draft"}
                    </span>
                    <span className="text-[14px] font-bold text-indigo-600">{q.leadCount}</span>
                    <span className="text-[10px] text-slate-400">leads</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Empty state if no data at all */}
      {!hasData && (
        <div className="mt-6 flex flex-col items-center gap-4 rounded-2xl border border-slate-100 bg-white py-16 text-center shadow-sm">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-100 bg-slate-50">
            <BarChart2 className="size-7 text-slate-300" />
          </div>
          <h3 className="text-[16px] font-bold text-slate-900">Nicio dată de analytics încă</h3>
          <p className="max-w-sm text-[13px] text-slate-400">
            Analytics-ul va apărea automat când utilizatorii vor completa chestionarele. Distribuie un chestionar publicat pentru a colecta primele date.
          </p>
          <a
            href="/admin/questionnaires"
            className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-[13px] font-semibold text-white hover:bg-indigo-700 transition-colors"
          >
            Mergi la Chestionare <ChevronRight className="size-3.5" />
          </a>
        </div>
      )}
    </div>
  );
}
