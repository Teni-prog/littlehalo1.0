"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow,
  Circle,
} from "@react-google-maps/api";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { MapPin, Star, DollarSign, Navigation } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { haversineDistance, formatDistance } from "@/lib/distance";
import Sitter from "@/assets/sitter1.png";

const MAP_STYLE = { width: "100%", height: "100%" };
const DEFAULT_CENTER = { lat: 45.9636, lng: -66.6431 };
const RADIUS_OPTIONS = [
  { value: 1000 },
  { value: 3000 },
  { value: 5000 },
  { value: 10000 },
];

const PARENT_ICON_URL =
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="40" viewBox="0 0 32 40">
      <path d="M16 0C9.373 0 4 5.373 4 12c0 9 12 28 12 28S28 21 28 12C28 5.373 22.627 0 16 0z" fill="#ff6b6b" stroke="#fff" stroke-width="2"/>
      <circle cx="16" cy="12" r="5" fill="#fff"/>
    </svg>`
  );

const SITTER_ICON_URL =
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="36" viewBox="0 0 32 40">
      <path d="M16 0C9.373 0 4 5.373 4 12c0 9 12 28 12 28S28 21 28 12C28 5.373 22.627 0 16 0z" fill="#14b8a6" stroke="#fff" stroke-width="2"/>
      <circle cx="16" cy="12" r="5" fill="#fff"/>
    </svg>`
  );

function SittersMap({ sitters, parent, activeId, onPinClick, radiusMeters }) {
  const t = useTranslations("sitters");
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });

  const [map, setMap] = useState(null);

  const parentIcon = isLoaded ? {
    url: PARENT_ICON_URL,
    scaledSize: new window.google.maps.Size(32, 40),
    anchor: new window.google.maps.Point(16, 40),
  } : null;

  const sitterIcon = isLoaded ? {
    url: SITTER_ICON_URL,
    scaledSize: new window.google.maps.Size(28, 36),
    anchor: new window.google.maps.Point(14, 36),
  } : null;

  const parentCenter =
    parent?.latitude && parent?.longitude
      ? { lat: parent.latitude, lng: parent.longitude }
      : DEFAULT_CENTER;

  const onLoad = useCallback(
    (mapInstance) => {
      setMap(mapInstance);
      const bounds = new window.google.maps.LatLngBounds();
      if (parent?.latitude && parent?.longitude)
        bounds.extend({ lat: parent.latitude, lng: parent.longitude });
      sitters.forEach((s) => {
        if (s.latitude && s.longitude)
          bounds.extend({ lat: s.latitude, lng: s.longitude });
      });
      if (!bounds.isEmpty()) mapInstance.fitBounds(bounds, 60);
    },
    [sitters, parent]
  );

  // Recenter + re-zoom when radius changes
  useEffect(() => {
    if (!map || !radiusMeters) return;
    map.panTo(parentCenter);
    // Approximate zoom from radius
    const zoom = Math.round(14 - Math.log2(radiusMeters / 500));
    map.setZoom(Math.max(10, Math.min(zoom, 16)));
  }, [radiusMeters, map]);

  const activePin = sitters.find((s) => s.id === activeId);

  if (!isLoaded)
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-teal-500 rounded-full animate-spin" />
      </div>
    );

  return (
    <GoogleMap
      mapContainerStyle={MAP_STYLE}
      center={parentCenter}
      zoom={12}
      onLoad={onLoad}
      onUnmount={() => setMap(null)}
      options={{
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: true,
        styles: [
          { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
        ],
      }}
    >
      {/* Radius circle */}
      {radiusMeters && (parent?.latitude || parentCenter) && (
        <Circle
          center={parentCenter}
          radius={radiusMeters}
          options={{
            fillColor: "#ff6b6b",
            fillOpacity: 0.08,
            strokeColor: "#ff6b6b",
            strokeOpacity: 0.6,
            strokeWeight: 1.5,
          }}
        />
      )}

      {/* Parent pin */}
      {parent?.latitude && parent?.longitude && (
        <Marker
          position={{ lat: parent.latitude, lng: parent.longitude }}
          icon={parentIcon}
          title={t("yourLocationTitle")}
          zIndex={10}
        />
      )}

      {/* Sitter pins */}
      {sitters.map((s) => {
        if (!s.latitude || !s.longitude) return null;
        return (
          <Marker
            key={s.id}
            position={{ lat: s.latitude, lng: s.longitude }}
            icon={sitterIcon}
            title={s.name}
            onClick={() => onPinClick(s.id)}
          />
        );
      })}

      {/* Info window */}
      {activePin?.latitude && activePin?.longitude && (
        <InfoWindow
          position={{ lat: activePin.latitude, lng: activePin.longitude }}
          onCloseClick={() => onPinClick(null)}
        >
          <div className="min-w-[160px] font-sans">
            <p className="font-bold text-gray-900 text-sm mb-1">{activePin.name}</p>
            <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
              <span className="flex items-center gap-0.5">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                {activePin.rating ?? "—"}
              </span>
              <span className="flex items-center gap-0.5">
                <DollarSign className="w-3 h-3 text-gray-400" />
                {t("hourlyRate", { rate: activePin.hourly_rate })}
              </span>
            </div>
            {activePin.distanceKm != null && (
              <p className="text-xs text-teal-600 mb-2">
                {formatDistance(activePin.distanceKm)}
              </p>
            )}
            <Link
              href={`/profile/Sitter/${activePin.id}`}
              className="block text-center text-xs font-semibold bg-[#ff6b6b] text-white px-3 py-1.5 rounded-lg hover:bg-[#ff5252] transition-colors"
            >
              {t("viewProfile")}
            </Link>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
}

export default function SittersPage() {
  const t = useTranslations("sitters");
  const [allSitters, setAllSitters] = useState([]);
  const [parent, setParent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState(null);
  const [radiusMeters, setRadiusMeters] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        // Fetch parent profile for location
        if (user) {
          const { data: profile } = await supabase
            .from("users")
            .select("id, name, latitude, longitude, neighbourhood")
            .eq("id", user.id)
            .single();
          if (profile) setParent(profile);
        }

        // Fetch all sitters
        const res = await fetch("/api/sitters");
        const result = await res.json();
        if (res.ok) setAllSitters(result.data || []);
      } catch {}
      setLoading(false);
    }
    load();
  }, []);

  // Attach distance and filter by radius
  const sittersWithDistance = useMemo(() => {
    return allSitters.map((s) => {
      const distanceKm =
        parent?.latitude && parent?.longitude && s.latitude && s.longitude
          ? haversineDistance(parent.latitude, parent.longitude, s.latitude, s.longitude)
          : null;
      return { ...s, distanceKm };
    });
  }, [allSitters, parent]);

  const filteredSitters = useMemo(() => {
    let list = sittersWithDistance;
    if (radiusMeters && parent?.latitude) {
      list = list.filter(
        (s) => s.distanceKm != null && s.distanceKm <= radiusMeters / 1000
      );
    }
    return [...list].sort((a, b) => {
      if (a.distanceKm == null && b.distanceKm == null) return 0;
      if (a.distanceKm == null) return 1;
      if (b.distanceKm == null) return -1;
      return a.distanceKm - b.distanceKm;
    });
  }, [sittersWithDistance, radiusMeters, parent]);

  if (loading)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-[#ff6b6b] rounded-full animate-spin" />
      </div>
    );

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-100">
      {/* Header bar */}
      <div className="bg-white border-b px-4 py-4 shrink-0">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{t("header.title")}</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {radiusMeters
                ? t("resultsFoundWithinRadius", {
                    count: filteredSitters.length,
                    km: radiusMeters / 1000,
                  })
                : t("resultsFound", { count: filteredSitters.length })}
            </p>
          </div>

          {/* Radius filter */}
          <div className="flex items-center gap-2">
            <Navigation className="w-4 h-4 text-gray-400 shrink-0" />
            <span className="text-sm text-gray-600 font-medium whitespace-nowrap">{t("radiusLabel")}</span>
            <div className="flex gap-1.5">
              {RADIUS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() =>
                    setRadiusMeters((prev) =>
                      prev === opt.value ? null : opt.value
                    )
                  }
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    radiusMeters === opt.value
                      ? "bg-[#ff6b6b] text-white border-[#ff6b6b]"
                      : "bg-white text-gray-600 border-gray-200 hover:border-[#ff6b6b]"
                  }`}
                >
                  {t("radiusKmOption", { km: opt.value / 1000 })}
                </button>
              ))}
              {radiusMeters && (
                <button
                  onClick={() => setRadiusMeters(null)}
                  className="px-3 py-1.5 rounded-lg text-xs text-gray-400 border border-gray-200 hover:text-[#ff6b6b] transition-colors"
                >
                  {t("clearRadius")}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Two-column body */}
      <div className="flex flex-1 overflow-hidden max-w-7xl mx-auto w-full">
        {/* Map — left */}
        <div className="hidden md:block w-1/2 lg:w-3/5 relative">
          <SittersMap
            sitters={filteredSitters}
            parent={parent}
            activeId={activeId}
            onPinClick={setActiveId}
            radiusMeters={radiusMeters}
          />
          {!parent?.latitude && (
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-600 shadow-sm max-w-xs">
              <MapPin className="w-4 h-4 text-[#ff6b6b] inline mr-1" />
              {t("setNeighbourhoodPrompt")}
            </div>
          )}
        </div>

        {/* Sitter card list — right */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {filteredSitters.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center shadow-sm mt-4">
              <p className="text-gray-500">{t("emptyState.title")}</p>
              <button
                onClick={() => setRadiusMeters(null)}
                className="mt-3 text-sm text-[#ff6b6b] hover:underline"
              >
                {t("emptyState.clearRadius")}
              </button>
            </div>
          ) : (
            filteredSitters.map((sitter) => (
              <SitterRow
                key={sitter.id}
                sitter={sitter}
                isActive={activeId === sitter.id}
                onClick={() =>
                  setActiveId((prev) => (prev === sitter.id ? null : sitter.id))
                }
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function SitterRow({ sitter, isActive, onClick }) {
  const t = useTranslations("sitters");
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl p-4 shadow-sm border cursor-pointer transition-all ${
        isActive ? "border-[#ff6b6b] ring-2 ring-[#ff6b6b]/20" : "border-gray-100 hover:border-gray-300"
      }`}
    >
      <div className="flex gap-4">
        {/* Photo */}
        <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0">
          <Image
            src={sitter.image || Sitter}
            alt={sitter.name}
            fill
            className="object-cover"
            unoptimized={!!sitter.image}
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-bold text-gray-900 text-sm leading-tight">{sitter.name}</p>
              <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {sitter.neighbourhood || sitter.location || t("locationNotSet")}
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="font-bold text-[#ff6b6b] text-sm">{t("hourlyRate", { rate: sitter.hourly_rate })}</p>
              <div className="flex items-center gap-0.5 justify-end mt-0.5">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs text-gray-600">{sitter.rating ?? "—"}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-teal-600 font-medium">
              {sitter.distanceKm != null
                ? formatDistance(sitter.distanceKm)
                : t("distanceUnavailable")}
            </span>
            <Link
              href={`/profile/Sitter/${sitter.id}`}
              onClick={(e) => e.stopPropagation()}
              className="text-xs font-semibold text-white bg-[#ff6b6b] px-3 py-1 rounded-lg hover:bg-[#ff5252] transition-colors"
            >
              {t("viewProfile")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
