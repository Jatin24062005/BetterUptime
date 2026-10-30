"use client"

import { useMemo, useState } from "react"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Panel, Section, SectionHead, StatStrip } from "@/components/ui-kit"

const RANGES = { "24h": 24, "7d": 28, "30d": 30 } as const
type Range = keyof typeof RANGES

// deterministic data: no hydration mismatch
const series = (n: number) =>
  Array.from({ length: n }, (_, i) => ({ t: i, ms: Math.round(112 + 30 * Math.sin(i * 0.7) + 14 * Math.sin(i * 1.9)) }))

export function UptimeStats() {
  const [range, setRange] = useState<Range>("24h")
  const data = useMemo(() => series(RANGES[range]), [range])
  const ms = data.map((d) => d.ms)
  const avg = Math.round(ms.reduce((a, b) => a + b, 0) / ms.length)

  return (
    <Section>
      <SectionHead title="See exactly what happened, and when"
        desc="Response times, uptime and incidents in one view, with history you can trust." />
      <StatStrip items={[
        { label: "Response time", value: "124", unit: "ms", sub: "Latest check" },
        { label: "Uptime, 30 days", value: "99.90", unit: "%", sub: "2 incidents" },
        { label: "Checks run", value: "15,420", sub: "Every 30s" },
        { label: "SSL certificate", value: "Valid", sub: "Expires Apr 15, 2027" },
      ]} />
      <Panel className="mt-6 p-5 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <h3 className="text-xl font-semibold tracking-tight text-white">Response time</h3>
            <p className="mt-1 text-sm text-zinc-500">Last {range}</p>
          </div>
          <div className="flex items-center gap-8">
            {[["Average", avg], ["Fastest", Math.min(...ms)], ["Slowest", Math.max(...ms)]].map(([l, v]) => (
              <div key={l} className="text-right">
                <p className="text-sm text-zinc-500">{l}</p>
                <p className="text-lg font-semibold text-white">{v}<span className="ml-0.5 text-sm font-normal text-zinc-500">ms</span></p>
              </div>
            ))}
          </div>
        </div>
        <div role="tablist" className="mt-6 inline-flex rounded-xl border border-white/[0.07] p-1 text-sm">
          {(Object.keys(RANGES) as Range[]).map((r) => (
            <button key={r} role="tab" aria-selected={range === r} onClick={() => setRange(r)}
              className={`rounded-lg px-4 py-1.5 transition ${range === r ? "bg-white text-black" : "text-zinc-400 hover:text-white"}`}>
              {r}
            </button>
          ))}
        </div>
        <div className="mt-6 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ left: -12, right: 0, top: 8 }}>
              <defs>
                <linearGradient id="rt" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#34e0a1" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#34e0a1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="t" hide />
              <YAxis stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} unit="ms" domain={[40, 180]} />
              <Tooltip cursor={{ stroke: "rgba(255,255,255,0.15)" }} formatter={(v: number) => [`${v} ms`, "Response"]} labelFormatter={() => ""}
                contentStyle={{ background: "#0a0d0f", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, color: "#fff" }} />
              <Area type="monotone" dataKey="ms" stroke="#34e0a1" strokeWidth={2} fill="url(#rt)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Panel>
    </Section>
  )
}