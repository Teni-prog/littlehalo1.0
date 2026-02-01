import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { User, Baby } from "lucide-react";

export default function LoginPage() {
    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* Left Side - Welcome & Branding */}
            <div className="hidden lg:flex flex-col justify-center p-12 bg-primary/10 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 backdrop-blur-3xl" />
                <div className="relative z-10 max-w-lg mx-auto space-y-6">
                    <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white text-2xl font-bold mb-8 shadow-xl">
                        LH
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold font-outfit text-gray-900">
                        Welcome Back!
                    </h1>
                    <p className="text-xl text-gray-600 leading-relaxed">
                        Sign in to access your dashboard, manage bookings, and connect with your community.
                    </p>
                </div>
            </div>

            {/* Right Side - Account Selection */}
            <div className="flex items-center justify-center p-6 md:p-12 bg-white">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center space-y-2">
                        <h2 className="text-2xl font-bold text-gray-900">Choose your account type</h2>
                        <p className="text-muted-foreground">Select how you want to log in</p>
                    </div>

                    <div className="grid gap-6">
                        {/* Parents Card */}
                        <Link href="/login/parents">
                            <Card className="group hover:border-primary/50 transition-all hover:shadow-md cursor-pointer border-2 border-transparent hover:bg-primary/5">
                                <CardContent className="p-6 flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-[#ff6b6b] group-hover:scale-110 transition-transform">
                                        <Baby className="w-6 h-6" />
                                    </div>
                                    <div className="text-left">
                                        <h3 className="font-bold text-lg text-gray-900">For Parents</h3>
                                        <p className="text-sm text-gray-500">Find care for your little ones</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>

                        {/* Sitters Card */}
                        <Link href="/login/sitters">
                            <Card className="group hover:border-secondary/50 transition-all hover:shadow-md cursor-pointer border-2 border-transparent hover:bg-secondary/5">
                                <CardContent className="p-6 flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 group-hover:scale-110 transition-transform">
                                        <User className="w-6 h-6" />
                                    </div>
                                    <div className="text-left">
                                        <h3 className="font-bold text-lg text-gray-900">For Sitters</h3>
                                        <p className="text-sm text-gray-500">Find jobs and manage bookings</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    </div>

                    <div className="text-center text-sm">
                        <p className="text-muted-foreground">
                            New to Little Halo? <Link href="/signup" className="text-primary font-bold hover:underline">Create an account</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

