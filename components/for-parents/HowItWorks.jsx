import { Check, ShieldCheck } from 'lucide-react';

export function ParentHowItWorks() {
  return (
    <section id="how-it-works" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFE5B4] text-[#111827] text-sm font-semibold mb-4">
            How It Works
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-[#111827] mb-4">
            Getting Started is Easy
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Finding trusted childcare has never been easier. From search to booking in just a few clicks
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="glass-card rounded-2xl p-8 text-center transition-all hover:shadow-xl">
            <div className="text-6xl font-bold text-gray-100 mb-4">01</div>
            <h3 className="text-2xl font-bold text-[#111827] mb-3">Search & Filter</h3>
            <p className="text-gray-600 mb-4">
              Browse verified sitters by location, language, experience, and available micro-adventures
            </p>
            <div className="inline-flex items-center gap-2 text-sm text-[#E5533D] font-medium">
              <Check className="w-4 h-4" />
              Takes 2 minutes
            </div>
          </div>

          {/* Step 2 */}
          <div className="glass-card rounded-2xl p-8 text-center transition-all hover:shadow-xl">
            <div className="text-6xl font-bold text-gray-100 mb-4">02</div>
            <h3 className="text-2xl font-bold text-[#111827] mb-3">Review & Connect</h3>
            <p className="text-gray-600 mb-4">
              Read reviews, check credentials, and message sitters directly to find the perfect match
            </p>
            <div className="inline-flex items-center gap-2 text-sm text-[#E5533D] font-medium">
              <ShieldCheck className="w-4 h-4" />
              100% verified sitters
            </div>
          </div>

          {/* Step 3 */}
          <div className="glass-card rounded-2xl p-8 text-center transition-all hover:shadow-xl border-2 border-[#E5533D]">
            <div className="text-6xl font-bold text-[#E5533D]/20 mb-4">03</div>
            <h3 className="text-2xl font-bold text-[#111827] mb-3">Book & Enjoy</h3>
            <p className="text-gray-600 mb-4">
              Schedule care, pay securely, and relax knowing your children are in trusted hands
            </p>
            <div className="inline-flex items-center gap-2 text-sm text-[#E5533D] font-medium">
              <Check className="w-4 h-4" />
              Fully insured
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
