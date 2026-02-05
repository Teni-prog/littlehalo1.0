import { Star } from 'lucide-react';

export function SitterTestimonials() {
  return (
    <section id="testimonials" className="py-20 bg-gradient-to-b from-white/50 to-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFE5B4] text-[#111827] text-sm font-semibold mb-4">
            Testimonials
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-[#111827] mb-4">
            Stories from Our Sitters
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Real experiences from childcare providers who've transformed their careers
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
              "I love offering Mandarin micro-adventures to newcomer families. 
              I'm making 40% more than my previous babysitting jobs and doing what I love!"
            </p>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#E5533D] to-[#D4442C] flex items-center justify-center text-white font-bold">
                EC
              </div>
              <div>
                <div className="font-semibold text-[#111827]">Emily Chen</div>
                <div className="text-sm text-gray-600">ECE Professional, Toronto</div>
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
              "The flexible schedule is perfect for my university classes. 
              I choose when I work, and payment is always on time."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#E5533D] to-[#D4442C] flex items-center justify-center text-white font-bold">
                MR
              </div>
              <div>
                <div className="font-semibold text-[#111827]">Maria Rodriguez</div>
                <div className="text-sm text-gray-600">Student, Vancouver</div>
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
              "I've been full-time with littlëHALO for 3 years. 
              The platform is reliable, families are amazing, and I'm earning more than I did teaching."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#E5533D] to-[#D4442C] flex items-center justify-center text-white font-bold">
                JP
              </div>
              <div>
                <div className="font-semibold text-[#111827]">James Park</div>
                <div className="text-sm text-gray-600">Full-time Sitter, Montreal</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
