import Link from "next/link";
import { Users, Clock, Heart, DollarSign, ArrowRight } from "lucide-react";

export function DualCTA() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-[#1F2937] rounded-3xl overflow-hidden">
          <div className="grid lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-gray-700">
            {/* Left Side - For Parents */}
            <div className="p-10 md:p-12 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20">
                <Users className="w-4 h-4 text-[#FFE5B4]" />
                <span className="text-xs font-medium text-[#FFE5B4] uppercase tracking-wide">
                  For Parents
                </span>
              </div>

              <h2 className="text-3xl md:text-4xl font-semibold text-white">
                Find your village instantly.
              </h2>

              <p className="text-gray-300 text-lg leading-relaxed">
                Stop calling daycares that are full. Browse profiles, check
                reviews, and book a verified sitter for tonight or next month.
              </p>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-[#E5533D] shrink-0 mt-0.5" />
                  <p className="text-gray-300">
                    <span className="font-semibold text-white">
                      Same-day booking
                    </span>{" "}
                    available for emergencies.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <Heart className="w-5 h-5 text-[#E5533D] shrink-0 mt-0.5" />
                  <p className="text-gray-300">
                    <span className="font-semibold text-white">
                      Special needs support
                    </span>{" "}
                    with specialized filters.
                  </p>
                </div>
              </div>

              <Link
                href="/signup"
                className="inline-flex items-center gap-2 text-white font-semibold hover:gap-3 transition-all group"
              >
                <span>Create Family Profile</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            {/* Right Side - For Sitters */}
            <div className="p-10 md:p-12 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20">
                <DollarSign className="w-4 h-4 text-[#FFE5B4]" />
                <span className="text-xs font-medium text-[#FFE5B4] uppercase tracking-wide">
                  For Sitters
                </span>
              </div>

              <h2 className="text-3xl md:text-4xl font-semibold text-white">
                Earn meaningful income.
              </h2>

              <p className="text-gray-300 text-lg leading-relaxed">
                Turn your childcare experience into flexible earnings. Set your
                rates, choose your hours, and help newcomer families thrive.
              </p>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors">
                <div className="text-3xl font-bold text-white mb-2">
                  <span className="font-bold">$18-28</span>{" "}
                  <span className="text-xl font-normal">/hr</span>
                </div>
                <p className="text-[#FFE5B4]">
                  Plus <span className="font-semibold">$50 monthly bonus</span>{" "}
                  for top rated sitters.
                </p>
              </div>

              <Link
                href="/signup"
                className="inline-flex items-center gap-2 text-white font-semibold hover:gap-3 transition-all group"
              >
                <span>Become a Sitter</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
