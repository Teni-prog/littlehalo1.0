"use client";

import { useState, useEffect, useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import ParentSidebar from "@/components/ParentSidebar";
import ParentReviewForm from "@/components/ParentReviewForm";

// ── Constants ─────────────────────────────────────────────────────────────────

const DAYS_KEYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
const MONTH_KEYS = [
  "january","february","march","april","may","june",
  "july","august","september","october","november","december",
];
// 6 AM – 10 PM  (17 slots)
const TIME_SLOTS = Array.from({ length: 17 }, (_, i) =>
  (6 + i).toString().padStart(2, "0")
);

const STATUS_CONFIG = {
  pending_sitter: { labelKey: "pending",            bg: "#FAEEDA", text: "#633806" },
  confirmed:      { labelKey: "confirmed",          bg: "#E6F1FB", text: "#0C447C" },
  completed:      { labelKey: "completed",          bg: "#E1F5EE", text: "#085041" },
  cancelled:      { labelKey: "cancelledDeclined",  bg: "#F1EFE8", text: "#5F5E5A" },
  declined:       { labelKey: "cancelledDeclined",  bg: "#F1EFE8", text: "#5F5E5A" },
};

function statusCfg(status) {
  return STATUS_CONFIG[status] ?? STATUS_CONFIG.cancelled;
}

function formatHour(h, ampm) {
  const n = parseInt(h, 10);
  if (n === 0)   return `12 ${ampm.am}`;
  if (n < 12)    return `${n} ${ampm.am}`;
  if (n === 12)  return `12 ${ampm.pm}`;
  return `${n - 12} ${ampm.pm}`;
}

// Safe local YYYY-MM-DD string (avoids UTC midnight off-by-one)
function localDateStr(d) {
  const y   = d.getFullYear();
  const m   = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function ParentSchedule() {
  const t = useTranslations("scheduleParent");
  const locale = useLocale();
  const dateLocale = locale === "fr" ? "fr-CA" : "en-US";
  const [parentName,    setParentName]    = useState("");
  const [parentUserId,  setParentUserId]  = useState(null);
  const [rawBookings,   setRawBookings]   = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [viewMode,      setViewMode]      = useState("month"); // "month" | "week"
  const [currentDate,   setCurrentDate]   = useState(new Date());
  const [selectedBk,    setSelectedBk]    = useState(null);
  const [reviewedSet,   setReviewedSet]   = useState(new Set());

  // ── Data loading ─────────────────────────────────────────────────────────────
  useEffect(() => {
    async function load() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        setParentUserId(user.id);
        setParentName(user.user_metadata?.name || t("fallback.parent"));

        const res  = await fetch(`/api/booking?parentId=${user.id}`);
        const data = await res.json();
        if (res.ok) setRawBookings(data.bookings || []);

        // Which bookings this parent has already reviewed
        const { data: reviews } = await supabase
          .from("reviews")
          .select("booking_id")
          .eq("reviewer_id", user.id)
          .eq("reviewer_role", "parent");
        if (reviews) setReviewedSet(new Set(reviews.map((r) => r.booking_id)));
      } catch {}
      setLoading(false);
    }
    load();
  }, []);

  // ── Format raw bookings ───────────────────────────────────────────────────────
  const bookings = useMemo(() =>
    rawBookings.map((b) => {
      const startParts = (b.start_time || "00:00").split(":").map(Number);
      const endParts   = (b.end_time   || "01:00").split(":").map(Number);
      const [startH, startM] = startParts;
      const [endH,   endM  ] = endParts;
      const fmt = (h, m) => {
        const sfx = h >= 12 ? t("time.pm") : t("time.am");
        return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${sfx}`;
      };
      const firstChild  = Array.isArray(b.children) ? b.children[0] : null;
      const sitterName  = b.sitter_profile?.user?.name || t("fallback.sitter");
      const cfg         = statusCfg(b.status);
      return {
        id:          b.id,
        date:        b.date,         // "YYYY-MM-DD"
        startH,
        endH,
        timeLabel:   `${fmt(startH, startM)} – ${fmt(endH, endM)}`,
        sitterName,
        child:       firstChild ? { name: firstChild.name, age: firstChild.age } : null,
        status:      b.status,
        adventure:   b.adventure_id || null,
        ...cfg,
      };
    }),
  [rawBookings]);

  const bookingsForDate = (ds) => bookings.filter((b) => b.date === ds);

  // ── Month grid ────────────────────────────────────────────────────────────────
  const monthDays = useMemo(() => {
    const y     = currentDate.getFullYear();
    const mo    = currentDate.getMonth();
    const first = new Date(y, mo, 1).getDay();
    const days  = new Date(y, mo + 1, 0).getDate();
    const grid  = [];
    for (let i = 0; i < first; i++) grid.push(null);
    for (let i = 1; i <= days;  i++) grid.push(new Date(y, mo, i));
    return grid;
  }, [currentDate]);

  // ── Week dates ────────────────────────────────────────────────────────────────
  const weekStart = useMemo(() => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() - d.getDay());
    return d;
  }, [currentDate]);

  const weekDates = useMemo(() =>
    Array.from({ length: 7 }, (_, i) => {
      const d = new Date(weekStart);
      d.setDate(d.getDate() + i);
      return d;
    }),
  [weekStart]);

  // ── Navigation ────────────────────────────────────────────────────────────────
  function navigate(dir) {
    const d = new Date(currentDate);
    if (viewMode === "month") d.setMonth(d.getMonth() + dir);
    else                      d.setDate(d.getDate() + dir * 7);
    setCurrentDate(d);
  }

  // ── Month view ────────────────────────────────────────────────────────────────
  const renderMonthView = () => (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {/* Day-of-week headers */}
      <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
        {DAYS_KEYS.map((d) => (
          <div key={d} className="p-3 text-center text-sm font-semibold text-gray-600">
            {t(`days.${d}`)}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7">
        {monthDays.map((date, idx) => {
          const ds          = date ? localDateStr(date) : null;
          const dayBookings = ds ? bookingsForDate(ds) : [];
          const hasBookings = dayBookings.length > 0;

          return (
            <div
              key={idx}
              className={`min-h-28 border border-gray-100 p-2 ${
                !date       ? "bg-gray-50"  :
                hasBookings ? "bg-gray-100" : ""
              }`}
            >
              {date && (
                <div>
                  <p className="font-medium text-sm text-gray-900 mb-1.5">
                    {date.getDate()}
                  </p>
                  <div className="space-y-1">
                    {dayBookings.map((bk) => (
                      <button
                        key={bk.id}
                        onClick={() => setSelectedBk(bk)}
                        className="w-full text-left px-2 py-1 rounded-md text-[10px] font-semibold truncate hover:opacity-80 transition-opacity"
                        style={{ backgroundColor: bk.bg, color: bk.text }}
                      >
                        {bk.sitterName} · {bk.timeLabel.split(" – ")[0]}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  // ── Week view ─────────────────────────────────────────────────────────────────
  const renderWeekView = () => {
    const todayStr = localDateStr(new Date());
    return (
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {/* Header row */}
        <div
          className="grid border-b border-gray-200"
          style={{ gridTemplateColumns: "80px repeat(7, 1fr)" }}
        >
          <div className="bg-gray-50 border-r border-gray-200" />
          {weekDates.map((d, i) => {
            const isToday = localDateStr(d) === todayStr;
            return (
              <div key={i} className="bg-gray-50 border-r border-gray-200 p-3 text-center">
                <p className="text-xs font-semibold text-gray-500 uppercase">
                  {t(`days.${DAYS_KEYS[d.getDay()]}`)}
                </p>
                <p className={`text-lg font-bold ${isToday ? "text-teal-600" : "text-gray-900"}`}>
                  {d.getDate()}
                </p>
              </div>
            );
          })}
        </div>

        {/* Scrollable time grid */}
        <div className="max-h-[600px] overflow-y-auto">
          <div
            className="grid"
            style={{ gridTemplateColumns: "80px repeat(7, 1fr)" }}
          >
            {/* Time-label column */}
            <div>
              {TIME_SLOTS.map((hour) => (
                <div
                  key={hour}
                  className="h-16 border-b border-gray-100 p-1 pr-2 flex items-start justify-end"
                >
                  <span className="text-xs text-gray-400">{formatHour(hour, { am: t("time.am"), pm: t("time.pm") })}</span>
                </div>
              ))}
            </div>

            {/* One column per day */}
            {weekDates.map((d, colIdx) => {
              const ds          = localDateStr(d);
              const dayBookings = bookingsForDate(ds);

              return (
                <div key={colIdx} className="border-l border-gray-200">
                  {TIME_SLOTS.map((hour) => {
                    const hourInt      = parseInt(hour, 10);
                    const startingHere = dayBookings.filter(
                      (b) => b.startH === hourInt
                    );
                    return (
                      <div key={hour} className="h-16 border-b border-gray-100 relative p-0.5">
                        {startingHere.map((bk) => {
                          const durationH = Math.max(bk.endH - bk.startH, 1);
                          return (
                            <button
                              key={bk.id}
                              onClick={() => setSelectedBk(bk)}
                              className="absolute left-0.5 right-0.5 top-0.5 rounded-lg border-l-4 p-1.5 text-left overflow-hidden hover:opacity-90 transition-opacity"
                              style={{
                                backgroundColor: bk.bg,
                                borderLeftColor: bk.text,
                                height: `${durationH * 64 - 4}px`,
                                zIndex: 10,
                              }}
                            >
                              <p
                                className="font-bold text-[10px] leading-tight truncate"
                                style={{ color: bk.text }}
                              >
                                {bk.sitterName}
                              </p>
                              <p
                                className="text-[9px] leading-tight truncate"
                                style={{ color: bk.text, opacity: 0.7 }}
                              >
                                {bk.timeLabel}
                              </p>
                            </button>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // ── Side panel ────────────────────────────────────────────────────────────────
  const renderSidePanel = () => {
    if (!selectedBk) return null;
    const cfg            = statusCfg(selectedBk.status);
    const isCompleted    = selectedBk.status === "completed";
    const alreadyReviewed = reviewedSet.has(selectedBk.id);

    return (
      <div
        className="fixed inset-0 bg-black/40 z-50 flex justify-end"
        onClick={() => setSelectedBk(null)}
      >
        <div
          className="w-full max-w-md bg-white h-full overflow-y-auto shadow-2xl flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">{t("details.title")}</h2>
            <button
              onClick={() => setSelectedBk(null)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="flex-1 p-6 space-y-5">
            {/* Status badge */}
            <span
              className="inline-flex px-3 py-1 rounded-full text-sm font-semibold"
              style={{ backgroundColor: cfg.bg, color: cfg.text }}
            >
              {t(`status.${cfg.labelKey}`)}
            </span>

            {/* Sitter */}
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                {t("details.sitter")}
              </p>
              <p className="font-bold text-gray-900 text-lg">{selectedBk.sitterName}</p>
            </div>

            {/* Date & Time */}
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                {t("details.dateTime")}
              </p>
              <p className="font-medium text-gray-900">
                {new Date(`${selectedBk.date}T12:00:00`).toLocaleDateString(dateLocale, {
                  weekday: "long",
                  year:    "numeric",
                  month:   "long",
                  day:     "numeric",
                })}
              </p>
              <p className="text-sm text-gray-600 mt-0.5">{selectedBk.timeLabel}</p>
            </div>

            {/* Child */}
            {selectedBk.child && (
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                  {t("details.child")}
                </p>
                <p className="font-medium text-gray-900">{selectedBk.child.name}</p>
                <p className="text-sm text-gray-500">{t("details.yearsOld", { age: selectedBk.child.age })}</p>
              </div>
            )}

            {/* Micro-Adventure */}
            {selectedBk.adventure && (
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                  {t("details.microAdventure")}
                </p>
                <div className="bg-yellow-50 text-yellow-800 px-4 py-3 rounded-xl text-sm font-medium border border-yellow-100">
                  {selectedBk.adventure}
                </div>
              </div>
            )}

            {/* Review section */}
            {isCompleted && !alreadyReviewed && (
              <div className="pt-2">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                  {t("details.leaveReview")}
                </p>
                <ParentReviewForm
                  booking={{
                    id:    selectedBk.id,
                    date:  selectedBk.date,
                    hours: Math.max(selectedBk.endH - selectedBk.startH, 1),
                  }}
                  sitterName={selectedBk.sitterName}
                  onSubmitted={() =>
                    setReviewedSet((prev) => new Set([...prev, selectedBk.id]))
                  }
                />
              </div>
            )}

            {isCompleted && alreadyReviewed && (
              <div className="flex items-center gap-2 px-4 py-3 bg-teal-50 rounded-xl border border-teal-100 mt-2">
                <span className="text-sm text-teal-700 font-medium">
                  {t("details.reviewSubmitted")}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <ParentSidebar userName={parentName}>
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-8 w-full">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{t("header.greeting", { name: parentName })}</h1>
          <p className="text-gray-600">{t("header.subtitle")}</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-teal-500 rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Calendar controls */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => navigate(-1)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <h2 className="text-xl font-bold text-gray-900 min-w-52 text-center">
                  {viewMode === "month"
                    ? `${t(`months.${MONTH_KEYS[currentDate.getMonth()]}`)} ${currentDate.getFullYear()}`
                    : `${weekDates[0].toLocaleDateString()} – ${weekDates[6].toLocaleDateString()}`}
                </h2>
                <button
                  onClick={() => navigate(1)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Month / Week toggle */}
              <div className="flex gap-2">
                {["month", "week"].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
                      viewMode === mode
                        ? "bg-teal-500 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {t(`viewToggle.${mode}`)}
                  </button>
                ))}
              </div>
            </div>

            {/* Calendar */}
            {viewMode === "month" ? renderMonthView() : renderWeekView()}

            {/* Legend */}
            <div className="mt-4 bg-white rounded-2xl border border-gray-200 p-4">
              <div className="flex flex-wrap gap-5 text-xs font-medium">
                {[
                  { labelKey: "pending",           bg: "#FAEEDA", text: "#633806" },
                  { labelKey: "confirmed",         bg: "#E6F1FB", text: "#0C447C" },
                  { labelKey: "completed",         bg: "#E1F5EE", text: "#085041" },
                  { labelKey: "cancelledDeclined", bg: "#F1EFE8", text: "#5F5E5A" },
                ].map((s) => (
                  <span key={s.labelKey} className="flex items-center gap-1.5">
                    <span
                      className="w-3 h-3 rounded inline-block"
                      style={{ backgroundColor: s.bg }}
                    />
                    <span style={{ color: s.text }}>{t(`status.${s.labelKey}`)}</span>
                  </span>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Booking detail side panel (portal-style) */}
      {renderSidePanel()}
    </ParentSidebar>
  );
}
