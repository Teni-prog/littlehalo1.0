"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Logo from "@/public/Logo1.png";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const supabase = createClient();

    // getSession reads from cookie — instant, no network call
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

  const isActive = (path) => pathname.startsWith(path);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between mx-auto px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Link href="/">
            <Image
              src={Logo}
              alt="Little Halo Logo"
              width={75}
              height={80}
              className="ml-5 cursor-pointer"
            />
          </Link>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden md:flex gap-6 text-sm font-medium">
            <Link
              href="/profile/Parents"
              className={`transition-colors hover:text-primary ${
                isActive("/profile/Parents") ? "text-primary font-bold border-b-2 border-primary pb-1" : ""
              }`}
            >
              For Parents
            </Link>
            <Link
              href="/profile/Sitter"
              className={`transition-colors hover:text-primary ${
                isActive("/profile/Sitter") ? "text-primary font-bold border-b-2 border-primary pb-1" : ""
              }`}
            >
              For Sitters
            </Link>
            <Link
              href="/Testmatching"
              className={`transition-colors hover:text-primary ${
                isActive("/Testmatching") ? "text-primary font-bold border-b-2 border-primary pb-1" : ""
              }`}
            >
              Testing
            </Link>
          </div>

          {user ? (
            <Button
              onClick={handleLogout}
              variant="outline"
              className="cursor-pointer"
            >
              Log Out
            </Button>
          ) : (
            <Link href="/login">
              <Button className="cursor-pointer">Sign In</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
