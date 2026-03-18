import Link from "next/link";

export function ActivitiesCTA() {
  return (
    <section className="py-20 bg-primary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Turn Babysitting Into Learning Time?
          </h2>

          <p className="text-lg text-white/90 mb-10 max-w-2xl mx-auto">
            Join hundreds of parents who've discovered the littlëHALO
            difference. Book a sitter and choose your first micro-adventure
            today.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Link
              href="/signup"
              className="w-full sm:w-auto px-8 py-3 bg-white text-primary font-bold rounded hover:bg-gray-100"
            >
              Get Started Free
            </Link>
            <Link
              href="/browse-sitters"
              className="w-full sm:w-auto px-8 py-3 bg-white/20 border border-white text-white font-bold rounded hover:bg-white/30"
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
              className="text-white font-semibold hover:underline"
            >
              Learn how to add activities to your profile
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
