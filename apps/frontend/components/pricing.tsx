import { Check, Star, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const plans = [
  {
    name: "Free",
    price: 0,
    period: "forever",
    description: "Perfect for personal projects and getting started",
    features: [
      "10 monitors",
      "10 heartbeats",
      "3-minute checks",
      "Email alerts",
      "Status page",
      "30-day data retention",
      "Community support",
    ],
    limitations: ["Basic alerting only", "Limited integrations"],
    popular: false,
    cta: "Get started free",
    highlight: false,
  },
  {
    name: "Pro",
    price: 29,
    period: "month",
    description: "For growing teams and businesses",
    features: [
      "50 monitors",
      "50 heartbeats",
      "30-second checks",
      "Email, SMS & Slack alerts",
      "Custom status pages",
      "1-year data retention",
      "API access",
      "Team collaboration",
      "Advanced integrations",
      "Priority support",
    ],
    limitations: [],
    popular: true,
    cta: "Start free trial",
    highlight: true,
  },
  {
    name: "Business",
    price: 79,
    period: "month",
    description: "For larger teams with advanced needs",
    features: [
      "200 monitors",
      "200 heartbeats",
      "10-second checks",
      "All alert channels",
      "White-label status pages",
      "2-year data retention",
      "Full API access",
      "Advanced team features",
      "Custom integrations",
      "SLA monitoring",
      "Dedicated support",
    ],
    limitations: [],
    popular: false,
    cta: "Start free trial",
    highlight: false,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "contact us",
    description: "For large organizations with specific requirements",
    features: [
      "Unlimited monitors",
      "Unlimited heartbeats",
      "5-second checks",
      "Enterprise integrations",
      "Custom branding",
      "Unlimited data retention",
      "On-premise deployment",
      "SSO & SAML",
      "Audit logs",
      "99.99% SLA",
      "24/7 dedicated support",
      "Custom development",
    ],
    limitations: [],
    popular: false,
    cta: "Contact sales",
    highlight: false,
  },
]

const features = [
  {
    category: "Monitoring",
    items: [
      { name: "Website monitoring", free: true, pro: true, business: true, enterprise: true },
      { name: "API monitoring", free: true, pro: true, business: true, enterprise: true },
      { name: "SSL monitoring", free: true, pro: true, business: true, enterprise: true },
      { name: "Domain monitoring", free: false, pro: true, business: true, enterprise: true },
      { name: "Cron monitoring", free: false, pro: true, business: true, enterprise: true },
      { name: "Transaction monitoring", free: false, pro: false, business: true, enterprise: true },
    ],
  },
  {
    category: "Alerting",
    items: [
      { name: "Email alerts", free: true, pro: true, business: true, enterprise: true },
      { name: "SMS alerts", free: false, pro: true, business: true, enterprise: true },
      { name: "Slack integration", free: false, pro: true, business: true, enterprise: true },
      { name: "PagerDuty integration", free: false, pro: true, business: true, enterprise: true },
      { name: "Webhook alerts", free: false, pro: true, business: true, enterprise: true },
      { name: "Custom escalation", free: false, pro: false, business: true, enterprise: true },
    ],
  },
  {
    category: "Features",
    items: [
      { name: "Status pages", free: true, pro: true, business: true, enterprise: true },
      { name: "Custom branding", free: false, pro: false, business: true, enterprise: true },
      { name: "API access", free: false, pro: true, business: true, enterprise: true },
      { name: "Team collaboration", free: false, pro: true, business: true, enterprise: true },
      { name: "SSO & SAML", free: false, pro: false, business: false, enterprise: true },
      { name: "Audit logs", free: false, pro: false, business: false, enterprise: true },
    ],
  },
]

export function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-[#0f1419]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge variant="outline" className="border-gray-700 text-gray-400 mb-6">
            Pricing Plans
          </Badge>
          <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-white">Simple, transparent pricing</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Choose the perfect plan for your monitoring needs. All plans include our core features with no hidden fees
            or surprise charges. Start free, upgrade anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-16">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative bg-[#1a1f2e] border-gray-800 hover:border-gray-700 transition-all duration-300 ${
                plan.highlight ? "ring-2 ring-[#6366f1] scale-105" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-[#6366f1] text-white px-4 py-1">
                    <Star className="w-4 h-4 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl font-bold text-white mb-2">{plan.name}</CardTitle>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-white">
                    {typeof plan.price === "number" ? `$${plan.price}` : plan.price}
                  </span>
                  <span className="text-gray-400 ml-2">/{plan.period}</span>
                </div>
                <CardDescription className="text-gray-300 text-base">{plan.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-3">
                      <Check className="h-5 w-5 text-green-400 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {plan.limitations.length > 0 && (
                  <div className="border-t border-gray-800 pt-4">
                    <div className="text-gray-500 text-sm mb-2">Limitations:</div>
                    <ul className="space-y-2">
                      {plan.limitations.map((limitation, limitIndex) => (
                        <li key={limitIndex} className="flex items-center space-x-3">
                          <div className="w-5 h-5 flex-shrink-0 text-gray-600">−</div>
                          <span className="text-gray-500 text-sm">{limitation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <Button
                  className={`w-full py-3 text-lg font-semibold transition-all ${
                    plan.highlight
                      ? "bg-[#6366f1] hover:bg-[#5855eb] text-white"
                      : "bg-gray-800 hover:bg-gray-700 text-white border border-gray-700"
                  }`}
                >
                  {plan.cta}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Feature Comparison Table */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-white text-center mb-12">Detailed feature comparison</h3>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left text-white font-semibold py-4 px-6">Features</th>
                  <th className="text-center text-white font-semibold py-4 px-6">Free</th>
                  <th className="text-center text-white font-semibold py-4 px-6">Pro</th>
                  <th className="text-center text-white font-semibold py-4 px-6">Business</th>
                  <th className="text-center text-white font-semibold py-4 px-6">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {features.map((category, categoryIndex) => (
                  <>
                    <tr key={categoryIndex} className="border-b border-gray-800">
                      <td colSpan={5} className="text-gray-400 font-medium py-4 px-6 bg-[#1a1f2e]">
                        {category.category}
                      </td>
                    </tr>
                    {category.items.map((item, itemIndex) => (
                      <tr key={itemIndex} className="border-b border-gray-800 hover:bg-[#1a1f2e]/50">
                        <td className="text-gray-300 py-3 px-6">{item.name}</td>
                        <td className="text-center py-3 px-6">
                          {item.free ? (
                            <Check className="h-5 w-5 text-green-400 mx-auto" />
                          ) : (
                            <span className="text-gray-600">−</span>
                          )}
                        </td>
                        <td className="text-center py-3 px-6">
                          {item.pro ? (
                            <Check className="h-5 w-5 text-green-400 mx-auto" />
                          ) : (
                            <span className="text-gray-600">−</span>
                          )}
                        </td>
                        <td className="text-center py-3 px-6">
                          {item.business ? (
                            <Check className="h-5 w-5 text-green-400 mx-auto" />
                          ) : (
                            <span className="text-gray-600">−</span>
                          )}
                        </td>
                        <td className="text-center py-3 px-6">
                          {item.enterprise ? (
                            <Check className="h-5 w-5 text-green-400 mx-auto" />
                          ) : (
                            <span className="text-gray-600">−</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pricing FAQ */}
        <div className="text-center">
          <div className="bg-[#1a1f2e] border border-gray-800 rounded-lg p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-6">Frequently asked questions</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              <div>
                <h4 className="text-white font-semibold mb-2">Can I change plans anytime?</h4>
                <p className="text-gray-400 text-sm">
                  Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately and are
                  prorated.
                </p>
              </div>

              <div>
                <h4 className="text-white font-semibold mb-2">What happens to my data?</h4>
                <p className="text-gray-400 text-sm">
                  Your monitoring data is retained according to your plan's data retention policy. We never delete data
                  without notice.
                </p>
              </div>

              <div>
                <h4 className="text-white font-semibold mb-2">Is there a free trial?</h4>
                <p className="text-gray-400 text-sm">
                  Yes, all paid plans come with a 14-day free trial. No credit card required to start.
                </p>
              </div>

              <div>
                <h4 className="text-white font-semibold mb-2">Do you offer discounts?</h4>
                <p className="text-gray-400 text-sm">
                  We offer annual billing discounts (20% off) and special rates for startups and non-profits.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
