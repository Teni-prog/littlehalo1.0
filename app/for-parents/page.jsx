import { PublicNavbar } from '@/components/layout/PublicNavbar';
import { SiteFooter } from '@/components/homepage/Footer';
import { ParentHero } from '@/components/for-parents/Hero';
import { ParentBenefits } from '@/components/for-parents/Benefits';
import { ParentHowItWorks } from '@/components/for-parents/HowItWorks';
import { MicroAdventures } from '@/components/for-parents/MicroAdventures';
import { ParentTestimonials } from '@/components/for-parents/Testimonials';
import { ParentCTA } from '@/components/for-parents/CTA';

export const metadata = {
  title: 'Find Trusted Childcare Near You - littlëHALO',
  description: 'Find trusted, verified babysitters on littlëHALO. Book childcare with confidence - background-checked sitters, educational micro-adventures, and flexible scheduling.',
};

export default function ForParentsPage() {
  return (
    <>
      <PublicNavbar activePage="for-parents" />
      
      {/* Animated Background Blobs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#FFE5B4] rounded-full mix-blend-multiply filter blur-[80px] opacity-40 animate-blob" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#EFA59A] rounded-full mix-blend-multiply filter blur-[80px] opacity-40 animate-blob animation-delay-2000" />
        <div className="absolute bottom-[20%] left-[20%] w-[500px] h-[500px] bg-[#FFE5B4]/30 rounded-full mix-blend-multiply filter blur-[80px] opacity-30 animate-blob animation-delay-4000" />
        <div className="absolute bottom-0 right-[10%] w-[500px] h-[500px] bg-[#EFA59A]/20 rounded-full mix-blend-multiply filter blur-[80px] opacity-25 animate-blob animation-delay-6000" />
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
