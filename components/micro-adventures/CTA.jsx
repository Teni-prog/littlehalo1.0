import Link from 'next/link';
import { Sparkles, UserPlus } from 'lucide-react';

export function ActivitiesCTA() {
  return (
    <section className="py-20 bg-[#1F2937] relative overflow-hidden">
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-white" />
            <span className="text-sm font-medium text-white">Start Your Child's Learning Journey Today</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Turn Babysitting Into Learning Time?
          </h2>

          <p className="text-lg sm:text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            Join hundreds of parents who've discovered the littlëHALO difference. 
            Book a sitter and choose your first micro-adventure today.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Link 
              href="/signup"
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#E5533D] to-[#D4442C] text-white font-bold rounded-lg hover:shadow-xl hover:shadow-[#E5533D]/25 transition-all flex items-center justify-center gap-2 group"
            >
              <UserPlus className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>Get Started Free</span>
            </Link>
            <Link 
              href="/browse-sitters"
              className="w-full sm:w-auto px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/20 text-white font-bold rounded-lg hover:bg-white/20 transition-all"
            >
              Browse Sitters
            </Link>
          </div>

          {/* For Sitters CTA */}
          <div className="pt-8 border-t border-white/20">
            <p className="text-white/80 mb-4">
              Are you a babysitter looking to stand out with unique activities?
            </p>
            <Link 
              href="/for-sitters"
              className="text-white font-semibold hover:underline inline-flex items-center gap-2"
            >
              Learn how to add activities to your profile
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
