"use client";

import { useState, useEffect } from "react";
import { Copy, Check, AlertCircle } from "lucide-react";
import { timeRangeToHourFlags, hourFlagsToTimeRange } from "@/lib/availabilityHelpers";

const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
const DAY_LABELS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

// Generate time options (e.g., "06:00", "06:30", ..., "22:00")
function generateTimeOptions() {
  const options = [];
  for (let h = 6; h <= 22; h++) {
    for (let m of ["00", "30"]) {
      const hour = h.toString().padStart(2, "0");
      options.push(`${hour}:${m}`);
    }
  }
  return options;
}

const TIME_OPTIONS = generateTimeOptions();

// Format time for display (e.g., "09:00" -> "9:00 AM")
function formatTimeForDisplay(time) {
  if (!time) return "";
  const [h, m] = time.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${m.toString().padStart(2, "0")} ${suffix}`;
}

// Toast component
function Toast({ message, type, visible }) {
  if (!visible) return null;
  return (
    <div className={`fixed bottom-6 right-6 px-6 py-3 rounded-xl text-white font-semibold flex items-center gap-2 z-50 ${
      type === "success" ? "bg-teal-500" : "bg-red-500"
    }`}>
      {type === "success" ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
      {message}
    </div>
  );
}

export default function SimpleAvailabilityCalendar({ initialData, onSave }) {
  const [availability, setAvailability] = useState(null);
  const [repeatWeekly, setRepeatWeekly] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "success", visible: false });

  // Initialize state from initialData — handles both hourly and day-based formats
  useEffect(() => {
    const newAvailability = {};
    DAYS.forEach((day, idx) => {
      const raw = initialData?.[day];
      if (!raw) {
        // No stored data — weekdays default to available 9-5 on first load, unavailable otherwise
        newAvailability[day] = {
          available: !initialData && idx < 5,
          from: "09:00",
          to: "17:00",
        };
      } else if ("available" in raw) {
        // Already in day-based format { available, from, to }
        newAvailability[day] = raw;
      } else {
        // Hourly format: { "09": true, "10": true, ... } — convert to day-based for the picker
        const hasHours = Object.values(raw).some(v => v === true);
        const { from, to } = hourFlagsToTimeRange(raw);
        newAvailability[day] = { available: hasHours, from, to };
      }
    });
    setAvailability(newAvailability);
  }, [initialData]);

  if (!availability) return <div className="animate-pulse">Loading...</div>;

  const handleToggleDay = (day) => {
    setAvailability(prev => {
      const dayData = prev[day] || { available: false, from: "09:00", to: "17:00" };
      return {
        ...prev,
        [day]: { ...dayData, available: !dayData.available }
      };
    });
  };

  const handleTimeChange = (day, field, value) => {
    setAvailability(prev => {
      const dayData = prev[day] || { available: false, from: "09:00", to: "17:00" };
      return {
        ...prev,
        [day]: { ...dayData, [field]: value }
      };
    });
  };

  const handleCopyToAll = () => {
    // Find first enabled day and copy to all enabled days
    const firstEnabledDay = DAYS.find(day => availability[day]?.available);
    if (!firstEnabledDay) {
      setToast({ message: "Enable at least one day first", type: "error", visible: true });
      setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000);
      return;
    }

    const templateTime = availability[firstEnabledDay];
    const newAvailability = {};
    DAYS.forEach(day => {
      if (availability[day]?.available) {
        newAvailability[day] = { ...templateTime };
      } else {
        newAvailability[day] = { ...availability[day] };
      }
    });
    setAvailability(newAvailability);
    setToast({ message: "Times copied to all enabled days", type: "success", visible: true });
    setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 2000);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Convert range format to hourly format
      const hourlyAvailability = {};
      DAYS.forEach(day => {
        const dayData = availability[day];
        if (dayData?.available) {
          // Convert time range to hourly flags
          hourlyAvailability[day] = timeRangeToHourFlags(dayData.from, dayData.to);
        } else {
          // Not available - empty object
          hourlyAvailability[day] = {};
        }
      });

      await onSave(hourlyAvailability, repeatWeekly);
      setToast({ message: "Availability updated ✓", type: "success", visible: true });
      setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 2000);
    } catch (error) {
      const errorMsg = error?.message || "Failed to save availability. Please try again.";
      setToast({ message: errorMsg, type: "error", visible: true });
      setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 4000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-h-[80vh] overflow-y-auto">
      {/* Header */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">Set Your Availability</h3>
        <p className="text-sm text-gray-600">Choose which days and hours you're available for bookings</p>
      </div>

      {/* Controls */}
      <div className="space-y-4 border-b border-gray-200 pb-6">
        <button
          onClick={handleCopyToAll}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
        >
          <Copy className="w-4 h-4" />
          Copy to all days
        </button>

        {/* Repeat Weekly Toggle */}
        <div className="flex items-start gap-3">
          <label className="flex items-center gap-2 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={repeatWeekly}
              onChange={() => setRepeatWeekly(!repeatWeekly)}
              className="w-4 h-4 rounded border-gray-300 text-teal-500"
            />
            <span className="font-semibold text-gray-900">Repeat weekly</span>
          </label>
          <p className="text-sm text-gray-600 mt-0.5">
            This schedule repeats every week until you change it
          </p>
        </div>
      </div>

      {/* Day Cards */}
      <div className="space-y-3">
        {DAYS.map((day, idx) => {
          const dayLabel = DAY_LABELS[idx];
          const dayAvail = availability[day] || { available: false, from: "09:00", to: "17:00" };
          const isAvailable = dayAvail?.available ?? false;

          return (
            <div
              key={day}
              className={`border rounded-xl p-4 transition-all ${
                isAvailable
                  ? "bg-white border-gray-200"
                  : "bg-gray-50 border-gray-100"
              }`}
            >
              {/* Day Header with Toggle Switch */}
              <div className="flex items-center justify-between mb-3">
                <span className={`font-semibold ${
                  isAvailable ? "text-gray-900" : "text-gray-400"
                }`}>
                  {dayLabel}
                </span>

                {/* Toggle Switch */}
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAvailable}
                    onChange={() => handleToggleDay(day)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-teal-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500" />
                </label>
              </div>

              {/* Time Pickers - Only show if available */}
              {isAvailable && (
                <div className="flex gap-3 items-end">
                  {/* From Time */}
                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-gray-600 mb-2">From</label>
                    <select
                      value={dayAvail?.from || "09:00"}
                      onChange={(e) => handleTimeChange(day, "from", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    >
                      {TIME_OPTIONS.map(time => (
                        <option key={time} value={time}>
                          {formatTimeForDisplay(time)}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* To Time */}
                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-gray-600 mb-2">To</label>
                    <select
                      value={dayAvail?.to || "17:00"}
                      onChange={(e) => handleTimeChange(day, "to", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    >
                      {TIME_OPTIONS.map(time => (
                        <option key={time} value={time}>
                          {formatTimeForDisplay(time)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Save Button */}
      <div className="border-t border-gray-200 pt-6 sticky bottom-0 bg-white">
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-teal-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? "Saving…" : "Save Availability"}
        </button>
      </div>

      {/* Toast */}
      <Toast message={toast.message} type={toast.type} visible={toast.visible} />
    </div>
  );
}
