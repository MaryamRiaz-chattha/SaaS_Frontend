import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "../ui/card";
import { Upload, Sparkles, Calendar } from "lucide-react";

export function WorkSection() {
  return (
    <section id="how-it-works" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">How It Works</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Three simple steps to transform your YouTube workflow
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card className="text-center group hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
            <CardHeader>
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                <Upload className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">1. Upload Video</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Simply drag and drop your video file. Our system supports all major video formats.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center group hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
            <CardHeader>
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                <Sparkles className="h-8 w-8 text-[#fd1d1d]" />
              </div>
              <CardTitle className="text-2xl">2. AI Generation</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Our AI analyzes your content and generates optimized titles, descriptions, and thumbnails.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center group hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
            <CardHeader>
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/20 transition-colors">
                <Calendar className="h-8 w-8 text-accent" />
              </div>
              <CardTitle className="text-2xl">3. Schedule & Publish</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Schedule your content for optimal times or publish immediately with one click.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}