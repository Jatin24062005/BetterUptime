import { Shield, Globe, Clock, Zap, Users, Database, Bell, BarChart3, Lock } from "lucide-react"
import { Panel, Section, SectionHead } from "@/components/ui-kit"

const main = [
  { icon: Shield, title: "From SSL to domain expiry", desc: "Web pages, APIs, ping, SSL, domain expiry, POP3, IMAP, SMTP and DNS, all in one place.", items: ["SSL certificates", "Domain expiry alerts", "DNS validation", "Email server checks"] },
  { icon: Globe, title: "30s checks worldwide", desc: "A screenshot of the error and a second-by-second timeline from 15+ locations.", items: ["15+ locations", "30-second intervals", "Error screenshots", "Performance metrics"] },
  { icon: Clock, title: "Cron monitoring", desc: "Never lose a backup again. Get alerted when a cron job or serverless worker doesn’t run.", items: ["Cron job tracking", "Serverless workers", "Backup verification", "Scheduled task alerts"] },
]
const more = [
  { icon: Zap, title: "Performance", desc: "Response times, page load speed and core web vitals for every endpoint." },
  { icon: Users, title: "Team collaboration", desc: "Share dashboards, set permissions and coordinate incident response." },
  { icon: Database, title: "API monitoring", desc: "REST, GraphQL and database checks with custom authentication." },
  { icon: Bell, title: "Smart alerting", desc: "Email, SMS, Slack, PagerDuty or webhook, routed by severity." },
  { icon: BarChart3, title: "Analytics", desc: "Historical data, trend analysis and custom reports." },
  { icon: Lock, title: "Enterprise security", desc: "SSO, audit logs and SOC 2 compliant controls." },
]

export function Features() {
  return (
    <Section>
      <SectionHead title="Everything you need to keep services up"
        desc="Monitoring tools built to be fast, quiet when things are fine, and loud when they aren’t." />
      <div className="grid gap-4 md:grid-cols-3">
        {main.map((f) => (
          <Panel key={f.title} className="flex flex-col p-7">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#34e0a1]/10 text-[#34e0a1]"><f.icon className="h-5 w-5" /></span>
            <h3 className="mt-6 text-xl font-semibold tracking-tight text-white">{f.title}</h3>
            <p className="mt-3 leading-relaxed text-zinc-400">{f.desc}</p>
            <ul className="mt-6 space-y-2 border-t border-white/[0.07] pt-6 text-sm text-zinc-400">
              {f.items.map((i) => <li key={i} className="flex items-center gap-2"><span className="h-1 w-1 rounded-full bg-[#34e0a1]" />{i}</li>)}
            </ul>
          </Panel>
        ))}
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {more.map((f) => (
          <Panel key={f.title} className="p-6">
            <f.icon className="h-5 w-5 text-zinc-400" />
            <h4 className="mt-4 font-medium text-white">{f.title}</h4>
            <p className="mt-2 text-sm leading-relaxed text-zinc-400">{f.desc}</p>
          </Panel>
        ))}
      </div>
    </Section>
  )
}