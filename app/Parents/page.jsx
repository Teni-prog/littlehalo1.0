import React from 'react'
import { ArrowLeft, Bell, Settings, Search, BookOpen, MessageCircle, CreditCard } from "lucide-react";
import Link from 'next/link';
import WelcomeBanner from '@/components/ui/welcomebanner';

export default function Parents(userName, sessionCount) {
    const user = {
        name: "John Doe",
        email: "john.doe@example.com",
        role: "Parent",
    };
    const sessions = [
        {
            id: 1,
            date: "2022-01-01",
            time: "10:00 AM",
            duration: "1 hour",
            sitter: "Jane Doe",
        },
        {
            id: 2,
            date: "2022-01-02",
            time: "11:00 AM",
            duration: "1 hour",
            sitter: "John Doe",
        },
    ];
    const actions = [
        {
            icon: Search,
            label: "Find Sitters",
            desc: "Search for new sitters",
            color: "bg-red-50 text-[#ff6b6b]",
        },
        {
            icon: BookOpen,
            label: "Adventures",
            desc: "Browse activities",
            color: "bg-teal-50 text-teal-500",
        },
        {
            icon: MessageCircle,
            label: "Messages",
            desc: "Chat with sitters",
            color: "bg-yellow-50 text-yellow-600",
        },
        {
            icon: CreditCard,
            label: "Payments",
            desc: "View billing history",
            color: "bg-purple-50 text-purple-500",
        },
    ];
    return (
        <>
            <main className='flex flex-col min-h-screen max-w-7xl mx-auto px-4 sm:px-6 py-8'>
                <WelcomeBanner userName={user.name} sessionCount={sessions.length} />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8">
                    {actions.map((action, index) => (
                        <button
                            key={index}
                            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center group cursor-pointer"
                        >
                            <div
                                className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                            >
                                <action.icon className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-gray-900 mb-1">{action.label}</h3>
                            <p className="text-xs text-gray-500">{action.desc}</p>
                        </button>
                    ))}
                </div>
            </main>
        </>
    )
}