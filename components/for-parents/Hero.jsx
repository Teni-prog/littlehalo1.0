import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, Star, MessageCircle } from 'lucide-react';

export function ParentHero() {
  return (
    <section className="w-full min-h-[90vh] flex items-center py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column: Content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-peach text-[#111827] text-sm font-semibold mb-6">
              <ShieldCheck className="w-4 h-4 text-primary" />
              100% Verified • Background Checked
            </div>

            {/* Heading */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-[#111827] mb-6 leading-tight">
              Find Trusted <span className="text-primary">Childcare</span> Near You
            </h1>

            {/* Subtitle */}
            <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0">
              Book verified, background-checked babysitters who offer educational micro-adventures. 
              Trusted childcare in under 2 hours—no waitlists, no stress.
            </p>

            {/* Trust Stats */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 lg:gap-6 text-sm mb-8">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-primary" />
                <span className="text-gray-700">
                  <span className="font-semibold text-[#111827]">100%</span> Verified
                </span>
              </div>
              <div className="w-px h-4 bg-gray-300" />
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-primary fill-primary" />
                <span className="text-gray-700">
                  <span className="font-semibold text-[#111827]">4.9</span> Avg Rating
                </span>
              </div>
              <div className="w-px h-4 bg-gray-300" />
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-primary" />
                <span className="text-gray-700">
                  <span className="font-semibold text-[#111827]">24/7</span> Support
                </span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                href="/browse-sitters"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-primary-dark text-white px-8 py-4 rounded-lg font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all"
              >
                Browse Sitters
              </Link>
              <Link
                href="/how-it-works"
                className="inline-flex items-center justify-center gap-2 bg-white/80 backdrop-blur-sm text-primary px-8 py-4 rounded-lg font-semibold border-2 border-primary hover:bg-primary hover:text-white transition-all"
              >
                See How It Works
              </Link>
            </div>
          </div>

          {/* Right Column: Hero Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden aspect-[4/5]">
              <Image
                src="https://images.unsplash.com/photo-1609220136736-443140cffec6?w=800&h=1000&fit=crop"
                alt="Happy parent and child with babysitter"
                fill
                className="object-cover"
                priority
              />
              
              {/* Floating Badge: Verification */}
              <div className="absolute top-6 right-6 glass-card rounded-lg px-4 py-3 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-primary" />
                <span className="text-sm font-semibold text-[#111827]">Verified Sitter</span>
              </div>
              
              {/* Floating Badge: Stats */}
              <div className="absolute bottom-6 left-6 glass-card rounded-lg px-4 py-3">
                <div className="text-sm text-gray-600">Families trust us</div>
                <div className="text-2xl font-bold text-primary">2,000+</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
