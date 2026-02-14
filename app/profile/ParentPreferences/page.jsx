import { MapPin, DollarSign, Languages, Briefcase, ScanHeart } from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/ui/button';

export default function ParentPreferences({ parent }) {
    if (!parent) return null;

    return (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 mb-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Your Preferences</h2>
                <button
                    className="text-[#ff6b6b] hover:text-[#ff5252] text-sm font-semibold hover:underline cursor-pointer"
                >
                    Edit Preferences
                </button>
            </div>
            <hr className="mb-6" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {/* Budget */}
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center flex-shrink-0">
                        <DollarSign className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Budget</h3>
                        <p className="text-gray-600">Up to ${parent.max_budget}/hour</p>
                    </div>
                </div>

                {/* Languages */}
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center flex-shrink-0">
                        <Languages className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Languages</h3>
                        <div className="flex flex-wrap gap-1">
                            {parent.preferred_languages?.map((lang, idx) => (
                                <span key={idx} className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                    {lang}
                                </span>
                            )) || <p className="text-gray-600">Any</p>}
                        </div>
                    </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-500 flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Location</h3>
                        <p className="text-gray-600">{parent.preferred_location || 'Any'}</p>
                    </div>
                </div>

                {/* Experience */}
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-yellow-50 text-yellow-600 flex items-center justify-center flex-shrink-0">
                        <Briefcase className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Experience</h3>
                        <p className="text-gray-600">
                            {parent.experience
                                ? `${parent.experience}+ years`
                                : 'Any level'}
                        </p>
                    </div>
                </div>

                {/* Special Needs */}
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center flex-shrink-0">
                        <ScanHeart className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className=" font-semibold text-gray-900 mb-1">Special Needs</h3>
                        <p className="text-gray-600">
                            {parent.special_needs ? `${parent.special_needs}` : 'None'}
                        </p>
                    </div>
                </div>
            </div>


            {/* Matching Criteria Info */}
            {/* <div className="mt-6 pt-6 border-t border-gray-100">
                <p className="text-sm text-gray-500">
                    <span className="font-semibold">Hard Requirements:</span> English speaker, within budget, background check approved
                    <br />
                    <span className="font-semibold">Preferences:</span> Same location, speaks preferred language, verified sitter, high rating (4.5+)
                </p>
            </div> */}
        </div>
    );
}