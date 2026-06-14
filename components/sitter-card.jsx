"use client";

import { useState } from "react";
import { Star, MapPin, BadgeCheck, Clock, Calendar } from "lucide-react";
import Image from "next/image";
import Sitter from "@/assets/sitter1.png";
import Link from "next/link";
import { haversineDistance, formatDistance } from "@/lib/distance";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function SitterCard({ sitter, parentLocation = null }) {
  const [imgSrc, setImgSrc] = useState(sitter.image || null);

  const distanceKm =
    parentLocation?.latitude &&
    parentLocation?.longitude &&
    sitter.latitude &&
    sitter.longitude
      ? haversineDistance(
          parentLocation.latitude,
          parentLocation.longitude,
          sitter.latitude,
          sitter.longitude,
        )
      : null;

  const hasAvailability = DAYS.some((d) => sitter.availability?.[d]);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex gap-5 p-5">
        {/* Photo */}
        <div className="relative w-32 h-32 shrink-0 rounded-xl overflow-hidden bg-gray-100">
          <Image
            src={imgSrc || Sitter}
            alt={sitter.name}
            fill
            className="object-cover"
            unoptimized={!!imgSrc}
            onError={() => setImgSrc(null)}
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              {/* Name + verified */}
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h3 className="text-xl font-bold text-gray-900">
                  {sitter.name}
                </h3>
                {sitter.is_verified && (
                  <span className="flex items-center gap-1 text-xs font-semibold text-teal-600 bg-teal-50 border border-teal-100 px-2 py-0.5 rounded-full whitespace-nowrap">
                    <BadgeCheck className="w-3.5 h-3.5" /> Verified
                  </span>
                )}
              </div>

              {/* Rating + distance */}
              <div className="flex items-center gap-3 text-sm mb-1 flex-wrap">
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold text-gray-900">
                    {sitter.rating}
                  </span>
                  <span className="text-gray-400">
                    ({sitter.reviews} reviews)
                  </span>
                </span>
                <span className="flex items-center gap-1 text-gray-500 text-xs">
                  <MapPin className="w-3.5 h-3.5" />
                  {distanceKm != null
                    ? formatDistance(distanceKm)
                    : sitter.neighbourhood ||
                      sitter.location ||
                      "Atlantic Canada"}
                </span>
              </div>

              {/* Response time — only shown if sitter has the field */}
              {sitter.response_time && (
                <div className="flex items-center gap-1 text-xs text-gray-400 mb-3">
                  <Clock className="w-3.5 h-3.5" />
                  Responds &lt; {sitter.response_time}
                </div>
              )}

              {/* Experience + special needs tags */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {sitter.experience > 0 && (
                  <span className="text-xs font-semibold bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full">
                    {sitter.experience} {sitter.experience === 1 ? "yr" : "yrs"}{" "}
                    exp.
                  </span>
                )}
                {sitter.special_needs?.slice(0, 3).map((need) => (
                  <span
                    key={need}
                    className="text-xs bg-teal-50 text-teal-600 px-2.5 py-1 rounded-full"
                  >
                    {need}
                  </span>
                ))}
              </div>
            </div>

            {/* Hourly rate — top right */}
            <div className="text-right shrink-0">
              <p className="text-xs text-gray-500 font-medium mb-0.5">
                Hourly Rate
              </p>
              <p className="text-2xl font-bold text-[#ff6b6b]">
                ${sitter.hourly_rate}
              </p>
            </div>
          </div>

          {/* Available days */}
          {hasAvailability && (
            <div className="mt-4 bg-gray-50 rounded-xl p-3 border border-gray-100">
              <div className="flex items-center gap-1.5 mb-2">
                <Calendar className="w-3.5 h-3.5 text-[#ff6b6b]" />
                <span className="text-xs font-semibold text-gray-600">
                  Available Days This Week
                </span>
              </div>
              <div className="flex gap-1.5 flex-wrap">
                {DAYS.map((day) => (
                  <span
                    key={day}
                    className={`text-xs px-2.5 py-1.5 rounded-full font-medium ${
                      sitter.availability?.[day]
                        ? "bg-teal-500 text-white"
                        : "border border-gray-200 text-gray-400"
                    }`}
                  >
                    {day}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 justify-center px-5 pb-5">
        <Link href={`/profile/Sitter/${sitter.id}`}>
          <button className="px-5 py-2 border border-gray-200 text-gray-700 rounded-xl font-semibold text-sm hover:bg-gray-100 hover:border-gray-300 transition-colors cursor-pointer">
            View Profile
          </button>
        </Link>
        <Link href={`/booking?sitterId=${sitter.id}`}>
          <button className="px-5 py-2 bg-[#ff6b6b] text-white rounded-xl font-bold text-sm hover:bg-[#e85d5d] transition-colors cursor-pointer">
            Book Now
          </button>
        </Link>
      </div>
    </div>
  );
}
