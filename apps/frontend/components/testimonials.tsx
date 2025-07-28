import { Star, Quote } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "DevOps Engineer",
    company: "TechCorp",
    avatar: "/placeholder.svg?height=60&width=60",
    content:
      "BetterUptime has been a game-changer for our monitoring setup. The 30-second checks and instant alerts have helped us catch issues before they impact our users. The traceroute feature is incredibly useful for debugging network issues.",
    rating: 5,
    featured: true,
  },
  {
    name: "Michael Chen",
    role: "CTO",
    company: "StartupXYZ",
    avatar: "/placeholder.svg?height=60&width=60",
    content:
      "We switched from our previous monitoring solution and couldn't be happier. The SSL certificate monitoring alone has saved us from multiple outages. The team collaboration features make incident response much smoother.",
    rating: 5,
    featured: false,
  },
  {
    name: "Emily Rodriguez",
    role: "Site Reliability Engineer",
    company: "CloudTech",
    avatar: "/placeholder.svg?height=60&width=60",
    content:
      "The global monitoring locations give us confidence that our services are accessible worldwide. The detailed analytics and historical data help us identify patterns and optimize our infrastructure.",
    rating: 5,
    featured: false,
  },
  {
    name: "David Kim",
    role: "Full Stack Developer",
    company: "WebAgency",
    avatar: "/placeholder.svg?height=60&width=60",
    content:
      "Love the simplicity of the setup process. Had our entire monitoring stack configured in under 10 minutes. The status pages look professional and our clients appreciate the transparency.",
    rating: 5,
    featured: false,
  },
  {
    name: "Lisa Thompson",
    role: "Operations Manager",
    company: "E-commerce Plus",
    avatar: "/placeholder.svg?height=60&width=60",
    content:
      "The cron monitoring has been a lifesaver for our backup processes. We no longer worry about silent failures. The Slack integration keeps our team informed without overwhelming notifications.",
    rating: 5,
    featured: true,
  },
  {
    name: "Alex Martinez",
    role: "Lead Engineer",
    company: "FinTech Solutions",
    avatar: "/placeholder.svg?height=60&width=60",
    content:
      "Enterprise-grade monitoring at a fraction of the cost. The API monitoring capabilities are robust and the custom integrations work flawlessly. Support team is responsive and knowledgeable.",
    rating: 5,
    featured: false,
  },
]

export function Testimonials() {
  return (
    <section className="py-24 bg-[#0f1419]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge variant="outline" className="border-gray-700 text-gray-400 mb-6">
            Customer Stories
          </Badge>
          <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-white">Trusted by developers worldwide</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Don't just take our word for it. Here's what developers and teams are saying about our monitoring platform
            and how it's helping them build more reliable systems.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className={`bg-[#1a1f2e] border-gray-800 hover:border-gray-700 transition-all duration-300 hover:scale-105 ${
                testimonial.featured ? "ring-1 ring-[#6366f1]/50" : ""
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>

                <div className="relative mb-6">
                  <Quote className="absolute -top-2 -left-2 h-8 w-8 text-[#6366f1]/20" />
                  <p className="text-gray-300 text-base leading-relaxed pl-6">{testimonial.content}</p>
                </div>

                <div className="flex items-center space-x-4">
                  <img
                    src={testimonial.avatar || "/placeholder.svg"}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-700"
                  />
                  <div>
                    <div className="font-semibold text-white">{testimonial.name}</div>
                    <div className="text-sm text-gray-400">
                      {testimonial.role} at {testimonial.company}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="text-center mb-16">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-6 w-6 text-yellow-400 fill-current" />
                ))}
              </div>
              <div className="text-2xl font-bold text-white mb-1">4.9/5</div>
              <div className="text-gray-400">Average rating</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">50K+</div>
              <div className="text-gray-400">Happy customers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">99.9%</div>
              <div className="text-gray-400">Customer satisfaction</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">24/7</div>
              <div className="text-gray-400">Support available</div>
            </div>
          </div>
        </div>

        {/* Case Study Preview */}
        <div className="bg-[#1a1f2e] border border-gray-800 rounded-lg p-8 max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-white mb-2">Success Story</h3>
            <p className="text-gray-400">How TechCorp reduced downtime by 85% with BetterUptime</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-green-400 mb-2">85%</div>
              <div className="text-gray-400">Reduction in downtime</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-400 mb-2">45%</div>
              <div className="text-gray-400">Faster incident response</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-400 mb-2">60%</div>
              <div className="text-gray-400">Cost savings vs previous solution</div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <button className="text-[#6366f1] hover:text-[#5855eb] font-medium transition-colors">
              Read full case study →
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
