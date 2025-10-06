import Link from "next/link";

import { ArrowRight } from "lucide-react";
import { Button } from "../ui/button";

export function CTASection() {
  return (
    <section className="py-24 bg-gradient-to-r from-primary to-secondary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
            Ready to Transform Your YouTube Channel?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Join thousands of creators who have already automated their success
          </p>
          <Button size="lg" variant="secondary" className="text-lg px-8 py-6 group" asChild>
            <Link href="/auth/signup">
              Start Your Free Trial
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </section>
    )
  }
