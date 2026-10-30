import { Fragment } from "react"
import { Check } from "lucide-react"
import { Panel, Section, SectionHead } from "@/components/ui-kit"

const plans = [
  { name: "Free", price: "$0", per: "/forever", desc: "For personal projects", cta: "Get started free",
    features: ["10 monitors", "10 heartbeats", "3-minute checks", "Email alerts", "Status page", "30-day retention"] },
  { name: "Pro", price: "$29", per: "/month", desc: "For growing teams", cta: "Start free trial", popular: true,
    features: ["50 monitors", "50 heartbeats", "30-second checks", "Email, SMS and Slack alerts", "Custom status pages", "1-year retention", "API access", "Priority support"] },
  { name: "Business", price: "$79", per: "/month", desc: "For larger teams", cta: "Start free trial",
    features: ["200 monitors", "200 heartbeats", "10-second checks", "All alert channels", "White-label status pages", "2-year retention", "Full API access", "Dedicated support"] },
  { name: "Enterprise", price: "Custom", per: "", desc: "For specific requirements", cta: "Contact sales",
    features: ["Unlimited monitors", "5-second checks", "Custom branding", "SSO and SAML", "Audit logs", "On-premise option", "99.99% SLA", "24/7 dedicated support"] },
]

// [feature, first plan that includes it: 0 Free, 1 Pro, 2 Business, 3 Enterprise]
const table: [string, [string, number][]][] = [
  ["Monitoring", [["Website monitoring", 0], ["API monitoring", 0], ["SSL monitoring", 0], ["Domain monitoring", 1], ["Cron monitoring", 1], ["Transaction monitoring", 2]]],
  ["Alerting", [["Email alerts", 0], ["SMS alerts", 1], ["Slack integration", 1], ["PagerDuty integration", 1], ["Webhook alerts", 1], ["Custom escalation", 2]]],
  ["Platform", [["Status pages", 0], ["API access", 1], ["Team collaboration", 1], ["Custom branding", 2], ["SSO and SAML", 3], ["Audit logs", 3]]],
]

const faq = [
  ["Can I change plans anytime?", "Yes. Upgrades and downgrades take effect immediately and are prorated."],
  ["What happens to my data?", "It’s kept for your plan’s retention period. We never delete data without notice."],
  ["Is there a free trial?", "All paid plans include a 14-day trial. No credit card required."],
  ["Do you offer discounts?", "Annual billing is 20% off, with special rates for startups and non-profits."],
]

export function Pricing() {
  return (
    <Section id="pricing">
      <SectionHead title="Simple, transparent pricing" desc="Start free and upgrade when you need faster checks or more monitors. No hidden fees." />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {plans.map((p) => (
          <div key={p.name} className={`relative flex flex-col rounded-2xl border p-7 ${p.popular ? "border-[#34e0a1]/40 bg-[#34e0a1]/[0.04] shadow-[0_0_60px_-20px_rgba(52,224,161,0.4)]" : "border-white/[0.07] bg-white/[0.02]"}`}>
            {p.popular && <span className="absolute right-5 top-5 rounded-full bg-[#34e0a1] px-3 py-1 text-xs font-medium text-black">Most popular</span>}
            <h3 className="text-lg font-medium text-white">{p.name}</h3>
            <p className="mt-1 text-sm text-zinc-500">{p.desc}</p>
            <p className="mt-6 text-4xl font-semibold tracking-tight text-white">{p.price}<span className="ml-1 text-base font-normal text-zinc-500">{p.per}</span></p>
            <ul className="mt-8 flex-1 space-y-3">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm text-zinc-300"><Check className="mt-0.5 h-4 w-4 shrink-0 text-[#34e0a1]" />{f}</li>
              ))}
            </ul>
            <button className={`mt-8 h-11 w-full rounded-xl text-sm font-medium transition ${p.popular ? "bg-white text-black hover:bg-zinc-200" : "border border-white/10 text-white hover:bg-white/[0.06]"}`}>{p.cta}</button>
          </div>
        ))}
      </div>

      <Panel className="mt-20 overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-white/[0.07] text-left text-zinc-400">
              <th className="px-6 py-4 font-medium">Compare plans</th>
              {plans.map((p) => <th key={p.name} className="px-6 py-4 text-center font-medium text-white">{p.name}</th>)}
            </tr>
          </thead>
          <tbody>
            {table.map(([cat, rows]) => (
              <Fragment key={cat}>
                <tr><td colSpan={5} className="bg-white/[0.03] px-6 py-3 text-zinc-400">{cat}</td></tr>
                {rows.map(([name, min]) => (
                  <tr key={name} className="border-t border-white/[0.05]">
                    <td className="px-6 py-3 text-zinc-300">{name}</td>
                    {plans.map((p, i) => (
                      <td key={p.name} className="px-6 py-3 text-center">
                        {i >= min ? <Check className="mx-auto h-4 w-4 text-[#34e0a1]" aria-label="Included" /> : <span className="text-zinc-700" aria-label="Not included">—</span>}
                      </td>
                    ))}
                  </tr>
                ))}
              </Fragment>
            ))}
          </tbody>
        </table>
      </Panel>

      <Panel className="mt-12 grid gap-8 p-8 sm:grid-cols-2">
        {faq.map(([q, a]) => (
          <div key={q}><h4 className="font-medium text-white">{q}</h4><p className="mt-2 text-sm leading-relaxed text-zinc-400">{a}</p></div>
        ))}
      </Panel>
    </Section>
  )
}