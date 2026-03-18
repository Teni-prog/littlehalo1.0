// import { createClient } from "@/lib/supabase/server";
// import { NextResponse } from "next/server";
// import matchSitters from "@/lib/rulebased";

// /**
//  * GET /api/matching
//  * Get matched sitters for a parent based on preferences
//  *
//  * Query Parameters:
//  * - parent_id (optional): Parent ID to fetch preferences from database
//  * - max_budget (optional): Maximum hourly rate budget
//  * - preferred_location (optional): Preferred location/city
//  * - preferred_language (optional): Preferred language
//  * - limit (optional): Number of top matches to return (default: 3)
//  *
//  * Examples:
//  * - GET /api/matching?parent_id=123 - Returns top 3 matches for parent 123
//  * - GET /api/matching?max_budget=25&preferred_location=Halifax&limit=5
//  */
// export async function GET(request) {
//   try {
//     const supabase = await createClient();
//     const { searchParams } = new URL(request.url);
//     const parentId = searchParams.get("parent_id");
//     const maxBudget = searchParams.get("max_budget");
//     const preferredLocation = searchParams.get("preferred_location");
//     const preferredLanguage = searchParams.get("preferred_language");
//     const limit = parseInt(searchParams.get("limit") || "3");

//     let hardRules = {};
//     let softPreferences = {};

//     // If parent_id is provided, fetch parent preferences from database
//     if (parentId) {
//       const { data: parent, error: parentError } = await supabase
//         .from("users")
//         .select("*")
//         .eq("id", parentId)
//         .eq("user_type", "parent")
//         .single();

//       if (parentError) {
//         return NextResponse.json(
//           { error: "Parent not found" },
//           { status: 404 },
//         );
//       }

//       hardRules = {
//         maxBudget: parent.max_budget || 30,
//       };

//       softPreferences = {
//         city: parent.preferred_location?.split(",")[0] || "Halifax",
//         preferredLanguage:
//           parent.preferred_languages?.[1] ||
//           parent.preferred_languages?.[0] ||
//           "English",
//       };
//     } else {
//       hardRules = {
//         maxBudget: maxBudget ? parseFloat(maxBudget) : 30,
//       };

//       softPreferences = {
//         city: preferredLocation || "Halifax",
//         preferredLanguage: preferredLanguage || "English",
//       };
//     }
//     const { data: sitters, error: sitterError } = await supabase.from(
//       "sitter_profiles",
//     ).select(`
//                 id,
//                 bio,
//                 hourly_rate,
//                 languages,
//                 location,
//                 is_verified,
//                 rating,
//                 reviews_count,
//                 background_check_status,
//                 experience,
//                 special_needs,
//                 users!user_id (
//                     id,
//                     name,
//                     email,
//                     avatar
//                 )
//             `);

//     if (sitterError) {
//       return NextResponse.json({ error: sitterError.message }, { status: 500 });
//     }

//     // Transform sitters to match algorithm format (consistent with /api/sitters)
//     const formattedSitters =
//       sitters?.map((sitter) => ({
//         id: sitter.users.id,
//         email: sitter.users.email,
//         name: sitter.users.name,
//         image: sitter.users.avatar,
//         bio: sitter.bio,
//         hourly_rate: sitter.hourly_rate,
//         languages: sitter.languages,
//         location: sitter.location,
//         is_verified: sitter.is_verified,
//         rating: sitter.rating,
//         reviews: sitter.reviews_count,
//         background_check_status: sitter.background_check_status,
//         experience: sitter.experience,
//         special_needs: sitter.special_needs,
//       })) || [];

//     // Run matching algorithm
//     const matches = matchSitters(formattedSitters, hardRules, softPreferences);

//     // Return top N matches
//     const topMatches = matches.slice(0, limit);

//     return NextResponse.json({
//       data: topMatches,
//       preferences: { hardRules, softPreferences },
//     });
//   } catch (error) {
//     console.error("Matching error:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 },
//     );
//   }
// }
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
// import matchSitters from "@/lib/testingmatch";
import { matchSittersTOPSIS } from "@/lib/topsis";

export async function GET(request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);

    const parentId = searchParams.get("parent_id");
    const maxBudget = searchParams.get("max_budget");
    const preferredLocation = searchParams.get("preferred_location");
    const preferredLanguage = searchParams.get("preferred_language");
    const idealRating = parseFloat(searchParams.get("ideal_rating") || "5.0");
    // Make constraints opt-in instead of opt-out to avoid filtering everyone
    const requireVerified = searchParams.get("require_verified") === "true";
    const requireBackgroundCheck =
      searchParams.get("require_background_check") === "true";
    const limit = parseInt(searchParams.get("limit") || "3");

    let maxBudgetValue = maxBudget ? parseFloat(maxBudget) : 30;
    let cityValue = preferredLocation || "Halifax";
    let languageValue = preferredLanguage || "English";

    // If parent_id is provided, fetch parent preferences from database
    if (parentId) {
      const { data: parent, error: parentError } = await supabase
        .from("users")
        .select("*")
        .eq("id", parentId)
        .eq("user_type", "parent")
        .single();

      if (parentError) {
        return NextResponse.json(
          { error: "Parent not found" },
          { status: 404 },
        );
      }

      maxBudgetValue = parent.max_budget || 30;
      cityValue = parent.preferred_location?.split(",")[0] || "Halifax";
      languageValue =
        parent.preferred_languages?.[1] ||
        parent.preferred_languages?.[0] ||
        "English";
    }

    // Fetch all sitters with their user info
    const { data: sitters, error: sitterError } = await supabase.from(
      "sitter_profiles",
    ).select(`
        id,
        bio,
        hourly_rate,
        languages,
        location,
        is_verified,
        rating,
        reviews_count,
        background_check_status,
        experience,
        special_needs,
        users!user_id (
          id,
          name,
          email,
          avatar
        )
      `);

    if (sitterError) {
      return NextResponse.json({ error: sitterError.message }, { status: 500 });
    }

    // Transform sitters to match algorithm format
    // Key changes: rename hourly_rate -> price, add languageMatch for Pareto
    const formattedSitters =
      sitters?.map((sitter) => ({
        id: sitter.users.id,
        email: sitter.users.email,
        name: sitter.users.name,
        image: sitter.users.avatar,
        bio: sitter.bio,
        hourly_rate: sitter.hourly_rate, // keep original for response
        price: sitter.hourly_rate ?? 20, // algorithm uses this, default to 20 if missing
        languages: sitter.languages || [],
        location: sitter.location,
        is_verified: sitter.is_verified,
        rating: sitter.rating ?? 3.5, // default rating if missing
        reviews: sitter.reviews_count,
        background_check_status: sitter.background_check_status,
        experience: sitter.experience ?? 1, // default to 1 year if missing
        special_needs: sitter.special_needs,
        // Pareto needs languageMatch as a numeric dimension
        languageMatch: sitter.languages?.includes(languageValue) ? 1 : 0,
      })) || [];

    console.log(`Total sitters fetched: ${formattedSitters.length}`);
    console.log(`Language value: ${languageValue}`);
    console.log(`Max budget: ${maxBudgetValue}`);

    // Build parent profile in the format the new algorithm expects
    const parentPrefs = {
      preferredLanguage: languageValue,
      maxBudget: maxBudgetValue,
      idealRating: idealRating,
      requireVerified,
      requireBackgroundCheck,
    };

    // Run matching algorithm
    const matches = matchSittersTOPSIS(formattedSitters, parentPrefs);

    console.log(`Match result type: ${matches?.error ? "error" : "success"}`);
    console.log(
      `Matches count: ${Array.isArray(matches) ? matches.length : 0}`,
    );

    // Handle no matches case
    if (matches?.error) {
      return NextResponse.json(
        {
          data: [],
          message: matches.error,
          preferences: {
            preferredLanguage: parentPrefs.preferredLanguage,
            maxBudget: parentPrefs.maxBudget,
            softPreferences: { city: cityValue, language: languageValue },
          },
        },
        { status: 200 },
      );
    }

    // Return top N matches
    const topMatches = matches.slice(0, limit);

    return NextResponse.json({
      data: topMatches,
      preferences: {
        preferredLanguage: parentPrefs.preferredLanguage,
        maxBudget: parentPrefs.maxBudget,
        softPreferences: { city: cityValue, language: languageValue },
      },
    });
  } catch (error) {
    console.error("Matching error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
