import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/public/Logo2.png";
import {
  Search,
  Shield,
  Heart,
  Award,
  ArrowRight,
  Instagram,
  Twitter,
  Facebook,
} from "lucide-react";

export default function Home() {
  return (
    <>
      <div className="flex flex-col min-h-screen">
        {/* <div className="hidden lg:flex flex-col justify-center p-12 bg-primary/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/20 backdrop-blur-3xl" />
          <div className="relative z-10 max-w-lg mx-auto space-y-6">
            <Image src={Logo} alt="Logo" width={100} height={100} />
            <h1 className="text-4xl md:text-5xl font-bold font-outfit text-gray-900">
              Welcome Back!
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Sign in to access your dashboard, manage bookings, and connect with your community.
            </p>
            <Link href="/search">
              <Button size="lg" className="h-12 px-6 cursor-pointer" >
                Search Sitters
              </Button>
            </Link>
          </div>
        </div> */}
        <section className="bg-gradient-to-br from-red-50 to-white py-20 px-4 md:px-6">
          <div className="container mx-auto grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-sm font-medium">
                ✨ Trusted by 10,000+ families
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground font-outfit leading-tight">
                Accessible, Special-Needs-Aware{" "}
                <span className="text-primary">Childcare</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl">
                Connect with verified sitters who understand your family's
                unique needs. Every session includes growth-focused
                micro-adventures for your child's development.
              </p>

              <div className="bg-white p-4 rounded-xl shadow-lg border max-w-md">
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter your location or postal code"
                    className="h-12 border-0 bg-gray-50 focus-visible:ring-0 focus-visible:bg-white transition-all"
                  />
                  <Link href="/search">
                    <Button size="lg" className="h-12 px-6 cursor-pointer">
                      Search Sitters
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            <div className="relative flex justify-center lg:justify-end">
              <img
                src="https://images.unsplash.com/photo-1660810710775-dceb42ffaebb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWJ5c2l0dGVyJTIwY2hpbGQlMjBwbGF5aW5nfGVufDF8fHx8MTc2NjM0Mzc5M3ww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Babysitter playing with child"
                className="rounded-3xl shadow-2xl w-full h-125 object-cover"
              />

              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-4 border border-gray-100 flex items-center gap-4 animate-bounce-slow">
                <div className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" fill="white" />
                </div>

                <div>
                  <p className="text-xs text-gray-500 font-medium">
                    100% Verified
                  </p>
                  <p className="font-bold text-gray-800">Background Checked</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 container mx-auto px-4 md:px-6">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold font-outfit">
              Why choose Little Halo?
            </h2>
            <p className="text-xl text-muted-foreground">
              Everything you need for peace of mind
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-none shadow-lg bg-red-100/50 hover:shadow-xl transition-shadow">
              <CardContent className="pt-8 text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-[#ff6b6b] rounded-full flex items-center justify-center text-white shadow-md transform -translate-y-2">
                  <Shield className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  Verified Credentials
                </h3>
                <p className="text-gray-600">
                  All sitters are background-checked with educator-verified
                  skills.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg bg-teal-100/50 hover:shadow-xl transition-shadow">
              <CardContent className="pt-8 text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center text-white shadow-md transform -translate-y-2">
                  <Award className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  Special Needs Expertise
                </h3>
                <p className="text-gray-600">
                  Find sitters experienced with autism, ADHD, and language
                  barriers.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg bg-yellow-100/50 hover:shadow-xl transition-shadow">
              <CardContent className="pt-8 text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center text-white shadow-md transform -translate-y-2">
                  <Heart className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  Micro-Adventures
                </h3>
                <p className="text-gray-600">
                  Every session can include goal-based learning activities for
                  growth.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="py-24 bg-gray-50 px-4 md:px-6">
          <div className="container mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold font-outfit text-center mb-16">
              How it Works
            </h2>
            <div className="grid md:grid-cols-3 gap-12 relative">
              <div className="hidden md:block absolute top-12 left-1/3 w-1/3 h-0.5 border-t-2 border-dashed border-gray-300"></div>
              <div className="hidden md:block absolute top-12 right-1/3 w-1/3 h-0.5 border-t-2 border-dashed border-gray-300"></div>

              <div className="relative text-center space-y-6">
                <div className="w-24 h-24 mx-auto bg-white rounded-full shadow-md flex items-center justify-center text-3xl font-bold text-primary border-4 border-red-50 z-10 relative">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Search</h3>
                  <p className="text-gray-600">
                    Find sitters by location and needs
                  </p>
                </div>
              </div>

              <div className="relative text-center space-y-6">
                <div className="w-24 h-24 mx-auto bg-white rounded-full shadow-md flex items-center justify-center text-3xl font-bold text-teal-500 border-4 border-teal-50 z-10 relative">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Review</h3>
                  <p className="text-gray-600">
                    View credentials and expertise
                  </p>
                </div>
              </div>

              <div className="relative text-center space-y-6">
                <div className="w-24 h-24 mx-auto bg-white rounded-full shadow-md flex items-center justify-center text-3xl font-bold text-yellow-500 border-4 border-yellow-50 z-10 relative">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Book</h3>
                  <p className="text-gray-600">
                    Schedule your session directly
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer className="bg-gray-900 text-gray-300 py-16 px-4 md:px-6 mt-auto">
          <div className="container mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h4 className="text-white font-bold text-lg mb-4">About</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Our Story
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-white font-bold text-lg mb-4">Support</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Safety Information
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Cancellation Options
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-white font-bold text-lg mb-4">Community</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Guidelines
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Diversity & Inclusion
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Success Stories
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-white font-bold text-lg mb-4">Contact</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li className="flex gap-4 pt-2">
                  <Link href="#" className="hover:text-white transition-colors">
                    <Twitter className="w-5 h-5" />
                  </Link>
                  <Link href="#" className="hover:text-white transition-colors">
                    <Instagram className="w-5 h-5" />
                  </Link>
                  <Link href="#" className="hover:text-white transition-colors">
                    <Facebook className="w-5 h-5" />
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
