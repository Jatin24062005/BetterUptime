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
  DropdownMenuLabel,
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
  name: string;
  url: string;
  status: Status;
  responseTime: number;
  lastChecked: string;
};

type Tick = {
  id?: string;
  status: string;
  responseTime: number | null;
  createdAt: string;
};

type ApiWebsite = {
  id: string;
  name?: string;
  url: string;
  ticks?: Tick[] | Tick;
  states?: { currentStatus: string; lastCheckedAt?: string }[];
  incidents?: ApiIncident[];
};

type ApiIncident = {
  id: string;
  websiteId: string;
  regionId: string;
  startedAt: string;
  resolvedAt: string | null;
  duration: number | null;
  region?: { id: string; name: string };
};

type DashboardIncident = ApiIncident & {
  websiteName: string;
  websiteUrl: string;
};

type ApiNotification = {
  id: string;
  type: "DOWN" | "RECOVERY";
  status: string;
  message: string;
  recipient: string;
  createdAt: string;
  sentAt?: string | null;
};

type Profile = {
  id: string;
  username: string;
  mobile: string | null;
};

type Beat = {
  id: string;
  s: Status;
  r: number;
  hint: string;
};

// The overview strip represents individual recent checks, not 24-hour buckets.
// Each saved tick becomes one bar so the strip visibly advances on every poll.
const HISTORY_LENGTH = 36;
const POLL_MS = 3000;
const INCIDENT_POLL_MS = 30000;

const normalize = (s?: string): Status => {
  const v = (s || "").toLowerCase();
  if (v === "up" || v === "healthy") return "up";
  if (v === "down") return "down";
  return "checking";
};

function getApiErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError<{ message?: unknown }>(error)) {
    const message = error.response?.data?.message;
    if (typeof message === "string" && message.trim()) return message;
  }

  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

// Render the latest 36 real checks as individual bars.
// API results are usually newest-first; sort oldest-first so the newest tick
// appears on the right, like a live monitoring timeline.
function buildRecentTickBeats(ticks: Tick[]): Beat[] {
  return [...ticks]
    .filter((tick) => Number.isFinite(new Date(tick.createdAt).getTime()))
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    )
    .slice(-HISTORY_LENGTH)
    .map((tick, index) => {
      const timestamp = new Date(tick.createdAt);
      return {
        id: tick.id || `${timestamp.getTime()}-${index}`,
        s: normalize(tick.status),
        r: typeof tick.responseTime === "number" ? tick.responseTime : 0,
        hint: timestamp.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      };
    });
}

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
  const slots = Array.from({ length: HISTORY_LENGTH }, (_, index) => beats[index] || null);
  const max = Math.max(200, ...beats.map((beat) => beat.r));

  return (
    <div
      className="flex h-9 w-[min(100%,18rem)] items-end gap-[3px]"
      aria-label={`Latest ${beats.length} website checks`}
    >
      {slots.map((beat, index) => {
        if (!beat || beat.s === "checking") {
          return (
            <span
              key={beat?.id || `empty-${index}`}
              title={beat ? `Checking · ${beat.hint}` : "Waiting for next check"}
              className="h-2 min-w-[5px] flex-1 rounded-full bg-white/[0.06] transition-all duration-300"
            />
          );
        }

        const height = beat.s === "down"
          ? 100
          : Math.max(22, Math.min(100, (beat.r / max) * 100));

        return (
          <span
            key={beat.id}
            title={`${beat.s === "up" ? "Operational" : "Down"} · ${beat.hint}${beat.r ? ` · ${beat.r} ms` : ""}`}
            style={{ height: `${height}%` }}
            className={`min-w-[5px] flex-1 rounded-full opacity-90 transition-all duration-300 ease-out ${STATUS_STYLE[beat.s].bar}`}
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
  const [notifications, setNotifications] = useState<ApiNotification[]>([]);
  const [recentIncidents, setRecentIncidents] = useState<DashboardIncident[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loaded, setLoaded] = useState(false);

  // Mobile number onboarding for SMS outage alerts.
  const [isMobileDialogOpen, setIsMobileDialogOpen] = useState(false);
  const [mobileNumber, setMobileNumber] = useState("");
  const [mobileSaving, setMobileSaving] = useState(false);
  const [mobileError, setMobileError] = useState("");

  const profileName = profile?.username
    ? profile.username.includes("@")
      ? profile.username.split("@")[0]
      : profile.username
    : "Your account";
  const profileInitial = profileName.charAt(0).toUpperCase() || "U";

  useEffect(() => {
    if (!token) return;

    let isActive = true;

    const loadProfile = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/user/me`, {
          headers: { "Content-Type": "application/json", authorization: token },
        });

        if (!isActive) return;
        setProfile(res.data?.user || null);
        setIsMobileDialogOpen(Boolean(res.data?.requiresMobileSetup));
      } catch (error) {
        console.error("Unable to load user profile:", error);
      }
    };

    loadProfile();

    return () => {
      isActive = false;
    };
  }, [token]);

  const fetchNotifications = useCallback(async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${BACKEND_URL}/notifications`, {
        headers: { "Content-Type": "application/json", authorization: token },
      });
      setNotifications(Array.isArray(res.data?.notifications) ? res.data.notifications : []);
    } catch (error) {
      console.error("Unable to fetch notifications:", error);
    }
  }, [token]);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const handleMobileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!/^[6-9]\d{9}$/.test(mobileNumber)) {
      setMobileError("Enter a valid 10-digit Indian mobile number.");
      return;
    }

    try {
      setMobileSaving(true);
      setMobileError("");

      await axios.patch(
        `${BACKEND_URL}/user/mobile`,
        { mobile: mobileNumber },
        { headers: { "Content-Type": "application/json", authorization: token } }
      );

      setProfile((current) => current ? { ...current, mobile: mobileNumber } : current);
      setIsMobileDialogOpen(false);
      setMobileNumber("");
      toast.success("SMS alerts enabled", {
        description: "You'll receive an alert when a monitored website goes down.",
      });
    } catch (error: unknown) {
      setMobileError(
        getApiErrorMessage(error, "Couldn't save your number. Please try again.")
      );
    } finally {
      setMobileSaving(false);
    }
  };

  const handleSignout = () => {
    Cookies.remove("token");
    toast.success("Signed out");
    router.push("/");
  };

  const fetchWebsites = useCallback(async () => {
    if (!token) {
      setLoaded(true);
      return;
    }

    try {
      const res = await axios.get(`${BACKEND_URL}/websites`, {
        headers: { "Content-Type": "application/json", authorization: token },
      });

      const raw: ApiWebsite[] = Array.isArray(res.data?.websites)
        ? res.data.websites
        : Object.values(res.data?.websites || {});

      const data: Website[] = raw.map((site) => {
        const ticks = Array.isArray(site.ticks)
          ? site.ticks
          : site.ticks
            ? [site.ticks]
            : [];
        // /websites returns the newest tick first.
        const latestTick = ticks[0];
        const fallbackName = (() => {
          try {
            return new URL(site.url).hostname;
          } catch {
            return site.url;
          }
        })();

        return {
          id: site.id,
          name: site.name?.trim() || fallbackName,
          url: site.url,
          status: normalize(latestTick?.status || site.states?.[0]?.currentStatus),
          responseTime: latestTick?.responseTime || 0,
          lastChecked: latestTick?.createdAt
            ? new Date(latestTick.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })
            : "—",
        };
      });

      // Build the overview bars directly from saved database ticks. Since this
      // request runs every 3 seconds, a newly saved check appears without
      // waiting for the slower 24-hour analytics refresh.
      setHistory(
        Object.fromEntries(
          raw.map((site) => {
            const ticks = Array.isArray(site.ticks)
              ? site.ticks
              : site.ticks
                ? [site.ticks]
                : [];
            return [site.id, buildRecentTickBeats(ticks)];
          })
        )
      );

      setWebsites(data);
      setLoaded(true);
    } catch (error: unknown) {
      // The API currently responds with 404 when a user has no monitors.
      const isNoWebsitesResponse =
        axios.isAxiosError(error) && error.response?.status === 404;
      if (!isNoWebsitesResponse) {
        console.error("Error while fetching websites:", error);
      }
      setWebsites([]);
      setHistory({});
      setLoaded(true);
    }
  }, [token]);

  useEffect(() => {
    fetchWebsites();
    const interval = setInterval(fetchWebsites, POLL_MS);
    return () => clearInterval(interval);
  }, [fetchWebsites]);

  // Incident history is loaded separately. The overview tick strip is loaded
  // from the most recent saved ticks in /websites on the 3-second live poll.
  const websiteMetaKey = JSON.stringify(
    websites.map(({ id, name, url }) => ({ id, name, url }))
  );

  useEffect(() => {
    const siteMeta: { id: string; name: string; url: string }[] = JSON.parse(websiteMetaKey);

    if (!token || siteMeta.length === 0) {
      setRecentIncidents([]);
      return;
    }

    let isActive = true;

    const loadIncidents = async () => {
      const incidentResults = await Promise.all(
        siteMeta.map(async (site) => {
          try {
            const response = await axios.get(
              `${BACKEND_URL}/websites/${site.id}/incidents`,
              {
                headers: { "Content-Type": "application/json", authorization: token },
              }
            );
            const incidents: ApiIncident[] = Array.isArray(response.data?.incidents)
              ? response.data.incidents
              : [];
            return incidents.map((incident) => ({
              ...incident,
              websiteName: site.name,
              websiteUrl: site.url,
            }));
          } catch (error) {
            console.error(`Unable to load incidents for ${site.name}:`, error);
            return [] as DashboardIncident[];
          }
        })
      );

      if (!isActive) return;
      setRecentIncidents(
        incidentResults
          .flat()
          .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())
          .slice(0, 6)
      );
    };

    loadIncidents();
    const interval = setInterval(loadIncidents, INCIDENT_POLL_MS);

    return () => {
      isActive = false;
      clearInterval(interval);
    };
  }, [token, websiteMetaKey]);

  const handleAddWebsite = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = websiteName.trim();
    const trimmedUrl = websiteUrl.trim();

    if (!trimmedName || !trimmedUrl) {
      toast.error("Enter both a website name and URL.");
      return;
    }

    try {
      await axios.post(
        `${BACKEND_URL}/website`,
        { name: trimmedName, url: trimmedUrl },
        { headers: { "Content-Type": "application/json", authorization: token } }
      );

      await fetchWebsites();
      toast.success("Monitor added", {
        description: `${trimmedName} is now being checked.`,
      });
      setWebsiteUrl("");
      setWebsiteName("");
      setIsAddWebsiteOpen(false);
    } catch (error: unknown) {
      console.error("Failed to add website:", error);
      toast.error(
        getApiErrorMessage(error, "Couldn't add the monitor. Check the name and URL.")
      );
    }
  };

  const filtered = useMemo(
    () =>
      websites.filter((w) =>
        `${w.name} ${w.url}`.toLowerCase().includes(searchQuery.toLowerCase())
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
  const measuredBeats = allBeats.filter((beat) => beat.s !== "checking");
  const uptime = measuredBeats.length
    ? ((measuredBeats.filter((beat) => beat.s === "up").length / measuredBeats.length) * 100).toFixed(2)
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

  const formatIncidentDuration = (incident: DashboardIncident) => {
    const seconds = incident.duration ?? Math.max(
      0,
      Math.floor((Date.now() - new Date(incident.startedAt).getTime()) / 1000)
    );
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    if (minutes > 0) return `${minutes}m`;
    return `${seconds}s`;
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
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-emerald-400/80 to-teal-700 text-sm font-semibold text-[#06100d]">
                    {profileInitial}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-white">{profileName}</span>
                    <span className="block truncate text-xs text-zinc-500">
                      {profile?.mobile ? `+91 ${profile.mobile}` : "Mobile alerts not set"}
                    </span>
                  </span>
                  <ChevronsUpDown className="h-4 w-4 text-zinc-500" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                side="top"
                className="w-52 border-white/10 bg-[#0e1218] text-zinc-300"
              >
                <DropdownMenuLabel className="font-normal text-zinc-500">
                  {profile?.username || "Signed-in account"}
                </DropdownMenuLabel>
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative h-9 w-9 rounded-lg text-zinc-400 hover:bg-white/[0.06] hover:text-white"
                    aria-label="Notifications"
                  >
                    <Bell className="h-4 w-4" />
                    {notifications.length > 0 && (
                      <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[min(21rem,calc(100vw-2rem))] border-white/10 bg-[#0e1218] p-2 text-zinc-300">
                  <DropdownMenuLabel className="flex items-center justify-between px-2 py-2 text-white">
                    <span>Recent alerts</span>
                    <span className="text-xs font-normal text-zinc-500">{notifications.length}</span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/10" />
                  {notifications.length === 0 ? (
                    <DropdownMenuItem disabled className="py-4 text-xs text-zinc-500">
                      No notifications yet.
                    </DropdownMenuItem>
                  ) : (
                    notifications.slice(0, 8).map((notification) => (
                      <DropdownMenuItem key={notification.id} className="items-start whitespace-normal py-2.5 focus:bg-white/[0.06] focus:text-white">
                        <span className={`mr-2 mt-1.5 h-2 w-2 shrink-0 rounded-full ${notification.type === "DOWN" ? "bg-rose-400" : "bg-emerald-400"}`} />
                        <span className="min-w-0">
                          <span className="block text-xs leading-5 text-zinc-200">{notification.message}</span>
                          <span className="mt-1 block text-[11px] text-zinc-500">
                            {new Date(notification.createdAt).toLocaleString()} · {notification.status.toLowerCase()}
                          </span>
                        </span>
                      </DropdownMenuItem>
                    ))
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

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
                      <Label htmlFor="websiteName" className="text-sm text-zinc-300">
                        Website name
                      </Label>
                      <Input
                        id="websiteName"
                        placeholder="My production website"
                        value={websiteName}
                        onChange={(e) => setWebsiteName(e.target.value)}
                        className="h-11 rounded-lg border-white/10 bg-white/[0.04] text-white placeholder:text-zinc-600 focus-visible:border-emerald-400/50 focus-visible:ring-emerald-400/20"
                        required
                      />
                    </div>
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
                        disabled={!websiteUrl.trim() || !websiteName.trim()}
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
              <p className="mb-3 text-xs font-medium uppercase tracking-[0.16em] text-zinc-500">
                Overview <span className="mx-1 text-zinc-700">/</span> Welcome back, <span className="text-zinc-300">{profileName}</span>
              </p>
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
                    ? `Affected: ${downSites.map((w) => w.name).join(", ")}`
                    : `${total} ${total === 1 ? "website is" : "websites are"} being checked continuously.`}
              </p>
            </section>

            {/* stats */}
            <section className="mt-10 flex flex-col divide-y divide-white/[0.07] rounded-2xl border border-white/[0.07] bg-white/[0.02] px-6 sm:flex-row sm:divide-x sm:divide-y-0">
              <Stat label="Monitors" value={total} hint={`${upCount} up · ${downSites.length} down`} />
              <Stat
                label="Recent uptime"
                value={uptime}
                unit={uptime === "—" ? "" : "%"}
                hint={`Based on the latest ${HISTORY_LENGTH} checks per monitor`}
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
              <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold tracking-tight text-white">
                    Monitors
                  </h2>
                  <p className="mt-1 text-xs text-zinc-500">
                    Live checks · latest {HISTORY_LENGTH} ticks · updates every 3 seconds
                  </p>
                </div>
                <span className="text-xs text-zinc-500">
                  {filtered.length} / {total} monitors
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
                            <p className="truncate font-medium text-white">{w.name}</p>
                            <p className="truncate text-sm text-zinc-500">{host(w.url)} · {w.url}</p>
                          </div>
                        </Link>

                        <div className="block overflow-hidden">
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

            {/* Recent incidents from the incident history endpoint */}
            <section className="mt-10">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold tracking-tight text-white">
                    Recent incidents
                  </h2>
                  <p className="mt-1 text-xs text-zinc-500">Downtime events across your monitors</p>
                </div>
                <span className="text-xs text-zinc-500">{recentIncidents.length} shown</span>
              </div>

              <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.02]">
                {recentIncidents.length === 0 ? (
                  <div className="px-5 py-7 text-sm text-zinc-500">
                    No incidents recorded. Your monitors are looking good.
                  </div>
                ) : (
                  <ul className="divide-y divide-white/[0.06]">
                    {recentIncidents.map((incident) => (
                      <li key={incident.id} className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex min-w-0 items-start gap-3">
                          <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${incident.resolvedAt ? "bg-emerald-400" : "bg-rose-400"}`} />
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-white">{incident.websiteName}</p>
                            <p className="truncate text-xs text-zinc-500">{host(incident.websiteUrl)} · {new Date(incident.startedAt).toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 pl-5 sm:pl-0">
                          <span className={`text-xs font-medium ${incident.resolvedAt ? "text-emerald-300" : "text-rose-300"}`}>
                            {incident.resolvedAt ? "Resolved" : "Ongoing"}
                          </span>
                          <span className="text-xs tabular-nums text-zinc-500">{formatIncidentDuration(incident)}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          </main>
        </div>
      </div>

      {/* Ask for a mobile number only when the signed-in user has not added one. */}
      <Dialog open={isMobileDialogOpen} onOpenChange={setIsMobileDialogOpen}>
        <DialogContent className="w-[calc(100%-2rem)] max-w-[360px] rounded-2xl border border-white/[0.09] bg-[#0e1218] p-5 text-white shadow-2xl sm:p-6">
          <DialogHeader className="space-y-2 text-left">
            <div className="mb-1 grid h-10 w-10 place-items-center rounded-xl border border-emerald-400/15 bg-emerald-400/10 text-emerald-300">
              <Bell className="h-[18px] w-[18px]" />
            </div>
            <DialogTitle className="font-[family-name:var(--font-display)] text-xl font-semibold tracking-tight text-white">
              Get outage alerts
            </DialogTitle>
            <DialogDescription className="text-[13px] leading-5 text-zinc-400">
              Add your mobile number to receive an SMS when one of your websites goes down.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleMobileSubmit} className="mt-3 space-y-3">
            <div className="space-y-2">
              <Label htmlFor="alertMobile" className="text-xs font-medium text-zinc-300">
                Mobile number
              </Label>
              <div className="flex h-10 items-center rounded-lg border border-white/10 bg-white/[0.04] px-3 transition-colors focus-within:border-emerald-400/50">
                <span className="mr-3 border-r border-white/10 pr-3 text-sm text-zinc-400">
                  +91
                </span>
                <Input
                  id="alertMobile"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  placeholder="98765 43210"
                  value={mobileNumber}
                  onChange={(e) => {
                    setMobileNumber(e.target.value.replace(/\D/g, "").slice(0, 10));
                    setMobileError("");
                  }}
                  maxLength={10}
                  className="h-full border-0 bg-transparent px-0 text-sm text-white shadow-none placeholder:text-zinc-600 focus-visible:ring-0"
                  aria-describedby={mobileError ? "alertMobileError" : undefined}
                  required
                />
              </div>
              {mobileError && (
                <p id="alertMobileError" className="text-xs text-rose-400">
                  {mobileError}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={mobileSaving || mobileNumber.length !== 10}
              className="h-10 w-full rounded-lg bg-emerald-400 text-sm font-semibold text-[#04120c] hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {mobileSaving ? "Saving..." : "Enable SMS alerts"}
            </Button>
            <p className="text-center text-[11px] leading-4 text-zinc-500">
              Used only for important website status notifications.
            </p>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}