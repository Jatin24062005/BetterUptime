"use client";

import type React from "react";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Bricolage_Grotesque, Instrument_Sans } from "next/font/google";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowLeft,
  ExternalLink,
  Settings,
  Pause,
  Play,
  MoreHorizontal,
  Bell,
  MapPin,
  Shield,
  Camera,
  Download,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
});
const body = Instrument_Sans({ subsets: ["latin"], variable: "--font-body" });

/* ───────── Mock data (swap for your API) ───────── */
const monitor = {
  name: "example.com",
  url: "https://example.com",
  status: "up" as "up" | "down",
  responseTime: 124,
  lastChecked: "30 seconds ago",
  location: "US East",
  type: "HTTPS",
  isActive: true,
  createdAt: "Jan 15, 2024",
  checkInterval: 30,
  timeout: 30,
  sslExpiry: "Apr 15, 2027",
  incidents: 2,
  totalChecks: 15420,
};

const incidents = [
  { id: 1, type: "HTTP 500 error", duration: "2m 15s", when: "2 hours ago" },
  { id: 2, type: "High response time", duration: "5m 30s", when: "1 day ago" },
];

type RT = { label: string; responseTime: number };
type Day = { date: string; uptime: number };

const RANGES = {
  "24h": { points: 24, stepH: 1, fmt: (d: Date) => `${d.getHours()}:00` },
  "7d": { points: 28, stepH: 6, fmt: (d: Date) => d.toLocaleDateString([], { weekday: "short" }) },
  "30d": { points: 30, stepH: 24, fmt: (d: Date) => d.toLocaleDateString([], { month: "short", day: "numeric" }) },
} as const;
type RangeKey = keyof typeof RANGES;

const genResponse = (range: RangeKey): RT[] => {
  const { points, stepH, fmt } = RANGES[range];
  const now = Date.now();
  return Array.from({ length: points }, (_, i) => {
    const d = new Date(now - (points - 1 - i) * stepH * 3600_000);
    return {
      label: fmt(d),
      responseTime: Math.round(Math.max(50, 120 + Math.random() * 100 - 50)),
    };
  });
};

const genUptime = (): Day[] =>
  Array.from({ length: 30 }, (_, i) => {
    const d = new Date(Date.now() - (29 - i) * 86400_000);
    const u = Math.random() < 0.93 ? 99.9 + Math.random() * 0.1 : 98.5 + Math.random() * 1.4;
    return {
      date: d.toLocaleDateString([], { month: "short", day: "numeric" }),
      uptime: Number(u.toFixed(2)),
    };
  });

/* ───────── Small pieces ───────── */
function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <span className="relative grid h-8 w-8 place-items-center rounded-[10px] bg-gradient-to-br from-emerald-300 to-teal-500 shadow-[0_0_24px_-4px_rgba(52,211,153,0.6)]">
        <span className="h-3 w-3 rounded-full bg-[#06100d]" />
      </span>
      <span className="font-[family-name:var(--font-display)] text-[17px] font-semibold tracking-tight text-white">
        BetterUptime
      </span>
    </Link>
  );
}

const outlineBtn =
  "h-9 gap-2 rounded-lg border-white/10 bg-white/[0.03] text-zinc-300 hover:bg-white/[0.07] hover:text-white";

const panel = "rounded-2xl border border-white/[0.07] bg-white/[0.02]";

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-6 py-3 text-sm">
      <dt className="text-zinc-500">{k}</dt>
      <dd className="truncate text-right font-medium text-zinc-200">{v}</dd>
    </div>
  );
}

const tooltipStyle = {
  backgroundColor: "#0e1218",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 10,
  color: "#fff",
  fontSize: 13,
};

export default function WebsiteDetailsPage() {
  const [range, setRange] = useState<RangeKey>("24h");
  const [tab, setTab] = useState<"overview" | "incidents" | "settings">("overview");
  const [response, setResponse] = useState<RT[]>([]);
  const [uptime, setUptime] = useState<Day[]>([]);

  useEffect(() => setUptime(genUptime()), []);
  useEffect(() => setResponse(genResponse(range)), [range]);

  const stats = useMemo(() => {
    if (!response.length) return { avg: monitor.responseTime, min: 0, max: 0 };
    const v = response.map((r) => r.responseTime);
    return {
      avg: Math.round(v.reduce((a, b) => a + b, 0) / v.length),
      min: Math.min(...v),
      max: Math.max(...v),
    };
  }, [response]);

  const avgUptime = uptime.length
    ? (uptime.reduce((s, d) => s + d.uptime, 0) / uptime.length).toFixed(2)
    : "—";

  const isUp = monitor.status === "up";
  const barColor = (u: number) =>
    u >= 99.9 ? "bg-emerald-400" : u >= 99 ? "bg-amber-400" : "bg-rose-500";

  const tabs = ["overview", "incidents", "settings"] as const;

  return (
    <div
      className={`${display.variable} ${body.variable} min-h-screen bg-[#07090d] font-[family-name:var(--font-body)] text-zinc-300 antialiased selection:bg-emerald-400/30`}
    >
      <div
        aria-hidden
        className={`pointer-events-none fixed inset-x-0 top-0 h-[420px] ${
          isUp
            ? "bg-[radial-gradient(ellipse_60%_100%_at_50%_0%,rgba(52,211,153,0.11),transparent)]"
            : "bg-[radial-gradient(ellipse_60%_100%_at_50%_0%,rgba(244,63,94,0.12),transparent)]"
        }`}
      />

      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-[#07090d]/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 sm:px-8">
          <div className="flex items-center gap-5">
            <Logo />
            <span className="hidden h-5 w-px bg-white/10 sm:block" />
            <Link
              href="/dashboard"
              className="group hidden items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-white sm:flex"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
              All monitors
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-lg text-zinc-400 hover:bg-white/[0.06] hover:text-white"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
            </Button>
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-zinc-600 to-zinc-800 text-sm font-semibold text-white">
              C
            </span>
          </div>
        </div>
      </header>

      <main className="relative mx-auto max-w-6xl px-5 pb-20 pt-8 sm:px-8">
        <Link
          href="/dashboard"
          className="mb-6 inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white sm:hidden"
        >
          <ArrowLeft className="h-4 w-4" /> All monitors
        </Link>

        {/* Title */}
        <section className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="relative inline-flex h-3 w-3">
                <span
                  className={`absolute h-full w-full animate-ping rounded-full opacity-60 ${isUp ? "bg-emerald-400" : "bg-rose-500"}`}
                />
                <span
                  className={`relative h-full w-full rounded-full ${isUp ? "bg-emerald-400" : "bg-rose-500"}`}
                />
              </span>
              <span className={`text-sm font-medium ${isUp ? "text-emerald-300" : "text-rose-300"}`}>
                {isUp ? "Operational" : "Down"} · checked {monitor.lastChecked}
              </span>
            </div>
            <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              {monitor.name}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-zinc-500">
              <span>{monitor.url}</span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" /> {monitor.location}
              </span>
              <span className="rounded-md border border-white/10 px-1.5 py-0.5 text-xs text-zinc-400">
                {monitor.type}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" className={outlineBtn} asChild>
              <a href={monitor.url} target="_blank" rel="noreferrer">
                <ExternalLink className="h-4 w-4" /> Visit site
              </a>
            </Button>
            <Button variant="outline" className={outlineBtn}>
              {monitor.isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {monitor.isActive ? "Pause" : "Resume"}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className={`${outlineBtn} w-9 px-0`} aria-label="More">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 border-white/10 bg-[#0e1218] text-zinc-300">
                <DropdownMenuItem className="focus:bg-white/[0.06] focus:text-white">
                  <Settings className="mr-2 h-4 w-4" /> Configure
                </DropdownMenuItem>
                <DropdownMenuItem className="focus:bg-white/[0.06] focus:text-white">
                  <Camera className="mr-2 h-4 w-4" /> Screenshots
                </DropdownMenuItem>
                <DropdownMenuItem className="focus:bg-white/[0.06] focus:text-white">
                  <Download className="mr-2 h-4 w-4" /> Export data
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </section>

        {/* Key numbers */}
        <section className={`${panel} mt-10 flex flex-col divide-y divide-white/[0.07] px-6 sm:flex-row sm:divide-x sm:divide-y-0`}>
          {[
            { l: "Response time", v: monitor.responseTime, u: "ms", h: "Latest check" },
            { l: "Uptime, 30 days", v: avgUptime, u: "%", h: `${monitor.incidents} incidents` },
            { l: "Checks run", v: monitor.totalChecks.toLocaleString(), u: "", h: `Every ${monitor.checkInterval}s` },
            { l: "SSL certificate", v: "Valid", u: "", h: `Expires ${monitor.sslExpiry}` },
          ].map((s) => (
            <div key={s.l} className="flex-1 px-0 py-5 sm:px-6 sm:first:pl-0 sm:last:pr-0">
              <p className="text-[13px] text-zinc-500">{s.l}</p>
              <p className="mt-1.5 font-[family-name:var(--font-display)] text-[32px] font-semibold leading-none tracking-tight text-white tabular-nums">
                {s.v}
                {s.u && <span className="ml-1 text-lg font-medium text-zinc-500">{s.u}</span>}
              </p>
              <p className="mt-2 text-[13px] text-zinc-500">{s.h}</p>
            </div>
          ))}
        </section>

        {/* Tabs */}
        <div className="mt-10 flex items-center justify-between border-b border-white/[0.07]">
          <div role="tablist" className="flex gap-1">
            {tabs.map((t) => (
              <button
                key={t}
                role="tab"
                aria-selected={tab === t}
                onClick={() => setTab(t)}
                className={`relative px-4 py-3 text-sm font-medium capitalize transition-colors ${
                  tab === t ? "text-white" : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {t}
                {tab === t && (
                  <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-emerald-400" />
                )}
              </button>
            ))}
          </div>

          {tab === "overview" && (
            <div className="mb-2 flex rounded-lg border border-white/10 bg-white/[0.03] p-0.5">
              {(Object.keys(RANGES) as RangeKey[]).map((r) => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className={`rounded-md px-3 py-1 text-sm transition-colors ${
                    range === r ? "bg-white text-[#07090d] font-semibold" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Overview */}
        {tab === "overview" && (
          <div className="mt-8 space-y-8">
            <section className={`${panel} p-6`}>
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold tracking-tight text-white">
                    Response time
                  </h2>
                  <p className="mt-1 text-sm text-zinc-500">Last {range}</p>
                </div>
                <dl className="flex gap-8 text-sm">
                  {[
                    ["Average", stats.avg],
                    ["Fastest", stats.min],
                    ["Slowest", stats.max],
                  ].map(([k, v]) => (
                    <div key={k as string}>
                      <dt className="text-zinc-500">{k}</dt>
                      <dd className="font-[family-name:var(--font-display)] text-lg font-semibold text-white tabular-nums">
                        {v}
                        <span className="ml-0.5 text-sm font-medium text-zinc-500">ms</span>
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="mt-6 h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={response} margin={{ left: -12, right: 4, top: 8 }}>
                    <defs>
                      <linearGradient id="rt" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#34d399" stopOpacity={0.35} />
                        <stop offset="100%" stopColor="#34d399" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis
                      dataKey="label"
                      stroke="#52525b"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      minTickGap={28}
                    />
                    <YAxis
                      stroke="#52525b"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      unit="ms"
                    />
                    <Tooltip
                      contentStyle={tooltipStyle}
                      cursor={{ stroke: "rgba(255,255,255,0.15)" }}
                      formatter={(v: number) => [`${v} ms`, "Response time"]}
                    />
                    <Area
                      type="monotone"
                      dataKey="responseTime"
                      stroke="#34d399"
                      strokeWidth={2}
                      fill="url(#rt)"
                      activeDot={{ r: 5, fill: "#07090d", stroke: "#34d399", strokeWidth: 2 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </section>

            {/* Daily uptime strip */}
            <section className={`${panel} p-6`}>
              <div className="flex items-end justify-between">
                <div>
                  <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold tracking-tight text-white">
                    Daily uptime
                  </h2>
                  <p className="mt-1 text-sm text-zinc-500">Last 30 days</p>
                </div>
                <p className="font-[family-name:var(--font-display)] text-2xl font-semibold text-white tabular-nums">
                  {avgUptime}%
                </p>
              </div>
              <div className="mt-6 flex h-14 items-stretch gap-1">
                {uptime.map((d) => (
                  <div
                    key={d.date}
                    title={`${d.date} · ${d.uptime}%`}
                    className={`flex-1 rounded-[5px] opacity-90 transition-opacity hover:opacity-100 ${barColor(d.uptime)}`}
                  />
                ))}
              </div>
              <div className="mt-2 flex justify-between text-xs text-zinc-600">
                <span>{uptime[0]?.date}</span>
                <span>Today</span>
              </div>
            </section>

            <section className={`${panel} px-6 py-3`}>
              <h2 className="py-3 font-[family-name:var(--font-display)] text-xl font-semibold tracking-tight text-white">
                Monitor details
              </h2>
              <dl className="grid divide-y divide-white/[0.06] md:grid-cols-2 md:gap-x-16 md:divide-y-0">
                <div className="divide-y divide-white/[0.06]">
                  <Row k="URL" v={monitor.url} />
                  <Row k="Type" v={monitor.type} />
                  <Row k="Check interval" v={`${monitor.checkInterval} seconds`} />
                  <Row k="Timeout" v={`${monitor.timeout} seconds`} />
                </div>
                <div className="divide-y divide-white/[0.06] border-t border-white/[0.06] md:border-t-0">
                  <Row k="Location" v={monitor.location} />
                  <Row k="Created" v={monitor.createdAt} />
                  <Row k="Incidents" v={monitor.incidents} />
                  <Row
                    k="State"
                    v={
                      <span
                        className={`rounded-md px-2 py-0.5 text-xs ${
                          monitor.isActive
                            ? "bg-emerald-400/10 text-emerald-300"
                            : "bg-zinc-500/20 text-zinc-300"
                        }`}
                      >
                        {monitor.isActive ? "Active" : "Paused"}
                      </span>
                    }
                  />
                </div>
              </dl>
            </section>
          </div>
        )}

        {/* Incidents */}
        {tab === "incidents" && (
          <div className="mt-8">
            {incidents.length === 0 ? (
              <div className={`${panel} grid place-items-center px-6 py-16 text-center`}>
                <CheckCircle2 className="h-6 w-6 text-emerald-400" />
                <p className="mt-3 font-medium text-white">No incidents</p>
                <p className="mt-1 text-sm text-zinc-500">This monitor hasn&apos;t had any downtime.</p>
              </div>
            ) : (
              <ul className={`${panel} divide-y divide-white/[0.06]`}>
                {incidents.map((i) => (
                  <li key={i.id} className="flex items-center justify-between gap-4 px-6 py-4">
                    <div className="flex items-center gap-4">
                      <span className="grid h-9 w-9 place-items-center rounded-lg bg-emerald-400/10">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      </span>
                      <div>
                        <p className="font-medium text-white">{i.type}</p>
                        <p className="text-sm text-zinc-500">Resolved after {i.duration}</p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-sm text-zinc-500">
                      <Clock className="h-3.5 w-3.5" /> {i.when}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Settings */}
        {tab === "settings" && (
          <div className={`${panel} mt-8 flex flex-col items-start gap-5 p-6 sm:flex-row sm:items-center sm:justify-between`}>
            <div className="flex items-start gap-4">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-white/[0.06]">
                <Shield className="h-5 w-5 text-zinc-300" />
              </span>
              <div>
                <h2 className="font-medium text-white">Alerts and check settings</h2>
                <p className="mt-1 max-w-md text-sm text-zinc-500">
                  Change how often this website is checked and who gets notified when it goes down.
                </p>
              </div>
            </div>
            <Button className="h-10 gap-2 rounded-lg bg-white font-semibold text-[#07090d] hover:bg-zinc-200">
              <Settings className="h-4 w-4" /> Edit monitor
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}