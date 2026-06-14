"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Logo from "@/public/Logo1.png";
import Image from "next/image";
import { UserCircle, Settings } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const NAV_LINKS = [
  { label: "Features", href: "/#features" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "For Parents", href: "/#for-parents" },
  { label: "For Sitters", href: "/#for-sitters" },
  { label: "Activities", href: "/microadventure" },
];

export function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  const userType = user?.user_metadata?.user_type;
  const profileHref = userType === "sitter" ? "/profile/Sitter" : "/profile/Parents";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-white">
      <div className="container flex h-16 items-center justify-between mx-auto px-4 md:px-6">
        <div className="flex items-center gap-8">
          <Link href="/">
            <Image
              src={Logo}
              alt="Little Halo Logo"
              width={75}
              height={80}
              className="ml-5 cursor-pointer"
            />
          </Link>
          <div className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              {(userType === "parent" || userType === "sitter") && (
                <Link
                  href={userType === "sitter" ? "/settings/sitter" : "/settings/parent"}
                  aria-label="Settings"
                >
                  <Settings className="w-5 h-5 text-gray-500 hover:text-primary transition-colors cursor-pointer" />
                </Link>
              )}
              <Link href={profileHref} aria-label="Go to profile">
                <UserCircle className="w-8 h-8 text-gray-500 hover:text-primary transition-colors cursor-pointer" />
              </Link>
              <Button onClick={handleLogout} variant="outline" className="cursor-pointer">
                Log Out
              </Button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                Log in
              </Link>
              <Link href="/auth/signup">
                <Button className="cursor-pointer bg-primary hover:bg-primary/90 text-white">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
