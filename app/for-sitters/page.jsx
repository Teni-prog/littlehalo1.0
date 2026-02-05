import { PublicNavbar } from '@/components/layout/PublicNavbar';
import { SiteFooter } from '@/components/homepage/Footer';
import { SitterHero } from '@/components/for-sitters/Hero';
import { SitterBenefits } from '@/components/for-sitters/Benefits';
import { SitterHowItWorks } from '@/components/for-sitters/HowItWorks';
import { SitterTestimonials } from '@/components/for-sitters/Testimonials';
import { SitterCTA } from '@/components/for-sitters/CTA';

export const metadata = {
  title: 'Turn Your Love for Kids Into Meaningful Income - littlëHALO',
  description: 'Join littlëHALO as a babysitter - Earn $18-35/hr, set your own schedule, and make a difference in children\'s lives with meaningful micro-adventures.',
};

export default function ForSittersPage() {
  return (
    <>
      <PublicNavbar activePage="for-sitters" />
      
      {/* Animated Background Blobs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#FFE5B4] rounded-full mix-blend-multiply filter blur-[80px] opacity-40 animate-blob" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#EFA59A] rounded-full mix-blend-multiply filter blur-[80px] opacity-40 animate-blob animation-delay-2000" />
        <div className="absolute bottom-[20%] left-[20%] w-[500px] h-[500px] bg-[#FFE5B4]/30 rounded-full mix-blend-multiply filter blur-[80px] opacity-30 animate-blob animation-delay-4000" />
        <div className="absolute bottom-0 right-[10%] w-[500px] h-[500px] bg-[#EFA59A]/20 rounded-full mix-blend-multiply filter blur-[80px] opacity-25 animate-blob animation-delay-6000" />
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
