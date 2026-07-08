"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow,
  Circle,
} from "@react-google-maps/api";
import { Link } from "@/i18n/navigation";
import { Star, DollarSign } from "lucide-react";

const MAP_CONTAINER_STYLE = { width: "100%", height: "100%" };
const DEFAULT_CENTER      = { lat: 45.9636, lng: -66.6431 }; // Downtown Fredericton
const DEFAULT_ZOOM        = 13;

const PARENT_ICON_URL =
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="32" height="40" viewBox="0 0 32 40">
    <path d="M16 0C9.373 0 4 5.373 4 12c0 9 12 28 12 28S28 21 28 12C28 5.373 22.627 0 16 0z" fill="#ff6b6b" stroke="#fff" stroke-width="2"/>
    <circle cx="16" cy="12" r="5" fill="#fff"/>
  </svg>`);

const SITTER_ICON_URL =
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="28" height="36" viewBox="0 0 32 40">
    <path d="M16 0C9.373 0 4 5.373 4 12c0 9 12 28 12 28S28 21 28 12C28 5.373 22.627 0 16 0z" fill="#14b8a6" stroke="#fff" stroke-width="2"/>
    <circle cx="16" cy="12" r="5" fill="#fff"/>
  </svg>`);

const CIRCLE_OPTIONS = {
  strokeColor:   "#ff6b6b",
  strokeOpacity: 0.5,
  strokeWeight:  2,
  fillColor:     "#ff6b6b",
  fillOpacity:   0.07,
};

// sitters    — array of sitter objects with latitude/longitude
// parent     — parent object with latitude/longitude/name
// radiusKm   — selected radius in km (null = no filter / no circle)
export default function SitterMapPanel({ sitters = [], parent = null, radiusKm = null }) {
  const t = useTranslations("sitterMapPanel");
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });

  const [activeId, setActiveId] = useState(null);

  const center =
    parent?.latitude && parent?.longitude
      ? { lat: parent.latitude, lng: parent.longitude }
      : DEFAULT_CENTER;

  const activePin = sitters.find((s) => s.id === activeId);

  const parentIcon = useMemo(() => isLoaded ? {
    url: PARENT_ICON_URL,
    scaledSize: new window.google.maps.Size(32, 40),
    anchor: new window.google.maps.Point(16, 40),
  } : null, [isLoaded]);

  const sitterIcon = useMemo(() => isLoaded ? {
    url: SITTER_ICON_URL,
    scaledSize: new window.google.maps.Size(28, 36),
    anchor: new window.google.maps.Point(14, 36),
  } : null, [isLoaded]);

  if (loadError) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50 rounded-2xl text-sm text-gray-500">
        {t("mapUnavailable")}
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50 rounded-2xl">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-teal-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={MAP_CONTAINER_STYLE}
      center={center}
      zoom={DEFAULT_ZOOM}
      options={{
        disableDefaultUI:  false,
        zoomControl:       true,
        streetViewControl: false,
        mapTypeControl:    false,
        fullscreenControl: true,
        styles: [
          { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
        ],
      }}
    >
      {/* Radius circle centered on parent */}
      {radiusKm && parent?.latitude && parent?.longitude && (
        <Circle
          center={{ lat: parent.latitude, lng: parent.longitude }}
          radius={radiusKm * 1000}
          options={CIRCLE_OPTIONS}
        />
      )}

      {/* Parent pin */}
      {parent?.latitude && parent?.longitude && (
        <Marker
          position={{ lat: parent.latitude, lng: parent.longitude }}
          icon={parentIcon}
          title={t("parentPinTitle", { name: parent.name || t("yourLocation") })}
          zIndex={10}
        />
      )}

      {/* Sitter pins */}
      {sitters.map((sitter) => {
        if (!sitter.latitude || !sitter.longitude) return null;
        return (
          <Marker
            key={sitter.id}
            position={{ lat: sitter.latitude, lng: sitter.longitude }}
            icon={sitterIcon}
            title={sitter.name}
            onClick={() => setActiveId(sitter.id)}
          />
        );
      })}

      {/* Info window for selected sitter */}
      {activePin?.latitude && activePin?.longitude && (
        <InfoWindow
          position={{ lat: activePin.latitude, lng: activePin.longitude }}
          onCloseClick={() => setActiveId(null)}
        >
          <div className="min-w-[160px] font-sans">
            <p className="font-bold text-gray-900 text-sm mb-1">{activePin.name}</p>
            <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
              <span className="flex items-center gap-0.5">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                {activePin.rating ?? "—"}
              </span>
              <span className="flex items-center gap-0.5">
                <DollarSign className="w-3 h-3 text-gray-400" />
                {t("hourlyRate", { rate: activePin.hourly_rate })}
              </span>
            </div>
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
