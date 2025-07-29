"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Cookies from "js-cookie";
import {
  Plus,
  Search,
  MoreHorizontal,
  Globe,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Settings,
  Pause,
  BarChart3,
  Bell,
  User,
  LogOut,
  ChevronDown,
  ExternalLink,
  Camera,
  Zap,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import axios from "axios";
import { BACKEND_URL } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { url } from "inspector";


const monitors = [
  {
    id: 1,
    name: "example.com",
    url: "https://example.com",
    status: "up",
    responseTime: 124,
    uptime: 99.97,
    lastChecked: "2 minutes ago",
    location: "US East",
    type: "HTTP",
    incidents: 0,
  },
  {
    id: 2,
    name: "api.example.com",
    url: "https://api.example.com/health",
    status: "up",
    responseTime: 89,
    uptime: 99.99,
    lastChecked: "1 minute ago",
    location: "EU West",
    type: "API",
    incidents: 0,
  },
  {
    id: 3,
    name: "staging.example.com",
    url: "https://staging.example.com",
    status: "down",
    responseTime: 0,
    uptime: 98.45,
    lastChecked: "5 minutes ago",
    location: "US West",
    type: "HTTP",
    incidents: 2,
  },
  {
    id: 4,
    name: "cdn.example.com",
    url: "https://cdn.example.com",
    status: "up",
    responseTime: 45,
    uptime: 99.95,
    lastChecked: "30 seconds ago",
    location: "Global",
    type: "CDN",
    incidents: 0,
  },
];

const heartbeats = [
  {
    id: 1,
    name: "Database Backup",
    schedule: "Daily at 2:00 AM",
    status: "healthy",
    lastPing: "23 hours ago",
    grace: "5 minutes",
  },
  {
    id: 2,
    name: "Email Service",
    schedule: "Every 15 minutes",
    status: "healthy",
    lastPing: "12 minutes ago",
    grace: "30 minutes",
  },
  {
    id: 3,
    name: "Log Processor",
    schedule: "Every hour",
    status: "late",
    lastPing: "2 hours ago",
    grace: "10 minutes",
  },
];

const recentIncidents = [
  {
    id: 1,
    monitor: "staging.example.com",
    type: "HTTP 500 Error",
    duration: "5m 23s",
    resolved: false,
    timestamp: "2 minutes ago",
  },
  {
    id: 2,
    monitor: "api.example.com",
    type: "High Response Time",
    duration: "2m 15s",
    resolved: true,
    timestamp: "1 hour ago",
  },
];

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("monitors");
  const [isAddWebsiteOpen, setIsAddWebsiteOpen] = useState(false);
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [websiteName, setWebsiteName] = useState("");
  const [monitorType, setMonitorType] = useState("HTTP");
  const [checkInterval, setCheckInterval] = useState("30");
  const router = useRouter();
  const [websites, setWebsites] = useState();

  const token = Cookies.get("token");

  const handleSignout = async () => {
    Cookies.remove("token");
    toast.success("SignOut Successfully !");
    router.push("/");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "up":
      case "healthy":
        return "text-green-400";
      case "down":
        return "text-red-400";
      case "late":
        return "text-yellow-400";
      default:
        return "text-gray-400";
    }
  };

  const getStatusDot = (status: string) => {
    switch (status) {
      case "UP":
      case "healthy":
        return "bg-green-500";
      case "down":
        return "bg-red-500";
      case "late":
        case "checking":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  const handleAddWebsite = async (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically make an API call to add the monitor
    console.log("Adding website:", {
      websiteUrl,
      websiteName,
      monitorType,
      checkInterval,
    });

    try {
      const res = await axios.post(
        `${BACKEND_URL}/website`,
        { url: websiteUrl }, // <-- This is the data body
        {
          headers: {
            "Content-Type": "application/json",
            authorization: token,
          },
        }
      );

      console.log("Added Website Response :", res);
      toast.success("Added Website", {
        description: `${websiteName} Added Successfully with Url !`,
      });
    } catch (error) {
      console.log("Failed to Add Website !");
      toast.error("Something went wrong!");
    }

    // Reset form and close modal
    setWebsiteUrl("");
    setWebsiteName("");
    setMonitorType("HTTP");
    setCheckInterval("30");
    setIsAddWebsiteOpen(false);
  };

  const filteredWebsites = (websites || []).filter((w) =>
    w.url.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const fetchWebsites = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/websites`, {
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
      });

      const resWebsites = Array.isArray(res.data.websites)
      ? res.data.websites
      : Object.values(res.data.websites || {});

    
      setWebsites(
        resWebsites.map((w: any) => ({
          id: w.id,
          url: w.url,
          status: w.ticks[0] ? w.tick[0].status : "checking",
          responseTime: w.ticks[0] ? w.tick[0].responseTime : 0,
          lastChecked: w.ticks[0]
            ? new Date(w.ticks[0].createdAt).toLocaleString
            : Date.now().toLocaleString(),
        }))
      );
      console.log("Website fetched SUccessfully !");
      console.log("user websites : ", res.data);
    } catch (e) {
      console.log("Error while fetching websites : ", e);
    }
  };

  useEffect(() => {
    fetchWebsites();
  }, []);

  return (
    <div className="min-h-screen bg-[#0f1419]">
      {/* Header */}
      <header className="border-b border-gray-800 bg-[#1a1f2e]/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded-sm flex items-center justify-center">
                <div className="w-6 h-6 bg-[#1a1f2e] rounded-sm flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-sm"></div>
                </div>
              </div>
              <span className="text-xl font-bold text-white">Better Stack</span>
            </Link>
            <Badge
              variant="outline"
              className="border-gray-700 text-gray-400 text-xs"
            >
              Pro Plan
            </Badge>
          </div>

          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white"
            >
              <Bell className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-gray-400 ">
                  <User className="h-4 w-4 mr-2" />
                  Cameron
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-[#1a1f2e] border-gray-800"
              >
                <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-gray-800">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-gray-800">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Analytics
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-800" />
                <DropdownMenuItem
                  className="text-gray-300 hover:text-white hover:bg-gray-800"
                  onClick={handleSignout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 border-r border-gray-800 bg-[#1a1f2e]/30 min-h-screen">
          <nav className="p-4 space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-start text-white bg-gray-800/50 hover:bg-gray-800"
            >
              <Activity className="h-4 w-4 mr-3" />
              Dashboard
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-400 hover:text-white hover:bg-gray-800"
            >
              <Globe className="h-4 w-4 mr-3" />
              Monitors
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start text-gray-400 hover:text-white hover:bg-gray-800"
            >
              <BarChart3 className="h-4 w-4 mr-3" />
              Status Pages
            </Button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-[#1a1f2e] border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Monitors</p>
                    <p className="text-2xl font-bold text-white">{websites?.length}</p>
                  </div>
                  <Globe className="h-8 w-8 text-blue-400" />
                </div>
                <div className="flex items-center mt-2 text-sm">
                  <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
                  <span className="text-green-400">+2 this month</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#1a1f2e] border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Average Uptime</p>
                    <p className="text-2xl font-bold text-white">99.84%</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-400" />
                </div>
                <div className="flex items-center mt-2 text-sm">
                  <TrendingDown className="h-4 w-4 text-red-400 mr-1" />
                  <span className="text-red-400">-0.13% this week</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#1a1f2e] border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Avg Response Time</p>
                    <p className="text-2xl font-bold text-white">89ms</p>
                  </div>
                  <Zap className="h-8 w-8 text-yellow-400" />
                </div>
                <div className="flex items-center mt-2 text-sm">
                  <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
                  <span className="text-green-400">12ms faster</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#1a1f2e] border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Active Incidents</p>
                    <p className="text-2xl font-bold text-white">1</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-red-400" />
                </div>
                <div className="flex items-center mt-2 text-sm">
                  <span className="text-gray-400">staging.example.com</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Dashboard Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <TabsList className="bg-[#1a1f2e] border border-gray-800">
                <TabsTrigger
                  value="monitors"
                  className="data-[state=active]:bg-gray-800 text-gray-400 data-[state=active]:text-white"
                >
                  <Globe className="h-4 w-4 mr-2" />
                  Monitors
                </TabsTrigger>
                {/* <TabsTrigger
                  value="heartbeats"
                  className="data-[state=active]:bg-gray-800 text-gray-400 data-[state=active]:text-white"
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Heartbeats
                </TabsTrigger>
                <TabsTrigger
                  value="incidents"
                  className="data-[state=active]:bg-gray-800 text-gray-400 data-[state=active]:text-white"
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Incidents
                </TabsTrigger> */}
              </TabsList>

              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Search monitors..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-[#1a1f2e] border-gray-800 text-white placeholder-gray-500 focus:border-[#6366f1]"
                  />
                </div>
                <Dialog
                  open={isAddWebsiteOpen}
                  onOpenChange={setIsAddWebsiteOpen}
                >
                  <DialogTrigger asChild>
                    <Button className="bg-[#6366f1] hover:bg-[#5855eb] text-white">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Website
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-[#1a1f2e] border-gray-800 text-white max-w-md">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-semibold">
                        Add New Website Monitor
                      </DialogTitle>
                      <DialogDescription className="text-gray-400">
                        Enter the details for your new website monitor. We'll
                        start checking it immediately.
                      </DialogDescription>
                    </DialogHeader>

                    <form
                      onSubmit={handleAddWebsite}
                      className="space-y-4 mt-4"
                    >
                      <div className="space-y-2">
                        <Label
                          htmlFor="websiteUrl"
                          className="text-sm font-medium text-gray-300"
                        >
                          Website URL *
                        </Label>
                        <Input
                          id="websiteUrl"
                          type="url"
                          placeholder="https://example.com"
                          value={websiteUrl}
                          onChange={(e) => setWebsiteUrl(e.target.value)}
                          className="bg-[#0f1419] border-gray-700 text-white placeholder-gray-500 focus:border-[#6366f1]"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="websiteName"
                          className="text-sm font-medium text-gray-300"
                        >
                          Display Name
                        </Label>
                        <Input
                          id="websiteName"
                          type="text"
                          placeholder="My Website"
                          value={websiteName}
                          onChange={(e) => setWebsiteName(e.target.value)}
                          className="bg-[#0f1419] border-gray-700 text-white placeholder-gray-500 focus:border-[#6366f1]"
                        />
                        <p className="text-xs text-gray-500">
                          Leave empty to use the domain name
                        </p>
                      </div>

                      <div className="flex items-center justify-end space-x-3 pt-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsAddWebsiteOpen(false)}
                          className="border-gray-700 bg-primary text-gray-300 hover:bg-gray-800 hover:text-white"
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          className="bg-[#6366f1] hover:bg-[#5855eb] text-white"
                          disabled={!websiteUrl}
                        >
                          Add Monitor
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <TabsContent value="monitors" className="space-y-4">
              {filteredWebsites.map((website) => (
                <Card
                  key={website.id}
                  className="bg-[#1a1f2e] border-gray-800 hover:border-gray-700 transition-colors"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-3 h-3 rounded-full ${getStatusDot(website.status)} animate-pulse`}
                        ></div>
                        <div>
                          <h3 className="text-white font-semibold text-lg">
                            {new URL(website.url).hostname}
                          </h3>
                          <p className="text-gray-400 text-sm">{website.url}</p>
                        </div>
                        <Badge
                          variant="outline"
                          className="border-gray-700 text-gray-400 text-xs"
                        >
                          HTTP
                        </Badge>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p
                            className={`text-sm font-medium ${getStatusColor(website.status)}`}
                          >
                            {website.status === "up"
                              ? "Up"
                              : website.status === "down"
                                ? "Down"
                                : "Checking"}
                          </p>
                          <p className="text-gray-400 text-xs">
                            {website.status === "up"
                              ? `${website.responseTime}ms`
                              : "Timeout"}
                          </p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-gray-400 hover:text-white"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="bg-[#1a1f2e] border-gray-800"
                          >
                            <Link href={website.url} target="_blank">
                            <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-gray-800">
                              <ExternalLink/>
                              Visit Site
                            </DropdownMenuItem></Link>
                            <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-gray-800">
                              <BarChart3 className="h-4 w-4 mr-2" />
                              View Analytics
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-gray-800">
                              <Pause className="h-4 w-4 mr-2" />
                              Pause Monitor
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400">Last Checked</p>
                        <p className="text-white font-medium">
                          {website.lastChecked}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400">Response Time</p>
                        <p className="text-white font-medium">
                          {website.responseTime} ms
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400">Status</p>
                        <p className="text-white font-medium">
                          {website.status}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="heartbeats" className="space-y-4">
              {heartbeats.map((heartbeat) => (
                <Card
                  key={heartbeat.id}
                  className="bg-[#1a1f2e] border-gray-800 hover:border-gray-700 transition-colors"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-3 h-3 rounded-full ${getStatusDot(heartbeat.status)} animate-pulse`}
                        ></div>
                        <div>
                          <h3 className="text-white font-semibold">
                            {heartbeat.name}
                          </h3>
                          <p className="text-gray-400 text-sm">
                            {heartbeat.schedule}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p
                            className={`text-sm font-medium ${getStatusColor(heartbeat.status)}`}
                          >
                            {heartbeat.status === "healthy"
                              ? "Healthy"
                              : "Late"}
                          </p>
                          <p className="text-gray-400 text-xs">
                            Grace: {heartbeat.grace}
                          </p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-gray-400 hover:text-white"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="bg-[#1a1f2e] border-gray-800"
                          >
                            <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-gray-800">
                              <Settings className="h-4 w-4 mr-2" />
                              Configure
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-gray-800">
                              <Pause className="h-4 w-4 mr-2" />
                              Pause
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    <div className="mt-4 text-sm text-gray-400">
                      Last ping: {heartbeat.lastPing}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="incidents" className="space-y-4">
              {recentIncidents.map((incident) => (
                <Card
                  key={incident.id}
                  className="bg-[#1a1f2e] border-gray-800"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-3 h-3 rounded-full ${incident.resolved ? "bg-green-500" : "bg-red-500"}`}
                        ></div>
                        <div>
                          <h3 className="text-white font-semibold">
                            {incident.monitor}
                          </h3>
                          <p className="text-gray-400 text-sm">
                            {incident.type}
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            incident.resolved
                              ? "border-green-700 text-green-400"
                              : "border-red-700 text-red-400"
                          }`}
                        >
                          {incident.resolved ? "Resolved" : "Active"}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <p className="text-white text-sm">
                          Duration: {incident.duration}
                        </p>
                        <p className="text-gray-400 text-xs">
                          {incident.timestamp}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
