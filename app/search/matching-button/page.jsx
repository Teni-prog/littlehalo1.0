// import { createClient } from '@/lib/supabase/server';
// import { matchSitters } from '@/lib/matching-algorithm';
// import { SitterCard } from "@/components/sitter-card";

// export default async function SearchPage() {
//     // Connect to database
//     const supabase = await createClient();

//     // Get all parents
//     const { data: allParents } = await supabase
//         .from('users')
//         .select('id, name, email')
//         .eq('user_type', 'parent');

//     // Pick a random parent
//     const randomParent = allParents[Math.floor(Math.random() * allParents.length)];
//     const parentId = randomParent.id;

//     // Get this parent's full info (including preferences)
//     const { data: parent } = await supabase
//         .from('users')
//         .select('*')
//         .eq('id', parentId)
//         .single();

//     // Get this parent's child
//     const { data: children } = await supabase
//         .from('children')
//         .select('*')
//         .eq('parent_id', parentId)
//         .limit(1);

//     const child = children?.[0];
//     // Get all sitters
//     const { data: sitters } = await supabase
//         .from('sitter_profiles')
//         .select(`
//             *,
//             user:users!user_id(id, name, email, avatar)
//         `);

//     // Transform sitters to match our format
//     const formattedSitters = sitters?.map(sitter => ({
//         id: sitter.user.id,
//         email: sitter.user.email,
//         name: sitter.user.name,
//         image: sitter.user.avatar,
//         bio: sitter.bio,
//         hourly_rate: sitter.hourly_rate,
//         languages: sitter.languages,
//         location: sitter.location,
//         is_verified: sitter.is_verified,
//         rating: sitter.rating,
//         reviews: sitter.reviews_count,
//         background_check_status: sitter.background_check_status
//     })) || [];

//     // USE PARENT'S PREFERENCES FROM DATABASE (not hardcoded!)
//     const hardRules = {
//         maxBudget: parent.max_budget || 30, // Use their budget from database
//     };

//     const softPreferences = {
//         city: parent.preferred_location?.split(',')[0] || 'Fredericton', // Extract city from location
//         preferredLanguage: parent.preferred_languages?.[1] || parent.preferred_languages?.[0] || 'English', // Second language or first
//     };

//     // Run the matching algorithm
//     const matchedSitters = matchSitters(formattedSitters, hardRules, softPreferences);

//     return (
//         <div className="container py-8 min-h-screen bg-gray-100 px-4 ">
//             <h1 className="text-3xl font-bold font-outfit mb-2 flex justify-center">Top Matched Sitters</h1>
//             <p className="text-muted-foreground mb-8 flex justify-center">
//                 Showing matches for <span className="gap-2"> <strong>{parent.name}</strong> ({child?.name || 'your child'})</span>
//             </p>

//             {matchedSitters.length === 0 && (
//                 <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
//                     <p className="text-yellow-800 font-medium">
//                         No sitters match your requirements. Try adjusting your filters.
//                     </p>
//                 </div>
//             )}

//             {/* Show matched sitters with preference score */}
//             <div className="max-w-6xl mx-auto flex flex-col gap-4">
//                 <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
//                     <p className="text-sm text-blue-800">
//                         <strong>{parent.name}'s preferences:</strong> Under ${hardRules.maxBudget}/hr •
//                         Speaks {softPreferences.preferredLanguage} •
//                         Near {softPreferences.city}
//                     </p>
//                 </div>
//                 {matchedSitters.map((sitter) => (
//                     <div key={sitter.id} className="relative">
//                         {/* Show how many preferences they match */}
//                         <div className="absolute top-4 right-4 z-10 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
//                             {sitter.preferenceScore}/4 Preferences
//                         </div>

//                         <SitterCard sitter={sitter} />
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// }

import Image from "next/image";
import { MapPin, Star, BadgeCheck, Briefcase, Languages } from "lucide-react";
import sitter1 from "@/assets/sitter1.png"; // default avatar
import Link from "next/link";

export default function MatchedSitterCard({ sitter }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-lg transition-shadow">
      {/* Match Percentage Badge */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-4">
          <Image
            src={sitter.image || sitter1}
            alt={sitter.name || "Sitter"}
            className="rounded-full object-cover w-16 h-16"
            width={64}
            height={64}
            unoptimized={sitter.image ? true : false}
          />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-gray-900 text-lg">{sitter.name}</h3>
              {sitter.is_verified && (
                <BadgeCheck className="w-5 h-5 text-blue-500" />
              )}
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
              <MapPin className="w-4 h-4" />
              <span>{sitter.location}</span>
            </div>
          </div>
        </div>
        <div className="bg-teal-50 text-teal-600 px-3 py-1 rounded-full font-bold text-sm">
          {sitter.preferenceScore}/4
        </div>
      </div>

      {/* Details */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Star className="w-4 h-4 text-yellow-500 fill-current" />
          <span className="font-semibold">{sitter.rating}</span>
          <span>({sitter.reviews} reviews)</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Briefcase className="w-4 h-4" />
          <span>{sitter.experience} years experience</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Briefcase className="w-4 h-4" />
          <span>${sitter.hourly_rate}/hour</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Languages className="w-4 h-4" />
          <div className="flex flex-wrap gap-1">
            {sitter.languages?.map((lang, idx) => (
              <span key={idx} className="bg-gray-100 px-2 py-1 rounded">
                {lang}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Match Details */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-500">
          Matched {sitter.preferenceScore}/4 preferences
        </p>
      </div>

      {/* CTA Button */}
      <Link href={`/profile/Sitter/${sitter.id}`}>
        <button className="w-full mt-4 bg-[#ff6b6b] text-white py-2 rounded-xl font-semibold hover:bg-[#ff5252] transition-colors cursor-pointer">
          View Profile
        </button>
      </Link>
    </div>
  );
}
