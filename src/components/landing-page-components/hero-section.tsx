import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden crypto-hero-gradient pt-20 pb-8">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
<div className="container mx-auto px-4 relative z-10">
  <div className="max-w-4xl mx-auto text-center">
    <Badge variant="crypto" className="mb-6 animate-fade-in crypto-glow">
      AI-Powered YouTube Automation
    </Badge>
    <h1 className="text-5xl md:text-7xl font-bold mb-6 crypto-text-primary animate-slide-up">
      Automate Your YouTube Success
    </h1>
    <p className="text-xl md:text-2xl text-white mb-8 max-w-3xl mx-auto animate-slide-up animation-delay-200">
      Upload your videos and let AI generate compelling titles, descriptions, and thumbnails. Schedule and
      publish with one click.
    </p>
    <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up animation-delay-400">
      <Button size="lg" variant="crypto" className="text-lg px-8 py-6 group crypto-glow" asChild>
        <Link href="/auth/signup">
          Get Started Free
          <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </Button>
      <Button size="lg" variant="cryptoSecondary" className="text-lg px-8 py-6 text-[#d71919]" asChild>
        <Link href="#how-it-works">See How It Works</Link>
      </Button>
    </div>
  </div>
</div>
</section>
  )
}