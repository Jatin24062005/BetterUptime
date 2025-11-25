"use client"

import { useEffect, useState, useRef, useLayoutEffect } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

type UptimeData = {
  date: string
  uptime: number
  responseTime: number
  incidents: number
}

// Generate realistic uptime data for the last 30 days
const generateUptimeData = () => {
  const data: UptimeData[] = []
  const now = new Date()

  for (let i = 29; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
    const uptime = Math.random() < 0.95 ? 99.9 + Math.random() * 0.1 : 98.5 + Math.random() * 1.4
    const responseTime = 50 + Math.random() * 200

    data.push({
      date: date.toISOString().split("T")[0],
      uptime: Number(uptime.toFixed(2)),
      responseTime: Number(responseTime.toFixed(0)),
      incidents: Math.random() < 0.1 ? 1 : 0,
    })
  }

  return data
}

export function UptimeStats() {
  const [uptimeData, setUptimeData] = useState<UptimeData[]>([])
  const [responseTimeData, setResponseTimeData] = useState<UptimeData[]>([])

  const sectionRef = useRef<HTMLElement | null>(null)
  const headingRef = useRef<HTMLHeadingElement | null>(null)
  const descRef = useRef<HTMLParagraphElement | null>(null)
  const uptimeCardRef = useRef<HTMLDivElement | null>(null)
  const responseCardRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const data = generateUptimeData()
    setUptimeData(data)
    setResponseTimeData(data)
  }, [])

  // GSAP animations
  useLayoutEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
        defaults: { ease: "power3.out", duration: 0.9 },
      })

      tl.from(headingRef.current, { y: 30, opacity: 0 })
        .from(descRef.current, { y: 20, opacity: 0 }, "-=0.4")
        .from(
          [uptimeCardRef.current, responseCardRef.current],
          {
            y: 40,
            opacity: 0,
            scale: 0.97,
            stagger: 0.15,
          },
          "-=0.3"
        )

      // status cards stagger
      if (sectionRef.current) {
        const statusCards = sectionRef.current.querySelectorAll("[data-status-card]")
        gsap.from(statusCards, {
          y: 30,
          opacity: 0,
          stagger: 0.1,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
          },
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const averageUptime =
    uptimeData.length > 0
      ? (uptimeData.reduce((sum, item) => sum + item.uptime, 0) / uptimeData.length).toFixed(2)
      : "99.9"

  const averageResponseTime =
    responseTimeData.length > 0
      ? Math.round(responseTimeData.reduce((sum, item) => sum + item.responseTime, 0) / responseTimeData.length)
      : "125"

  return (
    <section ref={sectionRef} className="py-24 bg-[#0f1419] max-w-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2
            ref={headingRef}
            className="text-3xl sm:text-4xl font-bold text-white mb-6"
          >
            Real-time monitoring insights
          </h2>
          <p
            ref={descRef}
            className="text-xl text-gray-400 max-w-3xl mx-auto"
          >
            Track your website performance with detailed analytics and historical data. See exactly when issues occur
            and how quickly they&apos;re resolved.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Uptime Chart */}
          <Card
            ref={uptimeCardRef}
            className="bg-[#1a1f2e] border-gray-800"
          >
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                Uptime Percentage
                <span className="text-2xl font-bold text-green-400">{averageUptime}%</span>
              </CardTitle>
              <CardDescription className="text-gray-400">Last 30 days uptime monitoring data</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  uptime: {
                    label: "Uptime %",
                    color: "#22c55e",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={uptimeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis
                      dataKey="date"
                      stroke="#9ca3af"
                      fontSize={12}
                      tickFormatter={(value) => new Date(value).getDate().toString()}
                    />
                    <YAxis stroke="#9ca3af" fontSize={12} domain={[98, 100]} />
                    <ChartTooltip
                      content={<ChartTooltipContent />}
                      contentStyle={{
                        backgroundColor: "#1a1f2e",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                        color: "#ffffff",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="uptime"
                      stroke="#22c55e"
                      strokeWidth={2}
                      dot={{ fill: "#22c55e", strokeWidth: 0, r: 4 }}
                      activeDot={{ r: 6, stroke: "#22c55e", strokeWidth: 2, fill: "#0f1419" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Response Time Chart */}
          <Card
            ref={responseCardRef}
            className="bg-[#1a1f2e] border-gray-800"
          >
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                Response Time
                <span className="text-2xl font-bold text-blue-400">{averageResponseTime}ms</span>
              </CardTitle>
              <CardDescription className="text-gray-400">Average response time over the last 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  responseTime: {
                    label: "Response Time (ms)",
                    color: "#3b82f6",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={responseTimeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis
                      dataKey="date"
                      stroke="#9ca3af"
                      fontSize={12}
                      tickFormatter={(value) => new Date(value).getDate().toString()}
                    />
                    <YAxis stroke="#9ca3af" fontSize={12} />
                    <ChartTooltip
                      content={<ChartTooltipContent />}
                      contentStyle={{
                        backgroundColor: "#1a1f2e",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                        color: "#ffffff",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="responseTime"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={{ fill: "#3b82f6", strokeWidth: 0, r: 4 }}
                      activeDot={{ r: 6, stroke: "#3b82f6", strokeWidth: 2, fill: "#0f1419" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Status Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            className="bg-[#1a1f2e] border border-gray-800 rounded-lg p-6 text-center"
            data-status-card
          >
            <div className="text-3xl font-bold text-green-400 mb-2">99.97%</div>
            <div className="text-gray-400 mb-2">This Month</div>
            <div className="w-full bg-gray-800 rounded-full h-2">
              <div className="bg-green-400 h-2 rounded-full" style={{ width: "99.97%" }}></div>
            </div>
          </div>

          <div
            className="bg-[#1a1f2e] border border-gray-800 rounded-lg p-6 text-center"
            data-status-card
          >
            <div className="text-3xl font-bold text-blue-400 mb-2">2.3s</div>
            <div className="text-gray-400 mb-2">Avg Response</div>
            <div className="flex items-center justify-center space-x-1">
              <div className="text-green-400 text-sm">↓ 12%</div>
              <div className="text-gray-500 text-sm">vs last month</div>
            </div>
          </div>

          <div
            className="bg-[#1a1f2e] border border-gray-800 rounded-lg p-6 text-center"
            data-status-card
          >
            <div className="text-3xl font-bold text-yellow-400 mb-2">3</div>
            <div className="text-gray-400 mb-2">Incidents</div>
            <div className="flex items-center justify-center space-x-1">
              <div className="text-red-400 text-sm">↑ 1</div>
              <div className="text-gray-500 text-sm">vs last month</div>
            </div>
          </div>

          <div
            className="bg-[#1a1f2e] border border-gray-800 rounded-lg p-6 text-center"
            data-status-card
          >
            <div className="text-3xl font-bold text-purple-400 mb-2">47min</div>
            <div className="text-gray-400 mb-2">Total Downtime</div>
            <div className="flex items-center justify-center space-x-1">
              <div className="text-green-400 text-sm">↓ 23min</div>
              <div className="text-gray-500 text-sm">vs last month</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
