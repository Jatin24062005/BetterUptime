"use client"

import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

const integrations = [
  { name: "CloudFlare", icon: "☁️", x: 20, y: 15, category: "CDN" },
  { name: "GitHub", icon: "🐙", x: 80, y: 20, category: "Version Control" },
  { name: "Vercel", icon: "▲", x: 15, y: 60, category: "Hosting" },
  { name: "AWS", icon: "📦", x: 85, y: 70, category: "Cloud" },
  { name: "Docker", icon: "🐳", x: 50, y: 25, category: "Container" },
  { name: "Kubernetes", icon: "⚙️", x: 70, y: 45, category: "Orchestration" },
  { name: "Grafana", icon: "📊", x: 25, y: 80, category: "Monitoring" },
  { name: "Prometheus", icon: "🔥", x: 60, y: 75, category: "Metrics" },
  { name: "Datadog", icon: "🐕", x: 40, y: 15, category: "APM" },
  { name: "New Relic", icon: "🔄", x: 75, y: 25, category: "APM" },
  { name: "Sentry", icon: "👁️", x: 30, y: 45, category: "Error Tracking" },
  { name: "Slack", icon: "💬", x: 90, y: 50, category: "Communication" },
]

const popularIntegrations = [
  { name: "Datadog", description: "APM and infrastructure monitoring", logo: "🐕", users: "10K+" },
  { name: "New Relic", description: "Application performance monitoring", logo: "🔄", users: "8K+" },
  { name: "Grafana", description: "Open source analytics platform", logo: "📊", users: "12K+" },
  { name: "Prometheus", description: "Systems monitoring toolkit", logo: "🔥", users: "9K+" },
  { name: "Slack", description: "Team communication platform", logo: "💬", users: "25K+" },
  { name: "PagerDuty", description: "Digital operations management", logo: "📟", users: "7K+" },
]

export function Integrations() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const icons = container.querySelectorAll(".floating-icon")

    icons.forEach((icon, index) => {
      const element = icon as HTMLElement
      const delay = index * 0.5

      element.style.animationDelay = `${delay}s`
      element.classList.add("animate-float")
    })
  }, [])

  return (
    <section className="py-24 bg-[#0f1419] relative overflow-hidden">
      <div ref={containerRef} className="absolute inset-0 opacity-20">
        {integrations.map((integration, index) => (
          <div
            key={index}
            className="floating-icon absolute w-16 h-16 bg-gray-800/30 rounded-lg flex items-center justify-center text-2xl border border-gray-700/30 hover:bg-gray-700/40 transition-all duration-500"
            style={{
              left: `${integration.x}%`,
              top: `${integration.y}%`,
              transform: "translate(-50%, -50%)",
            }}
            title={`${integration.name} - ${integration.category}`}
          >
            {integration.icon}
          </div>
        ))}
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-white">
            Connect your existing
            <br />
            stack in 5 minutes
          </h2>

          <p className="text-xl text-gray-400 mb-12 leading-relaxed max-w-3xl mx-auto">
            Plug in the services you already use including Datadog,
            <br />
            New Relic, Grafana, Prometheus, Zabbix, Azure, AWS &
            <br />
            Google Cloud. Seamless integration with your workflow.
          </p>

          <Button
            variant="outline"
            className="bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800/50 hover:text-white px-8 py-4 rounded-md text-lg font-medium transition-all hover:scale-105"
          >
            Browse integrations
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>

        {/* Popular Integrations Grid */}
        <div className="mt-24">
          <h3 className="text-2xl font-bold text-white text-center mb-12">Popular integrations trusted by thousands</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularIntegrations.map((integration, index) => (
              <div
                key={index}
                className="bg-[#1a1f2e] border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-all duration-300 hover:scale-105 group"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center text-2xl group-hover:bg-gray-700 transition-colors">
                    {integration.logo}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-white font-semibold">{integration.name}</h4>
                      <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">{integration.users}</span>
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed">{integration.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Integration Stats */}
        <div className="mt-16 text-center">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">150+</div>
              <div className="text-gray-400">Integrations available</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">5min</div>
              <div className="text-gray-400">Average setup time</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">99.9%</div>
              <div className="text-gray-400">Integration uptime</div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translate(-50%, -50%) translateY(0px); }
          50% { transform: translate(-50%, -50%) translateY(-10px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </section>
  )
}
