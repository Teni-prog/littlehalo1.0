import { Check, ShieldCheck, Clock } from 'lucide-react';

export function SitterHowItWorks() {
  return (
    <section id="how-it-works" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFE5B4] text-[#111827] text-sm font-semibold mb-4">
            How It Works
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-[#111827] mb-4">
            Get Started in 3 Simple Steps
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            From signup to your first booking in as little as 48 hours
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Step 1 */}
          <div className="glass-card rounded-2xl p-8 text-center transition-all hover:shadow-xl relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-gradient-to-br from-[#E5533D] to-[#D4442C] text-white font-bold flex items-center justify-center text-lg">
              01
            </div>
            <h3 className="text-2xl font-bold text-[#111827] mb-3 mt-4">Create Your Profile</h3>
            <p className="text-gray-600 mb-4">
              Share your experience, certifications, availability, and the micro-adventures you offer
            </p>
            <div className="inline-flex items-center gap-2 text-sm text-[#E5533D] font-medium">
              <Clock className="w-4 h-4" />
              Takes 5 minutes
            </div>
          </div>

          {/* Step 2 */}
          <div className="glass-card rounded-2xl p-8 text-center transition-all hover:shadow-xl relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-gradient-to-br from-[#E5533D] to-[#D4442C] text-white font-bold flex items-center justify-center text-lg">
              02
            </div>
            <h3 className="text-2xl font-bold text-[#111827] mb-3 mt-4">Get Verified</h3>
            <p className="text-gray-600 mb-4">
              Complete a quick background check and identity verification to build trust with families
            </p>
            <div className="inline-flex items-center gap-2 text-sm text-[#E5533D] font-medium">
              <ShieldCheck className="w-4 h-4" />
              24-48 hour approval
            </div>
          </div>

          {/* Step 3 */}
          <div className="glass-card rounded-2xl p-8 text-center transition-all hover:shadow-xl border-2 border-[#E5533D] relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-gradient-to-br from-[#E5533D] to-[#D4442C] text-white font-bold flex items-center justify-center text-lg">
              03
            </div>
            <h3 className="text-2xl font-bold text-[#111827] mb-3 mt-4">Start Booking</h3>
            <p className="text-gray-600 mb-4">
              Accept jobs that fit your schedule, meet families, and start earning
            </p>
            <div className="inline-flex items-center gap-2 text-sm text-[#E5533D] font-medium">
              <Check className="w-4 h-4" />
              Start earning today
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
