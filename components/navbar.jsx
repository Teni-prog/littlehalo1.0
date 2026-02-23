"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import Logo from "@/public/Logo1.png";
import Image from "next/image";

export function Navbar() {
  const pathname = usePathname();

  const isActive = (path) => {
    return pathname.startsWith(path);
  };

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
                isActive("/profile/Parents")
                  ? "text-primary font-bold border-b-2 border-primary pb-1"
                  : ""
              }`}
            >
              For Parents
            </Link>
            <Link
              href="/search"
              className={`transition-colors hover:text-primary ${
                isActive("/search")
                  ? "text-primary font-bold border-b-2 border-primary pb-1"
                  : ""
              }`}
            >
              Find Sitters
            </Link>
            <Link
              href="/demo-matching"
              className={`transition-colors hover:text-primary ${
                isActive("/demo-matching")
                  ? "text-primary font-bold border-b-2 border-primary pb-1"
                  : ""
              }`}
            >
              Find Match
            </Link>
          </div>
          <Link href="/login">
            <Button className="cursor-pointer">Sign In</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
