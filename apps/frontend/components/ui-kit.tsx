import { ReactNode } from "react"

export function Panel({ className = "", children }: { className?: string; children: ReactNode }) {
  return <div className={`rounded-2xl border border-white/[0.07] bg-white/[0.02] ${className}`}>{children}</div>
}

export function StatStrip({ items }: { items: { label: string; value: string; unit?: string; sub: string }[] }) {
  return (
    <Panel className="grid grid-cols-2 overflow-hidden lg:grid-cols-4 lg:divide-x lg:divide-white/[0.07]">
      {items.map((i) => (
        <div key={i.label} className="p-5 text-left sm:p-6">
          <p className="text-sm text-zinc-500">{i.label}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-white">
            {i.value}
            {i.unit && <span className="ml-1 text-base font-normal text-zinc-500">{i.unit}</span>}
          </p>
          <p className="mt-2 text-xs text-zinc-500">{i.sub}</p>
        </div>
      ))}
    </Panel>
  )
}

export function Bars({ up = 9, dots = 20, tone = "up" }: { up?: number; dots?: number; tone?: "up" | "down" | "wait" }) {
  const c = { up: "bg-[#34e0a1]", down: "bg-red-400", wait: "bg-amber-400" }[tone]
  return (
    <div className="flex items-center gap-[3px]" aria-hidden>
      {Array.from({ length: dots }).map((_, i) => <span key={i} className="h-1 w-1 rounded-full bg-white/10" />)}
      {Array.from({ length: up }).map((_, i) => <span key={i} className={`h-6 w-1 rounded-full ${c}`} />)}
    </div>
  )
}

export function SectionHead({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="mx-auto mb-14 max-w-2xl text-center">
      <h2 className="text-balance text-3xl font-semibold tracking-tight text-white sm:text-5xl">{title}</h2>
      <p className="mt-5 text-pretty text-lg leading-relaxed text-zinc-400">{desc}</p>
    </div>
  )
}

export const Section = ({ id, children }: { id?: string; children: ReactNode }) => (
  <section id={id} className="relative py-24 sm:py-28">
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">{children}</div>
  </section>
)
 
export function Logo({ size = "md" }: { size?: "md" | "lg" }) {
  const s = size === "lg" ? "h-9 w-9" : "h-8 w-8"
  return (
    <span className="flex items-center gap-2.5">
      <span className={`grid ${s} place-items-center rounded-xl bg-gradient-to-br from-emerald-300 to-teal-500 shadow-[0_0_24px_-4px_rgba(52,211,153,0.6)]`}>
        <span className="h-3 w-3 rounded-full bg-[#06100d]" />
      </span>
      <span className="text-lg font-semibold tracking-tight text-white">BetterUptime</span>
    </span>
  )
}
 