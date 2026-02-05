import Link from "next/link";
import Image from "next/image";
import { Check, Star, ShieldAlert, UserPlus } from "lucide-react";
import { PublicNavbar } from '@/components/layout/PublicNavbar';
import { SiteFooter } from "@/components/homepage/Footer";

export const metadata = {
  title: "How It Works - littlëHALO",
  description:
    "Learn how littlëHALO works: Create your profile, find culturally-matched sitters, book care, and enjoy peace of mind with verified, trusted childcare.",
};

export default function HowItWorksPage() {
  return (
    <>
      <PublicNavbar activePage="how-it-works" />

      {/* Animated Background Blobs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#FFE5B4] rounded-full mix-blend-multiply filter blur-[80px] opacity-40 animate-blob" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#EFA59A] rounded-full mix-blend-multiply filter blur-[80px] opacity-40 animate-blob animation-delay-2000" />
        <div className="absolute bottom-[20%] left-[20%] w-[500px] h-[500px] bg-[#FFE5B4]/30 rounded-full mix-blend-multiply filter blur-[80px] opacity-30 animate-blob animation-delay-4000" />
      </div>

      {/* Main Content */}
      <main className="relative z-10 pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <section className="text-center mb-20">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-[#111827] mb-6">
              Book Trusted Care in{" "}
              <span className="text-[#E5533D]">3 Simple Steps</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              From signing up to your first booking, we've made it simple, safe,
              and secure.
            </p>
          </section>

          {/* Step 1: Create Profile */}
          <section className="glass-card rounded-3xl p-10 md:p-12 mb-16 lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center">
            <div>
              <div className="inline-block px-3 py-1 bg-yellow-50 text-yellow-600 text-sm font-semibold rounded-full mb-4">
                Step One
              </div>
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-[#E5533D] text-white flex items-center justify-center text-2xl font-bold shrink-0">
                  1
                </div>
                <div>
                  <h2 className="text-3xl font-bold tracking-tight text-[#111827] mb-3">
                    Create Your Family Profile
                  </h2>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    Tell us about your family, your children's ages, languages
                    spoken, and any special requirements. This helps us match
                    you with the perfect sitters.
                  </p>
                </div>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#E5533D] shrink-0 mt-0.5" />
                  <span className="text-gray-700">
                    Takes just 5 minutes to complete
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#E5533D] shrink-0 mt-0.5" />
                  <span className="text-gray-700">
                    Add multiple children to one profile
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#E5533D] shrink-0 mt-0.5" />
                  <span className="text-gray-700">
                    Specify cultural and dietary preferences
                  </span>
                </li>
              </ul>
            </div>

            {/* Mock Form */}
            <div className="mt-8 lg:mt-0 bg-white rounded-2xl p-8 shadow-sm">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Family Name
                  </label>
                  <input
                    type="text"
                    placeholder="Your Family Name"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-400"
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Languages Spoken
                  </label>
                  <input
                    type="text"
                    placeholder="English, Mandarin, ..."
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-400"
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Children
                  </label>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#E5533D] text-white flex items-center justify-center font-bold">
                        A
                      </div>
                      <span className="text-gray-700">Age 5</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Step 2: Browse Sitters */}
          <section className="glass-card rounded-3xl p-10 md:p-12 mb-16 lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center">
            <div className="order-2 lg:order-1 mt-8 lg:mt-0">
              <div className="space-y-4">
                {/* Sitter Card 1 */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-[#E5533D] transition-colors cursor-pointer">
                  <div className="flex items-start gap-4">
                    <Image
                      src="https://i.pravatar.cc/80?img=47"
                      alt="Sarah M."
                      width={80}
                      height={80}
                      className="rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-[#111827] text-lg">
                            Sarah M.
                          </h3>
                          <div className="flex items-center gap-1 text-yellow-400 mb-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-current" />
                            ))}
                            <span className="text-sm text-gray-600 ml-1">
                              4.9
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">
                            Speaks: English, Arabic
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                          Verified
                        </span>
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
                          Special Needs
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sitter Card 2 */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-[#E5533D] transition-colors cursor-pointer">
                  <div className="flex items-start gap-4">
                    <Image
                      src="https://i.pravatar.cc/80?img=32"
                      alt="Wei L."
                      width={80}
                      height={80}
                      className="rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-[#111827] text-lg">
                            Wei L.
                          </h3>
                          <div className="flex items-center gap-1 text-yellow-400 mb-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-current" />
                            ))}
                            <span className="text-sm text-gray-600 ml-1">
                              5.0
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">
                            Speaks: English, Mandarin
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="inline-block px-3 py-1 bg-yellow-50 text-yellow-600 text-sm font-semibold rounded-full mb-4">
                Step Two
              </div>
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-[#D4442C] text-white flex items-center justify-center text-2xl font-bold shrink-0">
                  2
                </div>
                <div>
                  <h2 className="text-3xl font-bold tracking-tight text-[#111827] mb-3">
                    Browse & Filter Sitters
                  </h2>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    Search by language, experience, availability, and location.
                    Read reviews from other families and view detailed profiles
                    including background checks.
                  </p>
                </div>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#E5533D] shrink-0 mt-0.5" />
                  <span className="text-gray-700">Filter by 15+ languages</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#E5533D] shrink-0 mt-0.5" />
                  <span className="text-gray-700">
                    See verified credentials and certifications
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#E5533D] shrink-0 mt-0.5" />
                  <span className="text-gray-700">
                    Read reviews from families like yours
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#E5533D] shrink-0 mt-0.5" />
                  <span className="text-gray-700">
                    Schedule a free 15-min video interview
                  </span>
                </li>
              </ul>
            </div>
          </section>

          {/* Step 3: Book & Pay */}
          <section className="glass-card rounded-3xl p-10 md:p-12 mb-16 lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center">
            <div>
              <div className="inline-block px-3 py-1 bg-yellow-50 text-yellow-600 text-sm font-semibold rounded-full mb-4">
                Step Three
              </div>
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-[#EFA59A] text-white flex items-center justify-center text-2xl font-bold shrink-0">
                  3
                </div>
                <div>
                  <h2 className="text-3xl font-bold tracking-tight text-[#111827] mb-3">
                    Book & Pay Securely
                  </h2>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    Choose your date and time, confirm the booking, and pay
                    securely through our platform. You're automatically covered
                    by insurance on every booking.
                  </p>
                </div>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#E5533D] shrink-0 mt-0.5" />
                  <span className="text-gray-700">
                    Secure payment via Stripe
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#E5533D] shrink-0 mt-0.5" />
                  <span className="text-gray-700">
                    Full insurance coverage included
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#E5533D] shrink-0 mt-0.5" />
                  <span className="text-gray-700">
                    Free cancellation (24h notice)
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-[#E5533D] shrink-0 mt-0.5" />
                  <span className="text-gray-700">24/7 support available</span>
                </li>
              </ul>
            </div>

            {/* Mock Booking Card */}
            <div className="mt-8 lg:mt-0 bg-white rounded-2xl p-8 shadow-sm">
              <h3 className="font-semibold text-[#111827] text-lg mb-4">
                Booking Summary
              </h3>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-700">
                  <span>Sitter: Sarah M.</span>
                  <span className="font-semibold">$20/hr</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Duration: 3 hours</span>
                  <span className="font-semibold">$60.00</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Service Fee (10%)</span>
                  <span className="font-semibold">$6.00</span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between text-[#111827] font-bold text-lg">
                  <span>Total</span>
                  <span>$66.00</span>
                </div>
              </div>
              <button className="w-full bg-[#E5533D] hover:bg-[#D4442C] text-white font-semibold py-3 rounded-lg transition-colors">
                Confirm Booking
              </button>
              <p className="text-xs text-gray-500 text-center mt-3">
                Protected by insurance • Secure payment
              </p>
            </div>
          </section>

          {/* Safety Note */}
          <section className="glass-card rounded-3xl p-10 md:p-12 bg-yellow-50/50 border-2 border-yellow-200">
            <div className="flex items-start gap-4">
              <ShieldAlert className="w-8 h-8 text-yellow-600 shrink-0" />
              <div>
                <h3 className="text-xl font-bold text-[#111827] mb-2">
                  Important: Keep All Bookings On Platform
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  All bookings must be made and paid through littlëHALO to
                  ensure insurance coverage and payment protection for both
                  families and sitters. Taking bookings off-platform violates
                  our terms and voids all protection.
                </p>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="text-center mt-24">
            <h2 className="text-4xl font-bold tracking-tight text-[#111827] mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Create your profile in 5 minutes and book your first sitter today.
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#E5533D] to-[#D4442C] text-white text-lg font-semibold px-8 py-4 rounded-lg transition-all hover:shadow-lg hover:shadow-[#E5533D]/30"
            >
              <UserPlus className="w-5 h-5" />
              Create Free Account
            </Link>
          </section>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
