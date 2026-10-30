import Link from "next/link"
import { ArrowRight, Check } from "lucide-react"
import { Section } from "@/components/ui-kit"

export function CTA() {
  return (
    <Section>
      <div className="relative overflow-hidden rounded-[32px] border border-white/[0.08] bg-[#0a0d0f] px-6 py-20 text-center sm:px-16">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_90%_at_50%_100%,rgba(52,224,161,0.22),transparent_70%)]" />
        <div className="relative mx-auto max-w-2xl">
          <h2 className="text-balance text-4xl font-semibold tracking-tight text-white sm:text-5xl">Start monitoring your websites today</h2>
          <p className="mt-5 text-lg text-zinc-400">Add your first monitor in under a minute. Free for up to 10 monitors.</p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/signup" className="inline-flex h-12 items-center gap-2 rounded-xl bg-[#34e0a1] px-7 font-medium text-[#04120c] shadow-[0_8px_30px_-8px_rgba(52,224,161,0.6)] transition hover:bg-[#6beebd]">
              Start free trial <ArrowRight className="h-4 w-4" />
            </Link>
            <button className="h-12 rounded-xl border border-white/10 px-7 text-zinc-200 transition hover:bg-white/[0.05]">Schedule demo</button>
          </div>
          <ul className="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-zinc-400">
            {["14-day free trial", "No credit card required", "Cancel anytime"].map((t) => (
              <li key={t} className="flex items-center gap-2"><Check className="h-4 w-4 text-[#34e0a1]" />{t}</li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  )
}