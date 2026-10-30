"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Cookies from "js-cookie"
import { ChevronDown, Menu, X } from "lucide-react"
import { Logo } from "@/components/ui-kit"

const menus = {
  Platform: [
    { name: "Uptime Monitoring", href: "#uptime", desc: "Monitor websites and APIs 24/7" },
    { name: "Error Tracking", href: "#errors", desc: "Track and debug application errors" },
    { name: "Log Management", href: "#logs", desc: "Centralized log collection and analysis" },
    { name: "Status Pages", href: "#status", desc: "Beautiful public status pages" },
  ],
  Community: [
    { name: "Discord", href: "#discord", desc: "Join our community" },
    { name: "GitHub", href: "#github", desc: "Open source projects" },
    { name: "Blog", href: "#blog", desc: "Latest updates and tutorials" },
    { name: "Newsletter", href: "#newsletter", desc: "Monthly product updates" },
  ],
  Company: [
    { name: "About Us", href: "#about", desc: "Learn more about our mission" },
    { name: "Careers", href: "#careers", desc: "Join our growing team" },
    { name: "Press Kit", href: "#press", desc: "Media resources and assets" },
    { name: "Contact", href: "#contact", desc: "Get in touch with us" },
  ],
}
const links = [["Documentation", "#docs"], ["Pricing", "#pricing"], ["Enterprise", "#enterprise"]]
const nav = "rounded-lg px-3 py-2 text-sm text-zinc-400 transition hover:text-white"

export function Header() {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState<string | null>(null)
  const [token, setToken] = useState<string | undefined>()
  useEffect(() => setToken(Cookies.get("token")), [])

  const signOut = () => { Cookies.remove("token"); setToken(undefined) }

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.06] bg-[#07090b]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" aria-label="BetterUptime home"><Logo /></Link>

        <nav className="hidden items-center gap-1 md:flex">
          {Object.entries(menus).map(([label, items]) => (
            <div key={label} className="relative" onMouseEnter={() => setActive(label)} onMouseLeave={() => setActive(null)}>
              <button className={`${nav} flex items-center gap-1`} aria-expanded={active === label}
                onFocus={() => setActive(label)}>
                {label}<ChevronDown className={`h-3.5 w-3.5 transition ${active === label ? "rotate-180" : ""}`} />
              </button>
              {active === label && (
                <div className="absolute left-0 top-full w-72 pt-2">
                  <div className="rounded-2xl border border-white/[0.08] bg-[#0b0e11] p-2 shadow-2xl">
                    {items.map((i) => (
                      <Link key={i.name} href={i.href} className="block rounded-xl px-3 py-2.5 transition hover:bg-white/[0.05]">
                        <p className="text-sm font-medium text-white">{i.name}</p>
                        <p className="text-xs text-zinc-500">{i.desc}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
          {links.map(([n, h]) => <Link key={n} href={h} className={nav}>{n}</Link>)}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {token ? (
            <>
              <Link href="/" onClick={signOut} className={`${nav} hover:text-rose-400`}>Sign out</Link>
              <Link href="/dashboard" className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-zinc-200">Dashboard</Link>
            </>
          ) : (
            <>
              <Link href="/signin" className={nav}>Sign in</Link>
              <Link href="/signup" className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-zinc-200">Sign up</Link>
            </>
          )}
        </div>

        <button className="text-zinc-300 md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="max-h-[calc(100vh-4rem)] overflow-y-auto border-t border-white/[0.06] px-4 py-4 md:hidden">
          {Object.entries(menus).map(([label, items]) => (
            <div key={label} className="mb-4">
              <p className="px-2 text-xs text-zinc-500">{label}</p>
              {items.map((i) => <Link key={i.name} href={i.href} onClick={() => setOpen(false)} className="block px-2 py-2 text-zinc-300">{i.name}</Link>)}
            </div>
          ))}
          {links.map(([n, h]) => <Link key={n} href={h} onClick={() => setOpen(false)} className="block px-2 py-2 text-zinc-300">{n}</Link>)}
          <div className="mt-4 grid grid-cols-2 gap-2">
            {token ? (
              <>
                <Link href="/" onClick={signOut} className="rounded-xl border border-white/10 py-2.5 text-center text-sm text-zinc-200">Sign out</Link>
                <Link href="/dashboard" className="rounded-xl bg-white py-2.5 text-center text-sm font-medium text-black">Dashboard</Link>
              </>
            ) : (
              <>
                <Link href="/signin" className="rounded-xl border border-white/10 py-2.5 text-center text-sm text-zinc-200">Sign in</Link>
                <Link href="/signup" className="rounded-xl bg-white py-2.5 text-center text-sm font-medium text-black">Sign up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}