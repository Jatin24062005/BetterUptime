"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, AreaChart, Area } from "recharts"
import {
  ArrowLeft,
  Globe,
  Activity,
  Zap,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  Settings,
  Pause,
  Play,
  MoreHorizontal,
  Bell,
  User,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  MapPin,
  Shield,
  Camera,
  Download,
} from "lucide-react"

// Mock data for the monitor
const monitorData = {
  id: "1",
  name: "example.com",
  url: "https://example.com",
  status: "up",
  responseTime: 124,
  uptime: 99.97,
  lastChecked: "30 seconds ago",
  location: "US East",
  type: "HTTPS",
  isActive: true,
  createdAt: "2024-01-15",
  checkInterval: 30,
  timeout: 30,
  sslExpiry: "2024-04-15",
  incidents: 2,
  totalChecks: 15420,
}

// Generate mock response time data for the last 24 hours
const generateResponseTimeData = () => {
  const data = []
  const now = new Date()

  for (let i = 23; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000)
    const baseResponseTime = 120
    const variation = Math.random() * 100 - 50
    const responseTime = Math.max(50, baseResponseTime + variation)

    data.push({
      time: time.toISOString(),
      responseTime: Math.round(responseTime),
      uptime: Math.random() > 0.05 ? 100 : 0,
      hour: time.getHours(),
    })
  }

  return data
}

// Generate uptime data for the last 30 days
const generateUptimeData = () => {
  const data = []
  const now = new Date()

  for (let i = 29; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
    const uptime = Math.random() < 0.95 ? 99.9 + Math.random() * 0.1 : 98.5 + Math.random() * 1.4

    data.push({
      date: date.toISOString().split("T")[0],
      uptime: Number(uptime.toFixed(2)),
      day: date.getDate(),
    })
  }

  return data
}

const recentIncidents = [
  {
    id: 1,
    type: "HTTP 500 Error",
    duration: "2m 15s",
    timestamp: "2 hours ago",
    resolved: true,
  },
  {
    id: 2,
    type: "High Response Time",
    duration: "5m 30s",
    timestamp: "1 day ago",
    resolved: true,
  },
]

type ResponseTimeData = {
  time: string
  responseTime: number
  uptime: number
  hour: number
}

type UptimeData = {
  date: string
  uptime: number
  day: number
}

export default function WebsiteDetailsPage() {
  const [responseTimeData, setResponseTimeData] = useState<ResponseTimeData[]>([])
  const [uptimeData, setUptimeData] = useState<UptimeData[]>([])
  const [timeRange, setTimeRange] = useState("24h")

  useEffect(() => {
    setResponseTimeData(generateResponseTimeData())
    setUptimeData(generateUptimeData())
  }, [])

  const averageResponseTime =
    responseTimeData.length > 0
      ? Math.round(responseTimeData.reduce((sum, item) => sum + item.responseTime, 0) / responseTimeData.length)
      : 124

  const currentUptime =
    uptimeData.length > 0
      ? (uptimeData.reduce((sum, item) => sum + item.uptime, 0) / uptimeData.length).toFixed(2)
      : "99.97"

  return (
    <div className="min-h-screen bg-[#0f1419] relative overflow-hidden">
      {/* Premium Vignette Glow Background */}
      <div className="absolute inset-0">
        {/* Main vignette effect */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(circle at 50% 30%, 
                rgba(99, 102, 241, 0.12) 0%, 
                rgba(99, 102, 241, 0.06) 25%, 
                rgba(15, 20, 25, 0.95) 60%, 
                rgba(15, 20, 25, 1) 100%
              )
            `,
          }}
        />

        {/* Animated glow orbs */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-[#6366f1]/8 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 right-1/4 w-80 h-80 bg-green-500/6 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/3 right-0 w-72 h-72 bg-purple-500/6 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "0.5s" }}
        ></div>

        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-3"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-gray-800/50 bg-[#1a1f2e]/30 backdrop-blur-xl sticky top-0">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <Link
              href="/dashboard"
              className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors group"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Dashboard</span>
            </Link>
            <div className="w-px h-6 bg-gray-700"></div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded-sm flex items-center justify-center">
                <div className="w-6 h-6 bg-[#1a1f2e] rounded-sm flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-sm"></div>
                </div>
              </div>
              <span className="text-xl font-bold text-white">Better Stack</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              <Bell className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  <User className="h-4 w-4 mr-2" />
                  Cameron
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-[#1a1f2e]/90 backdrop-blur-xl border-gray-800/50">
                <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-gray-800/50">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-800/50" />
                <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-gray-800/50">
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 p-6 max-w-7xl mx-auto">
        {/* Monitor Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div
                className={`w-4 h-4 rounded-full ${monitorData.status === "up" ? "bg-green-500" : "bg-red-500"} animate-pulse`}
              ></div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">{monitorData.name}</h1>
                <div className="flex items-center space-x-4 text-gray-400">
                  <div className="flex items-center space-x-2">
                    <Globe className="h-4 w-4" />
                    <span>{monitorData.url}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <span>{monitorData.location}</span>
                  </div>
                  <Badge variant="outline" className="border-gray-700 text-gray-400">
                    {monitorData.type}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                className="border-gray-700 text-gray-300 hover:bg-gray-800/50 hover:text-white bg-transparent"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Visit Site
              </Button>
              <Button
                variant="outline"
                className="border-gray-700 text-gray-300 hover:bg-gray-800/50 hover:text-white bg-transparent"
              >
                {monitorData.isActive ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                {monitorData.isActive ? "Pause" : "Resume"}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="border-gray-700 text-gray-300 hover:bg-gray-800/50 hover:text-white bg-transparent"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-[#1a1f2e]/90 backdrop-blur-xl border-gray-800/50">
                  <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-gray-800/50">
                    <Settings className="h-4 w-4 mr-2" />
                    Configure
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-gray-800/50">
                    <Camera className="h-4 w-4 mr-2" />
                    Screenshots
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-gray-800/50">
                    <Download className="h-4 w-4 mr-2" />
                    Export Data
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Status Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-[#1a1f2e]/60 backdrop-blur-xl border-gray-800/50 hover:border-gray-700/50 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Status</p>
                    <p
                      className={`text-2xl font-bold ${monitorData.status === "up" ? "text-green-400" : "text-red-400"}`}
                    >
                      {monitorData.status === "up" ? "Online" : "Offline"}
                    </p>
                  </div>
                  {monitorData.status === "up" ? (
                    <CheckCircle className="h-8 w-8 text-green-400" />
                  ) : (
                    <AlertTriangle className="h-8 w-8 text-red-400" />
                  )}
                </div>
                <div className="flex items-center mt-2 text-sm">
                  <span className="text-gray-400">Last checked: {monitorData.lastChecked}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#1a1f2e]/60 backdrop-blur-xl border-gray-800/50 hover:border-gray-700/50 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Response Time</p>
                    <p className="text-2xl font-bold text-white">{monitorData.responseTime}ms</p>
                  </div>
                  <Zap className="h-8 w-8 text-yellow-400" />
                </div>
                <div className="flex items-center mt-2 text-sm">
                  <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
                  <span className="text-green-400">12ms faster than average</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#1a1f2e]/60 backdrop-blur-xl border-gray-800/50 hover:border-gray-700/50 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Uptime (30d)</p>
                    <p className="text-2xl font-bold text-white">{currentUptime}%</p>
                  </div>
                  <Activity className="h-8 w-8 text-blue-400" />
                </div>
                <div className="flex items-center mt-2 text-sm">
                  <TrendingDown className="h-4 w-4 text-red-400 mr-1" />
                  <span className="text-red-400">-0.03% this week</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#1a1f2e]/60 backdrop-blur-xl border-gray-800/50 hover:border-gray-700/50 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">SSL Certificate</p>
                    <p className="text-2xl font-bold text-white">Valid</p>
                  </div>
                  <Shield className="h-8 w-8 text-green-400" />
                </div>
                <div className="flex items-center mt-2 text-sm">
                  <span className="text-gray-400">Expires: {monitorData.sslExpiry}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Charts and Details */}
        <Tabs defaultValue="overview" className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList className="bg-[#1a1f2e]/60 backdrop-blur-xl border border-gray-800/50">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-gray-800/50 data-[state=active]:text-white"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="performance"
                className="data-[state=active]:bg-gray-800/50 data-[state=active]:text-white"
              >
                Performance
              </TabsTrigger>
              <TabsTrigger
                value="incidents"
                className="data-[state=active]:bg-gray-800/50 data-[state=active]:text-white"
              >
                Incidents
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                className="data-[state=active]:bg-gray-800/50 data-[state=active]:text-white"
              >
                Settings
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center space-x-2">
              <Button
                variant={timeRange === "24h" ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeRange("24h")}
                className={
                  timeRange === "24h"
                    ? "bg-[#6366f1] hover:bg-[#5855eb]"
                    : "border-gray-700 text-gray-300 hover:bg-gray-800/50"
                }
              >
                24h
              </Button>
              <Button
                variant={timeRange === "7d" ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeRange("7d")}
                className={
                  timeRange === "7d"
                    ? "bg-[#6366f1] hover:bg-[#5855eb]"
                    : "border-gray-700 text-gray-300 hover:bg-gray-800/50"
                }
              >
                7d
              </Button>
              <Button
                variant={timeRange === "30d" ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeRange("30d")}
                className={
                  timeRange === "30d"
                    ? "bg-[#6366f1] hover:bg-[#5855eb]"
                    : "border-gray-700 text-gray-300 hover:bg-gray-800/50"
                }
              >
                30d
              </Button>
            </div>
          </div>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Response Time Chart */}
              <Card className="bg-[#1a1f2e]/60 backdrop-blur-xl border-gray-800/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    Response Time (24h)
                    <span className="text-lg font-normal text-gray-400">{averageResponseTime}ms avg</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      responseTime: {
                        label: "Response Time (ms)",
                        color: "#6366f1",
                      },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={responseTimeData}>
                        <defs>
                          <linearGradient id="responseTimeGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="hour" stroke="#9ca3af" fontSize={12} tickFormatter={(value) => `${value}:00`} />
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
                        <Area
                          type="monotone"
                          dataKey="responseTime"
                          stroke="#6366f1"
                          strokeWidth={2}
                          fill="url(#responseTimeGradient)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Uptime Chart */}
              <Card className="bg-[#1a1f2e]/60 backdrop-blur-xl border-gray-800/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    Uptime (30 days)
                    <span className="text-lg font-normal text-gray-400">{currentUptime}%</span>
                  </CardTitle>
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
                        <XAxis dataKey="day" stroke="#9ca3af" fontSize={12} />
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
                          strokeWidth={3}
                          dot={{ fill: "#22c55e", strokeWidth: 0, r: 4 }}
                          activeDot={{ r: 6, stroke: "#22c55e", strokeWidth: 2, fill: "#0f1419" }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>

            {/* Monitor Details */}
            <Card className="bg-[#1a1f2e]/60 backdrop-blur-xl border-gray-800/50">
              <CardHeader>
                <CardTitle className="text-white">Monitor Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-gray-400 text-sm">URL</p>
                      <p className="text-white font-medium">{monitorData.url}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Monitor Type</p>
                      <p className="text-white font-medium">{monitorData.type}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Check Interval</p>
                      <p className="text-white font-medium">{monitorData.checkInterval} seconds</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-gray-400 text-sm">Timeout</p>
                      <p className="text-white font-medium">{monitorData.timeout} seconds</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Location</p>
                      <p className="text-white font-medium">{monitorData.location}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Created</p>
                      <p className="text-white font-medium">{monitorData.createdAt}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-gray-400 text-sm">Total Checks</p>
                      <p className="text-white font-medium">{monitorData.totalChecks.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Incidents</p>
                      <p className="text-white font-medium">{monitorData.incidents}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Status</p>
                      <Badge
                        className={
                          monitorData.isActive
                            ? "bg-green-900/50 text-green-400 border-green-700"
                            : "bg-red-900/50 text-red-400 border-red-700"
                        }
                      >
                        {monitorData.isActive ? "Active" : "Paused"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="bg-[#1a1f2e]/60 backdrop-blur-xl border-gray-800/50">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-white mb-2">{averageResponseTime}ms</div>
                  <div className="text-gray-400 mb-4">Average Response Time</div>
                  <div className="text-sm text-green-400">↓ 15% from last week</div>
                </CardContent>
              </Card>
              <Card className="bg-[#1a1f2e]/60 backdrop-blur-xl border-gray-800/50">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-white mb-2">45ms</div>
                  <div className="text-gray-400 mb-4">Fastest Response</div>
                  <div className="text-sm text-gray-400">Today at 3:42 AM</div>
                </CardContent>
              </Card>
              <Card className="bg-[#1a1f2e]/60 backdrop-blur-xl border-gray-800/50">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-white mb-2">289ms</div>
                  <div className="text-gray-400 mb-4">Slowest Response</div>
                  <div className="text-sm text-gray-400">Yesterday at 2:15 PM</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="incidents" className="space-y-4">
            {recentIncidents.map((incident) => (
              <Card key={incident.id} className="bg-[#1a1f2e]/60 backdrop-blur-xl border-gray-800/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <div>
                        <h3 className="text-white font-semibold">{incident.type}</h3>
                        <p className="text-gray-400 text-sm">Duration: {incident.duration}</p>
                      </div>
                      <Badge variant="outline" className="border-green-700 text-green-400">
                        Resolved
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-400 text-sm">{incident.timestamp}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="bg-[#1a1f2e]/60 backdrop-blur-xl border-gray-800/50">
              <CardHeader>
                <CardTitle className="text-white">Monitor Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-gray-400">
                  Configure your monitor settings, alert preferences, and notification channels here.
                </div>
                <Button className="bg-[#6366f1] hover:bg-[#5855eb] text-white">
                  <Settings className="h-4 w-4 mr-2" />
                  Configure Monitor
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
