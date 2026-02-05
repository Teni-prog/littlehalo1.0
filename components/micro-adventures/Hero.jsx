import Link from 'next/link';
import { Sparkles, TrendingUp, Users } from 'lucide-react';

export function ActivitiesHero() {
  return (
    <section className="relative pt-20 pb-16 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FFE5B4]/20 via-white to-[#EFA59A]/10" />
      <div className="absolute top-20 right-10 w-72 h-72 bg-[#E5533D]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-[#FFE5B4]/30 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full mb-6 shadow-sm">
            <Sparkles className="w-4 h-4 text-[#E5533D]" />
            <span className="text-sm font-medium text-gray-700">50+ Educational Activities Included</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            More Than Babysitting—
            <span className="block mt-2 bg-gradient-to-r from-[#E5533D] to-[#D4442C] bg-clip-text text-transparent">
              Adventures in Learning
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            From science experiments to cultural cooking, storytelling to STEM challenges—our micro-adventures 
            turn ordinary babysitting sessions into extraordinary learning experiences. 
            <span className="font-semibold text-gray-900"> All included at no extra cost.</span>
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto mb-10">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-[#E5533D] mb-1">50+</div>
              <div className="text-sm text-gray-600">Activities Available</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-[#E5533D] mb-1">8</div>
              <div className="text-sm text-gray-600">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-[#E5533D] mb-1">500+</div>
              <div className="text-sm text-gray-600">Hours Delivered</div>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="#activities"
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-[#E5533D] to-[#D4442C] text-white font-semibold rounded-lg hover:shadow-lg transition-all"
            >
              Browse Activities
            </Link>
            <Link 
              href="/for-parents"
              className="w-full sm:w-auto px-8 py-3.5 bg-white border-2 border-gray-200 text-gray-900 font-semibold rounded-lg hover:border-gray-300 hover:shadow-md transition-all"
            >
              See How It Works
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-[#E5533D]" />
              <span>Used in <strong>1,200+ bookings</strong></span>
            </div>
            <div className="hidden sm:block w-1 h-1 bg-gray-300 rounded-full" />
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#E5533D]" />
              <span>Average <strong>4.9-star ratings</strong></span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
