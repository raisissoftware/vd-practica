"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  ClipboardList,
  CheckCircle2,
  TrendingUp,
  Search,
  Settings,
  MoreHorizontal,
  BarChart2,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Stats {
  totalQuestionnaires: number;
  publishedQuestionnaires: number;
  totalLeads: number;
  recentLeads: number;
}

interface RecentQ {
  id: string;
  title: string;
  createdAt: Date;
  status: string;
}

interface TopQ {
  id: string;
  title: string;
  slug: string;
  _count: { leads: number };
}

interface DayData {
  date: string;
  count: number;
}

interface SourceData {
  source: string;
  count: number;
}

interface Props {
  stats: Stats;
  recentQuestionnaires: RecentQ[];
  topQuestionnaires: TopQ[];
  dailySeries: DayData[];
  leadsBySource: SourceData[];
}

// ─── Colors ───────────────────────────────────────────────────────────────────

const PIE_COLORS = ["#4F46E5", "#818CF8", "#A5B4FC", "#C7D2FE", "#E0E7FF"];

const SOURCE_LABELS: Record<string, string> = {
  direct: "Direct",
  questionnaire: "Chestionar",
  organic: "Organic",
  referral: "Referral",
  social: "Social",
};

// ─── Custom area tooltip ──────────────────────────────────────────────────────

function AreaTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const d = new Date(label);
  const formatted = d.toLocaleDateString("ro-RO", { day: "2-digit", month: "short" });
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-3 shadow-lg text-xs">
      <p className="font-semibold text-slate-500 mb-1">{formatted}</p>
      <p className="font-bold text-indigo-600">{payload[0].value} leads</p>
    </div>
  );
}

// ─── Empty chart ──────────────────────────────────────────────────────────────

function EmptyChartState({ msg }: { msg: string }) {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="text-center">
        <BarChart2 className="size-6 text-slate-200 mx-auto mb-1" />
        <p className="text-[11px] text-slate-400">{msg}</p>
      </div>
    </div>
  );
}

// ─── Dashboard ─────────────────────────────────────────────────────────────────

export function AdminDashboardClient({
  stats,
  recentQuestionnaires,
  topQuestionnaires,
  dailySeries,
  leadsBySource,
}: Props) {
  const router = useRouter();
  const [period, setPeriod] = useState<"7d" | "30d">("30d");

  const chartData = period === "7d" ? dailySeries.slice(-7) : dailySeries;
  const hasChartData = chartData.some((d) => d.count > 0);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("ro-RO", { day: "2-digit", month: "short" });

  const STAT_CARDS = [
    {
      label: "Leads Totale",
      value: stats.totalLeads,
      sub: `+${stats.recentLeads} în 30 zile`,
      up: true,
      icon: Users,
    },
    {
      label: "Chestionare",
      value: stats.totalQuestionnaires,
      sub: `${stats.publishedQuestionnaires} publicate`,
      up: true,
      icon: ClipboardList,
    },
    {
      label: "Chestionare Active",
      value: stats.publishedQuestionnaires,
      sub: "live acum",
      up: null,
      icon: CheckCircle2,
    },
    {
      label: "Leads Recente",
      value: stats.recentLeads,
      sub: "ultimele 30 zile",
      up: stats.recentLeads > 0,
      icon: TrendingUp,
    },
  ];

  return (
    <div className="min-h-full p-7" style={{ fontFamily: "'DM Sans', 'Inter', sans-serif" }}>
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-[20px] font-bold text-slate-900">Dashboard Overview</h1>
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-sm">
            <Search className="size-3.5 text-slate-400" />
            <input
              placeholder="Caută..."
              className="w-36 bg-transparent text-[13px] text-slate-500 outline-none placeholder:text-slate-400"
            />
          </div>
          <button
            onClick={() => router.push("/admin/settings")}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-[13px] text-slate-500 shadow-sm hover:bg-slate-50"
          >
            <Settings className="size-3.5" />
          </button>
        </div>
      </div>

      {/* Quick actions */}
      <div className="mb-6 flex flex-wrap items-center gap-2.5">
        <button
          onClick={() => router.push("/admin/questionnaires")}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-[13px] font-semibold text-white hover:bg-indigo-700 transition-colors shadow-sm"
        >
          + Chestionar Nou
        </button>
        <button
          onClick={() => router.push("/admin/leads")}
          className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-[13px] font-medium text-slate-600 hover:bg-slate-50 transition-colors shadow-sm"
        >
          👁 Vezi Leads
        </button>

        <div className="ml-auto flex gap-0.5 rounded-lg bg-slate-100 p-0.5">
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
      </div>

      {/* Stat cards */}
      <div className="mb-5 grid grid-cols-4 gap-3.5">
        {STAT_CARDS.map((s, i) => (
          <div key={i} className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
            <div className="mb-2 flex items-start justify-between">
              <span className="text-[12px] font-medium text-slate-500">{s.label}</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50">
                <s.icon className="size-4 text-indigo-600" />
              </div>
            </div>
            <div className="text-[28px] font-bold leading-none text-slate-900">
              {s.value.toLocaleString("ro-RO")}
            </div>
            <div className="mt-2 flex items-center gap-1.5">
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 text-[11px] font-semibold",
                  s.up === true
                    ? "bg-emerald-50 text-emerald-700"
                    : s.up === false
                    ? "bg-red-50 text-red-600"
                    : "bg-slate-100 text-slate-500"
                )}
              >
                {s.up === true ? "↑" : s.up === false ? "↓" : "–"}
              </span>
              <span className="text-[11px] text-slate-400">{s.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="mb-5 flex gap-4">
        {/* Area chart */}
        <div className="flex-1 rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <p className="text-[14px] font-semibold text-slate-900">Submisii</p>
              <p className="text-[12px] text-slate-400">
                Lead-uri colectate în ultimele {period === "7d" ? "7" : "30"} zile
              </p>
            </div>
            <button className="rounded-md p-1.5 text-slate-400 hover:bg-slate-50">
              <MoreHorizontal className="size-4" />
            </button>
          </div>
          {hasChartData ? (
            <ResponsiveContainer width="100%" height={140}>
              <AreaChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="dashGrad" x1="0" y1="0" x2="0" y2="1">
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
                <Tooltip content={<AreaTooltip />} />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#4F46E5"
                  strokeWidth={2.5}
                  fill="url(#dashGrad)"
                  dot={{ fill: "#4F46E5", r: 3, strokeWidth: 0 }}
                  activeDot={{ r: 5 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[140px]">
              <EmptyChartState msg="Nicio submisie în această perioadă." />
            </div>
          )}
        </div>

        {/* Donut — sources */}
        <div className="w-[280px] flex-shrink-0 rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="mb-4">
            <p className="text-[14px] font-semibold text-slate-900">Surse trafic</p>
            <p className="text-[12px] text-slate-400">De unde vin lead-urile</p>
          </div>
          {leadsBySource.length > 0 ? (
            <div className="flex items-center gap-4">
              <ResponsiveContainer width={100} height={100}>
                <PieChart>
                  <Pie
                    data={leadsBySource}
                    dataKey="count"
                    cx="50%"
                    cy="50%"
                    innerRadius={28}
                    outerRadius={46}
                    paddingAngle={2}
                  >
                    {leadsBySource.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-col gap-1.5">
                {leadsBySource.map((s, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-xs">
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
            </div>
          ) : (
            <div className="h-[100px]">
              <EmptyChartState msg="Nicio dată de sursă." />
            </div>
          )}
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-2 gap-4">
        {/* Recent activity */}
        <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
          <p className="mb-4 text-[14px] font-semibold text-slate-900">Activitate recentă</p>
          {recentQuestionnaires.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-8 text-center">
              <ClipboardList className="size-6 text-slate-200" />
              <p className="text-[12px] text-slate-400">
                Nicio activitate. Creați un chestionar pentru a începe.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {recentQuestionnaires.map((q) => (
                <div key={q.id} className="flex items-center gap-2.5">
                  <span
                    className={cn(
                      "size-[7px] flex-shrink-0 rounded-full",
                      q.status === "PUBLISHED" ? "bg-emerald-400" : "bg-amber-400"
                    )}
                  />
                  <span className="flex-1 text-[12px] text-slate-600 line-clamp-1">
                    {q.status === "PUBLISHED" ? "Publicat" : "Draft"}: &ldquo;{q.title}&rdquo;
                  </span>
                  <span className="flex-shrink-0 text-[11px] text-slate-400">
                    {new Date(q.createdAt).toLocaleDateString("ro-RO", {
                      day: "2-digit",
                      month: "short",
                    })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top questionnaires */}
        <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
          <p className="mb-4 text-[14px] font-semibold text-slate-900">Top Chestionare</p>
          {topQuestionnaires.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-8 text-center">
              <BarChart2 className="size-6 text-slate-200" />
              <p className="text-[12px] text-slate-400">Nicio dată disponibilă încă.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2.5">
              {topQuestionnaires.map((q, i) => (
                <div key={q.id} className="flex items-center gap-2.5">
                  <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-indigo-50 text-[11px] font-bold text-indigo-600">
                    {i + 1}
                  </span>
                  <span className="flex-1 truncate text-[12px] text-slate-700">
                    {q.title}
                  </span>
                  <span className="text-[11px] font-semibold text-indigo-600">
                    {q._count.leads}
                  </span>
                  <span className="text-[11px] text-slate-400">leads</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
