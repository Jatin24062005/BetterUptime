import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { UptimeStats } from "@/components/uptime-stats"
import { Integrations } from "@/components/integrations"
import { MonitoringFeatures } from "@/components/monitoring-features"
import { Features } from "@/components/features"
import { Pricing } from "@/components/pricing"
import { Testimonials } from "@/components/testimonials"
import { FAQ } from "@/components/faq"
import { CTA } from "@/components/cta"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <div className="min-h-screen bg-[#07090b] text-white antialiased selection:bg-[#34e0a1]/30">
      <Header />
      <main>
        <Hero />
        <UptimeStats />
        <Integrations />
        <MonitoringFeatures />
        <Features />
        <Pricing />
        <Testimonials />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}