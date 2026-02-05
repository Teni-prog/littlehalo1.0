import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { SiteFooter } from "@/components/homepage/Footer";
import { ParentHero } from "@/components/for-parents/Hero";
import { ParentBenefits } from "@/components/for-parents/Benefits";
import { ParentHowItWorks } from "@/components/for-parents/HowItWorks";
import { MicroAdventures } from "@/components/for-parents/MicroAdventures";
import { ParentTestimonials } from "@/components/for-parents/Testimonials";
import { ParentCTA } from "@/components/for-parents/CTA";

export const metadata = {
  title: "Find Trusted Childcare Near You - littlëHALO",
  description:
    "Find trusted, verified babysitters on littlëHALO. Book childcare with confidence - background-checked sitters, educational micro-adventures, and flexible scheduling.",
};

export default function ForParentsPage() {
  return (
    <>
      <PublicNavbar activePage="for-parents" />

      {/* Animated Background Blobs - For Parents pattern */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[5%] left-[10%] w-[550px] h-[550px] bg-peach rounded-full mix-blend-multiply filter blur-[80px] opacity-35 animate-blob" />
        <div className="absolute top-[30%] right-[5%] w-[450px] h-[450px] bg-coral rounded-full mix-blend-multiply filter blur-[80px] opacity-40 animate-blob animation-delay-2000" />
        <div className="absolute bottom-[10%] left-[40%] w-[500px] h-[500px] bg-peach/25 rounded-full mix-blend-multiply filter blur-[80px] opacity-30 animate-blob animation-delay-4000" />
        <div className="absolute bottom-[25%] right-[30%] w-[400px] h-[400px] bg-coral/30 rounded-full mix-blend-multiply filter blur-[80px] opacity-20 animate-blob animation-delay-6000" />
      </div>

      {/* Main Content */}
      <main className="relative z-10 pt-24 pb-20">
        <ParentHero />
        <ParentBenefits />
        <ParentHowItWorks />
        <MicroAdventures />
        <ParentTestimonials />
        <ParentCTA />
      </main>

      <SiteFooter />
    </>
  );
}
