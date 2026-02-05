import { Star } from 'lucide-react';

export function ParentTestimonials() {
  return (
    <section id="testimonials" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFE5B4] text-[#111827] text-sm font-semibold mb-4">
            Testimonials
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-[#111827] mb-4">
            What Parents Are Saying
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Real experiences from families who trust littlëHALO
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Testimonial 1 */}
          <div className="glass-card rounded-2xl p-8">
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-[#E5533D] fill-[#E5533D]" />
              ))}
            </div>
            <p className="text-gray-700 mb-6 italic">
              "Finding a Hindi-speaking sitter who understood our cultural values was a game-changer. 
              The micro-adventures keep my kids engaged and learning."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#E5533D] to-[#D4442C] flex items-center justify-center text-white font-bold">
                PS
              </div>
              <div>
                <div className="font-semibold text-[#111827]">Priya Singh</div>
                <div className="text-sm text-gray-600">Parent of 2, Toronto</div>
              </div>
            </div>
          </div>

          {/* Testimonial 2 */}
          <div className="glass-card rounded-2xl p-8">
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-[#E5533D] fill-[#E5533D]" />
              ))}
            </div>
            <p className="text-gray-700 mb-6 italic">
              "My daughter looks forward to her 'art adventures' with her sitter. 
              It's more than childcare—it's enrichment that fits our budget."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#E5533D] to-[#D4442C] flex items-center justify-center text-white font-bold">
                JK
              </div>
              <div>
                <div className="font-semibold text-[#111827]">Jessica Kim</div>
                <div className="text-sm text-gray-600">Parent of 1, Vancouver</div>
              </div>
            </div>
          </div>

          {/* Testimonial 3 */}
          <div className="glass-card rounded-2xl p-8">
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-[#E5533D] fill-[#E5533D]" />
              ))}
            </div>
            <p className="text-gray-700 mb-6 italic">
              "The platform is so easy to use, and I love that all sitters are background-checked. 
              I can book care with confidence, even last minute."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#E5533D] to-[#D4442C] flex items-center justify-center text-white font-bold">
                MC
              </div>
              <div>
                <div className="font-semibold text-[#111827]">Maria Cervantes</div>
                <div className="text-sm text-gray-600">Parent of 3, Montreal</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
