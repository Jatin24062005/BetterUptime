"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Play, ArrowRight } from "lucide-react"

export function Hero() {
  const [email, setEmail] = useState("")
  const [currentFeature, setCurrentFeature] = useState(0)

  const features = [
    "99.9% uptime SLA guaranteed",
    "30-second monitoring intervals",
    "Global monitoring locations",
    "Instant alert notifications",
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [features.length])

  return (
    <section className="pt-32 pb-20 bg-[#0f1419] relative overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-[#6366f1]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <Badge variant="outline" className="border-gray-700 text-gray-300 mb-6 px-4 py-2">
            <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
            Trusted by 50,000+ websites worldwide
          </Badge>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-8 leading-tight text-white">
            The most reliable
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300">
              uptime monitoring
            </span>
          </h1>

          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Get 10 monitors, 10 heartbeats and a status page
            <br />
            with 3-minute checks totally free.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8 max-w-lg mx-auto">
            <input
              type="email"
              placeholder="Your work e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full sm:flex-1 px-4 py-3 bg-[#1a1f2e] border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:border-transparent transition-all"
            />
            <Button
              className="w-full sm:w-auto bg-[#6366f1] hover:bg-[#5855eb] text-white px-8 py-3 rounded-md font-medium whitespace-nowrap transition-all hover:scale-105"
              asChild
            >
              <Link href="/signup">
                Get started in 30 seconds
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-8">
            <Button
              variant="outline"
              className="border-gray-700 text-gray-300 hover:bg-gray-800/50 hover:text-white px-6 py-2 bg-transparent"
            >
              <Play className="mr-2 h-4 w-4" />
              Watch 2-min demo
            </Button>
            <p className="text-gray-500 text-sm">
              Looking for an enterprise solution?{" "}
              <a href="#" className="text-gray-400 hover:text-white underline transition-colors">
                Book a demo
              </a>
            </p>
          </div>

          {/* Rotating features */}
          <div className="mb-12">
            <div className="h-8 flex items-center justify-center">
              <p className="text-gray-400 transition-all duration-500">{features[currentFeature]}</p>
            </div>
          </div>
        </div>

        {/* Dashboard Preview */}
        <div className="max-w-5xl mx-auto">
          <div className="bg-[#1a1f2e] rounded-lg border border-gray-800 overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-[#151a23]">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 bg-white rounded-sm flex items-center justify-center">
                    <div className="w-3 h-3 bg-[#1a1f2e] rounded-sm"></div>
                  </div>
                  <span className="text-white font-medium">Uptime Dashboard</span>
                </div>
              </div>
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
                <div className="flex items-center space-x-2 text-gray-400 p-2 rounded border border-gray-800">
                  <div className="w-4 h-4 border border-gray-600 rounded"></div>
                  <span className="text-sm">Monitors</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-400 p-2 rounded border border-gray-800">
                  <div className="w-4 h-4 border border-gray-600 rounded"></div>
                  <span className="text-sm">Heartbeats</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-400 p-2 rounded border border-gray-800">
                  <div className="w-4 h-4 border border-gray-600 rounded"></div>
                  <span className="text-sm">On-call</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-400 p-2 rounded border border-gray-800">
                  <div className="w-4 h-4 border border-gray-600 rounded"></div>
                  <span className="text-sm">Incidents</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-400 p-2 rounded border border-gray-800">
                  <div className="w-4 h-4 border border-gray-600 rounded"></div>
                  <span className="text-sm">Status pages</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-[#0f1419] rounded-lg p-4 border border-gray-800">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-white font-medium">example.com</span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <span>Up</span>
                      <span>•</span>
                      <span>Checked every 30 seconds</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <span>⚠️ Send a test alert</span>
                    <span>📊 Incidents</span>
                    <span>⏸️ Pause this monitor</span>
                    <span>⚙️ Configure</span>
                    <div className="ml-auto">
                      <span>🎥 Cameron is currently on-call</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#0f1419] rounded-lg p-4 border border-gray-800">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-white font-medium">api.example.com</span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <span>Up</span>
                      <span>•</span>
                      <span>Response time: 124ms</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <span>🔍 View logs</span>
                    <span>📈 Performance</span>
                    <span>🔧 Settings</span>
                  </div>
                </div>

                <div className="bg-[#0f1419] rounded-lg p-4 border border-gray-800">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-white font-medium">staging.example.com</span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <span className="text-red-400">Down</span>
                      <span>•</span>
                      <span>Last checked 2 minutes ago</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <span className="text-red-400">🚨 Alert sent</span>
                    <span>📸 Screenshot taken</span>
                    <span>🔍 Error logs</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust indicators */}
        <div className="mt-16 text-center">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">99.99%</div>
              <div className="text-gray-400 text-sm">Uptime SLA</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">30s</div>
              <div className="text-gray-400 text-sm">Check interval</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">15+</div>
              <div className="text-gray-400 text-sm">Global locations</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">50K+</div>
              <div className="text-gray-400 text-sm">Websites monitored</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
