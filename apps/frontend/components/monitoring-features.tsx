"use client"

import { ReactNode, useState } from "react"
import { Panel, Section, SectionHead } from "@/components/ui-kit"

const hops = ["172.18.0.1", "10.204.6.12", "10.204.35.59", "10.204.64.37", "lo0-0.gw3.atl1.us.linode.com", "ae48.r11.atl01.ien.netarch.akamai.com", "atl-b24-link.ip.twelve99.net", "ash-bb2-link.ip.twelve99.net"]
const tabs = ["Traceroute", "MTR", "SSL certificates", "cURL"]

function Row({ title, body, points, flip, children }: { title: string; body: string; points: string[]; flip?: boolean; children: ReactNode }) {
  return (
    <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
      <div className={flip ? "lg:order-2" : ""}>
        <h3 className="text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">{title}</h3>
        <p className="mt-5 max-w-md text-lg leading-relaxed text-zinc-400">{body}</p>
        <ul className="mt-8 space-y-3">
          {points.map((p) => (
            <li key={p} className="flex items-center gap-3 text-zinc-300"><span className="h-1.5 w-1.5 rounded-full bg-[#34e0a1]" />{p}</li>
          ))}
        </ul>
      </div>
      <div className={flip ? "lg:order-1" : ""}>{children}</div>
    </div>
  )
}

export function MonitoringFeatures() {
  const [tab, setTab] = useState(0)
  return (
    <Section>
      <SectionHead title="Debug the outage, not the tooling"
        desc="Every failed check comes with the evidence you need to fix it." />
      <div className="space-y-28">
        <Row title="Traceroute and MTR for timeouts"
          body="See where a request stalls with edge-based traceroute and MTR output from the region that failed."
          points={["Real-time network path analysis", "Multi-region traceroute", "Automatic timeout detection"]}>
          <Panel className="overflow-hidden">
            <div role="tablist" className="flex gap-1 overflow-x-auto border-b border-white/[0.07] p-3">
              {tabs.map((t, i) => (
                <button key={t} role="tab" aria-selected={tab === i} onClick={() => setTab(i)}
                  className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-sm transition ${tab === i ? "bg-white/10 text-white" : "text-zinc-500 hover:text-zinc-300"}`}>{t}</button>
              ))}
            </div>
            <div className="p-5 font-mono text-sm">
              <p className="mb-3 text-zinc-500">HOST: uptime-edge-us-east-2</p>
              <div className="max-h-72 space-y-1 overflow-y-auto">
                {hops.map((h, i) => (
                  <div key={h} className="flex gap-4 rounded px-2 py-1 hover:bg-white/[0.03]">
                    <span className="w-5 text-right text-zinc-600">{i + 1}</span><span className="truncate text-zinc-300">{h}</span>
                  </div>
                ))}
              </div>
            </div>
          </Panel>
        </Row>

        <Row flip title="Screenshots and error logs"
          body="When a site goes down we capture the error message and a screenshot, so you see what your users saw."
          points={["Screenshot of the failing page", "Full error response and timing", "Playwright transaction checks in real Chrome"]}>
          <Panel className="space-y-5 p-6">
            {[["Page load", "2.3s", 75], ["DOM content", "1.8s", 60], ["First paint", "0.9s", 30]].map(([l, v, w]) => (
              <div key={l as string}>
                <div className="mb-2 flex justify-between text-sm"><span className="text-zinc-400">{l}</span><span className="text-white">{v}</span></div>
                <div className="h-1.5 rounded-full bg-white/[0.06]"><div className="h-full rounded-full bg-[#34e0a1]" style={{ width: `${w}%` }} /></div>
              </div>
            ))}
            <div className="rounded-xl border border-red-400/20 bg-red-400/[0.05] p-4 font-mono text-xs leading-relaxed text-red-300">
              HTTP 500 Internal Server Error<br />Connection timeout after 30s<br />Screenshot captured at 14:32:15 UTC
            </div>
          </Panel>
        </Row>

        <Row title="SSL certificate monitoring"
          body="Get alerts before a certificate expires, and watch certificate health across every domain."
          points={["Automatic certificate discovery", "Expiry alerts at 30, 7 and 1 day", "Certificate chain validation"]}>
          <Panel className="p-6">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-white">SSL certificate</h4>
              <span className="rounded-full border border-[#34e0a1]/30 bg-[#34e0a1]/10 px-3 py-1 text-xs text-[#34e0a1]">Valid</span>
            </div>
            <dl className="mt-6 grid grid-cols-2 gap-5 text-sm">
              {[["Issued to", "example.com"], ["Issued by", "Let’s Encrypt"], ["Valid from", "Jan 15, 2027"], ["Expires", "Apr 15, 2027"]].map(([k, v]) => (
                <div key={k}><dt className="text-zinc-500">{k}</dt><dd className="mt-1 font-mono text-white">{v}</dd></div>
              ))}
            </dl>
            <div className="mt-6 rounded-xl border border-white/[0.07] p-4">
              <div className="flex justify-between text-sm"><span className="text-zinc-400">Expires in</span><span className="font-medium text-amber-400">23 days</span></div>
              <div className="mt-3 h-1.5 rounded-full bg-white/[0.06]"><div className="h-full w-1/4 rounded-full bg-amber-400" /></div>
            </div>
          </Panel>
        </Row>
      </div>
    </Section>
  )
}