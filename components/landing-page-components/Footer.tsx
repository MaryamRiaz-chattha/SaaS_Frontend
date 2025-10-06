import Link from "next/link"
import { Play, Twitter, Youtube, Linkedin, Mail } from "lucide-react"

export function Footer() {
  return (
    <footer className="crypto-footer">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 crypto-primary-gradient rounded-lg flex items-center justify-center crypto-glow">
                <Play className="h-4 w-4 text-white fill-current" />
              </div>
              <span className="text-xl font-bold crypto-text-primary">YouTube Automator</span>
            </Link>
            <p className="crypto-text-secondary max-w-xs">
              Automate your YouTube success with AI-powered content generation and smart scheduling.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="crypto-text-secondary hover:crypto-text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="crypto-text-secondary hover:crypto-text-primary transition-colors">
                <Youtube className="h-5 w-5" />
              </Link>
              <Link href="#" className="crypto-text-secondary hover:crypto-text-primary transition-colors">
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link href="#" className="crypto-text-secondary hover:crypto-text-primary transition-colors">
                <Mail className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Product */}
          <div className="space-y-4">
            <h3 className="font-semibold crypto-text-primary">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="crypto-text-secondary hover:crypto-text-primary transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#" className="crypto-text-secondary hover:crypto-text-primary transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="#" className="crypto-text-secondary hover:crypto-text-primary transition-colors">
                  API
                </Link>
              </li>
              <li>
                <Link href="#" className="crypto-text-secondary hover:crypto-text-primary transition-colors">
                  Integrations
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h3 className="font-semibold crypto-text-primary">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="crypto-text-secondary hover:crypto-text-primary transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="#" className="crypto-text-secondary hover:crypto-text-primary transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="crypto-text-secondary hover:crypto-text-primary transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="#" className="crypto-text-secondary hover:crypto-text-primary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="font-semibold crypto-text-primary">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="crypto-text-secondary hover:crypto-text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="crypto-text-secondary hover:crypto-text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="#" className="crypto-text-secondary hover:crypto-text-primary transition-colors">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="crypto-text-secondary hover:crypto-text-primary transition-colors">
                  GDPR
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="crypto-text-secondary text-sm">© 2025 YouTube Automator. All rights reserved.</p>
          <p className="crypto-text-secondary text-sm mt-4 md:mt-0">Made with ❤️ for YouTube creators</p>
        </div>
      </div>
    </footer>
  )
}
