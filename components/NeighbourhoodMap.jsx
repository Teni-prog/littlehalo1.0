"use client";

import { useJsApiLoader, GoogleMap, Marker } from "@react-google-maps/api";
import { useTranslations } from "next-intl";

const MAP_CONTAINER_STYLE = { width: "100%", height: "200px" };

const SITTER_ICON_URL =
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="36" viewBox="0 0 32 40">
      <path d="M16 0C9.373 0 4 5.373 4 12c0 9 12 28 12 28S28 21 28 12C28 5.373 22.627 0 16 0z" fill="#14b8a6" stroke="#fff" stroke-width="2"/>
      <circle cx="16" cy="12" r="5" fill="#fff"/>
    </svg>`
  );

export default function NeighbourhoodMap({ latitude, longitude, neighbourhood }) {
  const t = useTranslations("neighbourhoodMap");
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });

  if (!latitude || !longitude) return null;

  const center = { lat: latitude, lng: longitude };

  if (loadError)
    return (
      <div className="h-50 bg-gray-100 rounded-xl flex items-center justify-center text-sm text-gray-500">
        {t("mapUnavailable")}
      </div>
    );

  if (!isLoaded)
    return (
      <div className="h-50 bg-gray-100 rounded-xl flex items-center justify-center">
        <div className="w-6 h-6 border-4 border-gray-200 border-t-teal-500 rounded-full animate-spin" />
      </div>
    );

  const sitterIcon = {
    url: SITTER_ICON_URL,
    scaledSize: new window.google.maps.Size(28, 36),
    anchor: new window.google.maps.Point(14, 36),
  };

  return (
    <div className="rounded-xl overflow-hidden border border-gray-100">
      <GoogleMap
        mapContainerStyle={MAP_CONTAINER_STYLE}
        center={center}
        zoom={14}
        options={{
          disableDefaultUI: true,
          zoomControl: false,
          scrollwheel: false,
          draggable: false,
          styles: [
            { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
          ],
        }}
      >
        <Marker position={center} icon={sitterIcon} title={neighbourhood || t("defaultLocation")} />
      </GoogleMap>
      {neighbourhood && (
        <div className="bg-gray-50 px-3 py-2 text-xs text-gray-500 flex items-center gap-1 border-t border-gray-100">
          <span className="inline-block w-2 h-2 rounded-full bg-teal-500 mr-1" />
          {t("areaLabel", { neighbourhood })}
        </div>
      )}
    </div>
  );
}
