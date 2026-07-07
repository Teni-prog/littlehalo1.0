import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Sparkles, UserPlus } from "lucide-react";

const DOTTED_PATTERN_STYLE = {
  backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
  backgroundSize: "24px 24px",
};

export function ActivitiesCTA() {
  const t = useTranslations("adventuresCTA");

  return (
    <section className="py-20 bg-[#1F2937] relative overflow-hidden">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={DOTTED_PATTERN_STYLE}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-white" />
            <span className="text-sm font-medium text-white">
              {t("badge")}
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            {t("heading")}
          </h2>

          <p className="text-lg sm:text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            {t("description")}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Link
              href="/login"
              className="w-full sm:w-auto px-8 py-4 bg-linear-to-r from-primary to-primary-dark text-white font-bold rounded-lg hover:shadow-xl hover:shadow-primary/25 transition-all flex items-center justify-center gap-2 group"
            >
              <UserPlus className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>{t("actions.getStartedFree")}</span>
            </Link>
            <Link
              href="/search"
              className="w-full sm:w-auto px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/20 text-white font-bold rounded-lg hover:bg-white/20 transition-all"
            >
              {t("actions.browseSitters")}
            </Link>
          </div>

          {/* For Sitters CTA */}
          <div className="pt-8 border-t border-white/20">
            <p className="text-white/80 mb-4">
              {t("sitterCta.question")}
            </p>
            <Link
              href="/for-sitters"
              className="text-white font-semibold hover:underline inline-flex items-center gap-2"
            >
              {t("sitterCta.link")}
              <span className="group-hover:translate-x-1 transition-transform">
                →
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
