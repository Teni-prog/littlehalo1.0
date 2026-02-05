import Link from "next/link";
import {
  MessageCircle,
  Check,
  Rocket,
  TestTube,
  Palette,
  ChefHat,
  ShieldCheck,
  Heart,
} from "lucide-react";
import { PublicNavbar } from '@/components/layout/PublicNavbar';
import { SiteFooter } from "@/components/homepage/Footer";

export const metadata = {
  title: "Features - littlëHALO",
  description:
    "Discover littlëHALO's features: culturally-matched childcare, verified sitters, multilingual support, and flexible scheduling for newcomer families.",
};

export default function FeaturesPage() {
  return (
    <>
      <PublicNavbar activePage="features" />

      {/* Animated Background Blobs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#FFE5B4] rounded-full mix-blend-multiply filter blur-[80px] opacity-40 animate-blob" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#EFA59A] rounded-full mix-blend-multiply filter blur-[80px] opacity-40 animate-blob animation-delay-2000" />
        <div className="absolute bottom-[20%] left-[20%] w-[500px] h-[500px] bg-[#FFE5B4]/30 rounded-full mix-blend-multiply filter blur-[80px] opacity-30 animate-blob animation-delay-4000" />
        <div className="absolute bottom-0 right-[10%] w-[500px] h-[500px] bg-[#EFA59A]/20 rounded-full mix-blend-multiply filter blur-[80px] opacity-25 animate-blob animation-delay-6000" />
      </div>

      {/* Main Content */}
      <main className="relative z-10 pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <section className="text-center mb-20">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-[#111827] mb-6">
              Everything You Need for
              <br />
              Trusted Childcare
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              From cultural matching to specialized care, we've built features
              that address the unique needs of newcomer families in Atlantic
              Canada.
            </p>
          </section>

          {/* Features Grid */}
          <div className="space-y-24">
            {/* Feature 1: Cultural & Language Matching */}
            <section className="glass-card rounded-3xl p-10 md:p-12 lg:grid lg:grid-cols-2 lg:gap-12 lg:items-start">
              <div>
                <div className="w-16 h-16 rounded-2xl bg-[#E5533D]/10 flex items-center justify-center mb-6">
                  <MessageCircle
                    className="w-7 h-7 text-[#E5533D]"
                    strokeWidth={1.5}
                  />
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-[#111827] mb-4">
                  Cultural & Language Matching
                </h2>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  Find sitters who speak your language and understand your
                  family's cultural traditions. Your children deserve care that
                  honors their heritage.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-[#E5533D] shrink-0 mt-0.5" />
                    <span className="text-gray-700">
                      Filter by language (15+ languages available)
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-[#E5533D] shrink-0 mt-0.5" />
                    <span className="text-gray-700">
                      Match with sitters from your cultural background
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-[#E5533D] shrink-0 mt-0.5" />
                    <span className="text-gray-700">
                      Dietary, religious, and cultural preferences respected
                    </span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 lg:mt-0 grid grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <div className="text-3xl mb-2">🇨🇳</div>
                  <div className="font-semibold text-[#111827]">Mandarin</div>
                  <div className="text-sm text-gray-500">
                    8 sitters available
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <div className="text-3xl mb-2">🇸🇦</div>
                  <div className="font-semibold text-[#111827]">Arabic</div>
                  <div className="text-sm text-gray-500">
                    12 sitters available
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <div className="text-3xl mb-2">🇮🇳</div>
                  <div className="font-semibold text-[#111827]">Hindi</div>
                  <div className="text-sm text-gray-500">
                    6 sitters available
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <div className="text-3xl mb-2">🇵🇭</div>
                  <div className="font-semibold text-[#111827]">Tagalog</div>
                  <div className="text-sm text-gray-500">
                    5 sitters available
                  </div>
                </div>
              </div>
            </section>

            {/* Feature 2: Micro-Adventures Library */}
            <section className="glass-card rounded-3xl p-10 md:p-12 lg:grid lg:grid-cols-2 lg:gap-12 lg:items-start">
              <div className="bg-gradient-to-br from-[#EFA59A]/10 to-transparent rounded-2xl p-8 mb-8 lg:mb-0">
                <h3 className="font-semibold text-[#111827] mb-4">
                  Popular Activities
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
                      <TestTube className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <div className="font-medium text-[#111827]">
                        Science Experiments
                      </div>
                      <div className="text-sm text-gray-500">Ages 5-10</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                      <Palette className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-[#111827]">
                        Arts & Crafts
                      </div>
                      <div className="text-sm text-gray-500">All ages</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                      <ChefHat className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium text-[#111827]">
                        Cultural Cooking
                      </div>
                      <div className="text-sm text-gray-500">Ages 6+</div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="w-16 h-16 rounded-2xl bg-[#EFA59A]/20 flex items-center justify-center mb-6">
                  <Rocket
                    className="w-7 h-7 text-[#D4442C]"
                    strokeWidth={1.5}
                  />
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-[#111827] mb-4">
                  Micro-Adventures Library
                </h2>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  Every booking includes access to educational activities.
                  Transform babysitting into learning experiences—science
                  experiments, cultural cooking, language games, and more.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-[#E5533D] shrink-0 mt-0.5" />
                    <span className="text-gray-700">
                      50+ age-appropriate activities
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-[#E5533D] shrink-0 mt-0.5" />
                    <span className="text-gray-700">
                      Materials list and instructions included
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-[#E5533D] shrink-0 mt-0.5" />
                    <span className="text-gray-700">
                      Track your child's learning journey
                    </span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Feature 3: Multi-Layer Safety Verification */}
            <section className="glass-card rounded-3xl p-10 md:p-12">
              <div className="lg:grid lg:grid-cols-2 lg:gap-12 lg:items-start mb-12">
                <div>
                  <div className="w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center mb-6">
                    <ShieldCheck
                      className="w-7 h-7 text-green-600"
                      strokeWidth={1.5}
                    />
                  </div>
                  <h2 className="text-3xl font-bold tracking-tight text-[#111827] mb-4">
                    Multi-Layer Safety Verification
                  </h2>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    Every sitter goes through our rigorous 5-step verification
                    process before they can accept their first booking.
                  </p>
                </div>

                <div className="mt-8 lg:mt-0 bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-8">
                  <div className="grid grid-cols-2 gap-8">
                    <div className="text-center">
                      <div className="text-6xl font-bold text-green-600 mb-1">
                        100%
                      </div>
                      <div className="text-sm font-medium text-gray-700">
                        Verified Sitters
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="bg-white rounded-xl p-4">
                        <div className="text-4xl font-bold text-gray-800 mb-1">
                          0
                        </div>
                        <div className="text-sm font-medium text-gray-700">
                          Safety Incidents
                        </div>
                        <div className="text-xs text-gray-500 mt-2">
                          Since launching in 2024
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  {
                    number: "1",
                    title: "Government ID Verification",
                    desc: "Photo ID verified and cross-checked",
                  },
                  {
                    number: "2",
                    title: "Criminal Record Check",
                    desc: "Enhanced background screening",
                  },
                  {
                    number: "3",
                    title: "Reference Verification",
                    desc: "2+ professional references checked",
                  },
                  {
                    number: "4",
                    title: "First Aid Certification",
                    desc: "CPR & First Aid validated",
                  },
                  {
                    number: "5",
                    title: "Video Interview",
                    desc: "One-on-one screening with our team",
                  },
                ].map((step) => (
                  <div
                    key={step.number}
                    className="flex items-start gap-4 bg-green-100 rounded-xl p-4"
                  >
                    <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold shrink-0">
                      {step.number}
                    </div>
                    <div>
                      <div className="font-semibold text-[#111827]">
                        {step.title}
                      </div>
                      <div className="text-sm text-gray-600">{step.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Feature 4: Specialized Care Support */}
            <section className="glass-card rounded-3xl p-10 md:p-12">
              <div className="text-center mb-12 max-w-3xl mx-auto">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-50 to-transparent flex items-center justify-center mb-6 mx-auto">
                  <Heart
                    className="w-7 h-7 text-purple-600"
                    strokeWidth={1.5}
                  />
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-[#111827] mb-4">
                  Specialized Care Support
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Sitters trained in autism, ADHD, developmental delays, and
                  other special needs. Filter by specific experience and
                  certifications.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl p-6">
                  <h3 className="font-semibold text-[#111827] mb-4 bg-purple-100 inline-block px-3 py-1 rounded-lg">
                    Developmental
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Autism Spectrum</li>
                    <li>• ADHD</li>
                    <li>• Speech Delays</li>
                    <li>• Learning Disabilities</li>
                  </ul>
                </div>

                <div className="bg-white rounded-2xl p-6">
                  <h3 className="font-semibold text-[#111827] mb-4 bg-purple-100 inline-block px-3 py-1 rounded-lg">
                    Physical
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Mobility Support</li>
                    <li>• Medical Needs</li>
                    <li>• Feeding Assistance</li>
                    <li>• Medication Admin</li>
                  </ul>
                </div>

                <div className="bg-white rounded-2xl p-6">
                  <h3 className="font-semibold text-[#111827] mb-4 bg-purple-100 inline-block px-3 py-1 rounded-lg">
                    Behavioral
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Anxiety Support</li>
                    <li>• Emotional Regulation</li>
                    <li>• Trauma-Informed Care</li>
                    <li>• Social Skills</li>
                  </ul>
                </div>
              </div>
            </section>
          </div>

          {/* CTA Section */}
          <section className="text-center mt-24">
            <h2 className="text-4xl font-bold tracking-tight text-[#111827] mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join 2,000+ families finding trusted care today.
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 bg-[#E5533D] hover:bg-[#D4442C] text-white text-lg font-semibold px-8 py-4 rounded-lg transition-all hover:shadow-lg hover:shadow-[#E5533D]/30"
            >
              Find Your Sitter
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </Link>
          </section>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
