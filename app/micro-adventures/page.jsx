import { PublicNavbar } from '@/components/layout/PublicNavbar';
import { SiteFooter } from '@/components/homepage/Footer';
import { ActivitiesHero } from '@/components/micro-adventures/Hero';
import { ActivitiesBenefits } from '@/components/micro-adventures/Benefits';
import { ActivityLibrary } from '@/components/micro-adventures/ActivityLibrary';
import { ActivitiesCTA } from '@/components/micro-adventures/CTA';

export const metadata = {
  title: 'Micro-Adventures - Educational Activities | littlëHALO',
  description: 'Browse 50+ educational activities included with every babysitting session. From STEM experiments to cultural crafts—all at no extra cost.',
};

export default function MicroAdventuresPage() {
  return (
    <>
      <PublicNavbar activePage="activities" />
      
      {/* Background Blobs */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#FFE5B4] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#EFA59A] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-[#E5533D]/10 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000" />
        <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-[#FFE5B4] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
      </div>

      <main>
        <ActivitiesHero />
        <ActivitiesBenefits />
        <ActivityLibrary />
        <ActivitiesCTA />
      </main>

      <SiteFooter />
    </>
  );
}
