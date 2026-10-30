import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Panel, Section, SectionHead } from "@/components/ui-kit"

const items = [
  { name: "Datadog", desc: "APM and infrastructure monitoring", icon: "🐕", users: "10K+" },
  { name: "New Relic", desc: "Application performance monitoring", icon: "🔄", users: "8K+" },
  { name: "Grafana", desc: "Open source analytics platform", icon: "📊", users: "12K+" },
  { name: "Prometheus", desc: "Systems monitoring toolkit", icon: "🔥", users: "9K+" },
  { name: "Slack", desc: "Alerts in the channels your team uses", icon: "💬", users: "25K+" },
  { name: "PagerDuty", desc: "On-call and incident response", icon: "📟", users: "7K+" },
]

export function Integrations() {
  return (
    <Section>
      <SectionHead title="Plug into the stack you already use"
        desc="Connect Datadog, Grafana, Slack, AWS, Google Cloud and more in about five minutes." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((i) => (
          <Panel key={i.name} className="flex items-start gap-4 p-5 transition hover:border-white/[0.14]">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.04] text-xl">{i.icon}</span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-medium text-white">{i.name}</h3>
                <span className="text-xs text-zinc-500">{i.users} teams</span>
              </div>
              <p className="mt-1 text-sm leading-relaxed text-zinc-400">{i.desc}</p>
            </div>
          </Panel>
        ))}
      </div>
      <div className="mt-10 flex flex-col items-center gap-8">
        <dl className="grid w-full max-w-2xl grid-cols-3 text-center">
          {[["150+", "Integrations"], ["5 min", "Average setup"], ["99.9%", "Integration uptime"]].map(([v, l]) => (
            <div key={l}><dt className="text-2xl font-semibold tracking-tight text-white">{v}</dt><dd className="mt-1 text-sm text-zinc-500">{l}</dd></div>
          ))}
        </dl>
        <Link href="/integrations" className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-6 py-3 text-sm text-zinc-200 transition hover:bg-white/[0.05]">
          Browse integrations <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </Section>
  )
}