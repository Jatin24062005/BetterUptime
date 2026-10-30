import { Star } from "lucide-react"
import Link from "next/link"
import { Panel, Section, SectionHead } from "@/components/ui-kit"

const items = [
  { name: "Sarah Johnson", role: "DevOps Engineer", company: "TechCorp", text: "The 30-second checks and instant alerts help us catch issues before they reach our users. The traceroute output is a huge help when debugging network problems." },
  { name: "Michael Chen", role: "CTO", company: "StartupXYZ", text: "We switched from our previous tool and haven’t looked back. SSL monitoring alone has saved us from multiple outages, and incident response is much smoother." },
  { name: "Emily Rodriguez", role: "Site Reliability Engineer", company: "CloudTech", text: "Global locations tell us our services are reachable worldwide, and the historical data helps us spot patterns and tune our infrastructure." },
  { name: "David Kim", role: "Full Stack Developer", company: "WebAgency", text: "Setup took under 10 minutes. The status pages look professional and our clients appreciate the transparency." },
  { name: "Lisa Thompson", role: "Operations Manager", company: "E-commerce Plus", text: "Cron monitoring ended silent backup failures for us, and the Slack integration keeps the team informed without noise." },
  { name: "Alex Martinez", role: "Lead Engineer", company: "FinTech Solutions", text: "Enterprise-grade monitoring at a fraction of the cost. API checks are robust, custom integrations work, and support is quick." },
]

export function Testimonials() {
  return (
    <Section>
      <SectionHead title="Trusted by developers worldwide" desc="What teams say about catching incidents earlier and fixing them faster." />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((t) => (
          <Panel key={t.name} className="flex flex-col p-6">
            <div className="flex gap-0.5" aria-label="5 out of 5 stars">
              {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />)}
            </div>
            <p className="mt-5 flex-1 leading-relaxed text-zinc-300">{t.text}</p>
            <div className="mt-6 flex items-center gap-3 border-t border-white/[0.07] pt-5">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-[#34e0a1]/10 text-sm font-medium text-[#34e0a1]">
                {t.name.split(" ").map((n) => n[0]).join("")}
              </span>
              <div>
                <p className="text-sm font-medium text-white">{t.name}</p>
                <p className="text-xs text-zinc-500">{t.role}, {t.company}</p>
              </div>
            </div>
          </Panel>
        ))}
      </div>

      <dl className="mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-8 text-center sm:grid-cols-4">
        {[["4.9/5", "Average rating"], ["50K+", "Customers"], ["99.9%", "Satisfaction"], ["24/7", "Support"]].map(([v, l]) => (
          <div key={l}><dt className="text-2xl font-semibold tracking-tight text-white">{v}</dt><dd className="mt-1 text-sm text-zinc-500">{l}</dd></div>
        ))}
      </dl>

      <Panel className="mx-auto mt-16 max-w-4xl p-8">
        <h3 className="text-2xl font-semibold tracking-tight text-white">How TechCorp cut downtime by 85%</h3>
        <div className="mt-8 grid gap-6 sm:grid-cols-3 sm:divide-x sm:divide-white/[0.07]">
          {[["85%", "Less downtime"], ["45%", "Faster incident response"], ["60%", "Lower cost than before"]].map(([v, l]) => (
            <div key={l} className="sm:px-6 sm:first:pl-0">
              <p className="text-4xl font-semibold tracking-tight text-[#34e0a1]">{v}</p>
              <p className="mt-2 text-sm text-zinc-400">{l}</p>
            </div>
          ))}
        </div>
        <Link href="#case-study" className="mt-8 inline-block text-sm font-medium text-[#34e0a1] hover:underline">Read the case study</Link>
      </Panel>
    </Section>
  )
}