import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/landing-page-components/Header"
import { Footer } from "@/components/landing-page-components/Footer"
import {
  Brain,
  ImageIcon,
  Calendar,
  BarChart3,
  Zap,
  Shield,
  Clock,
  ArrowRight,
  CheckCircle,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react"

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="pt-24 pb-8 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center space-x-2 bg-primary/10 rounded-full px-4 py-2 mb-6">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Powerful Features</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Everything You Need to Dominate YouTube
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Discover the comprehensive suite of AI-powered tools designed to automate, optimize, and accelerate your
              YouTube growth.
            </p>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Core Features</h2>
            <p className="text-xl text-muted-foreground">The essential tools every creator needs</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="p-6 border-2 hover:border-primary/20 transition-all duration-300 hover:shadow-lg">
              <CardHeader className="p-0 mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">AI Title Generation</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-muted-foreground mb-4">
                  Generate compelling, SEO-optimized titles that grab attention and improve click-through rates using
                  advanced AI algorithms.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">SEO Optimized</Badge>
                  <Badge variant="secondary">Click-worthy</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="p-6 border-2 hover:border-primary/20 transition-all duration-300 hover:shadow-lg">
              <CardHeader className="p-0 mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <ImageIcon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Smart Thumbnails</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-muted-foreground mb-4">
                  Create eye-catching thumbnails automatically from your video content with AI-powered design and
                  optimization.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Auto-Generated</Badge>
                  <Badge variant="secondary">High CTR</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="p-6 border-2 hover:border-primary/20 transition-all duration-300 hover:shadow-lg">
              <CardHeader className="p-0 mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Smart Scheduling</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-muted-foreground mb-4">
                  Schedule your videos for optimal posting times based on your audience analytics and engagement
                  patterns.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Optimal Timing</Badge>
                  <Badge variant="secondary">Automated</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="p-6 border-2 hover:border-primary/20 transition-all duration-300 hover:shadow-lg">
              <CardHeader className="p-0 mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Performance Analytics</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-muted-foreground mb-4">
                  Track your video performance with detailed analytics and insights to optimize your content strategy.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Real-time</Badge>
                  <Badge variant="secondary">Actionable</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="p-6 border-2 hover:border-primary/20 transition-all duration-300 hover:shadow-lg">
              <CardHeader className="p-0 mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Bulk Operations</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-muted-foreground mb-4">
                  Process multiple videos at once with batch upload, editing, and scheduling capabilities for maximum
                  efficiency.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Time-saving</Badge>
                  <Badge variant="secondary">Efficient</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="p-6 border-2 hover:border-primary/20 transition-all duration-300 hover:shadow-lg">
              <CardHeader className="p-0 mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Content Protection</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-muted-foreground mb-4">
                  Secure your content with advanced privacy controls and copyright protection features.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Secure</Badge>
                  <Badge variant="secondary">Protected</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Advanced Features */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Advanced Capabilities</h2>
            <p className="text-xl text-muted-foreground">Take your channel to the next level</p>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-start space-x-6 p-6 bg-background rounded-lg border">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">AI-Powered SEO Optimization</h3>
                <p className="text-muted-foreground mb-3">
                  Our advanced AI analyzes trending keywords, competitor content, and YouTube algorithm preferences to
                  optimize your videos for maximum discoverability.
                </p>
                <div className="flex items-center space-x-2 text-sm text-primary">
                  <CheckCircle className="h-4 w-4" />
                  <span>Keyword research automation</span>
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-6 p-6 bg-background rounded-lg border">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Trend Analysis & Predictions</h3>
                <p className="text-muted-foreground mb-3">
                  Stay ahead of the curve with real-time trend analysis and content suggestions based on emerging topics
                  in your niche.
                </p>
                <div className="flex items-center space-x-2 text-sm text-primary">
                  <CheckCircle className="h-4 w-4" />
                  <span>Real-time trend monitoring</span>
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-6 p-6 bg-background rounded-lg border">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Automated Workflow Management</h3>
                <p className="text-muted-foreground mb-3">
                  Create custom workflows that automatically handle your entire video publishing process from upload to
                  promotion.
                </p>
                <div className="flex items-center space-x-2 text-sm text-primary">
                  <CheckCircle className="h-4 w-4" />
                  <span>Custom automation rules</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose YouTube Automator?</h2>
            <p className="text-xl text-muted-foreground">See how we compare to traditional methods</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="p-6 border-2 border-red-200">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="text-xl text-red-600">Manual Process</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <ul className="space-y-3">
                    <li className="flex items-center space-x-2 text-muted-foreground">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span>Hours spent on title research</span>
                    </li>
                    <li className="flex items-center space-x-2 text-muted-foreground">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span>Manual thumbnail creation</span>
                    </li>
                    <li className="flex items-center space-x-2 text-muted-foreground">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span>Guesswork for posting times</span>
                    </li>
                    <li className="flex items-center space-x-2 text-muted-foreground">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span>Limited analytics insights</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="p-6 border-2 border-primary/20 bg-primary/5">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="text-xl text-primary">With YouTube Automator</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <ul className="space-y-3">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-primary" />
                      <span>AI-generated titles in seconds</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-primary" />
                      <span>Automated thumbnail creation</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-primary" />
                      <span>Data-driven scheduling</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-primary" />
                      <span>Comprehensive performance tracking</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Experience These Features?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of creators who are already using TubeAI to grow their channels faster and more
              efficiently.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/auth/signup">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
