import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { SiteFooter } from "@/components/homepage/Footer";
import { SitterHero } from "@/components/for-sitters/Hero";
import { SitterBenefits } from "@/components/for-sitters/Benefits";
import { SitterHowItWorks } from "@/components/for-sitters/HowItWorks";
import { SitterTestimonials } from "@/components/for-sitters/Testimonials";
import { SitterCTA } from "@/components/for-sitters/CTA";

export const metadata = {
  title: "Turn Your Love for Kids Into Meaningful Income - littlëHALO",
  description:
    "Join littlëHALO as a babysitter - Earn $18-35/hr, set your own schedule, and make a difference in children's lives with meaningful micro-adventures.",
};

export default function ForSittersPage() {
  return (
    <>
      <PublicNavbar activePage="for-sitters" />

      {/* Animated Background Blobs - For Sitters pattern */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[15%] right-[20%] w-[480px] h-[480px] bg-coral rounded-full mix-blend-multiply filter blur-[80px] opacity-35 animate-blob animation-delay-2000" />
        <div className="absolute top-[50%] left-[5%] w-[520px] h-[520px] bg-peach rounded-full mix-blend-multiply filter blur-[80px] opacity-30 animate-blob" />
        <div className="absolute bottom-[5%] left-[35%] w-[450px] h-[450px] bg-coral/35 rounded-full mix-blend-multiply filter blur-[80px] opacity-35 animate-blob animation-delay-4000" />
        <div className="absolute bottom-[30%] right-[15%] w-[400px] h-[400px] bg-peach/40 rounded-full mix-blend-multiply filter blur-[80px] opacity-25 animate-blob animation-delay-6000" />
      </div>

      {/* Main Content */}
      <main className="relative z-10 pt-24 pb-20">
        <SitterHero />
        <SitterBenefits />
        <SitterHowItWorks />
        <SitterTestimonials />
        <SitterCTA />
      </main>

      <SiteFooter />
    </>
  );
}
