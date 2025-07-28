"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"

const tracerouteSteps = [
  { step: 1, text: "Start: 2024-04-17T16:53:02+0000", type: "header" },
  { step: 2, text: "HOST: uptime-edge-us-east-2.uptime-edge_worker-us-east", type: "host" },
  { step: 3, text: "|-- 172.18.0.1", type: "hop" },
  { step: 4, text: "|-- 10.204.6.12", type: "hop" },
  { step: 5, text: "|-- 10.204.35.59", type: "hop" },
  { step: 6, text: "|-- 10.204.64.37", type: "hop" },
  { step: 7, text: "|-- lo0-0.gw3.atl1.us.linode.com", type: "hop" },
  { step: 8, text: "|-- ae48.r11.atl01.ien.netarch.akamai.com", type: "hop" },
  { step: 9, text: "|-- atl-b24-link.ip.twelve99.net", type: "hop" },
  { step: 10, text: "|-- atl-bb2-link.ip.twelve99.net", type: "hop" },
  { step: 11, text: "|-- ash-bb2-link.ip.twelve99.net", type: "hop" },
]

export function MonitoringFeatures() {
  const [activeTab, setActiveTab] = useState("traceroute")
  const [selectedRegion, setSelectedRegion] = useState("us-east")

  const regions = [
    { id: "us-east", name: "🇺🇸 United States", flag: "🇺🇸" },
    { id: "eu-west", name: "🇪🇺 Europe", flag: "🇪🇺" },
    { id: "asia", name: "🇯🇵 Asia Pacific", flag: "🇯🇵" },
    { id: "australia", name: "🇦🇺 Australia", flag: "🇦🇺" },
  ]

  const statusChecks = [
    { status: "working", label: "Working", count: 847, color: "bg-blue-600" },
    { status: "working", label: "Working", count: 723, color: "bg-blue-600" },
    { status: "error", label: "Error", count: 1, color: "bg-red-600" },
  ]

  return (
    <section className="py-24 bg-[#0f1419]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* First Feature Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
          {/* Terminal/Traceroute Section */}
          <div className="order-2 lg:order-1">
            <div className="bg-[#1a1f2e] rounded-lg border border-gray-800 overflow-hidden shadow-2xl">
              <div className="flex items-center space-x-4 p-4 border-b border-gray-800 bg-[#151a23]">
                <button
                  className={`px-3 py-1 rounded text-sm transition-all ${
                    activeTab === "traceroute" ? "bg-[#2a3441] text-gray-300" : "text-gray-500 hover:text-gray-300"
                  }`}
                  onClick={() => setActiveTab("traceroute")}
                >
                  Traceroute
                </button>
                <button
                  className={`px-3 py-1 rounded text-sm transition-all ${
                    activeTab === "mtr" ? "bg-[#2a3441] text-gray-300" : "text-gray-500 hover:text-gray-300"
                  }`}
                  onClick={() => setActiveTab("mtr")}
                >
                  MTR
                </button>
                <button
                  className={`px-3 py-1 rounded text-sm transition-all ${
                    activeTab === "ssl" ? "bg-[#2a3441] text-gray-300" : "text-gray-500 hover:text-gray-300"
                  }`}
                  onClick={() => setActiveTab("ssl")}
                >
                  SSL certificates
                </button>
                <button
                  className={`px-3 py-1 rounded text-sm transition-all ${
                    activeTab === "curl" ? "bg-[#2a3441] text-gray-300" : "text-gray-500 hover:text-gray-300"
                  }`}
                  onClick={() => setActiveTab("curl")}
                >
                  cURL
                </button>
              </div>

              <div className="p-4">
                <div className="flex items-center space-x-4 mb-4">
                  <select
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                    className="bg-[#2a3441] text-gray-300 text-sm border border-gray-700 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {regions.map((region) => (
                      <option key={region.id} value={region.id}>
                        {region.name}
                      </option>
                    ))}
                  </select>
                  <Badge variant="outline" className="border-gray-700 text-gray-400 text-xs">
                    Live data
                  </Badge>
                </div>

                <div className="font-mono text-sm space-y-1 max-h-80 overflow-y-auto">
                  {tracerouteSteps.map((step, index) => (
                    <div key={index} className="text-gray-500 hover:bg-gray-800/30 px-2 py-1 rounded transition-colors">
                      <span className="text-gray-600 mr-4 w-6 inline-block text-right">{step.step}</span>
                      <span className="text-gray-400">{step.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <Badge variant="outline" className="border-gray-700 text-gray-400 mb-4">
              Network Diagnostics
            </Badge>
            <h3 className="text-3xl sm:text-4xl font-bold text-white mb-6">Traceroute & MTR for timeouts</h3>
            <p className="text-gray-400 text-lg leading-relaxed mb-8">
              Understand connection timeouts and request
              <br />
              timeouts with edge-based traceroute and
              <br />
              MTR outputs. Debug network issues instantly.
            </p>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-gray-300">Real-time network path analysis</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="text-gray-300">Multi-region traceroute capabilities</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span className="text-gray-300">Automatic timeout detection</span>
              </div>
            </div>
          </div>
        </div>

        {/* Second Feature Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
          <div>
            <Badge variant="outline" className="border-gray-700 text-gray-400 mb-4">
              Error Analysis
            </Badge>
            <h3 className="text-3xl sm:text-4xl font-bold text-white mb-6">Screenshots & error logs</h3>
            <p className="text-gray-400 text-lg leading-relaxed mb-8">
              We record your API's error message and take a
              <br />
              screenshot of your website being down so that you
              <br />
              know exactly what happened. Never miss the details.
            </p>

            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                {statusChecks.map((check, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className={`w-8 h-8 ${check.color} rounded-full flex items-center justify-center`}>
                      <span className="text-white text-xs">{check.status === "error" ? "✗" : "✓"}</span>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-400">{check.label}</div>
                      <div className="text-xs text-gray-500">{check.count}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-[#1a1f2e] border border-gray-800 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-2">Latest Error Details</div>
                <div className="font-mono text-xs text-red-400 bg-[#0f1419] p-3 rounded">
                  HTTP 500 Internal Server Error
                  <br />
                  Connection timeout after 30s
                  <br />
                  Screenshot captured at 14:32:15 UTC
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="bg-[#1a1f2e] rounded-lg border border-gray-800 p-6 shadow-2xl">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center">
                  <span className="text-white">🎭</span>
                </div>
                <div>
                  <span className="text-white font-medium">Playwright</span>
                  <div className="text-gray-400 text-sm">Browser automation</div>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Page Load</span>
                    <span className="text-green-400">2.3s</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded">
                    <div
                      className="h-2 bg-green-400 rounded transition-all duration-1000"
                      style={{ width: "75%" }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">DOM Content</span>
                    <span className="text-blue-400">1.8s</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded">
                    <div
                      className="h-2 bg-blue-400 rounded transition-all duration-1000"
                      style={{ width: "60%" }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">First Paint</span>
                    <span className="text-purple-400">0.9s</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded">
                    <div
                      className="h-2 bg-purple-400 rounded transition-all duration-1000"
                      style={{ width: "30%" }}
                    ></div>
                  </div>
                </div>
              </div>

              <h4 className="text-white font-semibold mb-3">Playwright transaction monitoring</h4>
              <p className="text-gray-400 text-sm leading-relaxed">
                We test all vital interactions by running a real
                <br />
                Chrome browser instance, with a full-fledged
                <br />
                JavaScript runtime. Catch issues users actually face.
              </p>
            </div>
          </div>
        </div>

        {/* Third Feature Row - SSL Monitoring */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1">
            <div className="bg-[#1a1f2e] rounded-lg border border-gray-800 p-6">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-white font-semibold">SSL Certificate Status</h4>
                <Badge variant="outline" className="border-green-700 text-green-400 bg-green-900/20">
                  Valid
                </Badge>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-400 mb-1">Issued To</div>
                    <div className="text-white font-mono">example.com</div>
                  </div>
                  <div>
                    <div className="text-gray-400 mb-1">Issued By</div>
                    <div className="text-white font-mono">Let's Encrypt</div>
                  </div>
                  <div>
                    <div className="text-gray-400 mb-1">Valid From</div>
                    <div className="text-white font-mono">Jan 15, 2024</div>
                  </div>
                  <div>
                    <div className="text-gray-400 mb-1">Expires</div>
                    <div className="text-white font-mono">Apr 15, 2024</div>
                  </div>
                </div>

                <div className="bg-[#0f1419] p-4 rounded-lg border border-gray-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400 text-sm">Certificate expires in</span>
                    <span className="text-orange-400 font-semibold">23 days</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <div className="bg-orange-400 h-2 rounded-full" style={{ width: "25%" }}></div>
                  </div>
                </div>

                <div className="text-xs text-gray-400">⚠️ Renewal reminder will be sent in 7 days</div>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <Badge variant="outline" className="border-gray-700 text-gray-400 mb-4">
              Security Monitoring
            </Badge>
            <h3 className="text-3xl sm:text-4xl font-bold text-white mb-6">SSL Certificate monitoring</h3>
            <p className="text-gray-400 text-lg leading-relaxed mb-8">
              Never let your SSL certificates expire again. Get automatic
              <br />
              alerts before expiration and monitor certificate health
              <br />
              across all your domains and subdomains.
            </p>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-gray-300">Automatic certificate discovery</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span className="text-gray-300">Expiration alerts (30, 7, 1 day)</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="text-gray-300">Certificate chain validation</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
