import { HeroSection } from "@/components/homepage/Hero";
import { FeaturesPreview } from "@/components/homepage/Features";
import { ComparisonTable } from "@/components/homepage/Comparison";
import { HowItWorksPreview } from "@/components/homepage/HowItWorks";
import { Testimonials } from "@/components/homepage/Testimonials";
import { PricingFAQ } from "@/components/homepage/Pricing";
import { DualCTA } from "@/components/homepage/DualCTA";
import { SiteFooter } from "@/components/homepage/Footer";

export default function Home() {
  return (
    <>
      {/* Animated Background Blobs - Exact match to HTML */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#FFE5B4] rounded-full mix-blend-multiply filter blur-[80px] opacity-40 animate-blob" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#EFA59A] rounded-full mix-blend-multiply filter blur-[80px] opacity-40 animate-blob animation-delay-2000" />
        <div className="absolute bottom-[20%] left-[20%] w-[500px] h-[500px] bg-[#FFE5B4]/30 rounded-full mix-blend-multiply filter blur-[80px] opacity-30 animate-blob animation-delay-4000" />
        <div className="absolute bottom-0 right-[10%] w-[500px] h-[500px] bg-[#EFA59A]/20 rounded-full mix-blend-multiply filter blur-[80px] opacity-25 animate-blob animation-delay-6000" />
      </div>

      {/* Main Content - Add top padding for fixed navbar */}
      <main className="relative z-10 pt-16">
        <HeroSection />

        {/* Content Sections Container - matches HTML structure */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 space-y-24">
          <FeaturesPreview />
          <ComparisonTable />
          <HowItWorksPreview />
          <Testimonials />
          <PricingFAQ />
        </div>

        <DualCTA />
        <SiteFooter />
      </main>
    </>
  );
}
