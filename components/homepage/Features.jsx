import Link from "next/link";
import {
  Heart,
  Globe,
  ShieldCheck,
  Rocket,
  Star,
  ArrowRight,
} from "lucide-react";

export function FeaturesPreview() {
  return (
    <section id="features" className="space-y-12 scroll-mt-20">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 mb-4">
          <Star className="w-4 h-4 text-[#111827] fill-current" />
          <span className="text-xs font-medium text-[#111827] uppercase tracking-wide">
            Features
          </span>
        </div>
        <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4 text-[#111827]">
          Everything You Need for Peace of Mind
        </h2>
        <p className="text-lg text-gray-500 leading-relaxed">
          We&apos;ve reimagined childcare for modern families. Safe,
          educational, and culturally aligned.
        </p>
      </div>

      {/* Feature Cards Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Smart Matching */}
        <div className="glass-card rounded-3xl p-8 space-y-5 hover:shadow-xl transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#FFE5B4] flex items-center justify-center">
              <Heart className="w-[22px] h-[22px] text-[#E5533D]" />
            </div>
            <h3 className="text-xl font-semibold text-[#111827]">
              Smart Matching
            </h3>
          </div>
          <p className="text-gray-600 leading-relaxed">
            Our algorithm considers language, cultural background, and special
            needs to find the perfect role model for your children.
          </p>
          <div className="pt-3 border-t border-gray-100">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              Matching capabilities
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1.5 rounded-lg bg-gray-50 text-gray-700 text-sm">
                Language Match
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-gray-50 text-gray-700 text-sm">
                Special Needs
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-gray-50 text-gray-700 text-sm">
                Education Support
              </span>
            </div>
          </div>
        </div>

        {/* Cultural & Language */}
        <div className="glass-card rounded-3xl p-8 space-y-5 hover:shadow-xl transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#FFE5B4] flex items-center justify-center">
              <Globe className="w-[22px] h-[22px] text-[#E5533D]" />
            </div>
            <h3 className="text-xl font-semibold text-[#111827]">
              Cultural Match
            </h3>
          </div>
          <p className="text-gray-600 leading-relaxed">
            Find sitters who speak your language and understand your cultural
            traditions. Keep your heritage alive.
          </p>
          <div className="pt-3 border-t border-gray-100">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              15+ languages available
            </div>
            <div className="flex gap-2">
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-lg">
                🇨🇳
              </div>
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-lg">
                🇸🇦
              </div>
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-lg">
                🇪🇸
              </div>
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-lg">
                🇮🇳
              </div>
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-600">
                +11
              </div>
            </div>
          </div>
        </div>

        {/* Safety & Verification */}
        <div className="glass-card rounded-3xl p-8 space-y-5 hover:shadow-xl transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#FFE5B4] flex items-center justify-center">
              <ShieldCheck className="w-[22px] h-[22px] text-[#E5533D]" />
            </div>
            <h3 className="text-xl font-semibold text-[#111827]">
              100% Verified
            </h3>
          </div>
          <p className="text-gray-600 leading-relaxed">
            Every sitter undergoes rigorous background checks, ID verification,
            and reference screening.
          </p>
          <div className="pt-3 border-t border-gray-100">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <div className="w-1.5 h-1.5 rounded-full bg-[#E5533D]" />
                Government ID Verification
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <div className="w-1.5 h-1.5 rounded-full bg-[#E5533D]" />
                Criminal Record Check
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <div className="w-1.5 h-1.5 rounded-full bg-[#E5533D]" />
                Reference Verification
              </div>
            </div>
          </div>
        </div>

        {/* Micro-Adventures - Highlighted */}
        <div className="glass-card rounded-3xl p-8 space-y-5 hover:shadow-xl transition-shadow border border-[#E5533D]/10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#E5533D] flex items-center justify-center">
              <Rocket className="w-[22px] h-[22px] text-white" />
            </div>
            <h3 className="text-xl font-semibold text-[#111827]">
              Micro-Adventures
            </h3>
          </div>
          <p className="text-gray-600 leading-relaxed">
            Turn babysitting into learning time with science experiments,
            creative arts, and cooking activities.
          </p>
          <div className="pt-3 border-t border-gray-100">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              Activity categories
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1.5 rounded-lg bg-[#FFE5B4]/50 text-[#111827] font-medium text-sm">
                STEM
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-[#FFE5B4]/50 text-[#111827] font-medium text-sm">
                Arts & Crafts
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-[#FFE5B4]/50 text-[#111827] font-medium text-sm">
                Cooking
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Link */}
      <div className="text-center pt-4">
        <Link
          href="/features"
          className="inline-flex items-center gap-2 text-[#E5533D] font-semibold hover:gap-3 transition-all"
        >
          <span>Explore All Features</span>
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </section>
  );
}
