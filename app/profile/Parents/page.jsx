"use client";

import { Search, BookOpen, MessageCircle, CreditCard, Calendar, Clock, CalendarCheck, Star, Heart, TrendingUp } from "lucide-react";
import Link from 'next/link';
import Image from 'next/image';
import WelcomeBanner from '@/components/ui/welcomebanner';
import sitter1 from '@/assets/sitter1.png';
import sitter2 from '@/assets/sitter2.png';
import MyChildren from '@/components/Mychildren';
import ChildProgress from '@/components/Childprogress';
import { useEffect, useState } from 'react';
import MatchedSitterCard from '@/app/search/matching-button/page';
import ParentPreferences from '../ParentPreferences/page';

export default function ParentDashboard() {
    const [currentParent, setCurrentParent] = useState(null);
    const [topMatches, setTopMatches] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch random parent and matched sitters on page load
    useEffect(() => {
        async function fetchData() {
            try {
                // 1. Get a random parent with preferences
                const parentsResponse = await fetch('/api/parents?has_preferences=true');
                const parentsResult = await parentsResponse.json();

                if (!parentsResponse.ok) {
                    throw new Error(parentsResult.error || 'Failed to fetch parents');
                }

                const parents = parentsResult.data;

                if (parents && parents.length > 0) {
                    // Pick random parent
                    const randomParent = parents[Math.floor(Math.random() * parents.length)];
                    setCurrentParent(randomParent);

                    // 2. Get matched sitters using the matching API
                    const matchingResponse = await fetch(`/api/matching?parent_id=${randomParent.id}&limit=3`);
                    const matchingResult = await matchingResponse.json();

                    if (!matchingResponse.ok) {
                        throw new Error(matchingResult.error || 'Failed to fetch matches');
                    }

                    console.log('Matched sitters:', matchingResult.data); // Debug
                    console.log('Preferences used:', matchingResult.preferences); // Debug

                    // Set top 3 matches
                    setTopMatches(matchingResult.data || []);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);
    // const user = {
    //     name: "John Doe",
    //     email: "john.doe@example.com",
    //     role: "Parent",
    // };


    const sessions = [
        {
            id: 1,
            date: "Feb 15, 2026",
            time: "3:00 PM - 6:00 PM",
            status: "Confirmed",
            child: "Emma (5)",
            adventure: "Nature Walk & Bird Watching",
            sitter: {
                name: "Sarah Chen",
                avatar: sitter1
            }
        },
        {
            id: 2,
            date: "Feb 18, 2026",
            time: "10:00 AM - 2:00 PM",
            status: "Pending",
            child: "Lucas (3)",
            adventure: "Arts & Crafts Session",
            sitter: {
                name: "Maria Rodriguez",
                avatar: sitter2
            }
        },
    ];

    const actions = [
        {
            icon: Search,
            label: "Find Sitters",
            desc: "Search for new sitters",
            color: "bg-red-50 text-[#ff6b6b]",
            href: "/search"
        },
        {
            icon: BookOpen,
            label: "Adventures",
            desc: "Browse activities",
            color: "bg-teal-50 text-teal-500",
            href: "/adventures"
        },
        {
            icon: MessageCircle,
            label: "Messages",
            desc: "Chat with sitters",
            color: "bg-yellow-50 text-yellow-600",
            href: "/messages"
        },
        {
            icon: CreditCard,
            label: "Payments",
            desc: "View billing history",
            color: "bg-purple-50 text-purple-500",
            href: "/payments",
        },
    ];

    const getStatusClass = (status) => {
        const statusMap = {
            confirmed: 'status-confirmed',
            pending: 'status-pending',
            denied: 'status-denied',
            cancelled: 'status-cancelled',
            completed: 'status-completed'
        };
        return statusMap[status.toLowerCase()] || 'status-pending';
    };

    const activities = [
        {
            icon: CalendarCheck,
            text: "Session completed with Sarah Johnson",
            time: "2 days ago",
            color: "bg-teal-50 text-teal-500",
        },
        {
            icon: Star,
            text: "New review submitted for Maria Garcia",
            time: "4 days ago",
            color: "bg-yellow-50 text-yellow-600",
        },
        {
            icon: Heart,
            text: "Saved Emily Chen to favorites",
            time: "1 week ago",
            color: "bg-red-50 text-[#ff6b6b]",
        },
        {
            icon: TrendingUp,
            text: 'Emma completed "Emotion Recognition" activity',
            time: "2 weeks ago",
            color: "bg-purple-50 text-purple-500",
        },
    ];

    const children = [
        {
            id: 1,
            name: "Emma Wilson",
            age: "5 years old",
            initial: "E",
            tags: ["Autism", "Visual Learner"],
            color: "bg-red-50 text-[#ff6b6b]",
        },
        {
            id: 2,
            name: "Lucas Wilson",
            age: "3 years old",
            initial: "L",
            tags: ["Active", "Outdoor Enthusiast"],
            color: "bg-blue-50 text-blue-600",
        },
    ];
    const progressStats = {
        totalSessions: 12,
        adventuresCompleted: 8,
        skills: [
            { name: "Empathy", percentage: 75, color: "bg-[#ff6b6b]" },
            { name: "Creativity", percentage: 60, color: "bg-[#ff6b6b]" },
            { name: "Problem Solving", percentage: 45, color: "bg-[#ff6b6b]" },
        ],
    };
    return (
        <main className='flex flex-col min-h-screen max-w-7xl mx-auto px-4 sm:px-6 py-8'>
            <WelcomeBanner userName={currentParent?.name || "Parent"} sessionCount={sessions.length} />

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8">
                {actions.map((action, index) => (
                    <Link
                        key={index}
                        href={action.href}
                        className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center group"
                    >
                        <div
                            className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                        >
                            <action.icon className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-gray-900 mb-1">{action.label}</h3>
                        <p className="text-xs text-gray-500">{action.desc}</p>
                    </Link>
                ))}
            </div>
            <ParentPreferences parent={currentParent} />
            {/* TOP MATCHED SITTERS SECTION - NEW! */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 mb-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Top Matched Sitters for You</h2>
                    <Link
                        href="/search"
                        className="text-[#ff6b6b] hover:text-[#ff5252] text-sm font-semibold hover:underline"
                    >
                        Search Sitters
                    </Link>
                </div>
                <hr />
                {topMatches.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                        {topMatches.map((sitter) => (
                            <MatchedSitterCard key={sitter.id} sitter={sitter} />
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 text-center py-8">
                        No matching sitters found. Try adjusting your preferences.
                    </p>
                )}
            </div>

            {/* Row 1: Upcoming Sessions + Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* <div className="lg:col-span-2">
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Upcoming Sessions</h2>
                            <Link
                                href="/sessions"
                                className="text-[#ff6b6b] hover:text-[#ff5252] text-sm font-semibold hover:underline "
                            >
                                View All
                            </Link>
                        </div>
                        <hr />
                        <div className="space-y-6 mt-4">
                            {sessions.map((session) => (
                                <div
                                    key={session.id}
                                    className="border border-gray-100 rounded-2xl p-6 bg-gray-50/50"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-4">
                                            <Image
                                                src={session.sitter.avatar}
                                                alt={session.sitter.name}
                                                className="rounded-full object-cover w-12 h-12"
                                            />
                                            <div>
                                                <h3 className="font-bold text-gray-900">
                                                    {session.sitter.name}
                                                </h3>
                                                <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="w-4 h-4" />
                                                        <span>{session.date}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Clock className="w-4 h-4" />
                                                        <span>{session.time}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <span className={getStatusClass(session.status)}>
                                            {session.status}
                                        </span>
                                    </div>

                                    <div className="mb-4">
                                        <span className="text-sm text-gray-500">
                                            For{" "}
                                            <span className="font-semibold text-gray-900">
                                                {session.child}
                                            </span>
                                        </span>
                                    </div>

                                    <div className="bg-yellow-50 text-yellow-800 px-4 py-3 rounded-xl text-sm font-medium border border-yellow-100">
                                        <span className="font-bold">Micro-Adventure:</span>{" "}
                                        {session.adventure}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div> */}

                {/* Right: Recent Activity */}
                {/* <div className="lg:col-span-1">
                    <MyChildren children={children} />
                </div> */}
            </div>


            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mt-8">
                {/* <div className="lg:col-span-2">
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
                        <hr />
                        <div className="space-y-6 mt-4">
                            {activities.map((item, index) => (
                                <div key={index} className="flex items-start gap-4">
                                    <div
                                        className={`w-10 h-10 rounded-full ${item.color} flex items-center justify-center flex-shrink-0`}
                                    >
                                        <item.icon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-gray-900 font-medium">{item.text}</p>
                                        <p className="text-sm text-gray-500 mt-1">{item.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div> */}

                {/* <div className="lg:col-span-1">
                    <ChildProgress
                        stats={progressStats}
                        selectedChild="Emma Wilson"
                        children={children}
                    />
                </div> */}
            </div>
        </main>
    );
}
