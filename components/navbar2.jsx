'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import Logo from "@/public/Logo1.png"
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

export function Navbar2() {
    return (
        <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between mx-auto px-4 md:px-6">
                <div className="flex items-center gap-2">
                    {/* <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">L</div> */}
                    <Image src={Logo} alt="Little Halo Logo" width={75} height={80} className="ml-20" />
                    {/* <Link href="/" className="font-bold text-2xl text-primary font-outfit">
                        Little Halo
                    </Link> */}
                </div>
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => onNavigate("home")}
                        className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-[#ff6b6b] transition-colors cursor-pointer"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </button>
                </div>
            </div>
        </nav>
    );
}
