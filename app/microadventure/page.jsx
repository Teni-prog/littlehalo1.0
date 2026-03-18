// import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { SiteFooter } from "@/components/Footer";
import { ActivitiesHero } from "@/components/micro-adventures/Hero";
import { ActivitiesBenefits } from "@/components/micro-adventures/Benefits";
import { ActivityLibrary } from "@/components/micro-adventures/ActivityLibrary";
import { ActivitiesCTA } from "@/components/micro-adventures/CTA";
import { mockActivities } from "@/lib/mock-data/activities";

export const metadata = {
  title: "Micro-Adventures - Educational Activities | littlëHALO",
  description:
    "Browse 50+ educational activities included with every babysitting session. From STEM experiments to cultural crafts—all at no extra cost.",
};

export default function MicroAdventuresPage() {
  return (
    <>
      {/* <PublicNavbar activePage="activities" /> */}

      <main>
        {/* <ActivitiesHero /> */}
        {/* <ActivitiesBenefits /> */}
        <ActivityLibrary />
        {/* <mockActivities /> */}
        {/* <ActivitiesCTA /> */}
      </main>

      {/* <SiteFooter /> */}
    </>
  );
}
