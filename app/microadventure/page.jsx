import { Suspense } from "react";
import { ActivitiesHero } from "@/components/micro-adventures/Hero";
import { ActivitiesBenefits } from "@/components/micro-adventures/Benefits";
import { ActivityLibrary } from "@/components/micro-adventures/ActivityLibrary";
import { ActivitiesCTA } from "@/components/micro-adventures/CTA";
import { SiteFooter } from "@/components/Footer";

export const metadata = {
  title: "Micro-Adventures - Educational Activities | littlëHALO",
  description:
    "Browse 50+ educational activities included with every babysitting session. From STEM experiments to cultural crafts—all at no extra cost.",
};

export default function MicroAdventuresPage({ searchParams }) {
  const bookingSitterId =
    typeof searchParams?.sitterId === "string" ? searchParams.sitterId : "";

  return (
    <>
      {/* Animated Background Blobs - Micro Adventures pattern */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[12%] left-[25%] w-110 h-110 bg-peach rounded-full mix-blend-multiply filter blur-[80px] opacity-35 animate-blob animation-delay-4000" />
        <div className="absolute top-[35%] right-[8%] w-122.5 h-122.5 bg-coral rounded-full mix-blend-multiply filter blur-[80px] opacity-30 animate-blob" />
        <div className="absolute bottom-[10%] left-[10%] w-115 h-115 bg-peach/35 rounded-full mix-blend-multiply filter blur-[80px] opacity-30 animate-blob animation-delay-2000" />
        <div className="absolute bottom-[30%] right-[35%] w-105 h-105 bg-coral/30 rounded-full mix-blend-multiply filter blur-[80px] opacity-25 animate-blob animation-delay-6000" />
      </div>

      <main className="relative z-10 pt-16">
        <ActivitiesHero />
        <ActivitiesBenefits />
        <Suspense fallback={
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-teal-500 rounded-full animate-spin" />
          </div>
        }>
          <ActivityLibrary bookingSitterId={bookingSitterId} />
        </Suspense>
        <ActivitiesCTA />
      </main>

      <SiteFooter />
    </>
  );
}
