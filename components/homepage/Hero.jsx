import Link from "next/link";
import Image from "next/image";
import { MapPin, Search, Check, Clock, Globe, ShieldCheck } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative w-full min-h-[90vh] flex items-center pt-24 pb-20">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Content */}
          <div className="relative z-10 text-center lg:text-left">
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFE5B4] text-[#111827] text-sm font-semibold mb-6">
              <Check className="w-[18px] h-[18px] text-[#E5533D]" />
              Trusted by 2,000+ families
            </div>

            {/* Heading */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-medium tracking-tight text-[#111827] mb-6 leading-[1.05]">
              Culturally-Matched{" "}
              <span className="text-[#E5533D]">Childcare</span>
            </h1>

            {/* Paragraph */}
            <p className="text-lg text-gray-600 mb-8 max-w-xl leading-relaxed">
              Connect with verified babysitters who understand your
              family&apos;s culture and language. Book trusted care in under 2
              hours—no waitlists.
            </p>

            {/* Search Box */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <div className="relative flex-1">
                <MapPin
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                  aria-hidden="true"
                />
                <label htmlFor="location-search" className="sr-only">
                  Enter your location or postal code
                </label>
                <input
                  id="location-search"
                  type="text"
                  name="location"
                  autoComplete="address-level2"
                  placeholder="Enter your location or postal code"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 focus:border-[#E5533D] focus:outline-none focus:ring-2 focus:ring-[#E5533D]/20 text-gray-900 placeholder:text-gray-400 bg-white shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5533D] focus-visible:ring-offset-1"
                />
              </div>
              <Link
                href="/signup"
                className="flex items-center justify-center gap-2 bg-linear-to-r from-[#E5533D] to-[#D4442C] text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-[#E5533D]/30 transition-all whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5533D] focus-visible:ring-offset-2"
              >
                Search Sitters
                <Search className="w-5 h-5" aria-hidden="true" />
              </Link>
            </div>

            {/* Trust Stats */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 lg:gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-[#E5533D]" aria-hidden="true" />
                <span className="text-gray-700">
                  <span className="font-semibold text-[#111827]">100%</span>{" "}
                  Verified
                </span>
              </div>
              <div className="w-px h-4 bg-gray-300" />
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#E5533D]" />
                <span className="text-gray-700">
                  <span className="font-semibold text-[#111827]">
                    &lt;2 hours
                  </span>{" "}
                  to match
                </span>
              </div>
              <div className="w-px h-4 bg-gray-300" />
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-[#E5533D]" />
                <span className="text-gray-700">
                  <span className="font-semibold text-[#111827]">15+</span>{" "}
                  Languages
                </span>
              </div>
            </div>
          </div>

          {/* Right Column - Hero Image */}
          <div className="relative lg:h-[600px] h-[500px]">
            {/* Main Hero Image */}
            <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&h=1000&fit=crop&q=80"
                alt="Happy child enjoying outdoor playground swing"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />

              {/* Floating Verification Badge */}
              <div className="absolute bottom-6 left-6 glass-card px-5 py-4 rounded-2xl shadow-xl max-w-[280px]">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#E5533D] flex items-center justify-center shrink-0 shadow-lg">
                    <ShieldCheck className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-[#E5533D] uppercase tracking-wide mb-0.5">
                      100% Verified
                    </div>
                    <div className="text-sm font-semibold text-[#111827]">
                      Background Checked
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      All sitters screened & verified
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Language Badge */}
              <div className="absolute top-6 right-6 glass-card px-4 py-3 rounded-xl shadow-lg">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    <div className="w-7 h-7 rounded-full bg-linear-to-br from-[#E5533D] to-[#D4442C] flex items-center justify-center text-white text-xs font-bold border-2 border-white">
                      🇵🇹
                    </div>
                    <div className="w-7 h-7 rounded-full bg-linear-to-br from-[#E5533D] to-[#D4442C] flex items-center justify-center text-white text-xs font-bold border-2 border-white">
                      🇮🇳
                    </div>
                    <div className="w-7 h-7 rounded-full bg-linear-to-br from-[#E5533D] to-[#D4442C] flex items-center justify-center text-white text-xs font-bold border-2 border-white">
                      🇵🇭
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-[#111827]">
                    15+ Languages
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
