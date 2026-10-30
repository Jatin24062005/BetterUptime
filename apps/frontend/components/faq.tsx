"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { Panel, Section, SectionHead } from "@/components/ui-kit"

const faqs = [
  ["Monitoring", "How quickly will I be notified if my website goes down?", "Within 30 seconds of detecting an issue. We check from multiple global locations every 30 seconds and notify you by email, SMS, Slack, PagerDuty or webhook."],
  ["Monitoring", "Can I monitor APIs and web services, not just websites?", "Yes. We support REST APIs, GraphQL endpoints and any HTTP/HTTPS endpoint, with custom headers, authentication, status code and JSON checks, plus database connection monitoring."],
  ["Alerts", "What types of alerts and notifications do you support?", "Email, SMS, Slack, Discord, Microsoft Teams, PagerDuty, webhooks and more. You can set escalation rules, team notifications and thresholds per issue type."],
  ["Monitoring", "How many monitoring locations do you have?", "15+ locations across North America, Europe, Asia and Australia, so you can spot regional connectivity issues."],
  ["Pricing", "Is there a free plan available?", "Yes. Free includes 10 monitors, 10 heartbeats, 3-minute checks, email alerts, a status page and 30 days of retention. Upgrade anytime."],
  ["Security", "Can I monitor SSL certificate expiration?", "Yes. We alert you 30, 7 and 1 day before expiry and validate the full certificate chain."],
  ["Data", "How long do you retain monitoring data?", "Free 30 days, Pro 1 year, Business 2 years, Enterprise unlimited. You can export your data at any time."],
  ["SLA", "Do you offer an uptime SLA guarantee?", "Business and Enterprise plans include a 99.99% uptime SLA with service credits for downtime beyond it."],
  ["Integrations", "Can I integrate with my existing tools?", "150+ integrations including Slack, PagerDuty, Datadog, New Relic, Grafana and Jira, plus a REST API and webhooks."],
  ["Teams", "How does team collaboration work?", "Pro and above include shared dashboards, roles, incident assignment, team notifications and audit logs."],
]
const cats = ["All", ...Array.from(new Set(faqs.map((f) => f[0])))]

export function FAQ() {
  const [cat, setCat] = useState("All")
  const [open, setOpen] = useState<string | null>(null)
  const list = cat === "All" ? faqs : faqs.filter((f) => f[0] === cat)

  return (
    <Section>
      <SectionHead title="Frequently asked questions" desc="Answers about monitoring, alerts, pricing and data." />
      <div className="mb-10 flex flex-wrap justify-center gap-2">
        {cats.map((c) => (
          <button key={c} onClick={() => { setCat(c); setOpen(null) }}
            className={`rounded-full px-4 py-1.5 text-sm transition ${cat === c ? "bg-white text-black" : "border border-white/[0.08] text-zinc-400 hover:text-white"}`}>{c}</button>
        ))}
      </div>
      <Panel className="mx-auto max-w-3xl divide-y divide-white/[0.07] overflow-hidden">
        {list.map(([, q, a]) => (
          <div key={q}>
            <button onClick={() => setOpen(open === q ? null : q)} aria-expanded={open === q}
              className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left transition hover:bg-white/[0.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#34e0a1]/50">
              <span className="font-medium text-white">{q}</span>
              <ChevronDown className={`h-5 w-5 shrink-0 text-zinc-500 transition ${open === q ? "rotate-180 text-[#34e0a1]" : ""}`} />
            </button>
            {open === q && <p className="px-6 pb-6 leading-relaxed text-zinc-400">{a}</p>}
          </div>
        ))}
      </Panel>
      <div className="mx-auto mt-12 flex max-w-3xl flex-col items-center justify-between gap-4 rounded-2xl border border-white/[0.07] p-6 sm:flex-row">
        <div><p className="font-medium text-white">Still have questions?</p><p className="text-sm text-zinc-500">We reply within 24 hours.</p></div>
        <div className="flex gap-2">
          <button className="h-10 rounded-xl bg-white px-5 text-sm font-medium text-black hover:bg-zinc-200">Contact support</button>
          <button className="h-10 rounded-xl border border-white/10 px-5 text-sm text-zinc-200 hover:bg-white/[0.05]">Documentation</button>
        </div>
      </div>
    </Section>
  )
}