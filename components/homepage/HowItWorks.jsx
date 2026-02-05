import Link from "next/link";
import {
  UserPlus,
  Users,
  CalendarCheck,
  Clock,
  Check,
  ShieldCheck,
  PlayCircle,
  ArrowRight,
} from "lucide-react";

export function HowItWorksPreview() {
  return (
    <section id="how-it-works" className="space-y-12 scroll-mt-20">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 mb-4">
          <PlayCircle className="w-4 h-4 text-[#111827]" />
          <span className="text-xs font-medium text-[#111827] uppercase tracking-wide">
            How It Works
          </span>
        </div>
        <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4 text-[#111827]">
          Getting Started is Easy
        </h2>
        <p className="text-lg text-gray-500 leading-relaxed">
          Finding trusted childcare has never been easier. Get matched in
          minutes.
        </p>
      </div>

      {/* Steps Grid */}
      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {/* Step 1 */}
        <div className="glass-card rounded-3xl p-8 relative overflow-hidden group hover:shadow-xl transition-shadow">
          <div className="absolute top-4 right-4 text-6xl font-bold text-gray-100 group-hover:text-[#FFE5B4] transition-colors">
            01
          </div>
          <div className="relative z-10 space-y-5">
            <div className="w-12 h-12 rounded-xl bg-[#E5533D] flex items-center justify-center shadow-lg">
              <UserPlus className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-[#111827] mb-2">
                Create Your Profile
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Tell us about your family&apos;s needs, language preferences,
                and any special requirements.
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500 pt-2">
              <Clock className="w-4 h-4" />
              <span>Takes 3 minutes</span>
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="glass-card rounded-3xl p-8 relative overflow-hidden group hover:shadow-xl transition-shadow">
          <div className="absolute top-4 right-4 text-6xl font-bold text-gray-100 group-hover:text-[#FFE5B4] transition-colors">
            02
          </div>
          <div className="relative z-10 space-y-5">
            <div className="w-12 h-12 rounded-xl bg-[#E5533D] flex items-center justify-center shadow-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-[#111827] mb-2">
                Browse & Match
              </h3>
              <p className="text-gray-600 leading-relaxed">
                View culturally-matched, verified sitters in your area. Read
                reviews and check availability.
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500 pt-2">
              <Check className="w-4 h-4" />
              <span>100% verified sitters</span>
            </div>
          </div>
        </div>

        {/* Step 3 - Highlighted */}
        <div className="glass-card rounded-3xl p-8 relative overflow-hidden group hover:shadow-xl transition-shadow border border-[#E5533D]/10">
          <div className="absolute top-4 right-4 text-6xl font-bold text-gray-100 group-hover:text-[#FFE5B4] transition-colors">
            03
          </div>
          <div className="relative z-10 space-y-5">
            <div className="w-12 h-12 rounded-xl bg-[#E5533D] flex items-center justify-center shadow-lg">
              <CalendarCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-[#111827] mb-2">
                Book with Confidence
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Schedule care and relax knowing your kids are in safe, caring
                hands. Track everything in-app.
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-[#E5533D] pt-2">
              <ShieldCheck className="w-4 h-4" />
              <span className="font-medium">Fully insured</span>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Flow - Desktop Only */}
      <div className="hidden md:flex items-center justify-center gap-8 max-w-2xl mx-auto pt-8">
        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[#FFE5B4] text-[#111827] font-bold text-lg">
          1
        </div>
        <div className="w-20 h-px bg-linear-to-r from-[#FFE5B4] to-gray-200" />
        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[#FFE5B4] text-[#111827] font-bold text-lg">
          2
        </div>
        <div className="w-20 h-px bg-linear-to-r from-[#FFE5B4] to-gray-200" />
        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[#E5533D] shadow-lg">
          <Check className="w-7 h-7 text-white" />
        </div>
      </div>

      {/* Bottom Link */}
      <div className="text-center pt-4">
        <Link
          href="/how-it-works"
          className="inline-flex items-center gap-2 text-[#E5533D] font-semibold hover:gap-3 transition-all"
        >
          <span>Learn More About Our Process</span>
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </section>
  );
}
