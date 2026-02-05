import Link from 'next/link';

export function ParentCTA() {
  return (
    <section id="cta" className="py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-[#1F2937] p-12 text-center">
          {/* Dotted pattern overlay */}
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
          
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Ready to Find Trusted Childcare?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of parents who trust littlëHALO for safe, enriching childcare
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#E5533D] to-[#D4442C] text-white px-8 py-4 rounded-lg font-semibold hover:shadow-lg hover:shadow-[#E5533D]/25 transition-all"
              >
                Get Started Free
              </Link>
              <Link
                href="/browse-sitters"
                className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-lg font-semibold border-2 border-white/20 hover:bg-white/20 transition-all"
              >
                Browse Sitters
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
