import Image from "next/image";
import { MessageCircle } from "lucide-react";

const testimonials = [
  {
    name: "Fatima S.",
    handle: "@fatima_s",
    avatar: "https://i.pravatar.cc/100?img=47",
    quote:
      "I was going to decline my dream job because of the 11-month daycare waitlist. Within 48 hours I found Layla who speaks Arabic like us. She's family now.",
  },
  {
    name: "Raj P.",
    handle: "@rajpatel",
    avatar: "https://i.pravatar.cc/100?img=13",
    quote:
      "Finding care for my son with autism felt impossible. Sarah uses visual schedules, understands his sensory needs, and celebrates his differences. His school performance has improved dramatically.",
  },
  {
    name: "Wei L.",
    handle: "@wei_liu",
    avatar: "https://i.pravatar.cc/100?img=32",
    quote:
      "LittlëHALO helped our family find a Mandarin-speaking sitter. My daughter was losing her language skills, but now she switches between Mandarin and English confidently. This platform truly understands immigrant families.",
  },
  {
    name: "Sofia M.",
    handle: "@sofia_martinez",
    avatar: "https://i.pravatar.cc/100?img=25",
    quote:
      "The verification process gave me peace of mind. Background checks, references, everything was thorough. Our sitter has been with us for 6 months now.",
  },
  {
    name: "Amara O.",
    handle: "@amara_o",
    avatar: "https://i.pravatar.cc/100?img=20",
    quote:
      "I was terrified to trust anyone with my children in a new country. The reviews from other African parents gave me confidence. Our sitter is like the grandmother my kids don't have here.",
  },
  {
    name: "Miguel R.",
    handle: "@miguel_r",
    avatar: "https://i.pravatar.cc/100?img=15",
    quote:
      "No more daycare waitlists! Booked care in under 2 hours for an emergency. Game changer for working parents.",
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 mb-4">
          <MessageCircle className="w-4 h-4 text-[#111827]" />
          <span className="text-xs font-medium text-[#111827] uppercase tracking-wide">
            Testimonials
          </span>
        </div>
        <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4 text-[#111827]">
          Public Cheers for Us!
        </h2>
        <p className="text-lg text-gray-500 leading-relaxed">
          Find out how our users are spreading the word!
        </p>
      </div>

      {/* Testimonials Grid */}
      <div className="grid md:grid-cols-3 gap-4 max-w-6xl mx-auto">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <Image
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <div className="font-semibold text-[#111827]">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {testimonial.handle}
                  </div>
                </div>
              </div>
              <svg
                className="w-5 h-5 text-gray-400"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </div>
            <p className="text-gray-700 leading-relaxed text-sm">
              {testimonial.quote}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
