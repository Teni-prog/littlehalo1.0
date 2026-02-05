import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { SiteFooter } from "@/components/homepage/Footer";
import { ActivitiesHero } from "@/components/micro-adventures/Hero";
import { ActivitiesBenefits } from "@/components/micro-adventures/Benefits";
import { ActivityLibrary } from "@/components/micro-adventures/ActivityLibrary";
import { ActivitiesCTA } from "@/components/micro-adventures/CTA";

export const metadata = {
  title: "Micro-Adventures - Educational Activities | littlëHALO",
  description:
    "Browse 50+ educational activities included with every babysitting session. From STEM experiments to cultural crafts—all at no extra cost.",
};

export default function MicroAdventuresPage() {
  return (
    <>
      <PublicNavbar activePage="activities" />

      {/* Animated Background Blobs - Micro Adventures pattern */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[12%] left-[25%] w-[440px] h-[440px] bg-[#FFE5B4] rounded-full mix-blend-multiply filter blur-[80px] opacity-35 animate-blob animation-delay-4000" />
        <div className="absolute top-[35%] right-[8%] w-[490px] h-[490px] bg-[#EFA59A] rounded-full mix-blend-multiply filter blur-[80px] opacity-30 animate-blob" />
        <div className="absolute bottom-[10%] left-[10%] w-[460px] h-[460px] bg-[#FFE5B4]/35 rounded-full mix-blend-multiply filter blur-[80px] opacity-30 animate-blob animation-delay-2000" />
        <div className="absolute bottom-[30%] right-[35%] w-[420px] h-[420px] bg-[#EFA59A]/30 rounded-full mix-blend-multiply filter blur-[80px] opacity-25 animate-blob animation-delay-6000" />
      </div>

      <main className="relative z-10">
        <ActivitiesHero />
        <ActivitiesBenefits />
        <ActivityLibrary />
        <ActivitiesCTA />
      </main>

      <SiteFooter />
    </>
  );
}
