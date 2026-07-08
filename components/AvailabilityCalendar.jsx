"use client";

import { useState, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";
import { ChevronLeft, ChevronRight, Copy } from "lucide-react";

// Hours from 6 AM to 10 PM (6, 7, 8, ..., 22)
const HOURS = Array.from({ length: 17 }, (_, i) => i + 6);
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const HOUR_LABELS = {
  6: "6 AM",
  7: "7 AM",
  8: "8 AM",
  9: "9 AM",
  10: "10 AM",
  11: "11 AM",
  12: "12 PM",
  13: "1 PM",
  14: "2 PM",
  15: "3 PM",
  16: "4 PM",
  17: "5 PM",
  18: "6 PM",
  19: "7 PM",
  20: "8 PM",
  21: "9 PM",
  22: "10 PM",
};

// dayKey: "monday" | "tuesday" | etc.
// availabilityObject: { hour: boolean, hour: boolean, ... }
function isSlotAvailable(dayKey, hour, recurring, overrides, dateStr) {
  // Check for date-specific override first
  if (overrides?.[dateStr]) {
    const dayOverrides = overrides[dateStr];
    if (dayOverrides !== undefined) {
      return dayOverrides.includes ? dayOverrides.includes(hour) : false;
    }
  }
  // Fall back to recurring pattern
  const recurringDay = recurring?.[dayKey.toLowerCase()] || [];
  return recurringDay.includes ? recurringDay.includes(hour) : false;
}

function toggleSlotInArray(arr, hour) {
  if (!Array.isArray(arr)) arr = [];
  if (arr.includes(hour)) {
    return arr.filter(h => h !== hour);
  } else {
    return [...arr, hour].sort((a, b) => a - b);
  }
}

export default function AvailabilityCalendar({ 
  value = null, 
  onChange = () => {}, 
  showRepeatToggle = true,
  dateRange = null // { start: Date, end: Date } for which week to show
}) {
  const t = useTranslations("availabilityCalendar");
  const locale = useLocale();
  const dateLocale = locale === "fr" ? "fr-CA" : "en-US";
  const recurring = value?.recurring_availability || {
    monday: [], tuesday: [], wednesday: [], thursday: [],
    friday: [], saturday: [], sunday: []
  };
  const overrides = value?.availability_overrides || {};
  const repeatWeekly = value?.repeat_weekly ?? true;

  // Calculate the week to display
  const now = dateRange?.start || new Date();
  const startOfWeek = new Date(now);
  const dayOfWeek = startOfWeek.getDay(); // 0 = Sunday
  const diff = startOfWeek.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
  startOfWeek.setDate(diff);
  startOfWeek.setHours(0, 0, 0, 0);

  const [isDragging, setIsDragging] = useState(false);
  const [dragMode, setDragMode] = useState(null); // 'add' or 'remove'

  function getDateStr(dayIndex) {
    const d = new Date(startOfWeek);
    d.setDate(d.getDate() + dayIndex);
    return d.toISOString().split('T')[0];
  }

  function handleSlotMouseDown(dayIndex, hour) {
    const dateStr = getDateStr(dayIndex);
    const dayKey = DAYS[dayIndex].toLowerCase();
    const isAvailable = isSlotAvailable(dayKey, hour, recurring, overrides, dateStr);
    setDragMode(isAvailable ? 'remove' : 'add');
    setIsDragging(true);
    handleSlotToggle(dayIndex, hour);
  }

  function handleSlotMouseEnter(dayIndex, hour) {
    if (!isDragging || !dragMode) return;
    // In drag mode, enforce the same action across all dragged slots
    const dateStr = getDateStr(dayIndex);
    const dayKey = DAYS[dayIndex].toLowerCase();
    const isAvailable = isSlotAvailable(dayKey, hour, recurring, overrides, dateStr);
    
    if ((dragMode === 'remove' && isAvailable) || (dragMode === 'add' && !isAvailable)) {
      handleSlotToggle(dayIndex, hour);
    }
  }

  function handleSlotMouseUp() {
    setIsDragging(false);
    setDragMode(null);
  }

  function handleSlotToggle(dayIndex, hour) {
    const dateStr = getDateStr(dayIndex);
    const dayKey = DAYS[dayIndex].toLowerCase();
    
    // If overriding, update availability_overrides; otherwise update recurring
    const isOverridden = overrides[dateStr] !== undefined;
    
    if (isOverridden) {
      // Toggle in the date-specific override
      const updated = { ...overrides };
      updated[dateStr] = toggleSlotInArray(overrides[dateStr], hour);
      onChange({
        ...value,
        availability_overrides: updated
      });
    } else {
      // Toggle in the recurring pattern
      const updated = { ...recurring };
      updated[dayKey] = toggleSlotInArray(recurring[dayKey], hour);
      onChange({
        ...value,
        recurring_availability: updated
      });
    }
  }

  function handleRepeatToggle() {
    onChange({
      ...value,
      repeat_weekly: !repeatWeekly
    });
  }

  function handleCopyLastWeek() {
    // Get last week's dates
    const lastWeekStart = new Date(startOfWeek);
    lastWeekStart.setDate(lastWeekStart.getDate() - 7);
    
    // For each day in the current week, check if there's an override from last week
    const newOverrides = { ...overrides };
    DAYS.forEach((_, dayIndex) => {
      const lastWeekDate = new Date(lastWeekStart);
      lastWeekDate.setDate(lastWeekDate.getDate() + dayIndex);
      const lastWeekDateStr = lastWeekDate.toISOString().split('T')[0];
      
      const currentDate = getDateStr(dayIndex);
      const dayKey = DAYS[dayIndex].toLowerCase();
      
      // Check if last week had an override
      if (overrides[lastWeekDateStr]) {
        newOverrides[currentDate] = [...(overrides[lastWeekDateStr] || [])];
      } else {
        // Use the recurring pattern from last week (which is the same as current recurring)
        newOverrides[currentDate] = [...(recurring[dayKey] || [])];
      }
    });
    
    onChange({
      ...value,
      availability_overrides: newOverrides
    });
  }

  return (
    <div className="space-y-4">
      {/* Header with controls */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <p className="text-sm font-semibold text-gray-900">
            {t("weekOf", { date: startOfWeek.toLocaleDateString(dateLocale, { month: "short", day: "numeric" }) })}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleCopyLastWeek}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <Copy className="w-4 h-4" />
            {t("copyLastWeek")}
          </button>

          {showRepeatToggle && (
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={repeatWeekly}
                onChange={handleRepeatToggle}
                className="w-4 h-4 rounded border-gray-300 text-teal-500 cursor-pointer"
              />
              <span className="text-sm font-medium text-gray-700">{t("repeatWeekly")}</span>
            </label>
          )}
        </div>
      </div>

      {/* Calendar grid */}
      <div className="overflow-x-auto">
      <div className="border border-gray-200 rounded-xl overflow-hidden bg-white min-w-[640px]">
        {/* Header row with days */}
        <div className="grid grid-cols-8 bg-gray-50 border-b border-gray-200">
          <div className="px-3 py-3 text-xs font-semibold text-gray-600 border-r border-gray-200" />
          {DAYS.map((day, i) => (
            <div
              key={day}
              className={`px-2 py-3 text-xs font-semibold text-gray-700 text-center border-r border-gray-200 last:border-r-0 ${
                i >= 5 ? 'bg-amber-50' : ''
              }`}
            >
              {t(`days.${day}`)}
            </div>
          ))}
        </div>

        {/* Hour rows */}
        <div>
          {HOURS.map((hour, hourIdx) => (
            <div
              key={hour}
              className={`grid grid-cols-8 border-b border-gray-100 last:border-b-0 ${
                hourIdx % 2 === 1 ? 'bg-gray-50' : 'bg-white'
              }`}
            >
              {/* Time label */}
              <div className="px-3 py-2 text-xs font-medium text-gray-600 border-r border-gray-200 flex items-center justify-center bg-gray-50 sticky left-0 z-10">
                {HOUR_LABELS[hour]}
              </div>

              {/* Availability slots for each day */}
              {DAYS.map((day, dayIndex) => {
                const dateStr = getDateStr(dayIndex);
                const dayKey = day.toLowerCase();
                const isAvailable = isSlotAvailable(dayKey, hour, recurring, overrides, dateStr);
                const isOverridden = overrides[dateStr] !== undefined;

                return (
                  <div
                    key={`${day}-${hour}`}
                    onMouseDown={() => handleSlotMouseDown(dayIndex, hour)}
                    onMouseEnter={() => handleSlotMouseEnter(dayIndex, hour)}
                    onMouseUp={handleSlotMouseUp}
                    onMouseLeave={handleSlotMouseUp}
                    className={`px-2 py-2 border-r border-gray-200 last:border-r-0 cursor-pointer transition-colors ${
                      isAvailable
                        ? 'bg-teal-100 hover:bg-teal-200'
                        : 'bg-white hover:bg-gray-100'
                    } ${isOverridden ? 'ring-1 ring-inset ring-amber-200' : ''}`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
      </div>

      {/* Info text */}
      <p className="text-xs text-gray-500">
        {t("dragInfo")} {showRepeatToggle && t("repeatInfo")}
      </p>
    </div>
  );
}
