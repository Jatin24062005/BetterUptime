"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const faqs = [
  {
    question: "How quickly will I be notified if my website goes down?",
    answer:
      "You'll receive alerts within 30 seconds of detecting an issue. Our monitoring system checks your website every 30 seconds from multiple global locations, ensuring rapid detection and notification of any downtime or performance issues. We support email, SMS, Slack, PagerDuty, and webhook notifications.",
    category: "Monitoring",
  },
  {
    question: "Can I monitor APIs and web services, not just websites?",
    answer:
      "Our platform supports comprehensive monitoring of REST APIs, GraphQL endpoints, web services, and any HTTP/HTTPS endpoint. You can set custom headers, authentication methods, check for specific response codes, validate JSON responses, and monitor response times. We also support database connection monitoring.",
    category: "Monitoring",
  },
  {
    question: "What types of alerts and notifications do you support?",
    answer:
      "We support a wide range of notification channels including email, SMS, Slack, Discord, Microsoft Teams, PagerDuty, webhooks, and many others. You can set up escalation rules, team notifications, customize alert thresholds, and configure different alert channels for different types of issues.",
    category: "Alerts",
  },
  {
    question: "How many monitoring locations do you have worldwide?",
    answer:
      "We monitor from 15+ global locations including North America (US East, US West, Canada), Europe (UK, Germany, France, Netherlands), Asia (Japan, Singapore, India), and Australia. This ensures your website is accessible from anywhere in the world and helps identify regional connectivity issues.",
    category: "Monitoring",
  },
  {
    question: "Is there a free plan available?",
    answer:
      "Yes! Our Free plan includes 10 monitors, 10 heartbeats, 3-minute check intervals, email alerts, a status page, and 30 days of data retention. It's perfect for personal projects and small websites. You can upgrade to paid plans anytime for more features and shorter check intervals.",
    category: "Pricing",
  },
  {
    question: "Can I monitor SSL certificate expiration?",
    answer:
      "Yes, we automatically monitor SSL certificate expiration dates and will alert you well before they expire (30, 7, and 1 day before expiration). This helps prevent security warnings and ensures your website remains secure and trusted by visitors. We also validate the entire certificate chain.",
    category: "Security",
  },
  {
    question: "How long do you retain monitoring data?",
    answer:
      "Data retention varies by plan: Free (30 days), Pro (1 year), Business (2 years), and Enterprise (unlimited). All plans include detailed incident reports, performance metrics, and historical data for the retention period. You can export data at any time.",
    category: "Data",
  },
  {
    question: "Do you offer an uptime SLA guarantee?",
    answer:
      "Yes, our Business and Enterprise plans include a 99.99% uptime SLA with service credits for any downtime that exceeds the SLA. All plans are built on enterprise-grade infrastructure with redundancy and failover systems across multiple cloud providers.",
    category: "SLA",
  },
  {
    question: "Can I integrate with my existing tools and workflow?",
    answer:
      "We offer 150+ integrations with popular tools including Slack, PagerDuty, Datadog, New Relic, Grafana, Jira, and many others. We also provide a comprehensive REST API and webhook support for custom integrations with your existing workflow and tools.",
    category: "Integrations",
  },
  {
    question: "How does team collaboration work?",
    answer:
      "Our Pro and higher plans include team collaboration features such as shared dashboards, user role management, incident assignment, team notifications, and audit logs. You can invite team members, set different permission levels, and coordinate incident response effectively.",
    category: "Teams",
  },
]

const categories = ["All", "Monitoring", "Alerts", "Pricing", "Security", "Data", "SLA", "Integrations", "Teams"]

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [activeCategory, setActiveCategory] = useState("All")

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  const filteredFAQs = activeCategory === "All" ? faqs : faqs.filter((faq) => faq.category === activeCategory)

  return (
    <section className="py-24 bg-[#0f1419]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge variant="outline" className="border-gray-700 text-gray-400 mb-6">
            Support
          </Badge>
          <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-white">Frequently asked questions</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Got questions? We've got answers. Here are the most common questions about our website monitoring platform,
            features, and pricing.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === category
                  ? "bg-[#6366f1] text-white"
                  : "bg-[#1a1f2e] text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="max-w-4xl mx-auto">
          {filteredFAQs.map((faq, index) => (
            <div key={index} className="mb-4">
              <button
                className="w-full text-left p-6 bg-[#1a1f2e] border border-gray-800 rounded-lg hover:border-gray-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#6366f1]"
                onClick={() => toggleFAQ(index)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Badge variant="outline" className="border-gray-700 text-gray-500 text-xs">
                      {faq.category}
                    </Badge>
                    <h3 className="text-lg font-semibold text-white pr-4">{faq.question}</h3>
                  </div>
                  {openIndex === index ? (
                    <ChevronUp className="h-5 w-5 text-[#6366f1] flex-shrink-0" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0" />
                  )}
                </div>

                {openIndex === index && (
                  <div className="mt-4 pt-4 border-t border-gray-800">
                    <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Contact Support */}
        <div className="mt-16 text-center">
          <div className="bg-[#1a1f2e] border border-gray-800 rounded-lg p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">Still have questions?</h3>
            <p className="text-gray-400 mb-6">
              Our support team is here to help you get the most out of our monitoring platform. Get in touch and we'll
              respond within 24 hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-6 py-3 bg-[#6366f1] hover:bg-[#5855eb] text-white rounded-lg font-semibold transition-colors">
                Contact Support
              </button>
              <button className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-semibold border border-gray-700 transition-colors">
                View Documentation
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
