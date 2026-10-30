import Link from "next/link"
import { Github, Linkedin, Mail, Twitter } from "lucide-react"
import { Logo } from "@/components/ui-kit"

const cols = {
  Product: ["Website Monitoring", "API Monitoring", "SSL Monitoring", "Cron Monitoring", "Status Pages", "Integrations"],
  Company: ["About Us", "Careers", "Blog", "Press Kit", "Partners", "Contact"],
  Resources: ["Documentation", "API Reference", "Help Center", "Community", "Tutorials", "Webinars"],
  Legal: ["Privacy Policy", "Terms of Service", "Cookie Policy", "GDPR", "Security", "Compliance"],
}
const slug = (s: string) => "#" + s.toLowerCase().replace(/\s+/g, "-")

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06]">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_repeat(4,1fr)]">
          <div>
            <Logo />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-zinc-500">Website monitoring that tells you when something breaks, and shows you why.</p>
            <div className="mt-6 flex gap-4 text-zinc-500">
              {[Twitter, Github, Linkedin, Mail].map((I, i) => (
                <Link key={i} href="#" aria-label="Social link" className="transition hover:text-white"><I className="h-5 w-5" /></Link>
              ))}
            </div>
          </div>
          {Object.entries(cols).map(([title, items]) => (
            <div key={title}>
              <h3 className="text-sm font-medium text-white">{title}</h3>
              <ul className="mt-4 space-y-3">
                {items.map((n) => <li key={n}><Link href={slug(n)} className="text-sm text-zinc-500 transition hover:text-white">{n}</Link></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] pt-8 text-sm text-zinc-600 md:flex-row">
          <p>© {new Date().getFullYear()} BetterUptime. All rights reserved.</p>
          <p className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#34e0a1]" />All systems operational</p>
        </div>
      </div>
    </footer>
  )
}