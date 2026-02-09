"use client";

import Link from "next/link";
import { Plus } from "lucide-react";

export default function MyChildren({ children }) {
    return (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">My Children</h2>
            <hr />

            <div className="space-y-4 mb-6 mt-4">
                {children.map((child) => (
                    <div
                        key={child.id}
                        className="flex items-center gap-4 p-4 border border-gray-100 rounded-2xl bg-gray-50/50"
                    >
                        <div
                            className={`w-12 h-12 rounded-full ${child.color} flex items-center justify-center text-xl font-bold`}
                        >
                            {child.initial}
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900">{child.name}</h3>
                            <p className="text-sm text-gray-500 mb-2">{child.age}</p>
                            <div className="flex flex-wrap gap-2">
                                {child.tags.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="px-2 py-1 bg-white border border-gray-200 text-xs text-gray-600 rounded-md font-medium"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <Link
                href="/children/add"
                className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 font-bold flex items-center justify-center gap-2 hover:border-[#ff6b6b] hover:text-[#ff6b6b] transition-colors"
            >
                <Plus className="w-5 h-5" /> Add Another Child
            </Link>
        </div>
    );
}