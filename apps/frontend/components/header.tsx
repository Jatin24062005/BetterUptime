"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, ChevronDown } from "lucide-react"
import Cookies from "js-cookie"

const platformItems = [
  { name: "Uptime Monitoring", href: "#uptime", description: "Monitor websites and APIs 24/7" },
  { name: "Error Tracking", href: "#errors", description: "Track and debug application errors" },
  { name: "Log Management", href: "#logs", description: "Centralized log collection and analysis" },
  { name: "Status Pages", href: "#status", description: "Beautiful public status pages" },
]

const communityItems = [
  { name: "Discord", href: "#discord", description: "Join our community" },
  { name: "GitHub", href: "#github", description: "Open source projects" },
  { name: "Blog", href: "#blog", description: "Latest updates and tutorials" },
  { name: "Newsletter", href: "#newsletter", description: "Monthly product updates" },
]

const companyItems = [
  { name: "About Us", href: "#about", description: "Learn more about our mission" },
  { name: "Careers", href: "#careers", description: "Join our growing team" },
  { name: "Press Kit", href: "#press", description: "Media resources and assets" },
  { name: "Contact", href: "#contact", description: "Get in touch with us" },
]

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  const token = Cookies.get("token");

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0f1419]/95 backdrop-blur-sm border-b border-gray-800/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <Link href="/" className="flex items-center space-x-1">
              <div className="w-6 h-6 bg-white rounded-sm flex items-center justify-center">
                <div className="w-4 h-4 bg-[#0f1419] rounded-sm flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-sm"></div>
                </div>
              </div>
              <span className="text-lg font-semibold text-white">BetterUptime</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown("platform")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <div className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors cursor-pointer">
                <span>Platform</span>
                <ChevronDown className="h-4 w-4" />
              </div>
              {activeDropdown === "platform" && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-[#1a1f2e] border border-gray-800 rounded-lg shadow-xl p-2">
                  {platformItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="block px-3 py-2 rounded hover:bg-gray-800 transition-colors"
                    >
                      <div className="text-white font-medium">{item.name}</div>
                      <div className="text-gray-400 text-sm">{item.description}</div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link href="#docs" className="text-gray-300 hover:text-white transition-colors">
              Documentation
            </Link>
            <Link href="#pricing" className="text-gray-300 hover:text-white transition-colors">
              Pricing
            </Link>

            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown("community")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <div className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors cursor-pointer">
                <span>Community</span>
                <ChevronDown className="h-4 w-4" />
              </div>
              {activeDropdown === "community" && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-[#1a1f2e] border border-gray-800 rounded-lg shadow-xl p-2">
                  {communityItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="block px-3 py-2 rounded hover:bg-gray-800 transition-colors"
                    >
                      <div className="text-white font-medium">{item.name}</div>
                      <div className="text-gray-400 text-sm">{item.description}</div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown("company")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <div className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors cursor-pointer">
                <span>Company</span>
                <ChevronDown className="h-4 w-4" />
              </div>
              {activeDropdown === "company" && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-[#1a1f2e] border border-gray-800 rounded-lg shadow-xl p-2">
                  {companyItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="block px-3 py-2 rounded hover:bg-gray-800 transition-colors"
                    >
                      <div className="text-white font-medium">{item.name}</div>
                      <div className="text-gray-400 text-sm">{item.description}</div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link href="#enterprise" className="text-gray-300 hover:text-white transition-colors">
              Enterprise
            </Link>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-transparent" asChild>
              <Link href="/signin">Sign in</Link>
            </Button>
            <Button className="bg-[#6366f1] hover:bg-[#5855eb] text-white px-6 py-2 rounded-md font-medium" asChild>
             {token ?<Link href="/dashboard">Dashboard</Link> : <Link href="/signup">Sign up</Link>}
            </Button>
          </div>

          <button className="md:hidden text-gray-300 hover:text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-800">
            <nav className="flex flex-col space-y-4">
              <div className="space-y-2">
                <div className="text-gray-400 text-sm font-medium px-2">Platform</div>
                {platformItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block px-4 py-2 text-gray-300 hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <Link href="#docs" className="text-gray-300 hover:text-white transition-colors px-2">
                Documentation
              </Link>
              <Link href="#pricing" className="text-gray-300 hover:text-white transition-colors px-2">
                Pricing
              </Link>
              <div className="space-y-2">
                <div className="text-gray-400 text-sm font-medium px-2">Community</div>
                {communityItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block px-4 py-2 text-gray-300 hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className="space-y-2">
                <div className="text-gray-400 text-sm font-medium px-2">Company</div>
                {companyItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block px-4 py-2 text-gray-300 hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <Link href="#enterprise" className="text-gray-300 hover:text-white transition-colors px-2">
                Enterprise
              </Link>
              <div className="flex flex-col space-y-2 pt-4 px-2">
                <Button variant="ghost" className="text-gray-300 hover:text-white justify-start" asChild>
                  <Link href="/signin">Sign in</Link>
                </Button>
                <Button className="bg-[#6366f1] hover:bg-[#5855eb] text-white justify-start" asChild>
                  <Link href="/signup">Sign up</Link>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
