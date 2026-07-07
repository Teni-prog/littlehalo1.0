import { useTranslations } from "next-intl";
import {
  Brain,
  Users2,
  DollarSign,
  Palette,
  Globe,
  MonitorOff,
} from "lucide-react";

const BENEFITS = [
  { icon: Brain, key: "realLearning" },
  { icon: Users2, key: "perfectForStage" },
  { icon: DollarSign, key: "includedInBooking" },
  { icon: Palette, key: "tailoredToInterests" },
  { icon: Globe, key: "heritageHonored" },
  { icon: MonitorOff, key: "handsOnNotScreenTime" },
];

export function ActivitiesBenefits() {
  const t = useTranslations("adventuresBenefits");

  return (
    <section className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {t("heading")}
          </h2>
          <p className="text-lg text-gray-600">
            {t.rich("intro", {
              strong: (chunks) => <strong>{chunks}</strong>,
            })}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {BENEFITS.map((benefit) => (
            <div
              key={benefit.key}
              className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-all"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center mb-4">
                <benefit.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {t(`items.${benefit.key}.title`)}
              </h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                {t(`items.${benefit.key}.description`)}
              </p>
              <div className="text-sm text-gray-500 italic">
                {t("exampleLabel")}: {t(`items.${benefit.key}.example`)}
              </div>
            </div>
          ))}
        </div>

        {/* The Difference Callout */}
        <div className="mt-16 max-w-4xl mx-auto bg-gradient-to-br from-peach/30 to-coral/20 border border-gray-200 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
            {t("difference.heading")}
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="text-sm font-semibold text-gray-500 mb-2">
                ❌ {t("difference.traditionalLabel")}
              </div>
              <p className="text-gray-600">
                {t("difference.traditionalDescription")}
              </p>
            </div>
            <div>
              <div className="text-sm font-semibold text-primary mb-2">
                ✓ {t("difference.haloLabel")}
              </div>
              <p className="text-gray-900 font-medium">
                {t("difference.haloDescription")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
