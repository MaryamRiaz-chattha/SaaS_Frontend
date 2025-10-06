"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, Play } from "lucide-react"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 crypto-navbar">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 crypto-primary-gradient rounded-lg flex items-center justify-center group-hover:crypto-glow transition-all duration-300 crypto-glow">
              <Play className="h-4 w-4 text-white fill-current" />
            </div>
            <span className="text-xl font-bold crypto-text-primary">YouTube Automator</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="#how-it-works" className="crypto-text-secondary hover:crypto-text-primary transition-colors">
              How It Works
            </Link>
            <Link href="/features" className="crypto-text-secondary hover:crypto-text-primary transition-colors">
              Features
            </Link>
            <Link href="/About" className="crypto-text-secondary hover:crypto-text-primary transition-colors">
              About
            </Link>
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="cryptoGhost" asChild>
              <Link href="/auth/login">Login</Link>
            </Button>
            <Button variant="crypto" asChild>
              <Link href="/auth/signup">Sign Up</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-primary">
            <nav className="flex flex-col space-y-4">
              <Link
                href="#how-it-works"
                className="crypto-text-secondary hover:crypto-text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                How It Works
              </Link>
              <Link
                href="/features"
                className="crypto-text-secondary hover:crypto-text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                href="/about"
                className="crypto-text-secondary hover:crypto-text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <div className="flex flex-col space-y-2 pt-4 border-t border-primary">
                <Button variant="cryptoGhost" asChild>
                  <Link href="/auth/login">Login</Link>
                </Button>
                <Button variant="crypto" asChild>
                  <Link href="/auth/signup">Sign Up</Link>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
