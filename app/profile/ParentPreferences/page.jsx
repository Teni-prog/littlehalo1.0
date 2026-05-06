"use client";

import { useState, useActionState } from "react";
import { MapPin, DollarSign, Languages, ScanHeart, Pencil, Check } from "lucide-react";
import { updateParentPreferences } from "@/app/actions/parent";

export default function ParentPreferences({ parent, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [location, setLocation] = useState(parent?.preferred_location || "");
  const [budget, setBudget] = useState(parent?.max_budget || 25);
  const [languagesText, setLanguagesText] = useState(
    (parent?.preferred_languages || ["English"]).join(", ")
  );

  const [state, formAction, isPending] = useActionState(async (prevState, formData) => {
    const result = await updateParentPreferences(prevState, formData);
    if (result?.success) {
      const langs = languagesText.split(",").map(l => l.trim()).filter(Boolean);
      setEditing(false);
      onUpdate?.({
        preferred_location: location,
        max_budget: budget,
        preferred_languages: langs,
      });
    }
    return result;
  }, null);

  function handleCancel() {
    setLocation(parent?.preferred_location || "");
    setBudget(parent?.max_budget || 25);
    setLanguagesText((parent?.preferred_languages || ["English"]).join(", "));
    setEditing(false);
  }

  if (!parent) return null;

  const parsedLanguages = languagesText.split(",").map(l => l.trim()).filter(Boolean);

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Your Preferences</h2>
        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-1.5 text-[#ff6b6b] hover:text-[#ff5252] text-sm font-semibold hover:underline cursor-pointer transition-colors"
          >
            <Pencil className="w-4 h-4" /> Edit Preferences
          </button>
        ) : null}
      </div>
      <hr className="mb-6" />

      {state?.error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
          {state.error}
        </div>
      )}

      {!editing ? (
        /* ── View Mode ── */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center shrink-0">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Budget</h3>
              <p className="text-gray-600">Up to ${parent.max_budget}/hour</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
              <Languages className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Languages</h3>
              <div className="flex flex-wrap gap-1">
                {parent.preferred_languages?.length ? (
                  parent.preferred_languages.map((lang, idx) => (
                    <span key={idx} className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded">
                      {lang}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-600">Any</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-500 flex items-center justify-center shrink-0">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Location</h3>
              <p className="text-gray-600">{parent.preferred_location || "Not set"}</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-50 text-red-500 flex items-center justify-center shrink-0">
              <ScanHeart className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Special Needs</h3>
              <p className="text-gray-600">{parent.special_needs || "None noted"}</p>
            </div>
          </div>
        </div>
      ) : (
        /* ── Edit Mode ── */
        <form action={formAction} className="space-y-5">
          {/* Pass parsed languages as hidden inputs */}
          {parsedLanguages.map(lang => (
            <input key={lang} type="hidden" name="languages" value={lang} />
          ))}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-teal-500" /> Location
              </label>
              <input
                name="location" type="text"
                value={location} onChange={e => setLocation(e.target.value)}
                placeholder="e.g. Fredericton, NB" required
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#ff6b6b] focus:ring-2 focus:ring-[#ff6b6b]/20 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-purple-500" /> Max Hourly Budget (CAD)
              </label>
              <input
                name="max_budget" type="number"
                value={budget} onChange={e => setBudget(e.target.value)}
                min={10} max={100} required
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#ff6b6b] focus:ring-2 focus:ring-[#ff6b6b]/20 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
              <Languages className="w-4 h-4 text-blue-500" /> Preferred Languages
            </label>
            <input
              type="text"
              value={languagesText}
              onChange={e => setLanguagesText(e.target.value)}
              placeholder="e.g. English, Yoruba, French"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#ff6b6b] focus:ring-2 focus:ring-[#ff6b6b]/20 transition-all"
            />
            <p className="text-xs text-gray-400">Separate languages with commas</p>
            {parsedLanguages.length === 0 && (
              <p className="text-xs text-red-500">Enter at least one language</p>
            )}
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="submit"
              disabled={isPending || parsedLanguages.length === 0}
              className="flex items-center gap-2 bg-[#ff6b6b] text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-[#ff5252] transition-colors disabled:opacity-60 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              {isPending ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button" onClick={handleCancel}
              className="px-6 py-2.5 rounded-xl text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
