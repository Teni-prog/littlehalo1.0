"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Settings, User, Shield,
  Check, X, Eye, EyeOff, AlertTriangle,
  ChevronDown, MapPin, Camera,
} from "lucide-react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { NEIGHBOURHOODS, PROVINCE_GROUPS } from "@/lib/neighbourhoods";

// ── Constants ──────────────────────────────────────────────────────────────────

const LANGUAGES = ["English", "French", "Mandarin", "Arabic", "Spanish", "Yoruba", "Hindi", "Portuguese"];

const NAV = [
  { id: "profile", label: "Profile", Icon: User },
  { id: "account", label: "Account", Icon: Shield },
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

function SaveBtn({ saving, label = "Save changes" }) {
  return (
    <button
      type="submit"
      disabled={saving}
      className="px-6 py-2.5 bg-teal-500 text-white rounded-xl font-semibold text-sm hover:bg-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
    >
      {saving ? "Saving…" : label}
    </button>
  );
}

// ── Neighbourhood selector ─────────────────────────────────────────────────────

function NeighbourhoodSelector({ value = {}, onChange }) {
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
          <p className="text-xs text-gray-500 mb-1">Province</p>
          <select
            value={province}
            onChange={e => handleProvince(e.target.value)}
            className={inputCls()}
          >
            <option value="">Select province…</option>
            {PROVINCE_GROUPS.map(p => (
              <option key={p.code} value={p.code}>{p.label}</option>
            ))}
          </select>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">City</p>
          <select
            value={city}
            onChange={e => handleCity(e.target.value)}
            disabled={!province}
            className={`${inputCls()} disabled:opacity-40 disabled:cursor-not-allowed`}
          >
            <option value="">{province ? "Select city…" : "—"}</option>
            {cities.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {city && (
        <div>
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs text-gray-500">
              Neighbourhood <span className="text-gray-400">(optional)</span>
            </p>
            {neighbourhood && (
              <button
                type="button"
                onClick={clearHood}
                className="text-xs text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
              >
                Clear
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
                {neighbourhood || "Search or select a neighbourhood…"}
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
                    placeholder="Type to filter…"
                    className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-teal-500"
                  />
                </div>
                <div className="max-h-48 overflow-y-auto">
                  {filteredHoods.length === 0 ? (
                    <p className="text-center text-xs text-gray-400 py-4">No neighbourhoods found</p>
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
          <MapPin className="w-3 h-3" /> Location pinned to {neighbourhood}
        </p>
      )}
    </div>
  );
}

// ── Profile section ───────────────────────────────────────────────────────────

function ProfileSection({ profile, userId, showToast, onSaved }) {
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
    if (!name.trim()) errs.name = "Name is required.";
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
        if (uploadErr) throw new Error("Photo upload failed: " + uploadErr.message);
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
      showToast("Profile updated successfully");
    } catch (err) {
      showToast(err.message || "Failed to save profile", "error");
    } finally {
      setSaving(false);
    }
  }

  const displayAvatar = avatarPrev || avatarUrl;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">Profile</h2>
        <p className="text-sm text-gray-500">Your public-facing information shown to families.</p>
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
              alt="avatar"
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
            {avatarPrev ? "Change photo" : "Upload photo"}
          </button>
          {avatarPrev && <p className="text-xs text-gray-400 mt-0.5">Preview — save to apply</p>}
          <p className="text-xs text-gray-400 mt-0.5">JPG, PNG or WEBP · max 2 MB</p>
        </div>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Full name" required error={errors.name}>
          <input value={name} onChange={e => setName(e.target.value)} className={inputCls(errors.name)} placeholder="Your name" />
        </Field>
        <Field label="Phone number">
          <input value={phone} onChange={e => setPhone(e.target.value)} className={inputCls()} placeholder="(506) 555-0100" type="tel" />
        </Field>
      </div>

      <Field label="Short bio" hint={`${bio.length}/300`}>
        <textarea
          value={bio}
          onChange={e => e.target.value.length <= 300 && setBio(e.target.value)}
          rows={3}
          placeholder="Tell families about yourself…"
          className={`${inputCls()} resize-none`}
        />
      </Field>

      <Field label="Hourly rate (CAD $)">
        <input
          type="number" min={10} max={200}
          value={hourlyRate}
          onChange={e => setHourlyRate(e.target.value)}
          className={inputCls()}
          placeholder="e.g. 20"
        />
      </Field>

      <Field label="Languages spoken">
        <div className="flex flex-wrap gap-2">
          {LANGUAGES.map(lang => (
            <button
              key={lang} type="button"
              onClick={() => toggleLang(lang)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors cursor-pointer ${languages.includes(lang) ? "bg-teal-500 text-white border-teal-500" : "border-gray-200 text-gray-600 hover:border-teal-400"}`}
            >
              {lang}
            </button>
          ))}
        </div>
      </Field>

      <Field
        label="Your location"
        hint="Select your neighbourhood — this sets your pin on the parent map."
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
    if (newPw !== confirmPw) { setPwMsg({ text: "Passwords do not match.", type: "error" }); return; }
    if (newPw.length < 6)   { setPwMsg({ text: "Password must be at least 6 characters.", type: "error" }); return; }
    setPwSaving(true);
    const { error } = await supabase.auth.updateUser({ password: newPw });
    if (error) {
      setPwMsg({ text: error.message, type: "error" });
    } else {
      setPwMsg({ text: "Password updated successfully.", type: "success" });
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
      showToast("Failed to delete account. Please try again.", "error");
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
        <h2 className="text-xl font-bold text-gray-900 mb-1">Account</h2>
        <p className="text-sm text-gray-500">Manage your credentials and account status.</p>
      </div>

      <div className="bg-gray-50 rounded-2xl border border-gray-100 p-5">
        <p className="text-sm font-semibold text-gray-700 mb-1">Email address</p>
        <p className="text-sm text-gray-500">{userEmail}</p>
        <p className="text-xs text-gray-400 mt-1">Email cannot be changed here. Contact support if needed.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="font-bold text-gray-900 mb-4">Change password</h3>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <PwInput label="New password"         value={newPw}     onChange={setNewPw}     show={showNew}  onToggle={() => setShowNew(v => !v)}  />
          <PwInput label="Confirm new password" value={confirmPw} onChange={setConfirmPw} show={showConf} onToggle={() => setShowConf(v => !v)} />
          {pwMsg && (
            <p className={`text-sm font-medium ${pwMsg.type === "error" ? "text-red-500" : "text-teal-600"}`}>
              {pwMsg.text}
            </p>
          )}
          <div className="flex justify-end">
            <SaveBtn saving={pwSaving} label="Update password" />
          </div>
        </form>
      </div>

      <div className="rounded-2xl border border-red-100 p-6">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          <h3 className="font-bold text-red-600">Danger zone</h3>
        </div>
        <p className="text-sm text-gray-500 mb-4">
          Deleting your account is permanent. All your data and booking history will be removed.
        </p>
        <button
          onClick={() => setShowDel(true)}
          className="px-5 py-2.5 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600 transition-colors cursor-pointer"
        >
          Delete my account
        </button>
      </div>

      {showDel && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
              <h3 className="font-bold text-gray-900">Are you sure?</h3>
            </div>
            <p className="text-sm text-gray-500 mb-4">This cannot be undone. Type <strong>DELETE</strong> to confirm.</p>
            <input
              value={delText} onChange={e => setDelText(e.target.value)}
              placeholder="Type DELETE"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-red-400 mb-4"
            />
            <div className="flex gap-2">
              <button
                onClick={handleDeleteAccount}
                disabled={delText !== "DELETE" || deleting}
                className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {deleting ? "Deleting…" : "Delete account"}
              </button>
              <button
                onClick={() => { setShowDel(false); setDelText(""); }}
                className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────────

export default function SitterSettings() {
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
      <div className="max-w-5xl mx-auto px-4 py-10 flex gap-8 items-start">

        {/* Sidebar */}
        <aside className="w-56 shrink-0 hidden md:block">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden sticky top-24">
            <div className="px-4 py-4 border-b border-gray-100 flex items-center gap-2">
              <Settings className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-bold text-gray-900">Settings</span>
            </div>
            <nav className="p-2">
              {NAV.map(({ id, label, Icon }) => (
                <button
                  key={id}
                  onClick={() => setSection(id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${section === id ? "bg-teal-50 text-teal-700" : "text-gray-600 hover:bg-gray-50"}`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {label}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Mobile nav */}
        <div className="md:hidden w-full mb-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-2 flex gap-1 overflow-x-auto">
            {NAV.map(({ id, label, Icon }) => (
              <button
                key={id}
                onClick={() => setSection(id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${section === id ? "bg-teal-50 text-teal-700" : "text-gray-500 hover:bg-gray-50"}`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
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
