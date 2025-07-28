import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle } from "lucide-react"

export function CTA() {
  return (
    <section className="py-24 bg-gradient-to-br from-[#6366f1] via-[#5855eb] to-[#4f46e5] relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-white">
            Start monitoring your
            <br />
            websites today
          </h2>

          <p className="text-xl sm:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
            Join thousands of developers and businesses who trust our platform to keep their websites running smoothly.
            Get started in less than 60 seconds.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12">
            <Button
              size="lg"
              className="bg-white text-[#6366f1] hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
              asChild
            >
              <Link href="/signup">
                Start free trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-[#6366f1] px-8 py-4 text-lg bg-transparent"
            >
              Schedule demo
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center mb-12">
            <div className="flex items-center justify-center space-x-2 text-blue-100">
              <CheckCircle className="h-5 w-5" />
              <span>14-day free trial</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-blue-100">
              <CheckCircle className="h-5 w-5" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-blue-100">
              <CheckCircle className="h-5 w-5" />
              <span>Cancel anytime</span>
            </div>
          </div>

          {/* Trust badges */}
          <div className="flex items-center justify-center space-x-8 text-blue-200 text-sm">
            <div className="flex items-center space-x-2">
              <span>🔒</span>
              <span>SOC 2 Compliant</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>🌍</span>
              <span>99.99% Uptime SLA</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>📞</span>
              <span>24/7 Support</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
