"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { ChevronLeft, ChevronRight, X, Check, AlertCircle } from "lucide-react";
import { isHourAvailable, setHourRangeAvailability, toggleHourAvailability } from "@/lib/availabilityHelpers";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAY_NAMES = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// Generate hourly time slots (6 AM – 10 PM)
const TIME_SLOTS = Array.from({ length: 17 }, (_, i) =>
  (6 + i).toString().padStart(2, "0")
);

// Pure helpers — defined outside the component so useEffect can reference them without
// them appearing in the dependency array.
function getWeekStart(date) {
  const d = new Date(date);
  d.setDate(d.getDate() - d.getDay());
  return d;
}

function dateStr(d) {
  return d.toISOString().split("T")[0];
}

// Toast component
function Toast({ message, type, visible }) {
  if (!visible) return null;
  return (
    <div
      className={`fixed bottom-6 right-6 px-6 py-3 rounded-xl text-white font-semibold flex items-center gap-2 z-50 transition-opacity ${
        type === "success" ? "bg-teal-500" : "bg-red-500"
      }`}
    >
      {type === "success" ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
      {message}
    </div>
  );
}

export default function SitterCalendar({
  sitterProfileId,
  availability = {},
  onEditAvailability,
  onAvailabilityChange,
}) {
  const t = useTranslations("sitterCalendar");
  const locale = useLocale();
  const dateLocale = locale === "fr" ? "fr-CA" : "en-US";
  const [bookings, setBookings] = useState([]);
  const [viewMode, setViewMode] = useState("week");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const [savingCells, setSavingCells] = useState({});
  const [toast, setToast] = useState({ message: "", type: "success", visible: false });
  const dragRef = useRef(null);

  // Derived week dates
  const weekStart = getWeekStart(currentDate);
  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    return d;
  });

  // Month grid
  const monthDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const grid = [];
    for (let i = 0; i < firstDay; i++) grid.push(null);
    for (let i = 1; i <= daysInMonth; i++) grid.push(new Date(year, month, i));
    return grid;
  }, [currentDate]);

  // ── Fetch bookings whenever sitterProfileId or displayed week changes ────────

  useEffect(() => {
    if (!sitterProfileId) return;

    async function fetchBookings() {
      try {
        const supabase = createClient();
        const ws = getWeekStart(currentDate);
        const we = new Date(ws);
        we.setDate(we.getDate() + 6);

        const { data, error } = await supabase
          .from("bookings")
          .select(
            `id, date, start_time, end_time, children, adventure_id, status,
             parent:users!parent_id(name)`
          )
          .eq("sitter_id", sitterProfileId)
          .in("status", ["confirmed", "pending_sitter"])
          .gte("date", dateStr(ws))
          .lte("date", dateStr(we));

        if (error) {
          console.error("[SitterCalendar] fetch bookings error:", error);
          return;
        }

        const formatted = (data || []).map((b) => {
          const startHour = parseInt(b.start_time.split(":")[0], 10);
          const endHour = parseInt(b.end_time.split(":")[0], 10);
          const child = b.children?.[0] || {};
          return {
            id: b.id,
            parentName: b.parent?.name || "Family",
            childName: child.name || child.first_name || "Child",
            childAge: child.age ?? null,
            date: b.date,
            time: b.start_time.substring(0, 5),
            endTime: b.end_time.substring(0, 5),
            startHour,
            endHour,
            duration: Math.max(endHour - startHour, 1),
            status: b.status,
          };
        });

        setBookings(formatted);
      } catch (err) {
        console.error("[SitterCalendar] error fetching bookings:", err);
      }
    }

    fetchBookings();
  }, [sitterProfileId, currentDate]);

  // ── Booking helpers ──────────────────────────────────────────────────────────

  // All bookings on a given calendar date (used by month view dots)
  const getBookingsForDate = (date) =>
    bookings.filter((b) => b.date === dateStr(date));

  // Booking that STARTS at exactly this date + hour → renders the spanning block
  const getBookingStartingAt = (date, hour) => {
    const h = parseInt(hour, 10);
    return bookings.find((b) => b.date === dateStr(date) && b.startHour === h) ?? null;
  };

  // Booking whose range COVERS this date + hour (startHour ≤ h < endHour)
  // Used to colour continuation cells and to open the panel on click
  const getBookingCoveringHour = (date, hour) => {
    const h = parseInt(hour, 10);
    return (
      bookings.find(
        (b) => b.date === dateStr(date) && b.startHour <= h && h < b.endHour
      ) ?? null
    );
  };

  // ── Availability handlers ────────────────────────────────────────────────────

  const handleCellClick = async (date, hour) => {
    const day = DAY_NAMES[date.getDay()];
    const cellKey = `${day}-${hour}`;
    const newAvailability = toggleHourAvailability(availability, day, hour);

    setSavingCells((prev) => ({ ...prev, [cellKey]: true }));

    if (onAvailabilityChange) {
      try {
        await onAvailabilityChange(newAvailability);
        setToast({ message: t("toast.availabilityUpdated"), type: "success", visible: true });
        setTimeout(() => setToast((p) => ({ ...p, visible: false })), 3000);
      } catch (error) {
        setToast({
          message: t("toast.saveFailed", { message: error?.message || t("toast.unknownError") }),
          type: "error",
          visible: true,
        });
        setTimeout(() => setToast((p) => ({ ...p, visible: false })), 4000);
        setSavingCells((prev) => {
          const next = { ...prev };
          delete next[cellKey];
          return next;
        });
        return;
      }
    }

    setTimeout(() => {
      setSavingCells((prev) => {
        const next = { ...prev };
        delete next[cellKey];
        return next;
      });
    }, 1000);
  };

  const handleDragStart = (date, hour) => {
    setIsDragging(true);
    setDragStart({ date, hour });
    dragRef.current = { date, hour };
  };

  const handleDragOver = (date, hour) => {
    if (!isDragging || !dragStart) return;
    dragRef.current = { date, hour };
  };

  const handleDragEnd = () => {
    if (!isDragging || !dragStart || !dragRef.current) {
      setIsDragging(false);
      return;
    }

    const startDate = dragStart.date;
    const endDate = dragRef.current.date;
    if (startDate.getTime() !== endDate.getTime()) {
      setIsDragging(false);
      return;
    }

    const fromHour = Math.min(parseInt(dragStart.hour), parseInt(dragRef.current.hour));
    const toHour = Math.max(parseInt(dragStart.hour), parseInt(dragRef.current.hour));
    const day = DAY_NAMES[startDate.getDay()];
    const isCurrentlyAvailable = isHourAvailable(
      availability,
      day,
      fromHour.toString().padStart(2, "0")
    );
    const newAvail = setHourRangeAvailability(
      availability,
      day,
      fromHour,
      toHour,
      !isCurrentlyAvailable
    );

    onAvailabilityChange?.(newAvail);

    const cellsToSave = {};
    for (let h = fromHour; h <= toHour; h++) {
      cellsToSave[`${day}-${h.toString().padStart(2, "0")}`] = true;
    }
    setSavingCells(cellsToSave);
    setTimeout(() => setSavingCells({}), 1500);
    setIsDragging(false);
  };

  // ── Week View ────────────────────────────────────────────────────────────────

  const renderWeekView = () => (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
    <div className="overflow-x-auto">
    <div className="min-w-[700px]">
      {/* Column headers */}
      <div className="grid" style={{ gridTemplateColumns: "80px repeat(7, 1fr)" }}>
        <div className="bg-gray-50 border-r border-gray-200 p-4" />
        {weekDates.map((date, idx) => (
          <div key={idx} className="bg-gray-50 border-r border-gray-200 p-4 text-center">
            <p className="text-xs font-semibold text-gray-600">{t(`days.${DAYS[date.getDay()]}`)}</p>
            <p className="text-lg font-bold text-gray-900">{date.getDate()}</p>
          </div>
        ))}
      </div>

      {/* Scrollable grid */}
      <div className="max-h-[600px] overflow-y-auto">
        <div className="grid" style={{ gridTemplateColumns: "80px repeat(7, 1fr)" }}>
          {/* Time labels */}
          <div className="bg-gray-50 border-r border-gray-200">
            {TIME_SLOTS.map((time) => (
              <div
                key={time}
                className="h-16 border-b border-gray-200 p-2 text-xs text-gray-500 font-medium flex items-start"
              >
                {parseInt(time)}:00
              </div>
            ))}
          </div>

          {/* Day columns */}
          {weekDates.map((date, dayIdx) => (
            <div key={dayIdx} className="border-r border-gray-200">
              {TIME_SLOTS.map((time) => {
                const day = DAY_NAMES[date.getDay()];
                const cellKey = `${day}-${time}`;
                const isAvailable = isHourAvailable(availability, day, time);
                const isSaving = savingCells[cellKey] || false;

                const startingBooking = getBookingStartingAt(date, time);
                const coveringBooking = getBookingCoveringHour(date, time);
                const isBooked = !!coveringBooking;

                return (
                  <div
                    key={cellKey}
                    // Block drag-to-toggle on booked cells
                    onMouseDown={() => !isBooked && handleDragStart(date, time)}
                    onMouseEnter={() => handleDragOver(date, time)}
                    onMouseUp={handleDragEnd}
                    onClick={() => {
                      if (coveringBooking) {
                        setSelectedBooking(coveringBooking);
                      } else {
                        handleCellClick(date, time);
                      }
                    }}
                    className={`h-16 border-b border-gray-200 cursor-pointer transition-colors relative ${
                      // Only the start cell can overflow so the booking block spans downward
                      startingBooking ? "" : "overflow-hidden"
                    } ${
                      isBooked
                        ? "bg-[#FAECE7]"
                        : isAvailable
                        ? "bg-[#E1F5EE]"
                        : "bg-white hover:bg-gray-50"
                    }`}
                  >
                    {/* "Available" label */}
                    {isAvailable && !isBooked && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <span style={{ fontSize: "11px", color: "#085041" }}>{t("available")}</span>
                      </div>
                    )}

                    {/*
                      Booking block — rendered ONLY on the start hour.
                      height spans all covered rows (duration × 64px cell height − 8px inset).
                      z-index 10 ensures it paints above continuation cells that follow in the DOM.
                    */}
                    {startingBooking && (
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedBooking(startingBooking);
                        }}
                        style={{
                          position: "absolute",
                          top: 4,
                          left: 4,
                          right: 4,
                          height: `${startingBooking.duration * 64 - 8}px`,
                          zIndex: 10,
                        }}
                        className="rounded-lg border-l-4 border-l-[#993C1D] bg-[#FAECE7] p-1.5 cursor-pointer hover:shadow-md flex flex-col justify-center overflow-hidden"
                      >
                        <div className="font-bold text-[10px] leading-tight truncate text-[#993C1D]">
                          {t("bookedWith", { name: startingBooking.parentName })}
                        </div>
                        <div className="text-[9px] leading-tight truncate text-[#993C1D] opacity-70">
                          {startingBooking.time} – {startingBooking.endTime}
                        </div>
                      </div>
                    )}

                    {/* Saving indicator (availability toggle) */}
                    {isSaving && !isBooked && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                        <Check className="w-5 h-5 text-teal-600" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
    </div>
    </div>
  );

  // ── Day View ─────────────────────────────────────────────────────────────────

  const renderDayView = () => {
    const day = DAY_NAMES[currentDate.getDay()];

    return (
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 border-b border-gray-200 p-6">
          <p className="text-sm font-semibold text-gray-600">{t(`days.${DAYS[currentDate.getDay()]}`)}</p>
          <p className="text-2xl font-bold text-gray-900">
            {currentDate.toLocaleDateString(dateLocale, {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>

        <div className="max-h-[600px] overflow-y-auto">
          <div className="divide-y divide-gray-200">
            {TIME_SLOTS.map((time) => {
              const cellKey = `${day}-${time}`;
              const isAvailable = isHourAvailable(availability, day, time);
              const isSaving = savingCells[cellKey] || false;

              const startingBooking = getBookingStartingAt(currentDate, time);
              const coveringBooking = getBookingCoveringHour(currentDate, time);
              const isBooked = !!coveringBooking;

              return (
                <div
                  key={time}
                  onMouseDown={() => !isBooked && handleDragStart(currentDate, time)}
                  onMouseUp={handleDragEnd}
                  onClick={() => {
                    if (coveringBooking) {
                      setSelectedBooking(coveringBooking);
                    } else {
                      handleCellClick(currentDate, time);
                    }
                  }}
                  className="flex items-stretch h-20 cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <div className="w-20 bg-gray-50 border-r border-gray-200 p-2 text-xs font-medium text-gray-600 flex items-center justify-center shrink-0">
                    {parseInt(time)}:00
                  </div>

                  <div
                    className={`flex-1 relative ${
                      isBooked ? "bg-[#FAECE7]" : isAvailable ? "bg-[#E1F5EE]" : "bg-white"
                    }`}
                  >
                    {isAvailable && !isBooked && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <span style={{ fontSize: "11px", color: "#085041" }}>{t("available")}</span>
                      </div>
                    )}

                    {startingBooking && (
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedBooking(startingBooking);
                        }}
                        className="absolute inset-1 rounded-lg border-l-4 border-l-[#993C1D] bg-[#FAECE7] p-2 cursor-pointer hover:shadow-md flex flex-col justify-center overflow-hidden"
                      >
                        <div className="font-bold text-xs leading-tight truncate text-[#993C1D]">
                          {t("bookedWith", { name: startingBooking.parentName })}
                        </div>
                        <div className="text-[11px] leading-tight truncate text-[#993C1D] opacity-70">
                          {startingBooking.time} – {startingBooking.endTime}
                        </div>
                      </div>
                    )}

                    {isSaving && !isBooked && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                        <Check className="w-5 h-5 text-teal-600" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // ── Month View ───────────────────────────────────────────────────────────────

  const renderMonthView = () => (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
    <div className="overflow-x-auto">
    <div className="min-w-[560px]">
      <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
        {DAYS.map((day) => (
          <div key={day} className="p-4 text-center font-semibold text-gray-600 text-sm">
            {t(`days.${day}`)}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {monthDays.map((date, idx) => {
          const hasBookings = date ? getBookingsForDate(date).length > 0 : false;
          return (
            <div
              key={idx}
              onClick={() => {
                if (date) {
                  setCurrentDate(date);
                  setViewMode("day");
                }
              }}
              className={`min-h-24 border border-gray-200 p-2 cursor-pointer transition-colors ${
                !date
                  ? "bg-gray-50"
                  : hasBookings
                  ? "bg-[var(--color-background-secondary)] hover:bg-gray-100"
                  : "hover:bg-gray-50"
              }`}
            >
              {date && (
                <div>
                  <p className="font-medium text-sm mb-1 text-[var(--color-text-primary)]">
                    {date.getDate()}
                  </p>
                  {hasBookings && (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-[#FAECE7]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#993C1D] inline-block" />
                      <span style={{ fontSize: "9px", color: "#993C1D", fontWeight: 600 }}>
                        {t("booked")}
                      </span>
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
    </div>
    </div>
  );

  // ── Navigation helpers ───────────────────────────────────────────────────────

  const navigate = (dir) => {
    const d = new Date(currentDate);
    if (viewMode === "week") d.setDate(d.getDate() + dir * 7);
    else if (viewMode === "month") d.setMonth(d.getMonth() + dir);
    else d.setDate(d.getDate() + dir);
    setCurrentDate(d);
  };

  // ── Main render ──────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-bold text-gray-900 min-w-40 text-center">
            {viewMode === "month" &&
              `${t(`months.${MONTHS[currentDate.getMonth()]}`)} ${currentDate.getFullYear()}`}
            {viewMode === "week" &&
              `${weekDates[0].toLocaleDateString()} – ${weekDates[6].toLocaleDateString()}`}
            {viewMode === "day" &&
              currentDate.toLocaleDateString(dateLocale, {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
          </h2>
          <button
            onClick={() => navigate(1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="flex gap-2 mb-4">
          {["month", "week", "day"].map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
                viewMode === mode
                  ? "bg-teal-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {t(`viewModes.${mode}`)}
            </button>
          ))}
        </div>

        <button
          onClick={() => onEditAvailability?.()}
          className="px-4 py-2 bg-teal-500 text-white rounded-lg font-medium hover:bg-teal-600 transition-colors"
        >
          {t("editAvailability")}
        </button>
      </div>

      {/* Calendar Views */}
      {viewMode === "week" && renderWeekView()}
      {viewMode === "day" && renderDayView()}
      {viewMode === "month" && renderMonthView()}

      {/* Booking Detail Side Panel */}
      {selectedBooking && (
        <div className="fixed inset-y-0 right-0 w-full sm:w-80 bg-white border-l border-gray-200 shadow-xl p-6 flex flex-col z-50 overflow-y-auto">
          <button
            onClick={() => setSelectedBooking(null)}
            className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="space-y-6 mt-4">
            <div>
              <p className="text-sm text-gray-500">{t("panel.family")}</p>
              <p className="text-lg font-bold text-gray-900">{selectedBooking.parentName}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">{t("panel.child")}</p>
              <p className="text-lg font-bold text-gray-900">{selectedBooking.childName}</p>
              {selectedBooking.childAge != null && (
                <p className="text-sm text-gray-500">{t("panel.age", { age: selectedBooking.childAge })}</p>
              )}
            </div>

            <div>
              <p className="text-sm text-gray-500">{t("panel.date")}</p>
              <p className="text-base font-semibold text-gray-900">{selectedBooking.date}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">{t("panel.time")}</p>
              <p className="text-base font-semibold text-gray-900">
                {selectedBooking.time} – {selectedBooking.endTime}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">{t("panel.status")}</p>
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                  selectedBooking.status === "confirmed"
                    ? "bg-teal-50 text-teal-700"
                    : "bg-yellow-50 text-yellow-700"
                }`}
              >
                {selectedBooking.status === "confirmed" ? t("panel.confirmed") : t("panel.pending")}
              </span>
            </div>

            {selectedBooking.adventure && (
              <div>
                <p className="text-sm text-gray-500">{t("panel.microAdventure")}</p>
                <p className="text-base font-semibold text-gray-900">
                  {selectedBooking.adventure}
                </p>
              </div>
            )}

            {selectedBooking.status === "confirmed" && (
              <button className="w-full py-3 bg-teal-500 text-white rounded-lg font-bold hover:bg-teal-600 transition-colors">
                {t("panel.markComplete")}
              </button>
            )}
          </div>
        </div>
      )}

      <Toast message={toast.message} type={toast.type} visible={toast.visible} />
    </div>
  );
}
