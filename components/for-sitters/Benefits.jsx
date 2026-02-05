import { Check, DollarSign, Calendar, Rocket, ShieldCheck, Users, TrendingUp } from 'lucide-react';

export function SitterBenefits() {
  return (
    <section id="benefits" className="py-20 bg-gradient-to-b from-transparent to-white/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFE5B4] text-[#111827] text-sm font-semibold mb-4">
            Why Join Us
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-[#111827] mb-4">
            Why Sitters Love littlëHALO
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            More than just babysitting—build a rewarding career while making a real difference
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Benefit 1 */}
          <div className="glass-card rounded-2xl p-8 transition-all hover:shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-[#E5533D]/10 flex items-center justify-center mb-4">
              <DollarSign className="w-6 h-6 text-[#E5533D]" />
            </div>
            <h3 className="text-xl font-bold text-[#111827] mb-3">Set Your Own Rates</h3>
            <p className="text-gray-600 mb-4">
              Earn $18-35/hour based on your experience and skills
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-sm text-gray-600">
                <Check className="w-5 h-5 text-[#E5533D] shrink-0 mt-0.5" />
                Weekly direct deposits
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-600">
                <Check className="w-5 h-5 text-[#E5533D] shrink-0 mt-0.5" />
                No commission fees
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-600">
                <Check className="w-5 h-5 text-[#E5533D] shrink-0 mt-0.5" />
                Transparent pricing
              </li>
            </ul>
          </div>

          {/* Benefit 2 */}
          <div className="glass-card rounded-2xl p-8 transition-all hover:shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-[#E5533D]/10 flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6 text-[#E5533D]" />
            </div>
            <h3 className="text-xl font-bold text-[#111827] mb-3">Flexible Schedule</h3>
            <p className="text-gray-600 mb-4">
              Work when it fits your life—no minimum hours required
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-sm text-gray-600">
                <Check className="w-5 h-5 text-[#E5533D] shrink-0 mt-0.5" />
                Control your calendar
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-600">
                <Check className="w-5 h-5 text-[#E5533D] shrink-0 mt-0.5" />
                Accept or decline jobs
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-600">
                <Check className="w-5 h-5 text-[#E5533D] shrink-0 mt-0.5" />
                No minimum hours
              </li>
            </ul>
          </div>

          {/* Benefit 3 */}
          <div className="glass-card rounded-2xl p-8 transition-all hover:shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-[#E5533D]/10 flex items-center justify-center mb-4">
              <Rocket className="w-6 h-6 text-[#E5533D]" />
            </div>
            <h3 className="text-xl font-bold text-[#111827] mb-3">Micro-Adventures</h3>
            <p className="text-gray-600 mb-4">
              Offer unique educational activities and showcase your talents
            </p>
            <div className="flex gap-2 flex-wrap mb-3">
              <span className="px-3 py-1 rounded-full bg-[#FFE5B4] text-sm font-medium text-[#111827]">
                🎵 Music
              </span>
              <span className="px-3 py-1 rounded-full bg-[#FFE5B4] text-sm font-medium text-[#111827]">
                🎨 Arts
              </span>
              <span className="px-3 py-1 rounded-full bg-[#FFE5B4] text-sm font-medium text-[#111827]">
                🔬 STEM
              </span>
            </div>
            <p className="text-sm text-gray-600">Charge extra for special skills</p>
          </div>

          {/* Benefit 4 */}
          <div className="glass-card rounded-2xl p-8 transition-all hover:shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-[#E5533D]/10 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6 text-[#E5533D]" />
            </div>
            <h3 className="text-xl font-bold text-[#111827] mb-3">Safety & Support</h3>
            <p className="text-gray-600 mb-4">
              Get 24/7 support, insurance coverage, and secure payments
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-sm text-gray-600">
                <Check className="w-5 h-5 text-[#E5533D] shrink-0 mt-0.5" />
                Family verification
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-600">
                <Check className="w-5 h-5 text-[#E5533D] shrink-0 mt-0.5" />
                Liability coverage
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-600">
                <Check className="w-5 h-5 text-[#E5533D] shrink-0 mt-0.5" />
                24/7 support line
              </li>
            </ul>
          </div>

          {/* Benefit 5 */}
          <div className="glass-card rounded-2xl p-8 transition-all hover:shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-[#E5533D]/10 flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-[#E5533D]" />
            </div>
            <h3 className="text-xl font-bold text-[#111827] mb-3">Verified Families</h3>
            <p className="text-gray-600 mb-4">
              Work with pre-screened, quality families you can trust
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-sm text-gray-600">
                <Check className="w-5 h-5 text-[#E5533D] shrink-0 mt-0.5" />
                Profile reviews before booking
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-600">
                <Check className="w-5 h-5 text-[#E5533D] shrink-0 mt-0.5" />
                Secure messaging
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-600">
                <Check className="w-5 h-5 text-[#E5533D] shrink-0 mt-0.5" />
                Choose your families
              </li>
            </ul>
          </div>

          {/* Benefit 6 */}
          <div className="glass-card rounded-2xl p-8 transition-all hover:shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-[#E5533D]/10 flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-[#E5533D]" />
            </div>
            <h3 className="text-xl font-bold text-[#111827] mb-3">Career Growth</h3>
            <p className="text-gray-600 mb-4">
              Build your reputation and increase your earnings over time
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-sm text-gray-600">
                <Check className="w-5 h-5 text-[#E5533D] shrink-0 mt-0.5" />
                Free CPR/First Aid training
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-600">
                <Check className="w-5 h-5 text-[#E5533D] shrink-0 mt-0.5" />
                Skills workshops
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-600">
                <Check className="w-5 h-5 text-[#E5533D] shrink-0 mt-0.5" />
                Career development
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
