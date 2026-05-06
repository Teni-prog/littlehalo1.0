"use client";

import { useState, useActionState } from "react";
import Link from "next/link";
import { Plus, Pencil, Check, X } from "lucide-react";
import { updateChild } from "@/app/actions/parent";

const AVATAR_COLORS = [
  "bg-red-100 text-[#ff6b6b]",
  "bg-teal-100 text-teal-600",
  "bg-yellow-100 text-yellow-600",
  "bg-purple-100 text-purple-600",
];

const SPECIAL_NEEDS = [
  "Autism", "ADHD", "Language Barrier", "Hearing Impairment",
  "Visual Impairment", "Down Syndrome", "Cerebral Palsy",
  "Speech Delay", "Anxiety", "Sensory Processing",
];

function ChildCard({ child, colorClass, onSaved }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(child.name);
  const [age, setAge] = useState(child.age);
  const [needs, setNeeds] = useState(child.special_needs || []);

  const [state, formAction, isPending] = useActionState(async (prevState, formData) => {
    const result = await updateChild(prevState, formData);
    if (result?.success) {
      setEditing(false);
      onSaved?.({ ...child, name, age, special_needs: needs });
    }
    return result;
  }, null);

  function toggleNeed(need) {
    setNeeds(prev =>
      prev.includes(need) ? prev.filter(n => n !== need) : [...prev, need]
    );
  }

  function handleCancel() {
    setName(child.name);
    setAge(child.age);
    setNeeds(child.special_needs || []);
    setEditing(false);
  }

  return (
    <div className="border border-gray-100 rounded-2xl p-4 bg-gray-50/50">
      {!editing ? (
        /* ── View Mode ── */
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-full ${colorClass} flex items-center justify-center text-lg font-bold shrink-0`}>
            {child.name?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-900">{child.name}</h3>
              <button
                onClick={() => setEditing(true)}
                className="text-gray-400 hover:text-[#ff6b6b] transition-colors ml-2"
              >
                <Pencil className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-gray-500 mb-2">{child.age} years old</p>
            <div className="flex flex-wrap gap-1.5">
              {child.special_needs?.length ? (
                child.special_needs.map((tag, i) => (
                  <span key={i} className="px-2 py-1 bg-white border border-gray-200 text-xs text-gray-600 rounded-md font-medium">
                    {tag}
                  </span>
                ))
              ) : (
                <span className="text-xs text-gray-400">No special needs noted</span>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* ── Edit Mode ── */
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="child_id" value={child.id} />
          {needs.map(need => (
            <input key={need} type="hidden" name="special_needs" value={need} />
          ))}

          {state?.error && (
            <p className="text-xs text-red-500">{state.error}</p>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-600">Name</label>
              <input
                name="name" type="text"
                value={name} onChange={e => setName(e.target.value)}
                required
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-[#ff6b6b] focus:ring-2 focus:ring-[#ff6b6b]/20 transition-all"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-600">Age</label>
              <input
                name="age" type="number"
                value={age} onChange={e => setAge(e.target.value)}
                min={0} max={18} required
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:border-[#ff6b6b] focus:ring-2 focus:ring-[#ff6b6b]/20 transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-600">Special Needs</label>
            <div className="flex flex-wrap gap-1.5">
              {SPECIAL_NEEDS.map(need => (
                <button
                  key={need} type="button" onClick={() => toggleNeed(need)}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
                    needs.includes(need)
                      ? "bg-[#ff6b6b] text-white border-[#ff6b6b]"
                      : "bg-white text-gray-600 border-gray-200 hover:border-[#ff6b6b]/50"
                  }`}
                >
                  {need}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="submit" disabled={isPending}
              className="flex items-center gap-1.5 bg-[#ff6b6b] text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-[#ff5252] transition-colors disabled:opacity-60 cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              {isPending ? "Saving..." : "Save"}
            </button>
            <button
              type="button" onClick={handleCancel}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" /> Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default function MyChildren({ children, onChildUpdated }) {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8">
      <h2 className="text-xl font-bold text-gray-900 mb-6">My Children</h2>
      <hr />
      <div className="space-y-4 mb-6 mt-4">
        {children.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">No children added yet.</p>
        ) : (
          children.map((child, i) => (
            <ChildCard
              key={child.id}
              child={child}
              colorClass={AVATAR_COLORS[i % AVATAR_COLORS.length]}
              onSaved={onChildUpdated}
            />
          ))
        )}
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
