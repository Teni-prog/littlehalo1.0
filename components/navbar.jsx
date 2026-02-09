import Link from "next/link";
import { Button } from "@/components/ui/button";
import Logo from "@/public/Logo1.png"
import Image from "next/image";

export function Navbar() {
    return (
        <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between mx-auto px-4 md:px-6">
                <div className="flex items-center gap-2">
                    {/* <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">L</div> */}
                    <Link href="/">   <Image src={Logo} alt="Little Halo Logo" width={75} height={80} className="ml-5 cursor-pointer" /></Link>
                    {/* <Link href="/" className="font-bold text-2xl text-primary font-outfit">
                        Little Halo
                    </Link> */}
                </div>
                <div className="flex items-center gap-6">
                    <div className="hidden md:flex gap-6 text-sm font-medium">
                        <Link href="/profile/Parents" className="transition-colors hover:text-primary">
                            For Parents
                        </Link>
                        <Link href="/profile/Sitter" className="transition-colors hover:text-primary">
                            For Sitters
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
