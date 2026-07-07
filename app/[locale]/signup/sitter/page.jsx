"use client";

import { useState, useRef } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useRouter } from "@/i18n/navigation";
import { completeSitterSignup } from "@/app/[locale]/actions/auth";
import {
  User, Mail, Lock, Phone, Camera, Globe, FileText,
  Briefcase, DollarSign, ChevronRight, ChevronLeft, Check, MapPin,
} from "lucide-react";
import { NEIGHBOURHOODS, NEIGHBOURHOOD_COORDS, PROVINCE_GROUPS } from "@/lib/neighbourhoods";


// ─── Constants ─────────────────────────────────────────────────────────────────

const LANGUAGES = ["English", "French", "Mandarin", "Arabic", "Spanish", "Yoruba", "Hindi", "Portuguese"];

const COUNTRIES = [
  "Afghanistan","Albania","Algeria","Angola","Argentina","Australia","Austria",
  "Bangladesh","Belgium","Bolivia","Brazil","Cambodia","Cameroon","Canada",
  "Chile","China","Colombia","Congo","Cuba","Czech Republic","Denmark",
  "Ecuador","Egypt","Ethiopia","Finland","France","Germany","Ghana","Greece",
  "Guatemala","Haiti","Honduras","Hungary","India","Indonesia","Iran","Iraq",
  "Ireland","Israel","Italy","Jamaica","Japan","Jordan","Kenya","Lebanon",
  "Libya","Malaysia","Mexico","Morocco","Mozambique","Myanmar","Nepal",
  "Netherlands","New Zealand","Nicaragua","Nigeria","Norway","Pakistan",
  "Panama","Paraguay","Peru","Philippines","Poland","Portugal","Romania",
  "Russia","Rwanda","Saudi Arabia","Senegal","Sierra Leone","Somalia",
  "South Africa","South Korea","Spain","Sri Lanka","Sudan","Sweden",
  "Switzerland","Syria","Taiwan","Tanzania","Thailand","Trinidad and Tobago",
  "Tunisia","Turkey","Uganda","Ukraine","United Arab Emirates",
  "United Kingdom","United States","Uruguay","Venezuela","Vietnam",
  "Yemen","Zimbabwe",
].sort();

const AGE_GROUPS      = ["0–2 years", "2–5 years", "5–8 years", "8–12 years"];
const SPECIAL_NEEDS   = ["Autism-friendly", "ADHD experience", "Developmental delays", "None"];
const CERTIFICATIONS  = ["First Aid", "CPR", "Early Childhood Education", "None"];
const DAYS            = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
const TIME_SLOTS      = ["Morning","Afternoon","Evening"];

// ─── Progress bar ──────────────────────────────────────────────────────────────

function ProgressBar({ current }) {
  const t = useTranslations("signupSitter");
  const STEP_LABELS = [t("progress.account"), t("progress.personal"), t("progress.credentials")];
  return (
    <div className="flex items-center justify-center mb-10">
      {STEP_LABELS.map((label, i) => {
        const n = i + 1;
        const done   = n < current;
        const active = n === current;
        return (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all ${
                done   ? "bg-teal-500 border-teal-500 text-white" :
                active ? "bg-white border-teal-500 text-teal-600" :
                         "bg-white border-gray-200 text-gray-400"
              }`}>
                {done ? <Check className="w-4 h-4" /> : n}
              </div>
              <span className={`text-xs mt-1.5 font-medium ${
                active ? "text-teal-600" : done ? "text-teal-400" : "text-gray-400"
              }`}>{label}</span>
            </div>
            {i < STEP_LABELS.length - 1 && (
              <div className={`w-14 h-0.5 mx-1 mb-5 transition-all ${done ? "bg-teal-500" : "bg-gray-200"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Shared input wrapper ──────────────────────────────────────────────────────

function Field({ label, error, required, children }) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700 mb-1.5 block">
        {label}{required && " *"}
      </label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

function TextInput({ icon: Icon, error, ...props }) {
  return (
    <div className="relative">
      {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />}
      <input
        {...props}
        className={`w-full ${Icon ? "pl-11" : "px-4"} pr-4 py-3 bg-gray-50 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-500/20 transition-all ${
          error ? "border-red-400" : "border-gray-200 focus:border-teal-500"
        }`}
      />
    </div>
  );
}

// ─── Tag multi-select ──────────────────────────────────────────────────────────

function TagSelect({ options, selected, onChange, exclusive = [] }) {
  function toggle(opt) {
    if (exclusive.includes(opt)) {
      onChange(selected.includes(opt) ? [] : [opt]);
    } else {
      const without = selected.filter(s => !exclusive.includes(s));
      onChange(
        without.includes(opt) ? without.filter(s => s !== opt) : [...without, opt]
      );
    }
  }
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(opt => (
        <button
          key={opt} type="button" onClick={() => toggle(opt)}
          className={`px-3 py-2 rounded-xl text-sm font-medium border transition-all cursor-pointer ${
            selected.includes(opt)
              ? "bg-teal-500 text-white border-teal-500"
              : "bg-white text-gray-600 border-gray-200 hover:border-teal-400"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

// ─── Searchable single-select dropdown ────────────────────────────────────────

function SearchableDropdown({ options, value, onChange, placeholder, error }) {
  const [query, setQuery]   = useState("");
  const [open, setOpen]     = useState(false);
  const filtered = options.filter(o => o.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="relative">
      <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      <input
        type="text"
        value={value || query}
        placeholder={placeholder}
        onFocus={() => { setOpen(true); if (value) setQuery(""); }}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        onChange={e => { setQuery(e.target.value); onChange(""); setOpen(true); }}
        className={`w-full pl-11 pr-4 py-3 bg-gray-50 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-500/20 transition-all ${
          error ? "border-red-400" : "border-gray-200 focus:border-teal-500"
        }`}
      />
      {open && filtered.length > 0 && (
        <ul className="absolute z-20 w-full bg-white border border-gray-200 rounded-xl mt-1 max-h-48 overflow-y-auto shadow-lg">
          {filtered.map(opt => (
            <li
              key={opt}
              onMouseDown={() => { onChange(opt); setQuery(""); setOpen(false); }}
              className="px-4 py-2.5 text-sm hover:bg-teal-50 cursor-pointer"
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ─── Language multi-select with search ────────────────────────────────────────

function LanguageSelect({ selected, onChange, error }) {
  const t = useTranslations("signupSitter");
  const [query, setQuery] = useState("");
  const [open, setOpen]   = useState(false);
  const filtered = LANGUAGES.filter(
    l => l.toLowerCase().includes(query.toLowerCase()) && !selected.includes(l)
  );

  return (
    <div>
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {selected.map(lang => (
            <span key={lang} className="flex items-center gap-1 bg-teal-500 text-white text-sm px-3 py-1.5 rounded-full">
              {lang}
              <button type="button" onClick={() => onChange(selected.filter(l => l !== lang))}
                className="ml-1 hover:opacity-70 leading-none cursor-pointer">×</button>
            </span>
          ))}
        </div>
      )}
      <div className="relative">
        <input
          type="text" value={query}
          placeholder={t("steps.personal.languagesPlaceholder")}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          onChange={e => { setQuery(e.target.value); setOpen(true); }}
          className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-500/20 transition-all ${
            error ? "border-red-400" : "border-gray-200 focus:border-teal-500"
          }`}
        />
        {open && filtered.length > 0 && (
          <ul className="absolute z-20 w-full bg-white border border-gray-200 rounded-xl mt-1 max-h-40 overflow-y-auto shadow-lg">
            {filtered.map(lang => (
              <li
                key={lang}
                onMouseDown={() => { onChange([...selected, lang]); setQuery(""); }}
                className="px-4 py-2.5 text-sm hover:bg-teal-50 cursor-pointer"
              >
                {lang}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

// ─── Step 1 — Basic Account ───────────────────────────────────────────────────

function Step1({ data, update, errors }) {
  const t = useTranslations("signupSitter");
  return (
    <div className="space-y-4">
      <Field label={t("steps.account.nameLabel")} error={errors.name} required>
        <TextInput icon={User} value={data.name} error={errors.name}
          onChange={e => update("name", e.target.value)} placeholder={t("steps.account.namePlaceholder")} />
      </Field>
      <Field label={t("steps.account.emailLabel")} error={errors.email} required>
        <TextInput icon={Mail} type="email" value={data.email} error={errors.email}
          onChange={e => update("email", e.target.value)} placeholder={t("steps.account.emailPlaceholder")} />
      </Field>
      <Field label={t("steps.account.passwordLabel")} error={errors.password} required>
        <TextInput icon={Lock} type="password" value={data.password} error={errors.password}
          onChange={e => update("password", e.target.value)} placeholder={t("steps.account.passwordPlaceholder")} />
      </Field>
    </div>
  );
}

// ─── Step 2 — Personal Info ───────────────────────────────────────────────────

function Step2({ data, update, errors }) {
  const t = useTranslations("signupSitter");
  const fileRef = useRef(null);

  function handlePhoto(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    update("photoPreview", URL.createObjectURL(file));
    update("photoFile", file);
  }

  function handleNeighbourhood(name) {
    const coords = NEIGHBOURHOOD_COORDS[name];
    update("neighbourhood", name);
    update("latitude",  coords?.lat ?? null);
    update("longitude", coords?.lng ?? null);
  }

  return (
    <div className="space-y-5">
      {/* Photo */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">{t("steps.personal.photoLabel")}</label>
        <div className="flex items-center gap-4">
          <div
            onClick={() => fileRef.current?.click()}
            className="w-20 h-20 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 hover:border-teal-400 flex items-center justify-center cursor-pointer overflow-hidden transition-all shrink-0"
          >
            {data.photoPreview
              ? <img src={data.photoPreview} alt={t("steps.personal.photoPreviewAlt")} className="w-full h-full object-cover" />
              : <Camera className="w-7 h-7 text-gray-400" />}
          </div>
          <div>
            <button type="button" onClick={() => fileRef.current?.click()}
              className="text-sm text-teal-600 font-semibold hover:underline cursor-pointer">
              {t("steps.personal.choosePhoto")}
            </button>
            <p className="text-xs text-gray-400 mt-1">{t("steps.personal.photoHint")}</p>
          </div>
          <input ref={fileRef} type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
        </div>
      </div>

      <Field label={t("steps.personal.phoneLabel")} error={errors.phone} required>
        <TextInput icon={Phone} type="tel" value={data.phone} error={errors.phone}
          onChange={e => update("phone", e.target.value)} placeholder={t("steps.personal.phonePlaceholder")} />
      </Field>

      <Field label={t("steps.personal.areaLabel")} error={errors.neighbourhood} required>
        <div className="relative">
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none z-10" />
          <select
            value={data.neighbourhood}
            onChange={e => handleNeighbourhood(e.target.value)}
            className={`w-full pl-11 pr-4 py-3 bg-gray-50 border rounded-xl text-sm outline-none appearance-none focus:ring-2 focus:ring-teal-500/20 transition-all ${
              errors.neighbourhood ? "border-red-400" : "border-gray-200 focus:border-teal-500"
            }`}
          >
            <option value="">{t("steps.personal.areaPlaceholder")}</option>
            {PROVINCE_GROUPS.map(({ label, code }) => (
              <optgroup key={code} label={label}>
                {NEIGHBOURHOODS.filter(n => n.province === code).map(n => (
                  <option key={n.name} value={n.name}>{n.name}</option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
        {data.neighbourhood && (
          <p className="text-xs text-teal-600 mt-1 flex items-center gap-1">
            <MapPin className="w-3 h-3" /> {t("steps.personal.areaSet", { neighbourhood: data.neighbourhood })}
          </p>
        )}
      </Field>

      <Field label={t("steps.personal.languagesLabel")} error={errors.languages} required>
        <LanguageSelect selected={data.languages} onChange={v => update("languages", v)} error={errors.languages} />
      </Field>

      <Field label={t("steps.personal.countryLabel")} error={errors.country} required>
        <SearchableDropdown
          options={COUNTRIES} value={data.country} error={errors.country}
          onChange={v => update("country", v)} placeholder={t("steps.personal.countryPlaceholder")} />
      </Field>

      <Field label={t("steps.personal.bioLabel")}>
        <div className="relative">
          <FileText className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
          <textarea
            value={data.bio}
            onChange={e => update("bio", e.target.value.slice(0, 300))}
            placeholder={t("steps.personal.bioPlaceholder")}
            rows={4}
            className="w-full pl-11 pr-16 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all resize-none"
          />
          <span className="absolute bottom-3 right-3 text-xs text-gray-400">{data.bio.length}/300</span>
        </div>
      </Field>
    </div>
  );
}

// ─── Step 3 — Caregiver Credentials ──────────────────────────────────────────

function Step3({ data, update, errors }) {
  const t = useTranslations("signupSitter");
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Field label={t("steps.credentials.experienceLabel")} error={errors.experience} required>
          <TextInput icon={Briefcase} type="number" value={data.experience} error={errors.experience}
            onChange={e => update("experience", e.target.value)}
            placeholder={t("steps.credentials.experiencePlaceholder")} min={0} max={50} />
        </Field>
        <Field label={t("steps.credentials.hourlyRateLabel")} error={errors.hourlyRate} required>
          <TextInput icon={DollarSign} type="number" value={data.hourlyRate} error={errors.hourlyRate}
            onChange={e => update("hourlyRate", e.target.value)}
            placeholder={t("steps.credentials.hourlyRatePlaceholder")} min={10} max={200} />
        </Field>
      </div>

      <Field label={t("steps.credentials.ageGroupsLabel")} error={errors.ageGroups} required>
        <TagSelect options={AGE_GROUPS} selected={data.ageGroups}
          onChange={v => update("ageGroups", v)} />
      </Field>

      <Field label={t("steps.credentials.specialNeedsLabel")}>
        <TagSelect options={SPECIAL_NEEDS} selected={data.specialNeeds}
          onChange={v => update("specialNeeds", v)} exclusive={["None"]} />
      </Field>

      <Field label={t("steps.credentials.certificationsLabel")}>
        <TagSelect options={CERTIFICATIONS} selected={data.certifications}
          onChange={v => update("certifications", v)} exclusive={["None"]} />
      </Field>
    </div>
  );
}

// ─── Step 4 — Availability ────────────────────────────────────────────────────


// ─── Main page ─────────────────────────────────────────────────────────────────

export default function SitterSignupPage() {
  const t = useTranslations("signupSitter");
  const router = useRouter();
  const [step, setStep]           = useState(1);
  const [errors, setErrors]       = useState({});
  const [loading, setLoading]     = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const [data, setData] = useState({
    // Step 1
    name: "", email: "", password: "",
    // Step 2
    phone: "", languages: [], country: "", bio: "",
    neighbourhood: "", latitude: null, longitude: null,
    photoPreview: null, photoFile: null,
    // Step 3
    experience: "", ageGroups: [], specialNeeds: [], certifications: [], hourlyRate: "",
  });

  function update(key, value) {
    setData(prev => ({ ...prev, [key]: value }));
    setErrors(prev => ({ ...prev, [key]: undefined }));
  }

  // ── Validation ────────────────────────────────────────────────────────────────

  function validate1() {
    const e = {};
    if (!data.name.trim())    e.name     = t("errors.nameRequired");
    if (!data.email.trim())   e.email    = t("errors.emailRequired");
    else if (!/\S+@\S+\.\S+/.test(data.email)) e.email = t("errors.emailInvalid");
    if (!data.password)       e.password = t("errors.passwordRequired");
    else if (data.password.length < 6) e.password = t("errors.passwordTooShort");
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function validate2() {
    const e = {};
    if (!data.phone.trim())        e.phone        = t("errors.phoneRequired");
    if (!data.neighbourhood)       e.neighbourhood = t("errors.neighbourhoodRequired");
    if (data.languages.length < 1) e.languages    = t("errors.languagesRequired");
    if (!data.country)             e.country      = t("errors.countryRequired");
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function validate3() {
    const e = {};
    if (data.experience === "")  e.experience = t("errors.experienceRequired");
    if (data.ageGroups.length < 1) e.ageGroups = t("errors.ageGroupsRequired");
    if (!data.hourlyRate)        e.hourlyRate = t("errors.hourlyRateRequired");
    setErrors(e);
    return Object.keys(e).length === 0;
  }


  // ── Step 1: create auth user, then advance ────────────────────────────────────

  function handleStep1() {
    if (validate1()) { setStep(2); setErrors({}); }
  }

  function handleNext() {
    if (step === 2 && validate2()) { setStep(3); setErrors({}); }
    if (step === 3 && validate3()) { handleSubmit(); }
  }

  // ── Final submit ──────────────────────────────────────────────────────────────

  async function handleSubmit() {
    setLoading(true);
    setSubmitError(null);
    try {
      const fd = new FormData();
      fd.append("email",        data.email);
      fd.append("password",     data.password);
      fd.append("name",         data.name);
      fd.append("phone",        data.phone);
      fd.append("bio",          data.bio);
      fd.append("country",      data.country);
      fd.append("neighbourhood", data.neighbourhood);
      if (data.latitude  != null) fd.append("latitude",  data.latitude.toString());
      if (data.longitude != null) fd.append("longitude", data.longitude.toString());
      fd.append("experience",   data.experience.toString());
      fd.append("hourly_rate",  data.hourlyRate.toString());
      if (data.photoFile) fd.append("photo", data.photoFile);
      data.languages.forEach(l     => fd.append("languages",     l));
      data.ageGroups.forEach(a     => fd.append("age_groups",    a));
      data.specialNeeds.forEach(s  => fd.append("special_needs", s));
      data.certifications.forEach(c => fd.append("certifications", c));

      const result = await completeSitterSignup(null, fd);
      if (result?.error) {
        const targetStep = result.step ?? 4;
        if (targetStep === 1) {
          const msg = result.error.toLowerCase();
          setErrors(msg.includes("password") ? { password: result.error } : { email: result.error });
          setStep(1);
        } else {
          setSubmitError(result.error);
        }
        return;
      }
      router.push("/profile/Sitter");
      router.refresh();
    } catch (e) {
      setSubmitError(e?.message || t("errors.genericSubmit"));
    } finally {
      setLoading(false);
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────────

  const stepTitles = [
    t("stepTitles.account"),
    t("stepTitles.personal"),
    t("stepTitles.credentials"),
    t("stepTitles.availability"),
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/signup"
          className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 transition-colors mb-6"
        >
          <ChevronLeft className="w-4 h-4" /> {t("common.back")}
        </Link>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md shadow-teal-100">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">{t("header.title")}</h1>
          <p className="text-gray-500 mt-2">
            {t("header.subtitle")}
          </p>
        </div>

        <ProgressBar current={step} />

        {submitError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
            {submitError}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <h2 className="text-lg font-bold text-gray-900 mb-6 pb-3 border-b border-gray-100">
            {t("stepIndicator", { step, title: stepTitles[step - 1] })}
          </h2>

          {step === 1 && <Step1 data={data} update={update} errors={errors} />}
          {step === 2 && <Step2 data={data} update={update} errors={errors} />}
          {step === 3 && <Step3 data={data} update={update} errors={errors} />}

          <div className="flex gap-3 mt-8">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(s => s - 1)}
                className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" /> {t("common.back")}
              </button>
            )}

            {step === 1 && (
              <button
                type="button" onClick={handleStep1}
                className="flex-1 py-3 bg-teal-500 text-white rounded-xl font-bold hover:bg-teal-600 transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                {t("common.continue")} <ChevronRight className="w-4 h-4" />
              </button>
            )}

            {step === 2 && (
              <button
                type="button" onClick={handleNext}
                className="flex-1 py-3 bg-teal-500 text-white rounded-xl font-bold hover:bg-teal-600 transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                {t("common.continue")} <ChevronRight className="w-4 h-4" />
              </button>
            )}

            {step === 3 && (
              <button
                type="button" onClick={handleSubmit} disabled={loading}
                className="flex-1 py-3 bg-teal-500 text-white rounded-xl font-bold hover:bg-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
              >
                {loading ? t("buttons.savingProfile") : t("buttons.completeProfile")} <Check className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <p className="text-center text-gray-500 text-sm mt-6 pb-8">
          {t("footer.haveAccount")}{" "}
          <Link href="/signin/sitter" className="text-teal-500 font-bold hover:underline">
            {t("footer.signIn")}
          </Link>
        </p>
      </div>
    </div>
  );
}
