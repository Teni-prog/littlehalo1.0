"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import {
  Settings, User, Shield, ShieldCheck,
  Check, X, Eye, EyeOff, AlertTriangle,
  ChevronDown, MapPin, Camera, Calendar, ArrowLeft,
} from "lucide-react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import SitterSidebar from "@/components/SitterSidebar";
import { NEIGHBOURHOODS, PROVINCE_GROUPS } from "@/lib/neighbourhoods";
import SimpleAvailabilityCalendar from "@/components/SimpleAvailabilityCalendar";
import SitterVerificationForm from "@/components/SitterVerificationForm";

// ── Constants ──────────────────────────────────────────────────────────────────

const LANGUAGES = ["English", "French", "Mandarin", "Arabic", "Spanish", "Yoruba", "Hindi", "Portuguese"];

const NAV = [
  { id: "profile", Icon: User },
  { id: "availability", Icon: Calendar },
  { id: "verification", Icon: ShieldCheck },
  { id: "account", Icon: Shield },
];

// ── Shared UI helpers ──────────────────────────────────────────────────────────

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
  const t = useTranslations("settingsSitter");
  return (
    <button
      type="submit"
      disabled={saving}
      className="px-6 py-2.5 bg-teal-500 text-white rounded-xl font-semibold text-sm hover:bg-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
    >
      {saving ? t("common.saving") : (label ?? t("common.saveChanges"))}
    </button>
  );
}

// ── Neighbourhood selector ─────────────────────────────────────────────────────

function NeighbourhoodSelector({ value = {}, onChange }) {
  const t = useTranslations("settingsSitter");
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
    setHoodSearch(""); setHoodOpen(false);
  }

  function handleCity(c) {
    onChange({ province, city: c, neighbourhood: "", lat: null, lng: null });
    setHoodSearch(""); setHoodOpen(false);
  }

  function handleHood(hood) {
    const found = NEIGHBOURHOODS.find(h => h.name === hood);
    onChange({ province, city, neighbourhood: hood, lat: found?.lat ?? null, lng: found?.lng ?? null });
    setHoodOpen(false); setHoodSearch("");
  }

  function clearHood() {
    onChange({ province, city, neighbourhood: "", lat: null, lng: null });
    setHoodSearch("");
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-xs text-gray-500 mb-1">{t("tabs.profile.location.provinceLabel")}</p>
          <select
            value={province}
            onChange={e => handleProvince(e.target.value)}
            className={inputCls()}
          >
            <option value="">{t("tabs.profile.location.selectProvince")}</option>
            {PROVINCE_GROUPS.map(p => (
              <option key={p.code} value={p.code}>{p.label}</option>
            ))}
          </select>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">{t("tabs.profile.location.cityLabel")}</p>
          <select
            value={city}
            onChange={e => handleCity(e.target.value)}
            disabled={!province}
            className={`${inputCls()} disabled:opacity-40 disabled:cursor-not-allowed`}
          >
            <option value="">{province ? t("tabs.profile.location.selectCity") : t("tabs.profile.location.dash")}</option>
            {cities.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {city && (
        <div>
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs text-gray-500">
              {t("tabs.profile.location.neighbourhoodLabel")} <span className="text-gray-400">{t("tabs.profile.location.optionalLabel")}</span>
            </p>
            {neighbourhood && (
              <button
                type="button"
                onClick={clearHood}
                className="text-xs text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
              >
                {t("tabs.profile.location.clearButton")}
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
                {neighbourhood || t("tabs.profile.location.searchPlaceholder")}
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
                    placeholder={t("tabs.profile.location.typeToFilter")}
                    className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-teal-500"
                  />
                </div>
                <div className="max-h-48 overflow-y-auto">
                  {filteredHoods.length === 0 ? (
                    <p className="text-center text-xs text-gray-400 py-4">{t("tabs.profile.location.noResults")}</p>
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

      {neighbourhood && (
        <p className="text-xs text-teal-600 flex items-center gap-1">
          <MapPin className="w-3 h-3" /> {t("tabs.profile.location.pinnedTo", { neighbourhood })}
        </p>
      )}
    </div>
  );
}

// ── Profile section ───────────────────────────────────────────────────────────

function ProfileSection({ profile, userId, showToast, onSaved }) {
  const t = useTranslations("settingsSitter");
  const supabase = createClient();
  const fileRef  = useRef(null);

  const [name,      setName]      = useState(profile?.name      || "");
  const [phone,     setPhone]     = useState(profile?.phone     || "");
  const [bio,       setBio]       = useState(profile?.bio       || "");
  const [hourlyRate,setHourlyRate]= useState(profile?.hourly_rate ?? "");
  const [languages, setLanguages] = useState(profile?.languages || []);
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar    || null);
  const [avatarPrev,setAvatarPrev]= useState(null);
  const [avatarFile,setAvatarFile]= useState(null);
  const [saving,    setSaving]    = useState(false);
  const [errors,    setErrors]    = useState({});

  const existingHood = NEIGHBOURHOODS.find(h => h.name === profile?.neighbourhood);
  const [location, setLocation] = useState({
    province:     existingHood?.province  || "",
    city:         existingHood?.city      || "",
    neighbourhood:profile?.neighbourhood || "",
    lat:          existingHood?.lat       ?? null,
    lng:          existingHood?.lng       ?? null,
  });

  function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPrev(URL.createObjectURL(file));
  }

  function toggleLang(lang) {
    setLanguages(prev => prev.includes(lang) ? prev.filter(l => l !== lang) : [...prev, lang]);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = {};
    if (!name.trim()) errs.name = t("tabs.profile.errors.nameRequired");
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setSaving(true);

    try {
      let finalAvatar = avatarUrl;

      if (avatarFile) {
        const ext  = avatarFile.name.split(".").pop();
        const path = `${userId}.${ext}`;
        const { error: uploadErr } = await supabase.storage
          .from("avatars")
          .upload(path, avatarFile, { upsert: true });
        if (uploadErr) throw new Error(t("tabs.profile.errors.photoUploadFailed", { message: uploadErr.message }));
        const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(path);
        finalAvatar = publicUrl;
      }

      // Update name/phone/avatar in users table
      const { error: userErr } = await supabase
        .from("users")
        .update({ name: name.trim(), phone: phone.trim() || null, avatar: finalAvatar })
        .eq("id", userId);
      if (userErr) throw new Error(userErr.message);

      // Update profile fields (including neighbourhood + coords) in sitter_profiles
      const { error: profErr } = await supabase
        .from("sitter_profiles")
        .update({
          bio:          bio.trim()           || null,
          hourly_rate:  hourlyRate !== "" ? Number(hourlyRate) : null,
          languages,
          neighbourhood:location.neighbourhood || null,
          latitude:     location.lat           ?? null,
          longitude:    location.lng           ?? null,
        })
        .eq("user_id", userId);
      if (profErr) throw new Error(profErr.message);

      setAvatarUrl(finalAvatar);
      setAvatarFile(null);
      setAvatarPrev(null);
      onSaved?.();
      showToast(t("toasts.profileUpdated"));
    } catch (err) {
      showToast(err.message || t("toasts.profileSaveFailed"), "error");
    } finally {
      setSaving(false);
    }
  }

  const displayAvatar = avatarPrev || avatarUrl;

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
              onError={() => { setAvatarUrl(null); setAvatarPrev(null); }}
            />
          ) : (
            <span className="text-2xl font-bold text-teal-600">{name?.[0]?.toUpperCase() || "S"}</span>
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
            {avatarPrev ? t("tabs.profile.changePhoto") : t("tabs.profile.uploadPhoto")}
          </button>
          {avatarPrev && <p className="text-xs text-gray-400 mt-0.5">{t("tabs.profile.previewHint")}</p>}
          <p className="text-xs text-gray-400 mt-0.5">{t("tabs.profile.fileHint")}</p>
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

      <Field label={t("tabs.profile.bioLabel")} hint={t("tabs.profile.bioHint", { count: bio.length })}>
        <textarea
          value={bio}
          onChange={e => e.target.value.length <= 300 && setBio(e.target.value)}
          rows={3}
          placeholder={t("tabs.profile.bioPlaceholder")}
          className={`${inputCls()} resize-none`}
        />
      </Field>

      <Field label={t("tabs.profile.hourlyRateLabel")}>
        <input
          type="number" min={10} max={200}
          value={hourlyRate}
          onChange={e => setHourlyRate(e.target.value)}
          className={inputCls()}
          placeholder={t("tabs.profile.hourlyRatePlaceholder")}
        />
      </Field>

      <Field label={t("tabs.profile.languagesLabel")}>
        <div className="flex flex-wrap gap-2">
          {LANGUAGES.map(lang => (
            <button
              key={lang} type="button"
              onClick={() => toggleLang(lang)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors cursor-pointer ${languages.includes(lang) ? "bg-teal-500 text-white border-teal-500" : "border-gray-200 text-gray-600 hover:border-teal-400"}`}
            >
              {t(`shared.languages.${lang}`)}
            </button>
          ))}
        </div>
      </Field>

      <Field
        label={t("tabs.profile.locationLabel")}
        hint={t("tabs.profile.locationHint")}
      >
        <NeighbourhoodSelector value={location} onChange={setLocation} />
      </Field>

      <div className="flex justify-end pt-2">
        <SaveBtn saving={saving} />
      </div>
    </form>
  );
}

// ── Account section ───────────────────────────────────────────────────────────

function AccountSection({ userId, userEmail, showToast }) {
  const t = useTranslations("settingsSitter");
  const supabase = createClient();
  const router   = useRouter();

  const [newPw,     setNewPw]     = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showNew,   setShowNew]   = useState(false);
  const [showConf,  setShowConf]  = useState(false);
  const [pwSaving,  setPwSaving]  = useState(false);
  const [pwMsg,     setPwMsg]     = useState(null);

  const [showDel,  setShowDel]  = useState(false);
  const [delText,  setDelText]  = useState("");
  const [deleting, setDeleting] = useState(false);

  async function handlePasswordChange(e) {
    e.preventDefault();
    setPwMsg(null);
    if (newPw !== confirmPw) { setPwMsg({ text: t("tabs.account.errors.passwordMismatch"), type: "error" }); return; }
    if (newPw.length < 6)   { setPwMsg({ text: t("tabs.account.errors.passwordTooShort"), type: "error" }); return; }
    setPwSaving(true);
    const { error } = await supabase.auth.updateUser({ password: newPw });
    if (error) {
      setPwMsg({ text: error.message, type: "error" });
    } else {
      setPwMsg({ text: t("tabs.account.passwordUpdated"), type: "success" });
      setNewPw(""); setConfirmPw("");
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
      showToast(t("tabs.account.deleteFailed"), "error");
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

      <div className="bg-gray-50 rounded-2xl border border-gray-100 p-5">
        <p className="text-sm font-semibold text-gray-700 mb-1">{t("tabs.account.emailLabel")}</p>
        <p className="text-sm text-gray-500">{userEmail}</p>
        <p className="text-xs text-gray-400 mt-1">{t("tabs.account.emailHint")}</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="font-bold text-gray-900 mb-4">{t("tabs.account.changePasswordTitle")}</h3>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <PwInput label={t("tabs.account.newPasswordLabel")}     value={newPw}     onChange={setNewPw}     show={showNew}  onToggle={() => setShowNew(v => !v)}  />
          <PwInput label={t("tabs.account.confirmPasswordLabel")} value={confirmPw} onChange={setConfirmPw} show={showConf} onToggle={() => setShowConf(v => !v)} />
          {pwMsg && (
            <p className={`text-sm font-medium ${pwMsg.type === "error" ? "text-red-500" : "text-teal-600"}`}>
              {pwMsg.text}
            </p>
          )}
          <div className="flex justify-end">
            <SaveBtn saving={pwSaving} label={t("tabs.account.updatePasswordButton")} />
          </div>
        </form>
      </div>

      <div className="rounded-2xl border border-red-100 p-6">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          <h3 className="font-bold text-red-600">{t("tabs.account.dangerZoneTitle")}</h3>
        </div>
        <p className="text-sm text-gray-500 mb-4">
          {t("tabs.account.dangerZoneText")}
        </p>
        <button
          onClick={() => setShowDel(true)}
          className="px-5 py-2.5 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600 transition-colors cursor-pointer"
        >
          {t("tabs.account.deleteAccountButton")}
        </button>
      </div>

      {showDel && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
              <h3 className="font-bold text-gray-900">{t("tabs.account.confirmDeleteTitle")}</h3>
            </div>
            <p className="text-sm text-gray-500 mb-4">{t("tabs.account.deleteConfirmBefore")} <strong>DELETE</strong> {t("tabs.account.deleteConfirmAfter")}</p>
            <input
              value={delText} onChange={e => setDelText(e.target.value)}
              placeholder={t("tabs.account.deleteInputPlaceholder")}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-red-400 mb-4"
            />
            <div className="flex gap-2">
              <button
                onClick={handleDeleteAccount}
                disabled={delText !== "DELETE" || deleting}
                className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {deleting ? t("tabs.account.deletingLabel") : t("tabs.account.deleteAccountConfirmButton")}
              </button>
              <button
                onClick={() => { setShowDel(false); setDelText(""); }}
                className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-50 cursor-pointer"
              >
                {t("tabs.account.cancelButton")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Availability section ──────────────────────────────────────────────────────

function AvailabilitySection({ userId, showToast, onSaved }) {
  const t = useTranslations("settingsSitter");
  const supabase = createClient();
  const [availability, setAvailability] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAvailability() {
      try {
        const { data: profile } = await supabase
          .from("sitter_profiles")
          .select("recurring_availability")
          .eq("user_id", userId)
          .single();

        if (profile) {
          // Initialize with existing data or defaults
          setAvailability(profile.recurring_availability || null);
        }
      } catch (err) {
        showToast(t("tabs.availability.errors.loadFailed"), "error");
      } finally {
        setLoading(false);
      }
    }
    fetchAvailability();
  }, [userId, supabase, showToast]);

  const handleSaveAvailability = async (newAvailability, repeatWeekly) => {
    try {
      const { error } = await supabase
        .from("sitter_profiles")
        .update({
          recurring_availability: newAvailability,
          repeat_weekly: repeatWeekly,
        })
        .eq("user_id", userId);

      if (error) throw error;
      showToast(t("tabs.availability.saveSuccess"));
      onSaved?.();
    } catch (err) {
      throw err;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-teal-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">{t("tabs.availability.title")}</h2>
        <p className="text-sm text-gray-500">{t("tabs.availability.subtitle")}</p>
      </div>

      {availability !== null && (
        <SimpleAvailabilityCalendar 
          initialData={availability}
          onSave={handleSaveAvailability}
        />
      )}
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────────

export default function SitterSettings() {
  const t = useTranslations("settingsSitter");
  const router   = useRouter();
  const supabase = createClient();
  const searchParams = useSearchParams();

  const [section,   setSection]   = useState(
    searchParams.get("tab") === "verification" ? "verification" : "profile"
  );
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
    const { data: sitterRow } = await supabase
      .from("sitter_profiles")
      .select("bio, hourly_rate, languages, neighbourhood, latitude, longitude, availability")
      .eq("user_id", uid)
      .maybeSingle();

    const { data: userRow } = await supabase
      .from("users")
      .select("name, phone, avatar")
      .eq("id", uid)
      .maybeSingle();

    setProfile({ ...(sitterRow || {}), ...(userRow || {}) });
  }

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
      if (user.user_metadata?.user_type !== "sitter") { router.push("/profile/Parents"); return; }
      setUserId(user.id);
      setUserEmail(user.email);
      await fetchProfile(user.id);
      setLoading(false);
    }
    init();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-teal-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
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
              <span className="text-sm font-bold text-gray-900">{t("nav.settingsTitle")}</span>
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
                showToast={showToast}
                onSaved={() => fetchProfile(userId)}
              />
            )}
            {section === "availability" && (
              <AvailabilitySection
                userId={userId}
                showToast={showToast}
                onSaved={() => fetchProfile(userId)}
              />
            )}
            {section === "verification" && (
              <SitterVerificationForm userId={userId} />
            )}
            {section === "account" && (
              <AccountSection userId={userId} userEmail={userEmail} showToast={showToast} />
            )}
          </div>
        </main>
      </div>

      {toast && <Toast msg={toast.msg} type={toast.type} />}
    </div>
  );
}
