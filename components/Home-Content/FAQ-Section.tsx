import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";

export function FAQSection() {
  return (
<section className="py-16 mt-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to know about our platform
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="item-1" className="border rounded-lg px-6">
                <AccordionTrigger className="text-left">How accurate is the AI-generated content?</AccordionTrigger>
                <AccordionContent>
                  Our AI is trained on millions of successful YouTube videos and achieves 95% accuracy in generating
                  relevant titles and descriptions. You can always edit and customize the generated content before
                  publishing.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border rounded-lg px-6">
                <AccordionTrigger className="text-left">What video formats are supported?</AccordionTrigger>
                <AccordionContent>
                  We support all major video formats including MP4, MOV, AVI, WMV, and more. Maximum file size is 10GB
                  per video.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border rounded-lg px-6">
                <AccordionTrigger className="text-left">Can I schedule videos for specific times?</AccordionTrigger>
                <AccordionContent>
                  Yes! You can schedule videos for any date and time. Our system will automatically publish your content
                  when scheduled, even if you're offline.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="border rounded-lg px-6">
                <AccordionTrigger className="text-left">Is there a free trial available?</AccordionTrigger>
                <AccordionContent>
                  Yes, we offer a 14-day free trial with full access to all features. No credit card required to get
                  started.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="border rounded-lg px-6">
                <AccordionTrigger className="text-left">How secure is my content?</AccordionTrigger>
                <AccordionContent>
                  We use enterprise-grade security with end-to-end encryption. Your videos are processed securely and
                  automatically deleted from our servers after 30 days.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>
    )
  }
