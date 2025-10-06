import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "../ui/card";
import { Clock, Target, Zap, Users, Sparkles, CheckCircle } from "lucide-react";

export function HomeFeatureSection() {
  return (
<section className="py-8">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Powerful Features</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to scale your YouTube channel
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="group hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <Clock className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Time Saving</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Reduce content creation time by 80%. Focus on creating while we handle the optimization.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <Target className="h-8 w-8 text-primary mb-2" />
                <CardTitle>SEO Optimization</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  AI-generated titles and descriptions optimized for YouTube's algorithm and search.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <Zap className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Smart Scheduling</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Schedule content for peak engagement times based on your audience analytics.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <Users className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Audience Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Get detailed analytics on what content performs best with your audience.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <Sparkles className="h-8 w-8 text-primary mb-2" />
                <CardTitle>AI Thumbnails</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Generate eye-catching thumbnails that increase click-through rates.</CardDescription>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CheckCircle className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Bulk Operations</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Process multiple videos at once and manage your entire content pipeline.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    )
  }

