"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import SitterSidebar from "@/components/SitterSidebar";
import SitterCalendar from "@/components/SitterCalendar";
import SimpleAvailabilityCalendar from "@/components/SimpleAvailabilityCalendar";

export default function SitterSchedule() {
  const t = useTranslations("scheduleSitter");
  const [sitterName, setSitterName] = useState("");
  const [sitterProfileId, setSitterProfileId] = useState(null);
  const [availability, setAvailability] = useState({});
  const [loading, setLoading] = useState(true);
  const [showAvailabilityEditor, setShowAvailabilityEditor] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) return;

        // Fetch sitter profile — include `id` so we can pass it to the calendar
        const { data: profile } = await supabase
          .from("sitter_profiles")
          .select("id, recurring_availability")
          .eq("user_id", user.id)
          .single();

        setSitterName(user.user_metadata?.name || t("defaultName"));

        if (profile?.id) {
          setSitterProfileId(profile.id);
        }

        if (profile?.recurring_availability) {
          setAvailability(profile.recurring_availability);
        }
      } catch (err) {
        console.error("Failed to load schedule data:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const handleSaveAvailability = async (hourlyAvailability, repeatWeekly) => {
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error(t("errors.notAuthenticated"));

      // hourlyAvailability is already in the correct format: { monday: { "09": true, ... }, ... }
      const { error } = await supabase
        .from("sitter_profiles")
        .update({
          recurring_availability: hourlyAvailability,
          repeat_weekly: repeatWeekly,
        })
        .eq("user_id", user.id);

      if (error) {
        throw new Error(error.message || t("errors.saveToDatabaseFailed"));
      }

      setAvailability(hourlyAvailability);
      setShowAvailabilityEditor(false);
    } catch (err) {
      throw new Error(err?.message || t("errors.saveFailed"));
    }
  };

  // Handle hourly availability changes from the calendar click (NEW)
  const handleCalendarAvailabilityChange = async (hourlyAvailability) => {
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error(t("errors.notAuthenticated"));

      const { error } = await supabase
        .from("sitter_profiles")
        .update({
          recurring_availability: hourlyAvailability,
          repeat_weekly: true,
        })
        .eq("user_id", user.id);

      if (error) {
        throw new Error(error.message || t("errors.saveFailed"));
      }

      setAvailability(hourlyAvailability);
    } catch (err) {
      throw err; // Let the calendar component handle the error and show toast
    }
  };

  return (
    <SitterSidebar userName={sitterName}>
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-8 w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{t("greeting", { name: sitterName })}</h1>
          <p className="text-gray-600">{t("subtitle")}</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-teal-500 rounded-full animate-spin" />
          </div>
        ) : (
          <>
            <SitterCalendar
              sitterProfileId={sitterProfileId}
              availability={availability}
              onEditAvailability={() => setShowAvailabilityEditor(true)}
              onAvailabilityChange={handleCalendarAvailabilityChange}
            />

            {/* Availability Editor Modal */}
            {showAvailabilityEditor && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col">
                  <div className="p-6 border-b border-gray-200 flex items-center justify-between shrink-0">
                    <h2 className="text-2xl font-bold text-gray-900">{t("editAvailability")}</h2>
                    <button
                      onClick={() => setShowAvailabilityEditor(false)}
                      className="p-1 hover:bg-gray-100 rounded transition-colors"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="overflow-y-auto flex-1">
                    <div className="p-6">
                      <SimpleAvailabilityCalendar
                        initialData={availability}
                        onSave={handleSaveAvailability}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </SitterSidebar>
  );
}
