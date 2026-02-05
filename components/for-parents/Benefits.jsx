import { Check, ShieldCheck, Rocket, MessageCircle, CreditCard, Heart } from 'lucide-react';

export function ParentBenefits() {
  return (
    <section id="benefits" className="py-20 bg-gradient-to-b from-transparent to-white/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFE5B4] text-[#111827] text-sm font-semibold mb-4">
            Why Choose Us
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-[#111827] mb-4">
            Why Parents Choose littlëHALO
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            More than babysitting—give your children enriching experiences while you get peace of mind
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Benefit 1 */}
          <div className="glass-card rounded-2xl p-8 transition-all hover:shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-[#E5533D]/10 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6 text-[#E5533D]" />
            </div>
            <h3 className="text-xl font-bold text-[#111827] mb-3">100% Verified Sitters</h3>
            <p className="text-gray-600 mb-4">
              Every sitter undergoes comprehensive background checks, identity verification, and reference checks
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-sm text-gray-600">
                <Check className="w-5 h-5 text-[#E5533D] shrink-0 mt-0.5" />
                Criminal background checks
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-600">
                <Check className="w-5 h-5 text-[#E5533D] shrink-0 mt-0.5" />
                Identity verification
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-600">
                <Check className="w-5 h-5 text-[#E5533D] shrink-0 mt-0.5" />
                Reference checks
              </li>
            </ul>
          </div>

          {/* Benefit 2 */}
          <div className="glass-card rounded-2xl p-8 transition-all hover:shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-[#E5533D]/10 flex items-center justify-center mb-4">
              <Rocket className="w-6 h-6 text-[#E5533D]" />
            </div>
            <h3 className="text-xl font-bold text-[#111827] mb-3">Micro-Adventures</h3>
            <p className="text-gray-600 mb-4">
              Educational activities like music lessons, language practice, and art projects
            </p>
            <div className="flex gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-[#FFE5B4] text-sm font-medium text-[#111827]">
                🎨 Music & Arts
              </span>
              <span className="px-3 py-1 rounded-full bg-[#FFE5B4] text-sm font-medium text-[#111827]">
                🌍 Languages
              </span>
              <span className="px-3 py-1 rounded-full bg-[#FFE5B4] text-sm font-medium text-[#111827]">
                🔬 STEM
              </span>
            </div>
          </div>

          {/* Benefit 3 */}
          <div className="glass-card rounded-2xl p-8 transition-all hover:shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-[#E5533D]/10 flex items-center justify-center mb-4">
              <Check className="w-6 h-6 text-[#E5533D]" />
            </div>
            <h3 className="text-xl font-bold text-[#111827] mb-3">Flexible Booking</h3>
            <p className="text-gray-600 mb-4">
              Book instantly, schedule in advance, or set up recurring care that fits your lifestyle
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-sm text-gray-600">
                <Check className="w-5 h-5 text-[#E5533D] shrink-0 mt-0.5" />
                Instant booking available
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-600">
                <Check className="w-5 h-5 text-[#E5533D] shrink-0 mt-0.5" />
                Schedule in advance
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-600">
                <Check className="w-5 h-5 text-[#E5533D] shrink-0 mt-0.5" />
                Recurring bookings
              </li>
            </ul>
          </div>

          {/* Benefit 4 */}
          <div className="glass-card rounded-2xl p-8 transition-all hover:shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-[#E5533D]/10 flex items-center justify-center mb-4">
              <MessageCircle className="w-6 h-6 text-[#E5533D]" />
            </div>
            <h3 className="text-xl font-bold text-[#111827] mb-3">Direct Communication</h3>
            <p className="text-gray-600 mb-4">
              Stay connected with secure messaging, real-time updates, and photo sharing
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-sm text-gray-600">
                <Check className="w-5 h-5 text-[#E5533D] shrink-0 mt-0.5" />
                Secure messaging platform
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-600">
                <Check className="w-5 h-5 text-[#E5533D] shrink-0 mt-0.5" />
                Real-time updates
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-600">
                <Check className="w-5 h-5 text-[#E5533D] shrink-0 mt-0.5" />
                Photo sharing
              </li>
            </ul>
          </div>

          {/* Benefit 5 */}
          <div className="glass-card rounded-2xl p-8 transition-all hover:shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-[#E5533D]/10 flex items-center justify-center mb-4">
              <CreditCard className="w-6 h-6 text-[#E5533D]" />
            </div>
            <h3 className="text-xl font-bold text-[#111827] mb-3">Transparent Pricing</h3>
            <p className="text-gray-600 mb-4">
              Clear, upfront pricing with no hidden fees. Secure payment and instant receipts
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-sm text-gray-600">
                <Check className="w-5 h-5 text-[#E5533D] shrink-0 mt-0.5" />
                No hidden fees
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-600">
                <Check className="w-5 h-5 text-[#E5533D] shrink-0 mt-0.5" />
                Secure payment processing
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-600">
                <Check className="w-5 h-5 text-[#E5533D] shrink-0 mt-0.5" />
                Instant digital receipts
              </li>
            </ul>
          </div>

          {/* Benefit 6 */}
          <div className="glass-card rounded-2xl p-8 transition-all hover:shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-[#E5533D]/10 flex items-center justify-center mb-4">
              <Heart className="w-6 h-6 text-[#E5533D]" />
            </div>
            <h3 className="text-xl font-bold text-[#111827] mb-3">Favorites & Reviews</h3>
            <p className="text-gray-600 mb-4">
              Save your favorite sitters, read verified reviews, and rebook with one tap
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-sm text-gray-600">
                <Check className="w-5 h-5 text-[#E5533D] shrink-0 mt-0.5" />
                Save favorite sitters
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-600">
                <Check className="w-5 h-5 text-[#E5533D] shrink-0 mt-0.5" />
                Verified reviews only
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-600">
                <Check className="w-5 h-5 text-[#E5533D] shrink-0 mt-0.5" />
                Quick rebooking
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
