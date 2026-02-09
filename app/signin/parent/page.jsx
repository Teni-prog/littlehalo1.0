"use client";

import Link from "next/link";
import {
    ArrowLeft,
    ShieldCheck,
    UserCircle,
    Mail,
    Lock,
    Baby,
} from "lucide-react";

export default function ParentLoginPage() {
    return (
        <div className="min-h-screen bg-gray-100">
            {/* --- Main Layout --- */}
            <main className="max-w-6xl mx-auto px-6 py-12 md:py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 items-center">
                    {/* LEFT SIDE: Same Welcome Text (Reused for consistency) */}
                    <div className="hidden md:block">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                            Welcome Back!
                        </h1>
                        <p className="text-xl text-gray-600 mb-12 leading-relaxed">
                            Sign in to access your dashboard, manage bookings, and connect
                            with your community.
                        </p>

                        <div className="space-y-8">
                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                                    <ShieldCheck className="w-6 h-6 text-[#ff6b6b]" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                        Safe & Secure
                                    </h3>
                                    <p className="text-gray-500">
                                        Your data is protected with industry-leading security
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center flex-shrink-0">
                                    <UserCircle className="w-6 h-6 text-teal-500" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                        Personalized Experience
                                    </h3>
                                    <p className="text-gray-500">
                                        Access your bookings, favorites, and recommendations
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT SIDE: Login Form Card */}
                    <div className="bg-white rounded-3xl shadow-xl p-8 md:p-10 border border-gray-100 relative">
                        {/* Back Button */}
                        <Link
                            href="/login"
                            className="absolute top-8 left-8 text-sm text-gray-400 hover:text-gray-600 flex items-center gap-1 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Change account type
                        </Link>

                        {/* Form Header */}
                        <div className="text-center mt-8 mb-8">
                            <div className="w-16 h-16 bg-[#ff6b6b] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md shadow-red-100">
                                <Baby className="w-8 h-8 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">
                                Parent Sign In
                            </h2>
                            <p className="text-gray-500 mt-2">
                                Enter your credentials to continue
                            </p>
                        </div>

                        {/* Inputs */}
                        <form className="space-y-5">
                            {/* Email Input */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#ff6b6b] focus:ring-2 focus:ring-[#ff6b6b]/20 transition-all"
                                    />
                                </div>
                            </div>

                            {/* Password Input */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="password"
                                        placeholder="Enter your password"
                                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#ff6b6b] focus:ring-2 focus:ring-[#ff6b6b]/20 transition-all"
                                    />
                                </div>
                            </div>

                            {/* Remember & Forgot */}
                            <div className="flex justify-between items-center text-sm">
                                <label className="flex items-center gap-2 cursor-pointer text-gray-600">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 rounded border-gray-300 text-[#ff6b6b] focus:ring-[#ff6b6b] cursor-pointer"
                                    />
                                    Remember me
                                </label>
                                <button
                                    type="button"
                                    className="text-[#ff6b6b] font-medium hover:underline cursor-pointer"
                                >
                                    Forgot password?
                                </button>
                            </div>

                            {/* Submit Button */}
                            <Link href="/profile/Parents">
                                <button
                                    type="button"
                                    className="w-full bg-[#ff6b6b] text-white py-3.5 rounded-xl font-bold hover:bg-[#ff5252] transition-colors shadow-lg shadow-red-100 cursor-pointer"
                                >
                                    Sign In
                                </button>
                            </Link>
                        </form>

                        {/* Footer Link */}
                        <p className="text-center text-gray-500 mt-8 text-sm">
                            Don't have an account?{" "}
                            <Link
                                href="/signup"
                                className="text-[#ff6b6b] font-bold hover:underline cursor-pointer"
                            >
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}