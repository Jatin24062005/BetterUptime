"use client"

import { useEffect, useState } from "react"

const stats = [
  { label: "Websites Monitored", value: 250000, suffix: "+" },
  { label: "Uptime Checks Daily", value: 50000000, suffix: "+" },
  { label: "Global Locations", value: 15, suffix: "" },
  { label: "Average Response Time", value: 30, suffix: "s" },
  { label: "Customer Satisfaction", value: 99.9, suffix: "%" },
  { label: "Years of Experience", value: 8, suffix: "+" },
]

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const duration = 2000
    const steps = 60
    const increment = value / steps
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= value) {
        setCount(value)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [value])

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M"
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(0) + "K"
    }
    return num.toString()
  }

  return (
    <span className="text-4xl sm:text-5xl font-bold">
      {formatNumber(count)}
      {suffix}
    </span>
  )
}

export function Stats() {
  return (
    <section className="py-24 bg-gradient-to-r from-gray-950 via-black to-gray-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            Trusted by Developers
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
              Around the World
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Join thousands of companies that rely on our monitoring platform to keep their websites and applications
            running smoothly 24/7.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center p-8 rounded-2xl bg-gray-900/50 border border-gray-800 hover:border-gray-700 transition-all duration-300"
            >
              <div className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 mb-4">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-gray-300 text-lg font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="mt-20 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-8 items-center opacity-60">
          {["Company A", "Company B", "Company C", "Company D", "Company E", "Company F"].map((company, index) => (
            <div key={index} className="text-center">
              <div className="h-12 bg-gray-700 rounded-lg flex items-center justify-center text-gray-400 font-semibold">
                {company}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
