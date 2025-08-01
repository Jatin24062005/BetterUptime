import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Plus, Settings, Bell, BarChart3 } from "lucide-react"

const steps = [
  {
    step: "01",
    icon: Plus,
    title: "Add Your Website",
    description:
      "Simply enter your website URL and configure monitoring settings. Set up checks for HTTP, HTTPS, ping, port, and keyword monitoring.",
    color: "from-green-400 to-green-600",
  },
  {
    step: "02",
    icon: Settings,
    title: "Configure Monitoring",
    description:
      "Choose monitoring frequency, locations, and alert thresholds. Set up custom headers, authentication, and advanced monitoring rules.",
    color: "from-blue-400 to-blue-600",
  },
  {
    step: "03",
    icon: Bell,
    title: "Receive Alerts",
    description:
      "Get instant notifications via email, SMS, Slack, or webhook when issues are detected. Configure escalation rules and team notifications.",
    color: "from-purple-400 to-purple-600",
  },
  {
    step: "04",
    icon: BarChart3,
    title: "Analyze Performance",
    description:
      "View detailed reports, uptime statistics, and performance metrics. Track trends and identify patterns to optimize your infrastructure.",
    color: "from-orange-400 to-orange-600",
  },
]

export function HowItWorks() {
  return (
    <section className="py-24 bg-black">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">How It Works</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Get started with website monitoring in minutes. Our simple 4-step process ensures you&apos;re protected from the
            moment you sign up.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 relative">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <Card className="bg-gray-900/50 border-gray-800 hover:border-gray-700 transition-all duration-300 h-full">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4">
                    <div
                      className={`w-16 h-16 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center`}
                    >
                      <step.icon className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <div className="text-sm font-mono text-gray-400 mb-2">STEP {step.step}</div>
                  <CardTitle className="text-white text-xl">{step.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-gray-300 text-base leading-relaxed">
                    {step.description}
                  </CardDescription>
                </CardContent>
              </Card>

              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <ArrowRight className="h-8 w-8 text-gray-600" />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-8 p-8 rounded-2xl bg-gradient-to-r from-gray-900 to-gray-800 border border-gray-700">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">30 seconds</div>
              <div className="text-gray-300">Setup time</div>
            </div>
            <div className="w-px h-12 bg-gray-700"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">15+</div>
              <div className="text-gray-300">Global locations</div>
            </div>
            <div className="w-px h-12 bg-gray-700"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">24/7</div>
              <div className="text-gray-300">Monitoring</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
