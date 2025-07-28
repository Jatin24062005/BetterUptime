import Link from "next/link"
import { Twitter, Github, Linkedin, Mail, MapPin, Phone } from "lucide-react"

const footerLinks = {
  product: [
    { name: "Website Monitoring", href: "#website-monitoring" },
    { name: "API Monitoring", href: "#api-monitoring" },
    { name: "SSL Monitoring", href: "#ssl-monitoring" },
    { name: "Cron Monitoring", href: "#cron-monitoring" },
    { name: "Status Pages", href: "#status-pages" },
    { name: "Integrations", href: "#integrations" },
  ],
  company: [
    { name: "About Us", href: "#about" },
    { name: "Careers", href: "#careers" },
    { name: "Blog", href: "#blog" },
    { name: "Press Kit", href: "#press" },
    { name: "Partners", href: "#partners" },
    { name: "Contact", href: "#contact" },
  ],
  resources: [
    { name: "Documentation", href: "#docs" },
    { name: "API Reference", href: "#api" },
    { name: "Help Center", href: "#help" },
    { name: "Community", href: "#community" },
    { name: "Tutorials", href: "#tutorials" },
    { name: "Webinars", href: "#webinars" },
  ],
  legal: [
    { name: "Privacy Policy", href: "#privacy" },
    { name: "Terms of Service", href: "#terms" },
    { name: "Cookie Policy", href: "#cookies" },
    { name: "GDPR", href: "#gdpr" },
    { name: "Security", href: "#security" },
    { name: "Compliance", href: "#compliance" },
  ],
}

export function Footer() {
  return (
    <footer className="bg-[#0f1419] border-t border-gray-800/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-white rounded-sm flex items-center justify-center">
                <div className="w-6 h-6 bg-[#0f1419] rounded-sm flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-sm"></div>
                </div>
              </div>
              <span className="text-2xl font-bold text-white">BetterUptime</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md leading-relaxed">
              The most reliable website monitoring platform trusted by developers and businesses worldwide. Keep your
              sites online 24/7 with advanced monitoring and alerting.
            </p>

            <div className="space-y-3 mb-6">
              <div className="flex items-center space-x-3 text-gray-400">
                <MapPin className="h-5 w-5" />
                <span>San Francisco, CA & Prague, CZ</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <Phone className="h-5 w-5" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <Mail className="h-5 w-5" />
                <span>hello@betterstack.com</span>
              </div>
            </div>

            <div className="flex space-x-4">
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-6 w-6" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Github className="h-6 w-6" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="h-6 w-6" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Mail className="h-6 w-6" />
              </Link>
            </div>
          </div>

          {/* Links Sections */}
          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-400 hover:text-white transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-400 hover:text-white transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-400 hover:text-white transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-400 hover:text-white transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-gray-500 text-sm mb-4 md:mb-0">© 2024 BetterUptime. All rights reserved.</div>
            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <span>🌍 Monitoring from 15+ global locations</span>
              <span>⚡ 99.99% uptime SLA</span>
              <span>🔒 SOC 2 compliant</span>
              <span>📱 Mobile apps available</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
