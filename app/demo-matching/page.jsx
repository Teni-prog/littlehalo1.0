"use client";

import { useState } from "react";
import matchSitters, {
  passesHardRules,
  calculatePreferenceScore,
} from "@/lib/matching-algorithm";

const dummyParents = [
  {
    id: 1,
    name: "Sarah Johnson",
    preferences: {
      city: "Toronto",
      preferredLanguage: "Greek",
      maxBudget: 40,
    },
  },
  {
    id: 2,
    name: "Michael Chen",
    preferences: {
      city: "Los Angeles",
      preferredLanguage: "Mandarin",
      maxBudget: 30,
    },
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    preferences: {
      city: "Chicago",
      preferredLanguage: "French",
      maxBudget: 20,
    },
  },
];

const dummySitters = [
  {
    id: 101,
    name: "Maria Garcia",
    hourly_rate: 50,
    languages: ["English", "Arabic"],
    location: "New York, NY",
    background_check_status: "approved",
    is_verified: true,
    rating: 4.8,
    qualifications: [
      "CPR Certified",
      "5 years experience",
      "Background checked",
    ],
  },
  {
    id: 102,
    name: "John Smith",
    hourly_rate: 18,
    languages: ["English"],
    location: "Brooklyn, NY",
    background_check_status: "approved",
    is_verified: false,
    rating: 3.2,
    qualifications: ["2 years experience", "Background checked"],
  },
  {
    id: 103,
    name: "Lisa Wong",
    hourly_rate: 28,
    languages: ["English", "Mandarin", "Cantonese"],
    location: "Los Angeles, CA",
    background_check_status: "approved",
    is_verified: true,
    rating: 4.9,
    qualifications: [
      "CPR Certified",
      "8 years experience",
      "Background checked",
      "First Aid",
    ],
  },
  {
    id: 104,
    name: "Sophie Martin",
    hourly_rate: 19,
    languages: ["English", "French"],
    location: "Chicago, IL",
    background_check_status: "approved",
    is_verified: true,
    rating: 4.5,
    qualifications: [
      "CPR Certified",
      "3 years experience",
      "Background checked",
    ],
  },
  {
    id: 105,
    name: "Alex Taylor",
    hourly_rate: 35,
    languages: ["English", "Spanish"],
    location: "New York, NY",
    background_check_status: "pending",
    is_verified: false,
    rating: 4.0,
    qualifications: ["10 years experience", "Special needs training"],
  },
  {
    id: 106,
    name: "Rachel Kim",
    hourly_rate: 24,
    languages: ["English", "Korean"],
    location: "Los Angeles, CA",
    background_check_status: "approved",
    is_verified: true,
    rating: 3.8,
    qualifications: [
      "CPR Certified",
      "4 years experience",
      "Background checked",
    ],
  },
];

export default function DemoMatchingPage() {
  const [selectedParent, setSelectedParent] = useState(null);
  const [matchResult, setMatchResult] = useState(null);
  const [parents, setParents] = useState(dummyParents);
  const [editingParent, setEditingParent] = useState(null);
  const [editForm, setEditForm] = useState({});

  const handleEditClick = (parent) => {
    setEditingParent(parent.id);
    setEditForm({
      city: parent.preferences.city,
      preferredLanguage: parent.preferences.preferredLanguage,
      maxBudget: parent.preferences.maxBudget,
    });
  };

  const handleSavePreferences = (parentId) => {
    setParents(
      parents.map((p) =>
        p.id === parentId ? { ...p, preferences: { ...editForm } } : p,
      ),
    );
    setEditingParent(null);
    // If this parent was selected, clear the match result so they need to re-match
    if (selectedParent?.id === parentId) {
      setMatchResult(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingParent(null);
    setEditForm({});
  };

  const handleFindMatch = (parent) => {
    setSelectedParent(parent);

    // Run the matching algorithm
    const hardRules = {
      maxBudget: parent.preferences.maxBudget,
      requiresEnglish: true,
      requiresBackgroundCheck: true,
    };

    const softPreferences = {
      city: parent.preferences.city,
      preferredLanguage: parent.preferences.preferredLanguage,
    };

    const matches = matchSitters(dummySitters, hardRules, softPreferences);

    // Get detailed breakdown for each sitter
    const detailedResults = dummySitters.map((sitter) => {
      const passesHard = passesHardRules(sitter, hardRules);
      const score = passesHard
        ? calculatePreferenceScore(sitter, softPreferences)
        : 0;

      // Detailed breakdown
      const breakdown = {
        hardRules: {
          speaksEnglish: sitter.languages?.includes("English"),
          withinBudget: sitter.hourly_rate <= hardRules.maxBudget,
          backgroundCheck: sitter.background_check_status === "approved",
        },
        softPreferences: passesHard
          ? {
              sameCity: sitter.location?.includes(softPreferences.city) ? 1 : 0,
              preferredLanguage:
                softPreferences.preferredLanguage &&
                sitter.languages?.includes(softPreferences.preferredLanguage)
                  ? 1
                  : 0,
              verified: sitter.is_verified === true ? 1 : 0,
              highRating: sitter.rating >= 3.5 ? 1 : 0,
            }
          : null,
      };

      return {
        sitter,
        passesHard,
        score,
        breakdown,
      };
    });

    setMatchResult({
      parent,
      bestMatch: matches[0] || null,
      allResults: detailedResults,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-2 text-gray-800">
          Matching Algorithm Demo
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Click &quot;Find a Match&quot; to see how our algorithm works
        </p>

        <div className="grid grid-cols-2 gap-8 mb-8">
          {/* Parents Column */}
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">
              Parents
            </h2>
            <div className="space-y-4">
              {parents.map((parent) => (
                <div
                  key={parent.id}
                  className={`bg-white p-6 rounded-lg shadow-md border-2 ${
                    selectedParent?.id === parent.id
                      ? "border-blue-500"
                      : "border-transparent"
                  }`}
                >
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">
                    {parent.name}
                  </h3>
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-600 mb-2">
                      Preferences:
                    </p>

                    {editingParent === parent.id ? (
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs text-gray-600 block mb-1">
                            📍 Location:
                          </label>
                          <input
                            type="text"
                            value={editForm.city}
                            onChange={(e) =>
                              setEditForm({ ...editForm, city: e.target.value })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                            placeholder="City"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-600 block mb-1">
                            🗣️ Preferred Language:
                          </label>
                          <input
                            type="text"
                            value={editForm.preferredLanguage}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                preferredLanguage: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                            placeholder="Language"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-600 block mb-1">
                            💰 Max Budget ($/hour):
                          </label>
                          <input
                            type="number"
                            value={editForm.maxBudget}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                maxBudget: Number(e.target.value),
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                            placeholder="Budget"
                            min="0"
                          />
                        </div>
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => handleSavePreferences(parent.id)}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition cursor-pointer text-sm"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded transition cursor-pointer text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>📍 Location: {parent.preferences.city}</li>
                        <li>
                          🗣️ Preferred Language:{" "}
                          {parent.preferences.preferredLanguage}
                        </li>
                        <li>
                          💰 Max Budget: ${parent.preferences.maxBudget}/hour
                        </li>
                      </ul>
                    )}
                  </div>

                  {editingParent !== parent.id && (
                    <div className="space-y-2">
                      <button
                        onClick={() => handleFindMatch(parent)}
                        className="w-full bg-red-400 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded transition cursor-pointer"
                      >
                        Find a Match
                      </button>
                      <button
                        onClick={() => handleEditClick(parent)}
                        className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded transition cursor-pointer"
                      >
                        Edit Preferences
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Sitters Column */}
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">
              Available Sitters
            </h2>
            <div className="space-y-4">
              {dummySitters.map((sitter) => (
                <div
                  key={sitter.id}
                  className={`bg-white p-6 rounded-lg shadow-md border-2 ${
                    matchResult?.bestMatch?.id === sitter.id
                      ? "border-green-500 bg-green-50"
                      : "border-transparent"
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-semibold text-gray-800">
                      {sitter.name}
                    </h3>
                    {matchResult?.bestMatch?.id === sitter.id && (
                      <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                        Best Match!
                      </span>
                    )}
                  </div>
                  <div className="mb-3">
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">Rate:</span> $
                      {sitter.hourly_rate}/hour
                    </p>
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">Languages:</span>{" "}
                      {sitter.languages.join(", ")}
                    </p>
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">Location:</span>{" "}
                      {sitter.location}
                    </p>
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">Rating:</span> ⭐{" "}
                      {sitter.rating}/5.0
                    </p>
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">Background Check:</span>{" "}
                      <span
                        className={
                          sitter.background_check_status === "approved"
                            ? "text-green-600"
                            : "text-orange-600"
                        }
                      >
                        {sitter.background_check_status}
                      </span>
                    </p>
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">Verified:</span>{" "}
                      {sitter.is_verified ? "✓ Yes" : "✗ No"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600 mb-1">
                      Qualifications:
                    </p>
                    <ul className="text-xs text-gray-600 list-disc list-inside">
                      {sitter.qualifications.map((qual, idx) => (
                        <li key={idx}>{qual}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Matching Process Explanation */}
        {matchResult && (
          <div className="bg-white p-8 rounded-lg shadow-lg border-2 border-blue-500">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">
              Matching Process for {matchResult.parent.name}
            </h2>

            {matchResult.bestMatch ? (
              <>
                <div className="bg-green-100 border-l-4 border-green-600 p-4 mb-6">
                  <h3 className="text-xl font-semibold text-green-800 mb-2">
                    Best Match: {matchResult.bestMatch.name}
                  </h3>
                  <p className="text-green-700">
                    Match Score: {matchResult.bestMatch.preferenceScore}/4
                    points
                  </p>
                </div>

                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-4 text-gray-800">
                    How the Algorithm Works:
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <h4 className="font-semibold text-gray-700 mb-2">
                      Step 1: Hard Rules (Must-Have Requirements)
                    </h4>
                    <p className="text-sm text-gray-600 mb-2">
                      All sitters must pass these requirements to be considered:
                    </p>
                    <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                      <li>Must speak English ✓</li>
                      <li>
                        Must be within budget ($
                        {matchResult.parent.preferences.maxBudget}/hour or less)
                        ✓
                      </li>
                      <li>Background check must be approved ✓</li>
                    </ul>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-700 mb-2">
                      Step 2: Soft Preferences (Scoring System)
                    </h4>
                    <p className="text-sm text-gray-600 mb-2">
                      Qualified sitters are scored based on preferences (max 4
                      points):
                    </p>
                    <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                      <li>
                        Same city ({matchResult.parent.preferences.city}): +1
                        point
                      </li>
                      <li>
                        Speaks preferred language (
                        {matchResult.parent.preferences.preferredLanguage}): +1
                        point
                      </li>
                      <li>Verified account: +1 point</li>
                      <li>High rating (3.5+): +1 point</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4 text-gray-800">
                    Detailed Results for All Sitters:
                  </h3>
                  <div className="space-y-4">
                    {matchResult.allResults
                      .sort((a, b) => {
                        if (a.passesHard !== b.passesHard)
                          return b.passesHard - a.passesHard;
                        return b.score - a.score;
                      })
                      .map((result, idx) => (
                        <div
                          key={result.sitter.id}
                          className={`p-4 rounded-lg border-2 ${
                            result.sitter.id === matchResult.bestMatch.id
                              ? "bg-green-50 border-green-500"
                              : result.passesHard
                                ? "bg-white border-gray-200"
                                : "bg-red-50 border-red-300"
                          }`}
                        >
                          <div className="flex justify-between items-start mb-3">
                            <h4 className="font-semibold text-gray-800">
                              {idx + 1}. {result.sitter.name}
                            </h4>
                            {result.passesHard ? (
                              <span className="bg-green-600 text-white text-xs px-2 py-1 rounded">
                                Score: {result.score}/4
                              </span>
                            ) : (
                              <span className="bg-red-600 text-white text-xs px-2 py-1 rounded">
                                Not Qualified
                              </span>
                            )}
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-semibold text-gray-700 mb-2">
                                Hard Rules Check:
                              </p>
                              <ul className="text-sm space-y-1">
                                <li
                                  className={
                                    result.breakdown.hardRules.speaksEnglish
                                      ? "text-green-600"
                                      : "text-red-600"
                                  }
                                >
                                  {result.breakdown.hardRules.speaksEnglish
                                    ? "✓"
                                    : "✗"}{" "}
                                  Speaks English
                                </li>
                                <li
                                  className={
                                    result.breakdown.hardRules.withinBudget
                                      ? "text-green-600"
                                      : "text-red-600"
                                  }
                                >
                                  {result.breakdown.hardRules.withinBudget
                                    ? "✓"
                                    : "✗"}{" "}
                                  Within budget (
                                  {result.sitter.hourly_rate <=
                                  matchResult.parent.preferences.maxBudget
                                    ? `$${result.sitter.hourly_rate} ≤ $${matchResult.parent.preferences.maxBudget}`
                                    : `$${result.sitter.hourly_rate} > $${matchResult.parent.preferences.maxBudget}`}
                                  )
                                </li>
                                <li
                                  className={
                                    result.breakdown.hardRules.backgroundCheck
                                      ? "text-green-600"
                                      : "text-red-600"
                                  }
                                >
                                  {result.breakdown.hardRules.backgroundCheck
                                    ? "✓"
                                    : "✗"}{" "}
                                  Background check approved
                                </li>
                              </ul>
                            </div>

                            {result.breakdown.softPreferences && (
                              <div>
                                <p className="text-sm font-semibold text-gray-700 mb-2">
                                  Preference Score:
                                </p>
                                <ul className="text-sm space-y-1">
                                  <li
                                    className={
                                      result.breakdown.softPreferences.sameCity
                                        ? "text-green-600"
                                        : "text-gray-500"
                                    }
                                  >
                                    {result.breakdown.softPreferences.sameCity
                                      ? "✓ (+1)"
                                      : "✗ (+0)"}{" "}
                                    Same city
                                  </li>
                                  <li
                                    className={
                                      result.breakdown.softPreferences
                                        .preferredLanguage
                                        ? "text-green-600"
                                        : "text-gray-500"
                                    }
                                  >
                                    {result.breakdown.softPreferences
                                      .preferredLanguage
                                      ? "✓ (+1)"
                                      : "✗ (+0)"}{" "}
                                    Preferred language
                                  </li>
                                  <li
                                    className={
                                      result.breakdown.softPreferences.verified
                                        ? "text-green-600"
                                        : "text-gray-500"
                                    }
                                  >
                                    {result.breakdown.softPreferences.verified
                                      ? "✓ (+1)"
                                      : "✗ (+0)"}{" "}
                                    Verified
                                  </li>
                                  <li
                                    className={
                                      result.breakdown.softPreferences
                                        .highRating
                                        ? "text-green-600"
                                        : "text-gray-500"
                                    }
                                  >
                                    {result.breakdown.softPreferences.highRating
                                      ? "✓ (+1)"
                                      : "✗ (+0)"}{" "}
                                    High rating (★{result.sitter.rating})
                                  </li>
                                </ul>
                              </div>
                            )}
                          </div>

                          {result.sitter.id === matchResult.bestMatch.id && (
                            <div className="mt-3 p-3 bg-green-100 rounded">
                              <p className="text-sm font-semibold text-green-800">
                                Why this is the best match:
                              </p>
                              <p className="text-sm text-green-700">
                                {result.sitter.name} passed all hard
                                requirements and scored the highest (
                                {result.score}/4 points) based on{" "}
                                {matchResult.parent.name}&apos;s preferences.
                                This sitter{" "}
                                {result.breakdown.softPreferences.sameCity
                                  ? `is in ${matchResult.parent.preferences.city}, `
                                  : ""}
                                {result.breakdown.softPreferences
                                  .preferredLanguage
                                  ? `speaks ${matchResult.parent.preferences.preferredLanguage}, `
                                  : ""}
                                {result.breakdown.softPreferences.verified
                                  ? "has a verified account, "
                                  : ""}
                                {result.breakdown.softPreferences.highRating
                                  ? "and has a high rating"
                                  : ""}
                                .
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-red-100 border-l-4 border-red-600 p-4">
                <h3 className="text-xl font-semibold text-red-800 mb-2">
                  No Matches Found
                </h3>
                <p className="text-red-700">
                  No sitters passed the hard requirements for{" "}
                  {matchResult.parent.name}. This could be due to budget
                  constraints, lack of approved background checks, or language
                  requirements.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
