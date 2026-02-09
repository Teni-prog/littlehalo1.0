"use client";

import Link from "next/link";

export default function ChildProgress({ stats, selectedChild, children }) {
    return (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">{selectedChild}'s Progress</h2>
                <select className="text-sm border border-gray-200 rounded-lg px-3 py-2 text-gray-500 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#ff6b6b]/20 focus:border-[#ff6b6b]">
                    {children.map((child) => (
                        <option key={child.id} value={child.name}>
                            {child.name}
                        </option>
                    ))}
                </select>
            </div>
            <hr />
            <div className="grid grid-cols-2 gap-4 mb-6 mt-4">
                <div className="bg-teal-50 p-4 rounded-2xl">
                    <p className="text-sm text-teal-600 font-medium mb-1">
                        Total Sessions
                    </p>
                    <p className="text-3xl font-bold text-teal-700">
                        {stats.totalSessions}
                    </p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-2xl">
                    <p className="text-sm text-yellow-600 font-medium mb-1">
                        Adventures Completed
                    </p>
                    <p className="text-3xl font-bold text-yellow-700">
                        {stats.adventuresCompleted}
                    </p>
                </div>
            </div>

            <div>
                <h3 className="font-bold text-gray-900 mb-4">Skills Practiced</h3>
                <div className="space-y-4 mb-6">
                    {stats.skills.map((skill, index) => (
                        <div key={index}>
                            <div className="flex justify-between text-sm text-gray-600 mb-1">
                                <span>{skill.name}</span>
                                <span className="font-semibold">{skill.percentage}%</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className={`h-full ${skill.color} rounded-full transition-all duration-500`}
                                    style={{ width: `${skill.percentage}%` }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
                <Link
                    href="/progress/full-report"
                    className="w-full py-3 border border-[#ff6b6b] text-[#ff6b6b] rounded-xl font-bold hover:bg-red-50 transition-colors flex items-center justify-center"
                >
                    View Full Report
                </Link>
            </div>
        </div>
    );
}