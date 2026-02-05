import Link from 'next/link';
import Image from 'next/image';
import { DollarSign, Calendar, ShieldCheck, Users, Star } from 'lucide-react';

export function SitterHero() {
  return (
    <section className="w-full min-h-[90vh] flex items-center py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column: Content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFE5B4] text-[#111827] text-sm font-semibold mb-6">
              <Users className="w-4 h-4 text-[#E5533D]" />
              Join 1,500+ trusted sitters
            </div>

            {/* Heading */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-[#111827] mb-6 leading-tight">
              Turn Your Love for Kids Into <span className="text-[#E5533D]">Meaningful Income</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0">
              Join littlëHALO and create a flexible childcare career on your terms. 
              Set your rates, choose your hours, and enrich children's lives with educational micro-adventures.
            </p>

            {/* Trust Stats */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 lg:gap-6 text-sm mb-8">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-[#E5533D]" />
                <span className="text-gray-700">
                  <span className="font-semibold text-[#111827]">$18-35</span> Per hour
                </span>
              </div>
              <div className="w-px h-4 bg-gray-300" />
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#E5533D]" />
                <span className="text-gray-700">
                  <span className="font-semibold text-[#111827]">100%</span> Flexible
                </span>
              </div>
              <div className="w-px h-4 bg-gray-300" />
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#E5533D]" />
                <span className="text-gray-700">
                  <span className="font-semibold text-[#111827]">24/7</span> Support
                </span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                href="/profile-setup-sitter"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#E5533D] to-[#D4442C] text-white px-8 py-4 rounded-lg font-semibold hover:shadow-lg hover:shadow-[#E5533D]/30 transition-all"
              >
                Start Earning Today
              </Link>
              <Link
                href="/how-it-works"
                className="inline-flex items-center justify-center gap-2 bg-white/80 backdrop-blur-sm text-[#E5533D] px-8 py-4 rounded-lg font-semibold border-2 border-[#E5533D] hover:bg-[#E5533D] hover:text-white transition-all"
              >
                Learn How
              </Link>
            </div>
          </div>

          {/* Right Column: Hero Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden aspect-[4/5]">
              <Image
                src="https://images.unsplash.com/photo-1544776193-352d25ca82cd?w=800&h=1000&fit=crop"
                alt="Happy babysitter with child"
                fill
                className="object-cover"
                priority
              />
              
              {/* Floating Badge: Earnings */}
              <div className="absolute top-6 right-6 glass-card rounded-lg px-4 py-3">
                <div className="text-xs text-gray-600">Last Month</div>
                <div className="text-2xl font-bold text-[#E5533D]">$2,450</div>
                <div className="text-xs text-gray-600">Sarah C. - Vancouver</div>
              </div>
              
              {/* Floating Badge: Rating */}
              <div className="absolute bottom-6 left-6 glass-card rounded-lg px-4 py-3 flex items-center gap-2">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-[#E5533D] fill-[#E5533D]" />
                  ))}
                </div>
                <span className="text-sm font-semibold text-[#111827]">4.9 Avg Rating</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
