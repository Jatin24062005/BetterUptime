import { Shield, Globe, Clock, Zap, Users, Database, Bell, BarChart3, Lock } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const mainFeatures = [
  {
    icon: Shield,
    title: "From SSL to domain expiration",
    description:
      "Monitor everything. Whether it's your web page, API, ping, SSL, domain expiration, POP3, IMAP, SMTP, DNS, or generic network monitoring. We've got you covered.",
    features: [
      "SSL Certificate Monitoring",
      "Domain Expiration Alerts",
      "DNS Record Validation",
      "Email Server Monitoring",
    ],
  },
  {
    icon: Globe,
    title: "30s checks from around the world",
    description:
      "Get a screenshot of the error and a second-by-second timeline with our fastest 30-second checks from 15+ global locations.",
    features: ["15+ Global Locations", "30-second Check Intervals", "Error Screenshots", "Performance Metrics"],
  },
  {
    icon: Clock,
    title: "Cron monitoring",
    description:
      "Never lose a database backup again. Track your CRON jobs and serverless workers and get alerted if they don't run correctly.",
    features: ["CRON Job Tracking", "Serverless Monitoring", "Backup Verification", "Scheduled Task Alerts"],
  },
]

const additionalFeatures = [
  {
    icon: Zap,
    title: "Performance Monitoring",
    description: "Track response times, page load speeds, and core web vitals across all your endpoints.",
    color: "text-yellow-400",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Share dashboards, manage user permissions, and coordinate incident response with your team.",
    color: "text-green-400",
  },
  {
    icon: Database,
    title: "API Monitoring",
    description: "Monitor REST APIs, GraphQL endpoints, and database connections with custom authentication.",
    color: "text-blue-400",
  },
  {
    icon: Bell,
    title: "Smart Alerting",
    description: "Get notified via email, SMS, Slack, PagerDuty, or webhook with intelligent alert routing.",
    color: "text-purple-400",
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Deep insights with historical data, trend analysis, and customizable reporting dashboards.",
    color: "text-cyan-400",
  },
  {
    icon: Lock,
    title: "Enterprise Security",
    description: "SOC 2 compliant with SSO, audit logs, and enterprise-grade security features.",
    color: "text-red-400",
  },
]

export function Features() {
  return (
    <section className="py-24 bg-[#0f1419]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Features */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="border-gray-700 text-gray-400 mb-6">
            Core Features
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Everything you need to monitor your infrastructure
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Comprehensive monitoring tools designed to keep your applications running smoothly with enterprise-grade
            reliability and performance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-24">
          {mainFeatures.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-gray-800 rounded-lg flex items-center justify-center mx-auto mb-6 hover:bg-gray-700 transition-colors">
                <feature.icon className="h-8 w-8 text-gray-400" />
              </div>

              <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>

              <p className="text-gray-400 leading-relaxed mb-6">{feature.description}</p>

              <div className="space-y-2">
                {feature.features.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex items-center justify-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-gray-500 rounded-full"></div>
                    <span className="text-sm text-gray-500">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Additional Features Grid */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-white text-center mb-12">Advanced capabilities for modern teams</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {additionalFeatures.map((feature, index) => (
              <div
                key={index}
                className="bg-[#1a1f2e] border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-all duration-300 hover:scale-105 group"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div
                    className={`w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center group-hover:bg-gray-700 transition-colors`}
                  >
                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <h4 className="text-white font-semibold">{feature.title}</h4>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Feature Stats */}
        <div className="text-center">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">15+</div>
              <div className="text-gray-400">Monitoring types</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">30s</div>
              <div className="text-gray-400">Fastest checks</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">99.9%</div>
              <div className="text-gray-400">Platform uptime</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">24/7</div>
              <div className="text-gray-400">Support available</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
