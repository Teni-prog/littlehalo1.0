"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, Menu, X } from "lucide-react";

export function PublicNavbar({ activePage = null }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/features", label: "Features", page: "features" },
    { href: "/how-it-works", label: "How It Works", page: "how-it-works" },
    { href: "/for-parents", label: "For Parents", page: "for-parents" },
    { href: "/for-sitters", label: "For Sitters", page: "for-sitters" },
    { href: "/micro-adventures", label: "Activities", page: "activities" },
  ];

  return (
    <nav className="fixed w-full z-50 top-0 bg-white/80 backdrop-blur-md border-b border-gray-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-[#E5533D] flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
              <Heart
                className="w-5 h-5 text-white"
                strokeWidth={1.5}
                aria-hidden="true"
              />
            </div>
            <div className="flex items-baseline gap-0.5 text-lg font-bold tracking-tight">
              <span className="text-[#111827]">littlë</span>
              <span className="text-[#E5533D]">HALO</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = activePage === link.page;
              return (
                <Link
                  key={link.page}
                  href={link.href}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5533D] focus-visible:ring-offset-1 ${
                    isActive
                      ? "text-[#E5533D] bg-gray-50"
                      : "text-gray-700 hover:text-[#E5533D] hover:bg-gray-50"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden sm:block text-sm font-medium text-gray-700 hover:text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5533D] focus-visible:ring-offset-1"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="bg-[#E5533D] hover:bg-[#D4442C] text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-all hover:shadow-lg hover:shadow-[#E5533D]/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5533D] focus-visible:ring-offset-2"
            >
              Sign Up
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:bg-gray-50 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5533D] focus-visible:ring-offset-2"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" aria-hidden="true" />
              ) : (
                <Menu className="w-6 h-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div
          className="md:hidden bg-white border-b border-gray-200"
          role="navigation"
          aria-label="Mobile navigation"
        >
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
            {navLinks.map((link) => {
              const isActive = activePage === link.page;
              return (
                <Link
                  key={`mobile-${link.page}`}
                  href={link.href}
                  className={`block px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? "text-[#E5533D] bg-gray-50"
                      : "text-gray-700 hover:text-[#E5533D] hover:bg-gray-50"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                  aria-current={isActive ? "page" : undefined}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="border-t border-gray-200 my-2"></div>
            <Link
              href="/login"
              className="block px-4 py-3 text-sm font-medium text-gray-700 hover:text-[#E5533D] hover:bg-gray-50 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="block mx-4 my-3 bg-[#E5533D] hover:bg-[#D4442C] text-white text-sm font-semibold px-5 py-2.5 rounded-lg text-center transition-all hover:shadow-lg hover:shadow-[#E5533D]/25"
              onClick={() => setMobileMenuOpen(false)}
            >
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
