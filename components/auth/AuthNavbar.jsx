import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function AuthNavbar({
  backHref = "/",
  backText = "Back to home",
  showBackButton = true,
}) {
  return (
    <nav className="fixed w-full z-50 top-0 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
              <svg
                className="w-5 h-5 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>
            <div className="flex items-baseline gap-0.5 text-lg font-bold tracking-tight">
              <span className="text-[#111827]">littlë</span>
              <span className="text-primary">HALO</span>
            </div>
          </Link>

          {/* Back Link */}
          {showBackButton && (
            <Link
              href={backHref}
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>{backText}</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
