"use client";

import type React from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";
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
  MoreHorizontal,
  Bell,
  MapPin,
  Shield,
  CheckCircle2,
  Clock,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BACKEND_URL } from "@/lib/utils";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
});
const body = Instrument_Sans({ subsets: ["latin"], variable: "--font-body" });

const POLL_MS = 15000;

type RangeKey = "24h" | "7d";
type Status = "UP" | "DOWN" | "UNKNOWN";

type Tick = {
  id: string;
  status: Status | string;
  responseTime: number | null;
  errorMessage?: string | null;
  createdAt: string;
};

type RegionState = {
  id: string;
  regionId: string;
  currentStatus: Status | string;
  outageStartedAt?: string | null;
  lastCheckedAt?: string;
  region?: { id: string; name: string };
};

type Incident = {
  id: string;
  startedAt: string;
  resolvedAt: string | null;
  duration: number | null;
  region?: { id: string; name: string };
};

type Website = {
  id: string;
  name: string;
  url: string;
  timeAdded?: string;
  currentStatus: RegionState[];
  latestTick: Tick | null;
  activeIncidents: Incident[];
};

type Profile = {
  id: string;
  username: string;
  mobile: string | null;
};

type ApiNotification = {
  id: string;
  type: "DOWN" | "RECOVERY";
  status: string;
  message: string;
  createdAt: string;
};

type ChartTick = {
  id: string;
  label: string;
  responseTime: number | null;
  status: Status;
  createdAt: string;
  errorMessage?: string | null;
};

const panel = "rounded-2xl border border-white/[0.07] bg-white/[0.02]";
const outlineBtn =
  "h-9 gap-2 rounded-lg border-white/10 bg-white/[0.03] text-zinc-300 hover:bg-white/[0.07] hover:text-white";
const tooltipStyle = {
  backgroundColor: "#0e1218",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 10,
  color: "#fff",
  fontSize: 13,
};

function normalizeStatus(value?: string): Status {
  const status = (value || "").toUpperCase();
  if (status === "UP") return "UP";
  if (status === "DOWN") return "DOWN";
  return "UNKNOWN";
}

function getApiErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError<{ message?: unknown }>(error)) {
    const message = error.response?.data?.message;
    if (typeof message === "string" && message.trim()) return message;
  }

  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

function formatDuration(totalSeconds: number) {
  const seconds = Math.max(0, Math.floor(totalSeconds));
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  if (days) return `${days}d ${hours}h`;
  if (hours) return `${hours}h ${minutes}m`;
  if (minutes) return `${minutes}m ${remainingSeconds}s`;
  return `${remainingSeconds}s`;
}

function relativeTime(value?: string | null) {
  if (!value) return "Not checked yet";
  const timestamp = new Date(value).getTime();
  if (!Number.isFinite(timestamp)) return "Not checked yet";
  const seconds = Math.max(0, Math.floor((Date.now() - timestamp) / 1000));
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

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

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-6 py-3 text-sm">
      <dt className="text-zinc-500">{k}</dt>
      <dd className="truncate text-right font-medium text-zinc-200">{v}</dd>
    </div>
  );
}

function StatusDot({ status }: { status: Status }) {
  const color =
    status === "UP"
      ? "bg-emerald-400"
      : status === "DOWN"
        ? "bg-rose-500"
        : "bg-amber-400";
  return (
    <span className="relative inline-flex h-3 w-3">
      {status !== "UNKNOWN" && (
        <span className={`absolute h-full w-full animate-ping rounded-full opacity-50 ${color}`} />
      )}
      <span className={`relative h-full w-full rounded-full ${color}`} />
    </span>
  );
}

export default function WebsiteDetailsPage() {
  const params = useParams<{ websiteId: string }>();
  const router = useRouter();
  const websiteId = Array.isArray(params?.websiteId)
    ? params.websiteId[0]
    : params?.websiteId;
  const token = Cookies.get("token");

  const [range, setRange] = useState<RangeKey>("24h");
  const [tab, setTab] = useState<"overview" | "incidents" | "settings">("overview");
  const [website, setWebsite] = useState<Website | null>(null);
  const [ticks, setTicks] = useState<Tick[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [notifications, setNotifications] = useState<ApiNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const headers = useMemo(
    () => ({ "Content-Type": "application/json", authorization: token || "" }),
    [token]
  );

  const loadProfileAndNotifications = useCallback(async () => {
    if (!token) return;
    const [profileResult, notificationResult] = await Promise.allSettled([
      axios.get(`${BACKEND_URL}/user/me`, { headers }),
      axios.get(`${BACKEND_URL}/notifications`, { headers }),
    ]);
    if (profileResult.status === "fulfilled") {
      setProfile(profileResult.value.data?.user || null);
    }
    if (notificationResult.status === "fulfilled") {
      const rows = notificationResult.value.data?.notifications;
      setNotifications(Array.isArray(rows) ? rows : []);
    }
  }, [headers, token]);

  const loadWebsiteData = useCallback(
    async (showInitialLoader = false) => {
      if (!websiteId || !token) {
        setLoading(false);
        if (!token) setError("Your session is missing. Please sign in again.");
        return;
      }

      if (showInitialLoader) setLoading(true);
      else setRefreshing(true);

      try {
        const [statusResult, ticksResult, incidentsResult] = await Promise.allSettled([
          axios.get(`${BACKEND_URL}/status/${encodeURIComponent(websiteId)}`, { headers }),
          axios.get(`${BACKEND_URL}/websites/${encodeURIComponent(websiteId)}/ticks`, {
            headers,
            params: { range },
          }),
          axios.get(`${BACKEND_URL}/websites/${encodeURIComponent(websiteId)}/incidents`, {
            headers,
          }),
        ]);

        if (statusResult.status === "rejected") {
          const statusCode = statusResult.reason?.response?.status;
          if (statusCode === 401) {
            setError("Your session has expired. Please sign in again.");
            return;
          }
          if (statusCode === 404) {
            setError("This monitor could not be found in your account.");
            return;
          }
          throw statusResult.reason;
        }

        const statusWebsite = statusResult.value.data?.website as Website | undefined;
        if (!statusWebsite) throw new Error("The status endpoint returned no website data.");
        setWebsite(statusWebsite);

        if (ticksResult.status === "fulfilled") {
          const rows = ticksResult.value.data?.ticks;
          const ordered = Array.isArray(rows)
            ? [...rows].sort(
                (a: Tick, b: Tick) =>
                  new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
              )
            : [];
          setTicks(ordered);
        } else {
          console.error("Unable to load tick history:", ticksResult.reason);
          setTicks([]);
        }

        if (incidentsResult.status === "fulfilled") {
          const rows = incidentsResult.value.data?.incidents;
          setIncidents(Array.isArray(rows) ? rows : []);
        } else {
          console.error("Unable to load incidents:", incidentsResult.reason);
          setIncidents([]);
        }

        setError("");
        setLastUpdated(new Date().toISOString());
      } catch (loadError: unknown) {
        console.error("Website details request failed:", loadError);
        setError(
          getApiErrorMessage(
            loadError,
            "Unable to load website details. Please try again."
          )
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [headers, range, token, websiteId]
  );

  useEffect(() => {
    loadProfileAndNotifications();
  }, [loadProfileAndNotifications]);

  useEffect(() => {
    loadWebsiteData(true);
    const interval = window.setInterval(() => loadWebsiteData(false), POLL_MS);
    return () => window.clearInterval(interval);
  }, [loadWebsiteData]);

  const chartTicks: ChartTick[] = useMemo(
    () =>
      ticks.map((tick) => {
        const date = new Date(tick.createdAt);
        const label =
          range === "24h"
            ? date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
            : date.toLocaleDateString([], { month: "short", day: "numeric" }) +
              " " +
              date.toLocaleTimeString([], { hour: "2-digit" });
        const status = normalizeStatus(tick.status);
        return {
          id: tick.id,
          label,
          status,
          createdAt: tick.createdAt,
          responseTime:
            status === "UP" && typeof tick.responseTime === "number"
              ? tick.responseTime
              : null,
        };
      }),
    [range, ticks]
  );

  const stats = useMemo(() => {
    const responseValues = chartTicks
      .map((tick) => tick.responseTime)
      .filter((value): value is number => typeof value === "number" && value >= 0);
    const upChecks = chartTicks.filter((tick) => tick.status === "UP").length;
    const downChecks = chartTicks.filter((tick) => tick.status === "DOWN").length;
    const knownChecks = upChecks + downChecks;
    return {
      avg: responseValues.length
        ? Math.round(responseValues.reduce((sum, value) => sum + value, 0) / responseValues.length)
        : null,
      min: responseValues.length ? Math.min(...responseValues) : null,
      max: responseValues.length ? Math.max(...responseValues) : null,
      uptime: knownChecks ? ((upChecks / knownChecks) * 100).toFixed(2) : "—",
      upChecks,
      downChecks,
      knownChecks,
    };
  }, [chartTicks]);

  const overallStatus = useMemo<Status>(() => {
    const states = website?.currentStatus || [];
    if (states.some((state) => normalizeStatus(state.currentStatus) === "DOWN")) return "DOWN";
    if (states.length && states.every((state) => normalizeStatus(state.currentStatus) === "UP")) return "UP";
    return normalizeStatus(website?.latestTick?.status);
  }, [website]);

  const latestCheckedAt = website?.currentStatus?.reduce<string | undefined>(
    (latest, state) => {
      if (!state.lastCheckedAt) return latest;
      if (!latest || new Date(state.lastCheckedAt).getTime() > new Date(latest).getTime()) {
        return state.lastCheckedAt;
      }
      return latest;
    },
    website?.latestTick?.createdAt
  );

  const activeIncidents = incidents.filter((incident) => !incident.resolvedAt);
  const protocol = (() => {
    try {
      return new URL(website?.url || "").protocol.replace(":", "").toUpperCase();
    } catch {
      return "HTTP";
    }
  })();
  const profileName = profile?.username
    ? profile.username.includes("@")
      ? profile.username.split("@")[0]
      : profile.username
    : "Your account";
  const profileInitial = profileName.charAt(0).toUpperCase() || "U";

  const tabs = ["overview", "incidents", "settings"] as const;
  const recentTicks = chartTicks.slice(-60);

  const formatIncidentDuration = (incident: Incident) => {
    const duration =
      incident.duration ??
      Math.max(0, Math.floor((Date.now() - new Date(incident.startedAt).getTime()) / 1000));
    return formatDuration(duration);
  };

  if (loading) {
    return (
      <div className={`${display.variable} ${body.variable} min-h-screen bg-[#07090d] px-5 py-10 text-zinc-300`}>
        <div className="mx-auto max-w-6xl animate-pulse space-y-6">
          <div className="h-8 w-44 rounded bg-white/[0.06]" />
          <div className="h-12 w-72 rounded bg-white/[0.06]" />
          <div className="h-44 rounded-2xl bg-white/[0.04]" />
          <div className="h-80 rounded-2xl bg-white/[0.04]" />
        </div>
      </div>
    );
  }

  if (error && !website) {
    return (
      <div className={`${display.variable} ${body.variable} min-h-screen bg-[#07090d] px-5 py-10 text-zinc-300`}>
        <div className="mx-auto max-w-lg rounded-2xl border border-white/[0.08] bg-white/[0.03] p-7 text-center">
          <AlertTriangle className="mx-auto h-7 w-7 text-rose-400" />
          <h1 className="mt-4 font-[family-name:var(--font-display)] text-2xl font-semibold text-white">
            Unable to load monitor
          </h1>
          <p className="mt-2 text-sm text-zinc-400">{error}</p>
          <div className="mt-6 flex justify-center gap-2">
            <Button variant="outline" className={outlineBtn} onClick={() => router.push("/dashboard")}>
              <ArrowLeft className="h-4 w-4" /> Dashboard
            </Button>
            <Button className="h-9 rounded-lg bg-emerald-400 text-[#04120c] hover:bg-emerald-300" onClick={() => loadWebsiteData(true)}>
              <RefreshCw className="mr-2 h-4 w-4" /> Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${display.variable} ${body.variable} min-h-screen bg-[#07090d] font-[family-name:var(--font-body)] text-zinc-300 antialiased selection:bg-emerald-400/30`}
    >
      <div
        aria-hidden
        className={`pointer-events-none fixed inset-x-0 top-0 h-[420px] ${
          overallStatus === "UP"
            ? "bg-[radial-gradient(ellipse_60%_100%_at_50%_0%,rgba(52,211,153,0.11),transparent)]"
            : overallStatus === "DOWN"
              ? "bg-[radial-gradient(ellipse_60%_100%_at_50%_0%,rgba(244,63,94,0.12),transparent)]"
              : "bg-[radial-gradient(ellipse_60%_100%_at_50%_0%,rgba(251,191,36,0.08),transparent)]"
        }`}
      />

      <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-[#07090d]/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 sm:px-8">
          <div className="flex items-center gap-5">
            <Logo />
            <span className="hidden h-5 w-px bg-white/10 sm:block" />
            <Link href="/dashboard" className="group hidden items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-white sm:flex">
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
              All monitors
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-lg text-zinc-400 hover:bg-white/[0.06] hover:text-white" aria-label="Notifications">
                  <Bell className="h-4 w-4" />
                  {notifications.length > 0 && <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-emerald-400" />}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[min(21rem,calc(100vw-2rem))] border-white/10 bg-[#0e1218] p-2 text-zinc-300">
                <DropdownMenuLabel className="px-2 py-2 text-white">Recent alerts ({notifications.length})</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/10" />
                {notifications.length === 0 ? (
                  <DropdownMenuItem disabled className="py-4 text-xs text-zinc-500">No notifications yet.</DropdownMenuItem>
                ) : notifications.slice(0, 6).map((notification) => (
                  <DropdownMenuItem key={notification.id} className="items-start whitespace-normal py-2.5 focus:bg-white/[0.06] focus:text-white">
                    <span className={`mr-2 mt-1.5 h-2 w-2 shrink-0 rounded-full ${notification.type === "DOWN" ? "bg-rose-400" : "bg-emerald-400"}`} />
                    <span className="min-w-0">
                      <span className="block text-xs leading-5 text-zinc-200">{notification.message}</span>
                      <span className="mt-1 block text-[11px] text-zinc-500">{new Date(notification.createdAt).toLocaleString()}</span>
                    </span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.03] py-1 pl-1 pr-2 transition-colors hover:bg-white/[0.06]" aria-label="Account menu">
                  <span className="grid h-7 w-7 place-items-center rounded-md bg-gradient-to-br from-emerald-400/80 to-teal-700 text-xs font-semibold text-[#06100d]">{profileInitial}</span>
                  <span className="hidden max-w-32 truncate text-xs font-medium text-zinc-300 sm:block">{profileName}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 border-white/10 bg-[#0e1218] text-zinc-300">
                <DropdownMenuLabel className="font-normal">
                  <span className="block text-sm text-white">{profileName}</span>
                  <span className="block truncate text-xs text-zinc-500">{profile?.username || "Signed-in account"}</span>
                  <span className="mt-1 block text-xs text-zinc-500">{profile?.mobile ? `+91 ${profile.mobile}` : "Mobile alerts not set"}</span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem onClick={() => router.push("/dashboard")} className="focus:bg-white/[0.06] focus:text-white">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Dashboard
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="relative mx-auto max-w-6xl px-5 pb-20 pt-8 sm:px-8">
        <Link href="/dashboard" className="mb-6 inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white sm:hidden">
          <ArrowLeft className="h-4 w-4" /> All monitors
        </Link>

        <section className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-2.5">
              <StatusDot status={overallStatus} />
              <span className={`text-sm font-medium ${overallStatus === "UP" ? "text-emerald-300" : overallStatus === "DOWN" ? "text-rose-300" : "text-amber-300"}`}>
                {overallStatus === "UP" ? "Operational" : overallStatus === "DOWN" ? "Down" : "Awaiting check"} · checked {relativeTime(latestCheckedAt)}
              </span>
            </div>
            <h1 className="mt-3 break-words font-[family-name:var(--font-display)] text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              {website?.name || "Website monitor"}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-zinc-500">
              <span className="break-all">{website?.url}</span>
              <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{website?.currentStatus?.length ? website.currentStatus.map((state) => state.region?.name).filter(Boolean).join(", ") || `${website.currentStatus.length} region(s)` : "Region not reported"}</span>
              <span className="rounded-md border border-white/10 px-1.5 py-0.5 text-xs text-zinc-400">{protocol}</span>
            </div>
            {error && <p className="mt-2 text-xs text-amber-300">Some monitor data could not be refreshed: {error}</p>}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {website?.url && (
              <Button variant="outline" className={outlineBtn} asChild>
                <a href={website.url} target="_blank" rel="noreferrer"><ExternalLink className="h-4 w-4" /> Visit site</a>
              </Button>
            )}
            <Button variant="outline" className={outlineBtn} onClick={() => loadWebsiteData(false)} disabled={refreshing}>
              <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} /> Refresh
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className={`${outlineBtn} w-9 px-0`} aria-label="More monitor actions"><MoreHorizontal className="h-4 w-4" /></Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 border-white/10 bg-[#0e1218] text-zinc-300">
                <DropdownMenuItem onClick={() => setTab("settings")} className="focus:bg-white/[0.06] focus:text-white"><Settings className="mr-2 h-4 w-4" /> Alert details</DropdownMenuItem>
                <DropdownMenuItem onClick={() => loadWebsiteData(false)} className="focus:bg-white/[0.06] focus:text-white"><RefreshCw className="mr-2 h-4 w-4" /> Refresh data</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </section>

        <section className={`${panel} mt-10 flex flex-col divide-y divide-white/[0.07] px-6 sm:flex-row sm:divide-x sm:divide-y-0`}>
          {[
            { label: "Response time", value: website?.latestTick?.responseTime ?? "—", unit: website?.latestTick?.responseTime != null ? "ms" : "", hint: "Latest saved check" },
            { label: `Successful checks, ${range}`, value: stats.uptime, unit: stats.uptime === "—" ? "" : "%", hint: `${stats.upChecks} up · ${stats.downChecks} down checks` },
            { label: "Checks", value: ticks.length.toLocaleString(), unit: "", hint: `Saved checks in the last ${range}` },
            { label: "Incidents", value: incidents.length.toLocaleString(), unit: "", hint: `${activeIncidents.length} currently ongoing` },
          ].map((item) => (
            <div key={item.label} className="flex-1 px-0 py-5 sm:px-6 sm:first:pl-0 sm:last:pr-0">
              <p className="text-[13px] text-zinc-500">{item.label}</p>
              <p className="mt-1.5 font-[family-name:var(--font-display)] text-[32px] font-semibold leading-none tracking-tight text-white tabular-nums">
                {item.value}{item.unit && <span className="ml-1 text-lg font-medium text-zinc-500">{item.unit}</span>}
              </p>
              <p className="mt-2 text-[13px] text-zinc-500">{item.hint}</p>
            </div>
          ))}
        </section>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.07]">
          <div role="tablist" className="flex gap-1">
            {tabs.map((item) => (
              <button key={item} role="tab" aria-selected={tab === item} onClick={() => setTab(item)} className={`relative px-4 py-3 text-sm font-medium capitalize transition-colors ${tab === item ? "text-white" : "text-zinc-500 hover:text-zinc-300"}`}>
                {item}
                {tab === item && <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-emerald-400" />}
              </button>
            ))}
          </div>
          {tab === "overview" && (
            <div className="mb-2 flex rounded-lg border border-white/10 bg-white/[0.03] p-0.5">
              {(["24h", "7d"] as RangeKey[]).map((item) => (
                <button key={item} onClick={() => setRange(item)} className={`rounded-md px-3 py-1 text-sm transition-colors ${range === item ? "bg-white font-semibold text-[#07090d]" : "text-zinc-400 hover:text-white"}`}>{item}</button>
              ))}
            </div>
          )}
        </div>

        {tab === "overview" && (
          <div className="mt-8 space-y-8">
            <section className={`${panel} p-6`}>
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold tracking-tight text-white">Response time</h2>
                  <p className="mt-1 text-sm text-zinc-500">Actual monitoring ticks · last {range}</p>
                </div>
                <dl className="flex gap-6 text-sm sm:gap-8">
                  {[["Average", stats.avg], ["Fastest", stats.min], ["Slowest", stats.max]].map(([label, value]) => (
                    <div key={label as string}>
                      <dt className="text-zinc-500">{label}</dt>
                      <dd className="font-[family-name:var(--font-display)] text-lg font-semibold text-white tabular-nums">{value ?? "—"}<span className="ml-0.5 text-sm font-medium text-zinc-500">{value == null ? "" : "ms"}</span></dd>
                    </div>
                  ))}
                </dl>
              </div>
              <div className="mt-6 h-[300px]">
                {chartTicks.some((tick) => tick.responseTime != null) ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartTicks} margin={{ left: -12, right: 4, top: 8 }}>
                      <defs>
                        <linearGradient id="responseTimeGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#34d399" stopOpacity={0.35} />
                          <stop offset="100%" stopColor="#34d399" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
                      <XAxis dataKey="label" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} minTickGap={32} />
                      <YAxis stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} unit="ms" />
                      <Tooltip
                        contentStyle={tooltipStyle}
                        cursor={{ stroke: "rgba(255,255,255,0.15)" }}
                        formatter={(value) => {
                          const raw = Array.isArray(value) ? value[0] : value;
                          const numericValue = typeof raw === "number" ? raw : raw == null ? null : Number(raw);

                          return [
                            numericValue == null || Number.isNaN(numericValue)
                              ? "No successful response"
                              : `${numericValue} ms`,
                            "Response time",
                          ];
                        }}
                        labelFormatter={(_, payload) => payload?.[0]?.payload?.createdAt ? new Date(payload[0].payload.createdAt).toLocaleString() : ""}
                      />
                      <Area type="monotone" dataKey="responseTime" connectNulls={false} stroke="#34d399" strokeWidth={2} fill="url(#responseTimeGradient)" activeDot={{ r: 5, fill: "#07090d", stroke: "#34d399", strokeWidth: 2 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="grid h-full place-items-center text-center">
                    <div><Clock className="mx-auto h-6 w-6 text-zinc-600" /><p className="mt-3 text-sm text-zinc-400">No successful response-time checks in this period.</p><p className="mt-1 text-xs text-zinc-600">The graph will populate as monitoring ticks are saved.</p></div>
                  </div>
                )}
              </div>
            </section>

            <section className={`${panel} p-6`}>
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold tracking-tight text-white">Check history</h2>
                  <p className="mt-1 text-sm text-zinc-500">Each bar represents one saved check · last {range}</p>
                </div>
                <div className="flex items-center gap-4 text-xs text-zinc-500">
                  <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-400" /> Up</span>
                  <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-rose-500" /> Down</span>
                  <span>{ticks.length} checks</span>
                </div>
              </div>
              {recentTicks.length ? (
                <div className="mt-6 flex h-14 items-end gap-[3px] overflow-hidden" aria-label={`${recentTicks.length} recent website checks`}>
                  {recentTicks.map((tick) => {
                    const status = normalizeStatus(tick.status);
                    const time = new Date(tick.createdAt);
                    return (
                      <span key={tick.id} title={`${status} · ${time.toLocaleString()}${tick.responseTime == null ? "" : ` · ${tick.responseTime} ms`}${tick.errorMessage ? ` · ${tick.errorMessage}` : ""}`} className={`min-w-[3px] flex-1 rounded-[4px] transition-all duration-300 ${status === "UP" ? "bg-emerald-400" : status === "DOWN" ? "bg-rose-500" : "bg-amber-400"}`} style={{ height: status === "DOWN" ? "100%" : status === "UP" ? "72%" : "30%" }} />
                    );
                  })}
                </div>
              ) : (
                <div className="mt-6 rounded-xl border border-dashed border-white/[0.08] px-4 py-8 text-center text-sm text-zinc-500">No saved ticks found for this range.</div>
              )}
              <div className="mt-3 flex justify-between text-xs text-zinc-600">
                <span>{recentTicks[0] ? new Date(recentTicks[0].createdAt).toLocaleString() : "—"}</span>
                <span>{recentTicks.length ? new Date(recentTicks[recentTicks.length - 1].createdAt).toLocaleString() : "—"}</span>
              </div>
            </section>

            <section className={`${panel} px-6 py-3`}>
              <h2 className="py-3 font-[family-name:var(--font-display)] text-xl font-semibold tracking-tight text-white">Monitor details</h2>
              <dl className="grid divide-y divide-white/[0.06] md:grid-cols-2 md:gap-x-16 md:divide-y-0">
                <div className="divide-y divide-white/[0.06]">
                  <Row k="Website name" v={website?.name || "—"} />
                  <Row k="URL" v={website?.url || "—"} />
                  <Row k="Protocol" v={protocol} />
                </div>
                <div className="divide-y divide-white/[0.06] border-t border-white/[0.06] md:border-t-0">
                  <Row k="Last check" v={latestCheckedAt ? new Date(latestCheckedAt).toLocaleString() : "Not checked yet"} />
                  <Row k="Monitoring regions" v={website?.currentStatus?.length || 0} />
                  <Row k="Active incidents" v={activeIncidents.length} />
                </div>
              </dl>
            </section>
          </div>
        )}

        {tab === "incidents" && (
          <div className="mt-8">
            {incidents.length === 0 ? (
              <div className={`${panel} grid place-items-center px-6 py-16 text-center`}>
                <CheckCircle2 className="h-6 w-6 text-emerald-400" />
                <p className="mt-3 font-medium text-white">No incidents</p>
                <p className="mt-1 text-sm text-zinc-500">This monitor has no recorded downtime incidents.</p>
              </div>
            ) : (
              <ul className={`${panel} divide-y divide-white/[0.06]`}>
                {incidents.map((incident) => (
                  <li key={incident.id} className="flex flex-col items-start justify-between gap-3 px-6 py-4 sm:flex-row sm:items-center">
                    <div className="flex min-w-0 items-center gap-4">
                      <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${incident.resolvedAt ? "bg-emerald-400/10" : "bg-rose-400/10"}`}>
                        {incident.resolvedAt ? <CheckCircle2 className="h-4 w-4 text-emerald-400" /> : <AlertTriangle className="h-4 w-4 text-rose-400" />}
                      </span>
                      <div className="min-w-0">
                        <p className="font-medium text-white">Website unavailable</p>
                        <p className="text-sm text-zinc-500">Started {new Date(incident.startedAt).toLocaleString()}{incident.region?.name ? ` · ${incident.region.name}` : ""}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 pl-[52px] sm:pl-0">
                      <span className={`text-sm font-medium ${incident.resolvedAt ? "text-emerald-300" : "text-rose-300"}`}>{incident.resolvedAt ? "Resolved" : "Ongoing"}</span>
                      <span className="inline-flex items-center gap-1.5 text-sm text-zinc-500"><Clock className="h-3.5 w-3.5" />{formatIncidentDuration(incident)}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {tab === "settings" && (
          <div className={`${panel} mt-8 flex flex-col items-start gap-5 p-6 sm:flex-row sm:items-center sm:justify-between`}>
            <div className="flex items-start gap-4">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-white/[0.06]"><Shield className="h-5 w-5 text-zinc-300" /></span>
              <div>
                <h2 className="font-medium text-white">SMS alert destination</h2>
                <p className="mt-1 max-w-md text-sm text-zinc-500">Downtime alerts are sent to the mobile number registered on your account.</p>
                <p className="mt-3 text-sm font-medium text-zinc-200">{profile?.mobile ? `+91 ${profile.mobile}` : "No mobile number registered"}</p>
              </div>
            </div>
            <Button variant="outline" className={outlineBtn} onClick={() => router.push("/dashboard")}>Manage account</Button>
          </div>
        )}

        <p className="mt-6 text-right text-[11px] text-zinc-600">{lastUpdated ? `Data refreshed ${relativeTime(lastUpdated)}` : "Waiting for data"} · Auto-refresh every ${POLL_MS / 1000}s</p>
      </main>
    </div>
  );
}
