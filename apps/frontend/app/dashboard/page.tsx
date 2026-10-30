"use client";

import type React from "react";
import { useEffect, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { Bricolage_Grotesque, Instrument_Sans } from "next/font/google";
import {
  Plus,
  Search,
  MoreHorizontal,
  Globe,
  Activity,
  Settings,
  Pause,
  BarChart3,
  Bell,
  LogOut,
  ExternalLink,
  LayoutDashboard,
  Radio,
  ChevronsUpDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { BACKEND_URL } from "@/lib/utils";

/* ───────────── Fonts ───────────── */
const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
});
const body = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-body",
});

/* ───────────── Types ───────────── */
type Status = "up" | "down" | "checking";

type Website = {
  id: string;
  url: string;
  status: Status;
  responseTime: number;
  lastChecked: string;
};

type Tick = { status: string; responseTime: number; createdAt: string };
type ApiWebsite = { id: string; url: string; ticks?: Tick[] | Tick };
type Beat = { s: Status; r: number };

const HISTORY_LENGTH = 36;
const POLL_MS = 5000;

const normalize = (s?: string): Status => {
  const v = (s || "").toLowerCase();
  if (v === "up" || v === "healthy") return "up";
  if (v === "down") return "down";
  return "checking";
};

const STATUS_STYLE: Record<
  Status,
  { dot: string; text: string; bar: string; label: string }
> = {
  up: {
    dot: "bg-emerald-400",
    text: "text-emerald-300",
    bar: "bg-emerald-400",
    label: "Operational",
  },
  down: {
    dot: "bg-rose-500",
    text: "text-rose-300",
    bar: "bg-rose-500",
    label: "Down",
  },
  checking: {
    dot: "bg-amber-400",
    text: "text-amber-300",
    bar: "bg-amber-400",
    label: "Checking",
  },
};

/* ───────────── Small pieces ───────────── */
function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <span className="relative grid h-8 w-8 place-items-center rounded-[10px] bg-gradient-to-br from-emerald-300 to-teal-500 shadow-[0_0_24px_-4px_rgba(52,211,153,0.6)]">
        <span className="h-3 w-3 rounded-full bg-[#06100d]" />
        <span className="absolute h-3 w-3 animate-ping rounded-full bg-[#06100d]/40" />
      </span>
      <span className="font-[family-name:var(--font-display)] text-[17px] font-semibold tracking-tight text-white">
        BetterUptime
      </span>
    </Link>
  );
}

function Pulse({ status, size = "h-2.5 w-2.5" }: { status: Status; size?: string }) {
  const c = STATUS_STYLE[status].dot;
  return (
    <span className={`relative inline-flex ${size}`}>
      {status !== "checking" && (
        <span
          className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 ${c}`}
        />
      )}
      <span className={`relative inline-flex h-full w-full rounded-full ${c}`} />
    </span>
  );
}

function BeatStrip({ beats }: { beats: Beat[] }) {
  const slots = Array.from({ length: HISTORY_LENGTH }, (_, i) => {
    const idx = i - (HISTORY_LENGTH - beats.length);
    return idx >= 0 ? beats[idx] : null;
  });
  const max = Math.max(200, ...beats.map((b) => b.r));
  return (
    <div className="flex h-9 items-end gap-[3px]" aria-hidden>
      {slots.map((b, i) => {
        if (!b)
          return <span key={i} className="h-2 w-[5px] rounded-full bg-white/[0.06]" />;
        const h = b.s === "down" ? 100 : Math.max(22, Math.min(100, (b.r / max) * 100));
        return (
          <span
            key={i}
            style={{ height: `${h}%` }}
            className={`w-[5px] rounded-full opacity-90 ${STATUS_STYLE[b.s].bar}`}
          />
        );
      })}
    </div>
  );
}

function Stat({
  label,
  value,
  unit,
  hint,
}: {
  label: string;
  value: string | number;
  unit?: string;
  hint?: string;
}) {
  return (
    <div className="flex-1 px-6 py-5 first:pl-0 last:pr-0">
      <p className="text-[13px] text-zinc-500">{label}</p>
      <p className="mt-1.5 font-[family-name:var(--font-display)] text-[34px] font-semibold leading-none tracking-tight text-white tabular-nums">
        {value}
        {unit && <span className="ml-1 text-lg font-medium text-zinc-500">{unit}</span>}
      </p>
      {hint && <p className="mt-2 truncate text-[13px] text-zinc-500">{hint}</p>}
    </div>
  );
}

/* ───────────── Page ───────────── */
export default function DashboardPage() {
  const router = useRouter();
  const token = Cookies.get("token");

  const [searchQuery, setSearchQuery] = useState("");
  const [isAddWebsiteOpen, setIsAddWebsiteOpen] = useState(false);
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [websiteName, setWebsiteName] = useState("");
  const [websites, setWebsites] = useState<Website[]>([]);
  const [history, setHistory] = useState<Record<string, Beat[]>>({});
  const [loaded, setLoaded] = useState(false);

  const handleSignout = () => {
    Cookies.remove("token");
    toast.success("Signed out");
    router.push("/");
  };

  const fetchWebsites = useCallback(async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/websites`, {
        headers: { "Content-Type": "application/json", authorization: token },
      });

const raw: ApiWebsite[] = Array.isArray(res.data.websites)
  ? (res.data.websites as ApiWebsite[])
  : (Object.values(res.data.websites || {}) as ApiWebsite[]);

const data: Website[] = raw.map((site: ApiWebsite) => {
        const ticks = Array.isArray(site.ticks)
          ? site.ticks
          : site.ticks
            ? [site.ticks]
            : [];
        const first = ticks[0];
        return {
          id: site.id,
          url: site.url,
          status: normalize(first?.status),
          responseTime: first?.responseTime || 0,
          lastChecked: first?.createdAt
            ? new Date(first.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })
            : "—",
        };
      });

      setWebsites(data);
      setHistory((prev) => {
        const next = { ...prev };
        data.forEach((w) => {
          const list = next[w.id] ? [...next[w.id]] : [];
          list.push({ s: w.status, r: w.responseTime });
          next[w.id] = list.slice(-HISTORY_LENGTH);
        });
        return next;
      });
      setLoaded(true);
    } catch (e) {
      console.log("Error while fetching websites : ", e);
      setLoaded(true);
    }
  }, [token]);

  useEffect(() => {
    fetchWebsites();
    const interval = setInterval(fetchWebsites, POLL_MS);
    return () => clearInterval(interval);
  }, [fetchWebsites]);

  const handleAddWebsite = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(
        `${BACKEND_URL}/website`,
        { url: websiteUrl },
        { headers: { "Content-Type": "application/json", authorization: token } }
      );
      fetchWebsites();
      toast.success("Monitor added", {
        description: `${websiteName || websiteUrl} is now being checked.`,
      });
    } catch (err) {
      console.log("Failed to Add Website !", err);
      toast.error("Couldn't add the monitor. Check the URL and try again.");
    }
    setWebsiteUrl("");
    setWebsiteName("");
    setIsAddWebsiteOpen(false);
  };

  const filtered = useMemo(
    () =>
      websites.filter((w) =>
        w.url.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [websites, searchQuery]
  );

  /* Derived stats from real data */
  const total = websites.length;
  const downSites = websites.filter((w) => w.status === "down");
  const upCount = websites.filter((w) => w.status === "up").length;
  const withTime = websites.filter((w) => w.responseTime > 0);
  const avgResponse = withTime.length
    ? Math.round(withTime.reduce((s, w) => s + w.responseTime, 0) / withTime.length)
    : 0;
  const allBeats = Object.values(history).flat();
  const uptime = allBeats.length
    ? ((allBeats.filter((b) => b.s === "up").length / allBeats.length) * 100).toFixed(2)
    : "—";

  const overall: Status = downSites.length
    ? "down"
    : total > 0 && upCount === total
      ? "up"
      : "checking";

  const headline =
    total === 0
      ? "No monitors yet"
      : downSites.length
        ? `${downSites.length} ${downSites.length === 1 ? "monitor is" : "monitors are"} down`
        : upCount === total
          ? "All systems operational"
          : "Running first checks";

  const host = (url: string) => {
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
  };

  const navItem =
    "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors";

  return (
    <div
      className={`${display.variable} ${body.variable} min-h-screen bg-[#07090d] font-[family-name:var(--font-body)] text-zinc-300 antialiased selection:bg-emerald-400/30`}
    >
      {/* soft ambient light, tinted by overall status */}
      <div
        aria-hidden
        className={`pointer-events-none fixed inset-x-0 top-0 h-[420px] transition-colors duration-1000 ${
          overall === "down"
            ? "bg-[radial-gradient(ellipse_60%_100%_at_50%_0%,rgba(244,63,94,0.12),transparent)]"
            : "bg-[radial-gradient(ellipse_60%_100%_at_50%_0%,rgba(52,211,153,0.11),transparent)]"
        }`}
      />

      <div className="relative flex">
        {/* ───── Sidebar ───── */}
        <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-white/[0.06] bg-[#090c11]/80 px-3 py-5 backdrop-blur lg:flex">
          <div className="px-2 pb-6">
            <Logo />
          </div>
          <nav className="space-y-1">
            <button className={`${navItem} bg-white/[0.07] font-medium text-white`}>
              <LayoutDashboard className="h-4 w-4" /> Overview
            </button>
            <button className={`${navItem} text-zinc-400 hover:bg-white/[0.04] hover:text-white`}>
              <Globe className="h-4 w-4" /> Monitors
            </button>
            <button className={`${navItem} text-zinc-400 hover:bg-white/[0.04] hover:text-white`}>
              <Radio className="h-4 w-4" /> Status pages
            </button>
            <button className={`${navItem} text-zinc-400 hover:bg-white/[0.04] hover:text-white`}>
              <Activity className="h-4 w-4" /> Incidents
            </button>
          </nav>

          <div className="mt-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex w-full items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.03] p-2.5 text-left transition-colors hover:bg-white/[0.06]">
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-zinc-600 to-zinc-800 text-sm font-semibold text-white">
                    C
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-white">Cameron</span>
                    <span className="block text-xs text-zinc-500">Pro plan</span>
                  </span>
                  <ChevronsUpDown className="h-4 w-4 text-zinc-500" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                side="top"
                className="w-52 border-white/10 bg-[#0e1218] text-zinc-300"
              >
                <DropdownMenuItem className="focus:bg-white/[0.06] focus:text-white">
                  <Settings className="mr-2 h-4 w-4" /> Settings
                </DropdownMenuItem>
                <DropdownMenuItem className="focus:bg-white/[0.06] focus:text-white">
                  <BarChart3 className="mr-2 h-4 w-4" /> Analytics
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem
                  onClick={handleSignout}
                  className="focus:bg-white/[0.06] focus:text-white"
                >
                  <LogOut className="mr-2 h-4 w-4" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </aside>

        {/* ───── Main ───── */}
        <div className="min-w-0 flex-1">
          {/* top bar */}
          <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-white/[0.06] bg-[#07090d]/70 px-5 py-3 backdrop-blur-xl sm:px-8">
            <div className="lg:hidden">
              <Logo />
            </div>
            <div className="relative ml-auto w-full max-w-xs sm:ml-0 sm:max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <Input
                placeholder="Search monitors"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 rounded-lg border-white/[0.08] bg-white/[0.04] pl-9 text-sm text-white placeholder:text-zinc-500 focus-visible:border-emerald-400/50 focus-visible:ring-emerald-400/20"
              />
            </div>

            <div className="ml-auto flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-lg text-zinc-400 hover:bg-white/[0.06] hover:text-white"
                aria-label="Notifications"
              >
                <Bell className="h-4 w-4" />
              </Button>

              <Dialog open={isAddWebsiteOpen} onOpenChange={setIsAddWebsiteOpen}>
                <DialogTrigger asChild>
                  <Button className="h-9 gap-1.5 rounded-lg bg-white px-3.5 text-sm font-semibold text-[#07090d] hover:bg-zinc-200">
                    <Plus className="h-4 w-4" />
                    New monitor
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md rounded-2xl border-white/10 bg-[#0e1218] p-7 text-white shadow-2xl">
                  <DialogHeader className="space-y-1.5 text-left">
                    <DialogTitle className="font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight">
                      Add a monitor
                    </DialogTitle>
                    <DialogDescription className="text-zinc-400">
                      We&apos;ll start checking this website right away and alert you if it goes down.
                    </DialogDescription>
                  </DialogHeader>

                  <form onSubmit={handleAddWebsite} className="mt-2 space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="websiteUrl" className="text-sm text-zinc-300">
                        Website URL
                      </Label>
                      <Input
                        id="websiteUrl"
                        type="url"
                        placeholder="https://example.com"
                        value={websiteUrl}
                        onChange={(e) => setWebsiteUrl(e.target.value)}
                        className="h-11 rounded-lg border-white/10 bg-white/[0.04] text-white placeholder:text-zinc-600 focus-visible:border-emerald-400/50 focus-visible:ring-emerald-400/20"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="websiteName" className="text-sm text-zinc-300">
                        Display name <span className="text-zinc-600">(optional)</span>
                      </Label>
                      <Input
                        id="websiteName"
                        placeholder="My website"
                        value={websiteName}
                        onChange={(e) => setWebsiteName(e.target.value)}
                        className="h-11 rounded-lg border-white/10 bg-white/[0.04] text-white placeholder:text-zinc-600 focus-visible:border-emerald-400/50 focus-visible:ring-emerald-400/20"
                      />
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setIsAddWebsiteOpen(false)}
                        className="rounded-lg text-zinc-400 hover:bg-white/[0.06] hover:text-white"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={!websiteUrl}
                        className="rounded-lg bg-emerald-400 font-semibold text-[#04120c] hover:bg-emerald-300 disabled:opacity-40"
                      >
                        Add monitor
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </header>

          <main className="mx-auto max-w-6xl px-5 pb-16 pt-10 sm:px-8">
            {/* status headline */}
            <section>
              <div className="flex items-center gap-3">
                <Pulse status={overall} size="h-3 w-3" />
                <span className={`text-sm font-medium ${STATUS_STYLE[overall].text}`}>
                  Live · updates every {POLL_MS / 1000}s
                </span>
              </div>
              <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                {headline}
              </h1>
              <p className="mt-3 max-w-xl text-base text-zinc-400">
                {total === 0
                  ? "Add your first website to start tracking uptime and response time."
                  : downSites.length
                    ? `Affected: ${downSites.map((w) => host(w.url)).join(", ")}`
                    : `${total} ${total === 1 ? "website is" : "websites are"} being checked continuously.`}
              </p>
            </section>

            {/* stats */}
            <section className="mt-10 flex flex-col divide-y divide-white/[0.07] rounded-2xl border border-white/[0.07] bg-white/[0.02] px-6 sm:flex-row sm:divide-x sm:divide-y-0">
              <Stat label="Monitors" value={total} hint={`${upCount} up · ${downSites.length} down`} />
              <Stat
                label="Uptime this session"
                value={uptime}
                unit={uptime === "—" ? "" : "%"}
                hint="Based on live checks"
              />
              <Stat
                label="Avg response time"
                value={avgResponse}
                unit="ms"
                hint={withTime.length ? "Across all monitors" : "Waiting for data"}
              />
              <Stat
                label="Active incidents"
                value={downSites.length}
                hint={downSites.length ? host(downSites[0].url) : "Nothing needs attention"}
              />
            </section>

            {/* monitors */}
            <section className="mt-12">
              <div className="mb-4 flex items-end justify-between">
                <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold tracking-tight text-white">
                  Monitors
                </h2>
                <span className="text-sm text-zinc-500">
                  {filtered.length} of {total}
                </span>
              </div>

              <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.02]">
                {!loaded && (
                  <div className="space-y-px">
                    {[0, 1, 2].map((i) => (
                      <div key={i} className="h-[84px] animate-pulse bg-white/[0.03]" />
                    ))}
                  </div>
                )}

                {loaded && filtered.length === 0 && (
                  <div className="grid place-items-center px-6 py-16 text-center">
                    <span className="grid h-12 w-12 place-items-center rounded-xl bg-white/[0.05]">
                      <Globe className="h-5 w-5 text-zinc-400" />
                    </span>
                    <p className="mt-4 font-medium text-white">
                      {searchQuery ? "No monitors match your search" : "No monitors yet"}
                    </p>
                    <p className="mt-1 text-sm text-zinc-500">
                      {searchQuery
                        ? "Try a different domain."
                        : "Add a website to start monitoring it."}
                    </p>
                    {!searchQuery && (
                      <Button
                        onClick={() => setIsAddWebsiteOpen(true)}
                        className="mt-5 rounded-lg bg-white font-semibold text-[#07090d] hover:bg-zinc-200"
                      >
                        <Plus className="mr-1.5 h-4 w-4" /> New monitor
                      </Button>
                    )}
                  </div>
                )}

                <ul className="divide-y divide-white/[0.06]">
                  {filtered.map((w) => {
                    const st = STATUS_STYLE[w.status];
                    return (
                      <li
                        key={w.id}
                        className="group flex flex-col gap-4 px-5 py-4 transition-colors hover:bg-white/[0.03] md:flex-row md:items-center md:gap-6"
                      >
                        <Link
                          href={`/website/${w.id}`}
                          className="flex min-w-0 flex-1 items-center gap-4"
                        >
                          <Pulse status={w.status} />
                          <div className="min-w-0">
                            <p className="truncate font-medium text-white">{host(w.url)}</p>
                            <p className="truncate text-sm text-zinc-500">{w.url}</p>
                          </div>
                        </Link>

                        <div className="hidden md:block">
                          <BeatStrip beats={history[w.id] || []} />
                        </div>

                        <div className="flex items-center justify-between gap-6 md:justify-end">
                          <div className="md:w-24 md:text-right">
                            <p className={`text-sm font-medium ${st.text}`}>{st.label}</p>
                            <p className="text-sm text-zinc-500 tabular-nums">
                              {w.status === "up"
                                ? `${w.responseTime} ms`
                                : w.status === "down"
                                  ? "No response"
                                  : "—"}
                            </p>
                          </div>
                          <p className="hidden w-24 text-right text-sm text-zinc-500 tabular-nums xl:block">
                            {w.lastChecked}
                          </p>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-lg text-zinc-500 hover:bg-white/[0.08] hover:text-white"
                                aria-label="Monitor actions"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="w-48 border-white/10 bg-[#0e1218] text-zinc-300"
                            >
                              <DropdownMenuItem asChild className="focus:bg-white/[0.06] focus:text-white">
                                <Link href={w.url} target="_blank">
                                  <ExternalLink className="mr-2 h-4 w-4" /> Visit site
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild className="focus:bg-white/[0.06] focus:text-white">
                                <Link href={`/website/${w.id}`}>
                                  <BarChart3 className="mr-2 h-4 w-4" /> View analytics
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem className="focus:bg-white/[0.06] focus:text-white">
                                <Pause className="mr-2 h-4 w-4" /> Pause monitor
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}