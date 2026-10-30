"use client"

import { useLayoutEffect, useRef, useState } from "react"
import Link from "next/link"
import gsap from "gsap"
import { ArrowRight, Play } from "lucide-react"
import VideoModal from "@/components/videoModal"
import { Bars, Panel, StatStrip } from "@/components/ui-kit"

const rows = [
  { name: "example.com", url: "https://example.com", ms: "124 ms", label: "Operational", tone: "up" as const },
  { name: "api.example.com", url: "https://api.example.com", ms: "98 ms", label: "Operational", tone: "up" as const },
  { name: "staging.example.com", url: "https://staging.example.com", ms: "—", label: "Down", tone: "down" as const },
]
const text = { up: "text-[#34e0a1]", down: "text-red-400" }
const dot = { up: "bg-[#34e0a1]", down: "bg-red-400" }

export function Hero() {
  const [email, setEmail] = useState("")
  const [videoOpen, setVideoOpen] = useState(false)
  const root = useRef<HTMLElement>(null)
  const demoRef = useRef<HTMLButtonElement>(null)

  const openVideo = () => {
    demoRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
    setTimeout(() => setVideoOpen(true), 200)
  }

  // one orchestrated entrance
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from("[data-hero]", { opacity: 0, y: 24, stagger: 0.09, duration: 0.9, ease: "power3.out" })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} className="relative overflow-hidden pb-24 pt-36 sm:pt-44">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[600px] bg-[radial-gradient(60%_100%_at_50%_0%,rgba(52,224,161,0.16),transparent_70%)]" />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p data-hero className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-1.5 text-sm text-zinc-300">
            <span className="h-2 w-2 rounded-full bg-[#34e0a1] shadow-[0_0_10px_#34e0a1]" />
            Operational · checked 30 seconds ago
          </p>
          <h1 data-hero className="text-balance text-5xl font-semibold leading-[1.05] tracking-tight text-white sm:text-7xl">
            Know it’s down before your users do
          </h1>
          <p data-hero className="mx-auto mt-6 max-w-xl text-pretty text-lg leading-relaxed text-zinc-400">
            Uptime monitoring with 30-second checks, instant alerts and a public status page. Free for 10 monitors.
          </p>

          <div data-hero className="mx-auto mt-10 flex max-w-lg flex-col gap-2 rounded-2xl border border-white/10 bg-white/[0.03] p-1.5 sm:flex-row">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your work email"
              className="h-11 flex-1 rounded-xl bg-transparent px-4 text-white placeholder:text-zinc-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#34e0a1]/60"
            />
            <Link href={`/signup${email ? `?email=${encodeURIComponent(email)}` : ""}`}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-white px-6 text-sm font-medium text-black transition hover:bg-zinc-200">
              Get started <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div data-hero className="mt-6 flex flex-col items-center justify-center gap-x-6 gap-y-3 text-sm text-zinc-500 sm:flex-row">
            <button ref={demoRef} onClick={openVideo}
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-zinc-300 transition hover:bg-white/[0.05] hover:text-white">
              <Play className="h-3.5 w-3.5" /> Watch 50-sec demo
            </button>
         
          </div>
        </div>

        {/* product preview, mirrors the real dashboard */}
        <div data-hero className="mx-auto mt-20 max-w-5xl">
          <div className="rounded-[28px] border border-white/[0.08] bg-gradient-to-b from-white/[0.05] to-transparent p-2 shadow-[0_40px_120px_-30px_rgba(52,224,161,0.25)]">
            <div className="rounded-[22px] bg-[#0a0d0f] p-5 sm:p-8">
              <p className="flex items-center gap-2 text-sm text-amber-400">
                <span className="h-2 w-2 rounded-full bg-amber-400" /> Live · updates every 5s
              </p>
              <h3 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">3 websites checked continuously</h3>
              <div className="mt-8">
                <StatStrip items={[
                  { label: "Monitors", value: "3", sub: "2 up · 1 down" },
                  { label: "Uptime this session", value: "99.90", unit: "%", sub: "Based on live checks" },
                  { label: "Avg response time", value: "124", unit: "ms", sub: "Across all monitors" },
                  { label: "Active incidents", value: "1", sub: "staging needs attention" },
                ]} />
              </div>
              <Panel className="mt-6 divide-y divide-white/[0.07] overflow-hidden">
                {rows.map((r) => (
                  <div key={r.name} className="flex items-center gap-4 px-5 py-4">
                    <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${dot[r.tone === "down" ? "down" : "up"]}`} />
                    <div className="min-w-0 flex-1 text-left">
                      <p className="truncate font-medium text-white">{r.name}</p>
                      <p className="truncate text-sm text-zinc-500">{r.url}</p>
                    </div>
                    <div className="hidden sm:block"><Bars up={r.tone === "down" ? 3 : 9} tone={r.tone} /></div>
                    <div className="w-28 text-right">
                      <p className={`text-sm font-medium ${text[r.tone === "down" ? "down" : "up"]}`}>{r.label}</p>
                      <p className="text-sm text-zinc-500">{r.ms}</p>
                    </div>
                  </div>
                ))}
              </Panel>
            </div>
          </div>
        </div>

        <dl className="mx-auto mt-20 grid max-w-3xl grid-cols-2 gap-8 text-center sm:grid-cols-4">
          {[["99.99%", "Uptime SLA"], ["30s", "Check interval"], ["15+", "Global locations"], ["50K+", "Websites monitored"]].map(([v, l]) => (
            <div key={l}>
              <dt className="text-2xl font-semibold tracking-tight text-white">{v}</dt>
              <dd className="mt-1 text-sm text-zinc-500">{l}</dd>
            </div>
          ))}
        </dl>
      </div>
      <VideoModal open={videoOpen} onClose={() => setVideoOpen(false)} />
    </section>
  )
}