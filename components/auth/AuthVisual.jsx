import { CheckCircle2, Sparkles } from "lucide-react";

export function AuthVisual({ badge, title, description, features }) {
  return (
    <div className="hidden lg:block relative">
      <div className="relative bg-gradient-to-br from-primary via-primary-dark to-primary rounded-3xl p-12 overflow-hidden shadow-2xl border border-primary-dark">
        {/* Decorative Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-64 h-64 bg-peach rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-48 h-48 bg-coral rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-peach rounded-full blur-2xl"></div>
        </div>

        {/* Dotted Pattern Overlay */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        ></div>

        {/* Floating Icons */}
        <div className="absolute top-16 right-8 animate-float">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-xl border border-white/20">
            <CheckCircle2 className="w-8 h-8 text-white" strokeWidth={2.5} />
          </div>
        </div>

        <div className="absolute bottom-24 right-20 animate-float animation-delay-2000">
          <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-xl border border-white/20">
            <svg
              className="w-7 h-7 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
        </div>

        <div className="absolute top-1/2 left-8 animate-float animation-delay-4000">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center shadow-lg border border-white/20">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-white">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm mb-6">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-sm font-medium">{badge}</span>
          </div>

          <h2 className="text-4xl font-bold mb-4 leading-tight">{title}</h2>

          <p className="text-lg text-white/90 leading-relaxed mb-12">
            {description}
          </p>

          {/* Feature Cards */}
          <div className="space-y-3">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group flex items-start gap-4 p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-[1.02]"
              >
                <div className="w-12 h-12 rounded-xl bg-white/30 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <svg
                    className="w-6 h-6 text-white"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold mb-1 text-white">{feature.title}</h3>
                  <p className="text-sm text-white/90 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
