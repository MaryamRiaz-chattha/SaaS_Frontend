import { Header } from "@/components/landing-page-components/Header"
import { Footer } from "@/components/landing-page-components/Footer"
import { HeroSection } from "@/components/landing-page-components/hero-section"
import { WorkSection } from "@/components/landing-page-components/work-section"
import { HomeFeatureSection } from "@/components/landing-page-components/feature-showcase"
import { TestimonialsSection } from "@/components/Testimonials-Section"
import { FAQSection } from "@/components/landing-page-components/faq-section"
import { CTASection } from "@/components/landing-page-components/call-to-action-section"
export default function LandingPage() {
  return (
    <div className="min-h-screen crypto-gradient-bg">
      {/* Header */}
      <Header />
      {/* Hero Section */}
      <HeroSection />
      {/* Work Section */}
      <WorkSection />
      {/* Features Section */}
      <HomeFeatureSection />
      {/* Testimonials Section */}
      <TestimonialsSection />
      {/* FAQ Section */}
      <FAQSection />
      {/* CTA Section */}
      <CTASection />
      {/* Footer */}
      <Footer />
    </div>
  )
}
