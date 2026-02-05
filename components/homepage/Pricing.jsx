"use client";

import { useState } from "react";
import Link from "next/link";
import { DollarSign, HelpCircle, Check, ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "Is ID verification mandatory?",
    answer:
      "Yes. Every single babysitter on our platform undergoes a rigorous multi-step verification process including government-issued ID verification, criminal record checks, and reference verification.",
  },
  {
    question: "Can I interview the sitter first?",
    answer:
      "Absolutely. You can schedule a free 15-minute video call or arrange a paid 'meet and greet' session before committing to a booking. We encourage families to interview sitters to ensure the right fit.",
  },
  {
    question: "What areas do you serve?",
    answer:
      "We currently serve Fredericton, Halifax, and Moncton in Atlantic Canada. We're expanding to new cities based on demand. Join our waitlist if your city isn't listed yet.",
  },
];

export function PricingFAQ() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <section id="pricing" className="space-y-16 scroll-mt-20">
      {/* Pricing Section */}
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 mb-4">
            <DollarSign className="w-4 h-4 text-[#111827]" />
            <span className="text-xs font-medium text-[#111827] uppercase tracking-wide">
              Pricing
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4 text-[#111827]">
            Transparent Pricing. Zero Hidden Costs.
          </h2>
          <p className="text-lg text-gray-500 leading-relaxed">
            Pay only for the care you book. No subscriptions, no surprise
            charges—just honest, upfront pricing.
          </p>
        </div>

        {/* Pricing Card */}
        <div className="glass-card rounded-3xl p-10 md:p-12 bg-linear-to-br from-orange-50/50 to-pink-50/30">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left Column - Features */}
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#FFE5B4] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 text-[#E5533D]" />
                  </div>
                  <div>
                    <p className="text-gray-700">
                      Average Rate:{" "}
                      <span className="font-bold text-[#E5533D]">
                        $18 - $28 / hr
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#FFE5B4] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 text-[#E5533D]" />
                  </div>
                  <div>
                    <p className="text-gray-700">Includes Insurance Coverage</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#FFE5B4] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 text-[#E5533D]" />
                  </div>
                  <div>
                    <p className="text-gray-700">
                      Free Cancellation (24h notice)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Calculator */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                <span className="font-semibold text-gray-700">Service Fee</span>
                <span className="font-bold text-[#111827]">10%</span>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between text-gray-600">
                  <span>Sitter Rate (3hrs)</span>
                  <span className="font-medium">$60.00</span>
                </div>
                <div className="flex items-center justify-between text-gray-600">
                  <span>Service Fee</span>
                  <span className="font-medium">$6.00</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200 mb-6">
                <span className="font-semibold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-[#E5533D]">
                  $66.00
                </span>
              </div>

              <Link
                href="/signup"
                className="block w-full text-center px-6 py-4 rounded-xl bg-linear-to-r from-[#E5533D] to-[#D4442C] text-white font-semibold hover:shadow-lg hover:shadow-[#E5533D]/30 transition-all"
              >
                Start Searching
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 mb-4">
            <HelpCircle className="w-4 h-4 text-[#111827]" />
            <span className="text-xs font-medium text-[#111827] uppercase tracking-wide">
              FAQS
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4 text-[#111827]">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-500 leading-relaxed">
            Everything you need to know about littlëHALO
          </p>
        </div>

        {/* FAQ Items */}
        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, index) => (
            <details
              key={index}
              className="glass-card rounded-xl overflow-hidden group"
              open={openFaq === index}
              onToggle={(e) => setOpenFaq(e.currentTarget.open ? index : null)}
            >
              <summary className="flex items-center justify-between p-5 cursor-pointer list-none">
                <span className="font-semibold text-[#111827] pr-4">
                  {faq.question}
                </span>
                <ChevronDown className="w-5 h-5 text-[#E5533D] shrink-0 transition-transform group-open:rotate-180" />
              </summary>
              <div className="px-5 pb-5 text-gray-600 leading-relaxed">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
