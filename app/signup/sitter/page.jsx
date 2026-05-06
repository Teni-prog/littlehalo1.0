"use client";

import { useState, useEffect } from "react";
import { useActionState } from "react";
import Link from "next/link";
import {
  UserCircle, Mail, Lock, User, ArrowLeft, MapPin,
  DollarSign, Phone, FileText, Briefcase, Languages,
} from "lucide-react";
import { signupSitter } from "@/app/actions/auth";

const AGE_GROUPS = [
  "Infants (0-12m)",
  "Toddlers (1-3y)",
  "Preschool (3-5y)",
  "School Age (6-12y)",
  "Teens (13+)",
];

const SPECIAL_NEEDS = [
  "Autism", "ADHD", "Language Barrier", "Hearing Impairment",
  "Visual Impairment", "Down Syndrome", "Cerebral Palsy",
  "Speech Delay", "Anxiety", "Sensory Processing",
];

export default function SitterSignupPage() {
  const [selectedAgeGroups, setSelectedAgeGroups] = useState([]);
  const [selectedNeeds, setSelectedNeeds] = useState([]);
  const [state, formAction, isPending] = useActionState(signupSitter, null);

  useEffect(() => {
    if (state?.error) window.scrollTo({ top: 0, behavior: "smooth" });
  }, [state?.error]);

  function toggleAgeGroup(group) {
    setSelectedAgeGroups(prev =>
      prev.includes(group) ? prev.filter(g => g !== group) : [...prev, group]
    );
  }

  function toggleNeed(need) {
    setSelectedNeeds(prev =>
      prev.includes(need) ? prev.filter(n => n !== need) : [...prev, need]
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <Link
            href="/signup"
            className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
          <div className="w-16 h-16 bg-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md shadow-teal-100">
            <UserCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Become a Sitter</h1>
          <p className="text-gray-500 mt-2">
            Share your culture and skills with families who value authentic heritage care
          </p>
        </div>

        {state?.error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
            {state.error}
          </div>
        )}

        <form action={formAction} className="space-y-6">
          {/* Hidden inputs for tag arrays */}
          {selectedAgeGroups.map(g => (
            <input key={g} type="hidden" name="age_groups" value={g} />
          ))}
          {selectedNeeds.map(n => (
            <input key={n} type="hidden" name="special_needs_experience" value={n} />
          ))}

          {/* ── Section 1: Account Details ── */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
            <h2 className="text-base font-bold text-gray-900 pb-1 border-b border-gray-100">
              Account Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    name="name" type="text" placeholder="Your full name" required
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    name="phone" type="tel" placeholder="(506) 555-0100" required
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  name="email" type="email" placeholder="your@email.com" required
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  name="password" type="password" placeholder="Min. 6 characters"
                  required minLength={6}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
                />
              </div>
            </div>
          </div>

          {/* ── Section 2: Professional Profile ── */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
            <h2 className="text-base font-bold text-gray-900 pb-1 border-b border-gray-100">
              Professional Profile
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    name="location" type="text" placeholder="e.g. Fredericton, NB" required
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Hourly Rate (CAD)</label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    name="hourly_rate" type="number" placeholder="e.g. 20"
                    min={10} max={100} required
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Years of Experience</label>
              <div className="relative">
                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  name="experience" type="number" placeholder="e.g. 3"
                  min={0} max={50} required
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Languages Spoken</label>
              <div className="relative">
                <Languages className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  name="languages" type="text" placeholder="e.g. English, Yoruba, French" required
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
                />
              </div>
              <p className="text-xs text-gray-400">Separate languages with commas</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">About You</label>
              <div className="relative">
                <FileText className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
                <textarea
                  name="bio"
                  placeholder="Tell families about yourself, your background, cultural knowledge, and childcare experience..."
                  rows={4}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all resize-none"
                />
              </div>
            </div>
          </div>

          {/* ── Section 3: Age Groups ── */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
            <h2 className="text-base font-bold text-gray-900 pb-1 border-b border-gray-100">
              Age Groups You Work With
            </h2>
            <p className="text-sm text-gray-500">Select all that apply</p>
            <div className="flex flex-wrap gap-2">
              {AGE_GROUPS.map(group => (
                <button
                  key={group} type="button" onClick={() => toggleAgeGroup(group)}
                  className={`px-3 py-2 rounded-xl text-sm font-medium border transition-all ${
                    selectedAgeGroups.includes(group)
                      ? "bg-teal-500 text-white border-teal-500"
                      : "bg-white text-gray-600 border-gray-200 hover:border-teal-400"
                  }`}
                >
                  {group}
                </button>
              ))}
            </div>
            {selectedAgeGroups.length === 0 && (
              <p className="text-xs text-red-500">Please select at least one age group</p>
            )}
          </div>

          {/* ── Section 4: Special Needs Experience ── */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
            <h2 className="text-base font-bold text-gray-900 pb-1 border-b border-gray-100">
              Special Needs Experience
            </h2>
            <p className="text-sm text-gray-500">
              Select any conditions you have experience working with{" "}
              <span className="text-gray-400">(optional)</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {SPECIAL_NEEDS.map(need => (
                <button
                  key={need} type="button" onClick={() => toggleNeed(need)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    selectedNeeds.includes(need)
                      ? "bg-teal-500 text-white border-teal-500"
                      : "bg-white text-gray-600 border-gray-200 hover:border-teal-400"
                  }`}
                >
                  {need}
                </button>
              ))}
            </div>
          </div>

          {/* ── Submit ── */}
          <button
            type="submit"
            disabled={isPending || selectedAgeGroups.length === 0}
            className="w-full bg-teal-500 text-white py-4 rounded-xl font-bold text-base hover:bg-teal-600 transition-colors shadow-lg shadow-teal-100 cursor-pointer disabled:opacity-60"
          >
            {isPending ? "Creating account..." : "Create Sitter Account"}
          </button>

          <p className="text-center text-gray-500 text-sm pb-8">
            Already have an account?{" "}
            <Link href="/signin/sitter" className="text-teal-500 font-bold hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
