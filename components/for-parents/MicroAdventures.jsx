import Link from 'next/link';
import { Palette, Music, TestTube, MessageCircle } from 'lucide-react';

export function MicroAdventures() {
  return (
    <section id="micro-adventures" className="py-20 bg-gradient-to-b from-white/50 to-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFE5B4] text-[#111827] text-sm font-semibold mb-4">
            Micro-Adventures
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-[#111827] mb-4">
            Educational Adventures for Your Child
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Turn babysitting into learning time with our unique micro-adventure activities
          </p>
        </div>

        {/* Adventure Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-card rounded-2xl p-6 text-center transition-all hover:shadow-xl">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#E5533D] to-[#D4442C] flex items-center justify-center mx-auto mb-4">
              <Palette className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-bold text-[#111827] mb-2">Arts & Crafts</h3>
            <p className="text-sm text-gray-600">
              Creative projects that develop fine motor skills and imagination
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 text-center transition-all hover:shadow-xl">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#E5533D] to-[#D4442C] flex items-center justify-center mx-auto mb-4">
              <Music className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-bold text-[#111827] mb-2">Music Lessons</h3>
            <p className="text-sm text-gray-600">
              Introduction to instruments, rhythm, and singing
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 text-center transition-all hover:shadow-xl">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#E5533D] to-[#D4442C] flex items-center justify-center mx-auto mb-4">
              <TestTube className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-bold text-[#111827] mb-2">Science Experiments</h3>
            <p className="text-sm text-gray-600">
              Hands-on STEM activities that spark curiosity
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 text-center transition-all hover:shadow-xl">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#E5533D] to-[#D4442C] flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-bold text-[#111827] mb-2">Language Practice</h3>
            <p className="text-sm text-gray-600">
              Bilingual activities to maintain cultural heritage
            </p>
          </div>
        </div>

        <div className="text-center mt-8">
          <Link
            href="/micro-adventures"
            className="inline-flex items-center gap-2 text-[#E5533D] font-semibold hover:underline"
          >
            Explore All Adventures
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
