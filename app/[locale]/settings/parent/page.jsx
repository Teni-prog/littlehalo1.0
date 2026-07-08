"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import ParentSidebar from "@/components/ParentSidebar";
import {
  Settings, User, Baby, SlidersHorizontal, Shield,
  Check, X, Camera, Eye, EyeOff, Trash2, Plus,
  ChevronDown, AlertTriangle, Pencil, ArrowLeft,
} from "lucide-react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { NEIGHBOURHOODS, PROVINCE_GROUPS } from "@/lib/neighbourhoods";

// ── Constants ─────────────────────────────────────────────────────────────────

const LANGUAGES = ["English", "French", "Mandarin", "Arabic", "Spanish", "Yoruba", "Hindi", "Portuguese"];

// Maps a stored (DB) value to its translation key — the stored value itself is never translated.
const LANGUAGE_KEYS = {
  English: "english", French: "french", Mandarin: "mandarin", Arabic: "arabic",
  Spanish: "spanish", Yoruba: "yoruba", Hindi: "hindi", Portuguese: "portuguese",
};

const COUNTRIES = [
  "Canada","United States","Nigeria","Ghana","United Kingdom","India","China",
  "Philippines","Jamaica","Kenya","Ethiopia","South Africa","Pakistan","Bangladesh",
  "Sri Lanka","Mexico","Brazil","France","Germany","Italy","Spain","Portugal",
  "Australia","New Zealand","Haiti","Somalia","Sudan","Egypt",
  "Trinidad and Tobago","Barbados","Guyana","Senegal","Cameroon","Uganda","Tanzania",
];

// Maps a stored (DB) value to its translation key — the stored value itself is never translated.
const COUNTRY_KEYS = {
  "Canada": "canada", "United States": "unitedStates", "Nigeria": "nigeria", "Ghana": "ghana",
  "United Kingdom": "unitedKingdom", "India": "india", "China": "china", "Philippines": "philippines",
  "Jamaica": "jamaica", "Kenya": "kenya", "Ethiopia": "ethiopia", "South Africa": "southAfrica",
  "Pakistan": "pakistan", "Bangladesh": "bangladesh", "Sri Lanka": "sriLanka", "Mexico": "mexico",
  "Brazil": "brazil", "France": "france", "Germany": "germany", "Italy": "italy", "Spain": "spain",
  "Portugal": "portugal", "Australia": "australia", "New Zealand": "newZealand", "Haiti": "haiti",
  "Somalia": "somalia", "Sudan": "sudan", "Egypt": "egypt", "Trinidad and Tobago": "trinidadAndTobago",
  "Barbados": "barbados", "Guyana": "guyana", "Senegal": "senegal", "Cameroon": "cameroon",
  "Uganda": "uganda", "Tanzania": "tanzania",
};

const SPECIAL_NEEDS_OPTIONS = ["Autism", "ADHD", "Developmental delays", "None"];

// Maps a stored (DB) value to its translation key — the stored value itself is never translated.
const SPECIAL_NEEDS_KEYS = {
  "Autism": "autism", "ADHD": "adhd", "Developmental delays": "developmentalDelays", "None": "none",
};

const DAYS    = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
const SLOTS   = ["morning","afternoon","evening"];

const NAV = [
  { id: "profile",     Icon: User },
  { id: "children",    Icon: Baby },
  { id: "preferences", Icon: SlidersHorizontal },
  { id: "account",     Icon: Shield },
];

// ── Shared UI helpers ─────────────────────────────────────────────────────────

function Toast({ msg, type }) {
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-semibold text-white ${type === "error" ? "bg-red-500" : "bg-teal-500"}`}>
      {type === "error" ? <X className="w-4 h-4 shrink-0" /> : <Check className="w-4 h-4 shrink-0" />}
      {msg}
    </div>
  );
}

function Field({ label, error, required, children, hint }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
      {hint  && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

function inputCls(err) {
  return `w-full px-4 py-2.5 border rounded-xl text-sm outline-none transition-colors ${err ? "border-red-400 focus:border-red-400" : "border-gray-200 focus:border-teal-500"}`;
}

function SaveBtn({ saving, label }) {
  const t = useTranslations("settingsParent");
  const resolvedLabel = label ?? t("common.saveChanges");
  return (
    <button
      type="submit"
      disabled={saving}
      className="px-6 py-2.5 bg-teal-500 text-white rounded-xl font-semibold text-sm hover:bg-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
    >
      {saving ? t("common.saving") : resolvedLabel}
    </button>
  );
}

// ── Country searchable dropdown ───────────────────────────────────────────────

function CountrySelect({ value, onChange }) {
  const t = useTranslations("settingsParent");
  const [open, setOpen]       = useState(false);
  const [search, setSearch]   = useState("");
  const ref                   = useRef(null);
  const filtered = COUNTRIES.filter(c => c.toLowerCase().includes(search.toLowerCase()));

  useEffect(() => {
    function handler(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-left focus:outline-none focus:border-teal-500 hover:border-gray-300 transition-colors bg-white"
      >
        <span className={value ? "text-gray-900" : "text-gray-400"}>{value ? t(`common.countries.${COUNTRY_KEYS[value]}`) : t("common.selectCountry")}</span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
          <div className="p-2 border-b border-gray-100">
            <input
              autoFocus
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t("common.search")}
              className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-teal-500"
            />
          </div>
          <div className="max-h-48 overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="text-center text-xs text-gray-400 py-4">{t("common.noResults")}</p>
            ) : filtered.map(c => (
              <button
                key={c} type="button"
                onClick={() => { onChange(c); setOpen(false); setSearch(""); }}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${value === c ? "text-teal-600 font-semibold" : "text-gray-700"}`}
              >
                {t(`common.countries.${COUNTRY_KEYS[c]}`)}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Availability grid ─────────────────────────────────────────────────────────

function AvailabilityGrid({ value = {}, onChange }) {
  const t = useTranslations("settingsParent");
  function toggle(day, slot) {
    onChange({ ...value, [day]: { ...(value[day] || {}), [slot]: !(value[day]?.[slot]) } });
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-separate border-spacing-1">
        <thead>
          <tr>
            <th className="w-16" />
            {SLOTS.map(s => (
              <th key={s} className="text-xs font-semibold text-gray-500 capitalize text-center pb-1">{t(`common.slots.${s}`)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {DAYS.map(day => (
            <tr key={day}>
              <td className="text-xs font-semibold text-gray-600 pr-2">{t(`common.days.${day}`)}</td>
              {SLOTS.map(slot => (
                <td key={slot} className="text-center">
                  <button
                    type="button"
                    onClick={() => toggle(day, slot)}
                    className={`w-full py-2 rounded-lg text-xs font-medium transition-colors ${value[day]?.[slot] ? "bg-teal-500 text-white" : "bg-gray-100 text-gray-400 hover:bg-gray-200"}`}
                  >
                    {value[day]?.[slot] ? "✓" : ""}
                  </button>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Neighbourhood selector (province → city → searchable hood) ───────────────

// value: { province, city, neighbourhood, lat, lng }
// onChange: (newValue) => void
function NeighbourhoodSelector({ value = {}, onChange }) {
  const t = useTranslations("settingsParent");
  const { province = "", city = "", neighbourhood = "" } = value;

  const cities = useMemo(
    () => [...new Set(NEIGHBOURHOODS.filter(n => n.province === province).map(n => n.city))],
    [province],
  );

  const hoods = useMemo(
    () => NEIGHBOURHOODS.filter(n => n.city === city),
    [city],
  );

  const [hoodSearch, setHoodSearch] = useState("");
  const [hoodOpen,   setHoodOpen]   = useState(false);
  const hoodRef = useRef(null);

  const filteredHoods = hoods.filter(h =>
    h.name.toLowerCase().includes(hoodSearch.toLowerCase()),
  );

  useEffect(() => {
    function handler(e) {
      if (hoodRef.current && !hoodRef.current.contains(e.target)) setHoodOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function handleProvince(p) {
    onChange({ province: p, city: "", neighbourhood: "", lat: null, lng: null });
    setHoodSearch("");
    setHoodOpen(false);
  }

  function handleCity(c) {
    onChange({ province, city: c, neighbourhood: "", lat: null, lng: null });
    setHoodSearch("");
    setHoodOpen(false);
  }

  function handleHood(hood) {
    const found = NEIGHBOURHOODS.find(h => h.name === hood);
    onChange({ province, city, neighbourhood: hood, lat: found?.lat ?? null, lng: found?.lng ?? null });
    setHoodOpen(false);
    setHoodSearch("");
  }

  function clearHood() {
    onChange({ province, city, neighbourhood: "", lat: null, lng: null });
    setHoodSearch("");
  }

  return (
    <div className="space-y-3">
      {/* Province + City row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <p className="text-xs text-gray-500 mb-1">{t("common.province")}</p>
          <select
            value={province}
            onChange={e => handleProvince(e.target.value)}
            className={inputCls()}
          >
            <option value="">{t("common.selectProvince")}</option>
            {PROVINCE_GROUPS.map(p => (
              <option key={p.code} value={p.code}>{p.label}</option>
            ))}
          </select>
        </div>

        <div>
          <p className="text-xs text-gray-500 mb-1">{t("common.city")}</p>
          <select
            value={city}
            onChange={e => handleCity(e.target.value)}
            disabled={!province}
            className={`${inputCls()} disabled:opacity-40 disabled:cursor-not-allowed`}
          >
            <option value="">{province ? t("common.selectCity") : t("common.dash")}</option>
            {cities.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Neighbourhood — optional searchable dropdown, only shown after city */}
      {city && (
        <div>
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs text-gray-500">
              {t("common.neighbourhood")} <span className="text-gray-400">({t("common.optional")})</span>
            </p>
            {neighbourhood && (
              <button
                type="button"
                onClick={clearHood}
                className="text-xs text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
              >
                {t("common.clear")}
              </button>
            )}
          </div>

          <div ref={hoodRef} className="relative">
            <button
              type="button"
              onClick={() => setHoodOpen(v => !v)}
              className="w-full flex items-center justify-between px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-left focus:outline-none hover:border-gray-300 transition-colors bg-white"
            >
              <span className={neighbourhood ? "text-gray-900" : "text-gray-400"}>
                {neighbourhood || t("common.searchOrSelectNeighbourhood")}
              </span>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform shrink-0 ${hoodOpen ? "rotate-180" : ""}`} />
            </button>

            {hoodOpen && (
              <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                <div className="p-2 border-b border-gray-100">
                  <input
                    autoFocus
                    value={hoodSearch}
                    onChange={e => setHoodSearch(e.target.value)}
                    placeholder={t("common.typeToFilter")}
                    className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-teal-500"
                  />
                </div>
                <div className="max-h-48 overflow-y-auto">
                  {filteredHoods.length === 0 ? (
                    <p className="text-center text-xs text-gray-400 py-4">{t("common.noNeighbourhoodsFound")}</p>
                  ) : filteredHoods.map(h => (
                    <button
                      key={h.name}
                      type="button"
                      onClick={() => handleHood(h.name)}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${neighbourhood === h.name ? "text-teal-600 font-semibold bg-teal-50" : "text-gray-700"}`}
                    >
                      {h.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Profile section ───────────────────────────────────────────────────────────

function ProfileSection({ profile, userId, userEmail, showToast, onProfileUpdated }) {
  const t = useTranslations("settingsParent");
  const supabase = createClient();
  const fileRef  = useRef(null);

  const [name,         setName]         = useState(profile?.name         || "");
  const [phone,        setPhone]        = useState(profile?.phone        || "");
  const [country,      setCountry]      = useState(profile?.country      || "");
  const [languages,    setLanguages]    = useState(profile?.preferred_languages || []);
  const [note,         setNote]         = useState(profile?.family_bio   || "");
  const [avatarUrl,    setAvatarUrl]    = useState(profile?.avatar       || null);
  const [avatarPreview,setAvatarPreview]= useState(null);
  const [avatarFile,   setAvatarFile]   = useState(null);
  const [saving,       setSaving]       = useState(false);
  const [errors,       setErrors]       = useState({});

  // Derive province/city from the stored neighbourhood name on first render
  const existingHood = NEIGHBOURHOODS.find(h => h.name === profile?.neighbourhood);
  const [location, setLocation] = useState({
    province:     existingHood?.province     || "",
    city:         existingHood?.city         || "",
    neighbourhood:profile?.neighbourhood    || "",
    lat:          existingHood?.lat          ?? null,
    lng:          existingHood?.lng          ?? null,
  });

  function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  }

  function toggleLang(lang) {
    setLanguages(prev => prev.includes(lang) ? prev.filter(l => l !== lang) : [...prev, lang]);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = {};
    if (!name.trim()) errs.name = t("tabs.profile.nameRequired");
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setSaving(true);

    try {
      let finalAvatarUrl = avatarUrl;

      // Upload new avatar if selected
      if (avatarFile) {
        const ext  = avatarFile.name.split(".").pop();
        const path = `${userId}.${ext}`;
        const { error: uploadErr } = await supabase.storage
          .from("parent-avatars")
          .upload(path, avatarFile, { upsert: true });
        if (uploadErr) throw new Error(t("tabs.profile.photoUploadFailed", { message: uploadErr.message }));
        const { data: { publicUrl } } = supabase.storage.from("parent-avatars").getPublicUrl(path);
        finalAvatarUrl = publicUrl;
      }

      const fields = {
        name:                name.trim(),
        phone:               phone.trim()           || null,
        neighbourhood:       location.neighbourhood || null,
        latitude:            location.lat           ?? null,
        longitude:           location.lng           ?? null,
        preferred_languages: languages,
        family_bio:          note.trim()            || null,
        avatar:              finalAvatarUrl,
      };

      // Try UPDATE first (safe — only touches the columns we provide)
      const { data: updated, error: updateErr } = await supabase
        .from("users").update(fields).eq("id", userId).select("id");
      if (updateErr) throw new Error(updateErr.message);

      // First-time save: no row existed yet, so INSERT with all required fields
      if (!updated?.length) {
        const { error: insertErr } = await supabase.from("users").insert({
          id:        userId,
          email:     userEmail,
          user_type: "parent",
          ...fields,
        });
        if (insertErr) throw new Error(insertErr.message);
      }
      setAvatarUrl(finalAvatarUrl);
      setAvatarFile(null);
      setAvatarPreview(null);
      onProfileUpdated?.();
      showToast(t("toasts.profileUpdated"));
    } catch (err) {
      showToast(err.message || t("toasts.profileUpdateFailed"), "error");
    } finally {
      setSaving(false);
    }
  }

  const displayAvatar = avatarPreview || avatarUrl;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">{t("tabs.profile.title")}</h2>
        <p className="text-sm text-gray-500">{t("tabs.profile.subtitle")}</p>
      </div>

      {/* Avatar */}
      <div className="flex items-center gap-4">
        <div
          onClick={() => fileRef.current?.click()}
          className="relative w-20 h-20 rounded-full overflow-hidden bg-teal-100 flex items-center justify-center cursor-pointer group shrink-0"
        >
          {displayAvatar ? (
            <Image
              src={displayAvatar}
              alt={t("tabs.profile.avatarAlt")}
              fill
              className="object-cover"
              unoptimized
              onError={() => { setAvatarUrl(null); setAvatarPreview(null); }}
            />
          ) : (
            <span className="text-2xl font-bold text-teal-600">{name?.[0]?.toUpperCase() || "P"}</span>
          )}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Camera className="w-5 h-5 text-white" />
          </div>
        </div>
        <div>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="text-sm font-semibold text-teal-600 hover:text-teal-700 transition-colors"
          >
            {avatarPreview ? t("tabs.profile.changePhoto") : t("tabs.profile.uploadPhoto")}
          </button>
          {avatarPreview && (
            <p className="text-xs text-gray-400 mt-0.5">{t("tabs.profile.previewHint")}</p>
          )}
          <p className="text-xs text-gray-400 mt-0.5">{t("tabs.profile.photoRequirements")}</p>
        </div>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label={t("tabs.profile.fullNameLabel")} required error={errors.name}>
          <input value={name} onChange={e => setName(e.target.value)} className={inputCls(errors.name)} placeholder={t("tabs.profile.fullNamePlaceholder")} />
        </Field>
        <Field label={t("tabs.profile.phoneLabel")}>
          <input value={phone} onChange={e => setPhone(e.target.value)} className={inputCls()} placeholder={t("tabs.profile.phonePlaceholder")} type="tel" />
        </Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label={t("tabs.profile.countryLabel")}>
          <CountrySelect value={country} onChange={setCountry} />
        </Field>
      </div>

      <Field label={t("tabs.profile.locationLabel")} hint={t("tabs.profile.locationHint")}>
        <NeighbourhoodSelector value={location} onChange={setLocation} />
      </Field>

      <Field label={t("tabs.profile.languagesLabel")}>
        <div className="flex flex-wrap gap-2">
          {LANGUAGES.map(lang => (
            <button
              key={lang} type="button"
              onClick={() => toggleLang(lang)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors cursor-pointer ${languages.includes(lang) ? "bg-teal-500 text-white border-teal-500" : "border-gray-200 text-gray-600 hover:border-teal-400"}`}
            >
              {t(`common.languages.${LANGUAGE_KEYS[lang]}`)}
            </button>
          ))}
        </div>
      </Field>

      <Field label={t("tabs.profile.noteLabel")} hint={t("tabs.profile.noteCounterHint", { count: note.length })}>
        <textarea
          value={note}
          onChange={e => e.target.value.length <= 300 && setNote(e.target.value)}
          rows={3}
          placeholder={t("tabs.profile.notePlaceholder")}
          className={`${inputCls()} resize-none`}
        />
      </Field>

      <div className="flex justify-end pt-2">
        <SaveBtn saving={saving} />
      </div>
    </form>
  );
}

// ── Children section ──────────────────────────────────────────────────────────

const EMPTY_CHILD = { name: "", date_of_birth: "", special_needs: [], medical_notes: "" };

function ChildForm({ initial = EMPTY_CHILD, onSave, onCancel, saving }) {
  const t = useTranslations("settingsParent");
  const [data, setData] = useState({ ...EMPTY_CHILD, ...initial });
  const [errors, setErrors] = useState({});

  function set(key, val) { setData(p => ({ ...p, [key]: val })); }

  function toggleNeed(need) {
    set("special_needs", data.special_needs.includes(need)
      ? data.special_needs.filter(n => n !== need)
      : [...data.special_needs, need]);
  }

  function calcAge(dob) {
    if (!dob) return null;
    const diff = Date.now() - new Date(dob).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
  }

  function submit(e) {
    e.preventDefault();
    const errs = {};
    if (!data.name.trim()) errs.name = t("tabs.children.nameRequired");
    if (!data.date_of_birth) errs.dob = t("tabs.children.dobRequired");
    if (Object.keys(errs).length) { setErrors(errs); return; }
    const age = calcAge(data.date_of_birth);
    onSave({ ...data, name: data.name.trim(), age });
  }

  return (
    <form onSubmit={submit} className="bg-gray-50 rounded-2xl border border-gray-100 p-5 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label={t("tabs.children.childNameLabel")} required error={errors.name}>
          <input value={data.name} onChange={e => set("name", e.target.value)} className={inputCls(errors.name)} placeholder={t("tabs.children.childNamePlaceholder")} />
        </Field>
        <Field label={t("tabs.children.dobLabel")} required error={errors.dob}>
          <input
            type="date" value={data.date_of_birth}
            onChange={e => set("date_of_birth", e.target.value)}
            max={new Date().toISOString().split("T")[0]}
            className={inputCls(errors.dob)}
          />
        </Field>
      </div>

      <Field label={t("tabs.children.specialNeedsLabel")}>
        <div className="flex flex-wrap gap-2">
          {SPECIAL_NEEDS_OPTIONS.map(opt => (
            <button
              key={opt} type="button"
              onClick={() => toggleNeed(opt)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors cursor-pointer ${data.special_needs.includes(opt) ? "bg-teal-500 text-white border-teal-500" : "border-gray-200 text-gray-600 hover:border-teal-400"}`}
            >
              {t(`common.specialNeeds.${SPECIAL_NEEDS_KEYS[opt]}`)}
            </button>
          ))}
        </div>
      </Field>

      <Field label={t("tabs.children.medicalNotesLabel")}>
        <textarea
          value={data.medical_notes}
          onChange={e => set("medical_notes", e.target.value)}
          rows={2}
          placeholder={t("tabs.children.medicalNotesPlaceholder")}
          className={`${inputCls()} resize-none`}
        />
      </Field>

      <div className="flex gap-2 justify-end">
        <button type="button" onClick={onCancel} className="px-4 py-2 border border-gray-200 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-100 cursor-pointer">
          {t("common.cancel")}
        </button>
        <SaveBtn saving={saving} label={initial.id ? t("tabs.children.saveChild") : t("tabs.children.addChild")} />
      </div>
    </form>
  );
}

function ChildCard({ child, onEdit, onDelete }) {
  const t = useTranslations("settingsParent");
  const age = child.age ?? (child.date_of_birth
    ? Math.floor((Date.now() - new Date(child.date_of_birth)) / (1000 * 60 * 60 * 24 * 365.25))
    : null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="font-bold text-gray-900">{child.name}</p>
          {age != null && <p className="text-sm text-gray-500">{t("tabs.children.yearsOld", { age })}</p>}
        </div>
        <div className="flex gap-2">
          <button onClick={onEdit} className="p-1.5 text-gray-400 hover:text-teal-600 transition-colors cursor-pointer">
            <Pencil className="w-4 h-4" />
          </button>
          <button onClick={() => setConfirmDelete(true)} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors cursor-pointer">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {child.special_needs?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {child.special_needs.map(n => (
            <span key={n} className="text-xs bg-teal-50 text-teal-700 px-2.5 py-1 rounded-full">
              {SPECIAL_NEEDS_KEYS[n] ? t(`common.specialNeeds.${SPECIAL_NEEDS_KEYS[n]}`) : n}
            </span>
          ))}
        </div>
      )}
      {child.medical_notes && (
        <p className="text-xs text-gray-500 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2">
          {child.medical_notes}
        </p>
      )}

      {confirmDelete && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-sm text-red-600 font-medium mb-2">
            {t("tabs.children.removeConfirm", { name: child.name })}
          </p>
          <div className="flex gap-2">
            <button
              onClick={onDelete}
              className="px-4 py-1.5 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600 cursor-pointer"
            >
              {t("tabs.children.remove")}
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              className="px-4 py-1.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-50 cursor-pointer"
            >
              {t("common.cancel")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ChildrenSection({ userId, showToast }) {
  const t = useTranslations("settingsParent");
  const supabase = createClient();
  const [children, setChildren] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [editing,  setEditing]  = useState(null); // child id | "new" | null
  const [saving,   setSaving]   = useState(false);

  const fetchChildren = useCallback(async () => {
    const { data } = await supabase.from("children").select("*").eq("parent_id", userId).order("created_at");
    setChildren(data || []);
    setLoading(false);
  }, [userId]);

  useEffect(() => { fetchChildren(); }, [fetchChildren]);

  async function handleSave(formData) {
    setSaving(true);
    try {
      if (editing === "new") {
        const { error } = await supabase.from("children").insert({ ...formData, parent_id: userId });
        if (error) throw error;
        showToast(t("toasts.childAdded"));
      } else {
        const { error } = await supabase.from("children").update(formData).eq("id", editing);
        if (error) throw error;
        showToast(t("toasts.childUpdated"));
      }
      setEditing(null);
      await fetchChildren();
    } catch (err) {
      showToast(err.message || t("toasts.childSaveFailed"), "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    const { error } = await supabase.from("children").delete().eq("id", id);
    if (error) { showToast(t("toasts.childRemoveFailed"), "error"); return; }
    showToast(t("toasts.childRemoved"));
    await fetchChildren();
  }

  if (loading) return <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-gray-200 border-t-teal-500 rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">{t("tabs.children.title")}</h2>
          <p className="text-sm text-gray-500">{t("tabs.children.subtitle")}</p>
        </div>
        {editing !== "new" && (
          <button
            onClick={() => setEditing("new")}
            className="flex items-center gap-2 px-4 py-2 bg-teal-500 text-white rounded-xl text-sm font-semibold hover:bg-teal-600 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" /> {t("tabs.children.addChild")}
          </button>
        )}
      </div>

      {editing === "new" && (
        <ChildForm
          onSave={handleSave}
          onCancel={() => setEditing(null)}
          saving={saving}
        />
      )}

      {children.length === 0 && editing !== "new" && (
        <div className="text-center py-12 text-gray-400 text-sm">
          {t("tabs.children.noChildrenYet")}
        </div>
      )}

      {children.map(child => (
        editing === child.id ? (
          <ChildForm
            key={child.id}
            initial={child}
            onSave={handleSave}
            onCancel={() => setEditing(null)}
            saving={saving}
          />
        ) : (
          <ChildCard
            key={child.id}
            child={child}
            onEdit={() => setEditing(child.id)}
            onDelete={() => handleDelete(child.id)}
          />
        )
      ))}
    </div>
  );
}

// ── Preferences section ───────────────────────────────────────────────────────

function PreferencesSection({ profile, userId, showToast }) {
  const t = useTranslations("settingsParent");
  const supabase = createClient();
  const [budgetMin,    setBudgetMin]    = useState(profile?.budget_min  ?? "");
  const [budgetMax,    setBudgetMax]    = useState(profile?.max_budget  ?? "");
  const [availability, setAvailability] = useState(profile?.availability ?? {});
  const [saving,       setSaving]       = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const prefFields = {
        budget_min:  budgetMin !== "" ? Number(budgetMin) : null,
        max_budget:  budgetMax !== "" ? Number(budgetMax) : null,
        availability,
      };
      const { error } = await supabase.from("users").update(prefFields).eq("id", userId);
      if (error) throw error;
      showToast(t("toasts.preferencesUpdated"));
    } catch (err) {
      showToast(err.message || t("toasts.preferencesUpdateFailed"), "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">{t("tabs.preferences.title")}</h2>
        <p className="text-sm text-gray-500">{t("tabs.preferences.subtitle")}</p>
      </div>

      <Field label={t("tabs.preferences.budgetLabel")}>
        <div className="flex items-center gap-3">
          <input
            type="number" min={0} max={200} placeholder={t("tabs.preferences.budgetMinPlaceholder")}
            value={budgetMin} onChange={e => setBudgetMin(e.target.value)}
            className={`${inputCls()} w-full`}
          />
          <span className="text-gray-400 shrink-0">{t("tabs.preferences.to")}</span>
          <input
            type="number" min={0} max={200} placeholder={t("tabs.preferences.budgetMaxPlaceholder")}
            value={budgetMax} onChange={e => setBudgetMax(e.target.value)}
            className={`${inputCls()} w-full`}
          />
        </div>
      </Field>

      <Field label={t("tabs.preferences.availabilityLabel")} hint={t("tabs.preferences.availabilityHint")}>
        <div className="mt-1">
          <AvailabilityGrid value={availability} onChange={setAvailability} />
        </div>
      </Field>

      <div className="flex justify-end pt-2">
        <SaveBtn saving={saving} />
      </div>
    </form>
  );
}

// ── Account section ───────────────────────────────────────────────────────────

function AccountSection({ userId, userEmail, showToast }) {
  const t = useTranslations("settingsParent");
  const supabase = createClient();
  const router   = useRouter();

  const [currentPw,  setCurrentPw]  = useState("");
  const [newPw,      setNewPw]      = useState("");
  const [confirmPw,  setConfirmPw]  = useState("");
  const [showCur,    setShowCur]    = useState(false);
  const [showNew,    setShowNew]    = useState(false);
  const [showConf,   setShowConf]   = useState(false);
  const [pwSaving,   setPwSaving]   = useState(false);
  const [pwMsg,      setPwMsg]      = useState(null);

  const [showDel,    setShowDel]    = useState(false);
  const [delText,    setDelText]    = useState("");
  const [deleting,   setDeleting]   = useState(false);

  async function handlePasswordChange(e) {
    e.preventDefault();
    setPwMsg(null);
    if (newPw !== confirmPw) { setPwMsg({ text: t("tabs.account.passwordsNoMatch"), type: "error" }); return; }
    if (newPw.length < 6)   { setPwMsg({ text: t("tabs.account.passwordTooShort"), type: "error" }); return; }
    setPwSaving(true);
    const { error } = await supabase.auth.updateUser({ password: newPw });
    if (error) {
      setPwMsg({ text: error.message, type: "error" });
    } else {
      setPwMsg({ text: t("tabs.account.passwordUpdated"), type: "success" });
      setCurrentPw(""); setNewPw(""); setConfirmPw("");
    }
    setPwSaving(false);
  }

  async function handleDeleteAccount() {
    if (delText !== "DELETE") return;
    setDeleting(true);
    try {
      await fetch("/api/account/delete", { method: "DELETE" });
      await supabase.auth.signOut();
      router.push("/login");
    } catch {
      showToast(t("tabs.account.deleteAccountFailed"), "error");
      setDeleting(false);
    }
  }

  function PwInput({ label, value, onChange, show, onToggle }) {
    return (
      <Field label={label}>
        <div className="relative">
          <input
            type={show ? "text" : "password"}
            value={value} onChange={e => onChange(e.target.value)}
            className={`${inputCls()} pr-10`}
          />
          <button type="button" onClick={onToggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </Field>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">{t("tabs.account.title")}</h2>
        <p className="text-sm text-gray-500">{t("tabs.account.subtitle")}</p>
      </div>

      {/* Email */}
      <div className="bg-gray-50 rounded-2xl border border-gray-100 p-5">
        <p className="text-sm font-semibold text-gray-700 mb-1">{t("tabs.account.emailLabel")}</p>
        <p className="text-sm text-gray-500">{userEmail}</p>
        <p className="text-xs text-gray-400 mt-1">{t("tabs.account.emailCannotChange")}</p>
      </div>

      {/* Change password */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="font-bold text-gray-900 mb-4">{t("tabs.account.changePasswordTitle")}</h3>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <PwInput label={t("tabs.account.currentPasswordLabel")} value={currentPw} onChange={setCurrentPw} show={showCur} onToggle={() => setShowCur(v => !v)} />
          <PwInput label={t("tabs.account.newPasswordLabel")}     value={newPw}     onChange={setNewPw}     show={showNew} onToggle={() => setShowNew(v => !v)} />
          <PwInput label={t("tabs.account.confirmPasswordLabel")} value={confirmPw} onChange={setConfirmPw} show={showConf} onToggle={() => setShowConf(v => !v)} />
          {pwMsg && (
            <p className={`text-sm font-medium ${pwMsg.type === "error" ? "text-red-500" : "text-teal-600"}`}>
              {pwMsg.text}
            </p>
          )}
          <div className="flex justify-end">
            <SaveBtn saving={pwSaving} label={t("tabs.account.updatePassword")} />
          </div>
        </form>
      </div>

      {/* Danger zone */}
      <div className="rounded-2xl border border-red-100 p-6">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          <h3 className="font-bold text-red-600">{t("tabs.account.dangerZoneTitle")}</h3>
        </div>
        <p className="text-sm text-gray-500 mb-4">
          {t("tabs.account.deleteWarning")}
        </p>
        <button
          onClick={() => setShowDel(true)}
          className="px-5 py-2.5 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600 transition-colors cursor-pointer"
        >
          {t("tabs.account.deleteAccountButton")}
        </button>
      </div>

      {/* Delete confirmation modal */}
      {showDel && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
              <h3 className="font-bold text-gray-900">{t("tabs.account.areYouSure")}</h3>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              {t.rich("tabs.account.deleteConfirmInstructions", { strong: (chunks) => <strong>{chunks}</strong> })}
            </p>
            <input
              value={delText} onChange={e => setDelText(e.target.value)}
              placeholder={t("tabs.account.typeDeletePlaceholder")}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-red-400 mb-4"
            />
            <div className="flex gap-2">
              <button
                onClick={handleDeleteAccount}
                disabled={delText !== "DELETE" || deleting}
                className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {deleting ? t("tabs.account.deleting") : t("tabs.account.deleteAccountConfirmBtn")}
              </button>
              <button
                onClick={() => { setShowDel(false); setDelText(""); }}
                className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-50 cursor-pointer"
              >
                {t("common.cancel")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function ParentSettings() {
  const t = useTranslations("settingsParent");
  const router   = useRouter();
  const supabase = createClient();

  const [section,   setSection]   = useState("profile");
  const [userId,    setUserId]    = useState(null);
  const [userEmail, setUserEmail] = useState("");
  const [profile,   setProfile]   = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [toast,     setToast]     = useState(null);

  function showToast(msg, type = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }

  async function fetchProfile(uid) {
    const { data } = await supabase.from("users").select("*").eq("id", uid).maybeSingle();
    setProfile(data || {});
  }

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
      if (user.user_metadata?.user_type !== "parent") { router.push("/profile/Sitter"); return; }
      setUserId(user.id);
      setUserEmail(user.email);
      await fetchProfile(user.id);
      setLoading(false);
    }
    init();
  }, []);

  if (loading) {
    return (
      <ParentSidebar>
        <div className="flex-1 flex items-center justify-center min-h-screen">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-teal-500 rounded-full animate-spin" />
        </div>
      </ParentSidebar>
    );
  }

  return (
    <ParentSidebar>
      <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 pt-8">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors cursor-pointer mb-2"
        >
          <ArrowLeft className="w-4 h-4" />
          {t("nav.back")}
        </button>
      </div>
      <div className="max-w-5xl mx-auto px-4 pb-10 flex gap-8 items-start">

        {/* Sidebar */}
        <aside className="w-56 shrink-0 hidden md:block">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden sticky top-24">
            <div className="px-4 py-4 border-b border-gray-100 flex items-center gap-2">
              <Settings className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-bold text-gray-900">{t("common.settings")}</span>
            </div>
            <nav className="p-2">
              {NAV.map(({ id, Icon }) => (
                <button
                  key={id}
                  onClick={() => setSection(id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${section === id ? "bg-teal-50 text-teal-700" : "text-gray-600 hover:bg-gray-50"}`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {t(`nav.${id}`)}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Mobile nav */}
        <div className="md:hidden w-full mb-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-2 flex gap-1 overflow-x-auto">
            {NAV.map(({ id, Icon }) => (
              <button
                key={id}
                onClick={() => setSection(id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${section === id ? "bg-teal-50 text-teal-700" : "text-gray-500 hover:bg-gray-50"}`}
              >
                <Icon className="w-3.5 h-3.5" />
                {t(`nav.${id}`)}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <main className="flex-1 min-w-0">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
            {section === "profile" && (
              <ProfileSection
                profile={profile}
                userId={userId}
                userEmail={userEmail}
                showToast={showToast}
                onProfileUpdated={() => fetchProfile(userId)}
              />
            )}
            {section === "children" && (
              <ChildrenSection userId={userId} showToast={showToast} />
            )}
            {section === "preferences" && (
              <PreferencesSection profile={profile} userId={userId} showToast={showToast} />
            )}
            {section === "account" && (
              <AccountSection userId={userId} userEmail={userEmail} showToast={showToast} />
            )}
          </div>
        </main>
      </div>

      {toast && <Toast msg={toast.msg} type={toast.type} />}
      </div>
    </ParentSidebar>
  );
}
