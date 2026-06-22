"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  Star,
  MapPin,
  BadgeCheck,
  DollarSign,
  Calendar,
  Users,
  Clock,
  Languages,
  Award,
  Shield,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Sitter from "@/assets/sitter1.png";
import dynamic from "next/dynamic";

const NeighbourhoodMap = dynamic(() => import("@/components/NeighbourhoodMap"), { ssr: false });
import SitterReviews from "@/components/SitterReviews";

const DAYS = [
  { key: "monday",    label: "Monday"    },
  { key: "tuesday",   label: "Tuesday"   },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday",  label: "Thursday"  },
  { key: "friday",    label: "Friday"    },
  { key: "saturday",  label: "Saturday"  },
  { key: "sunday",    label: "Sunday"    },
];

function formatHour(h) {
  const n = parseInt(h, 10);
  if (n === 0)  return "12:00 AM";
  if (n < 12)   return `${n}:00 AM`;
  if (n === 12) return "12:00 PM";
  return `${n - 12}:00 PM`;
}

function AvailabilityList({ availability }) {
  const avail = typeof availability === "string" ? JSON.parse(availability) : (availability ?? {});

  const rows = DAYS.flatMap(({ key, label }) => {
    const dayData = avail[key] ?? {};
    const activeHours = Object.keys(dayData)
      .filter((h) => dayData[h] === true)
      .map((h) => parseInt(h, 10))
      .sort((a, b) => a - b);

    if (activeHours.length === 0) return [];

    const start = formatHour(activeHours[0]);
    const end   = formatHour(activeHours[activeHours.length - 1] + 1);
    return [{ label, range: `${start} – ${end}` }];
  });

  if (rows.length === 0) {
    return (
      <p className="text-sm text-gray-400 italic">
        This sitter hasn&apos;t set their availability yet.
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {rows.map(({ label, range }) => (
        <li key={label} className="flex items-center gap-3">
          <Calendar className="w-4 h-4 text-teal-500 shrink-0" />
          <span className="font-semibold text-gray-800 w-28">{label}</span>
          <span className="text-gray-600 text-sm">{range}</span>
        </li>
      ))}
    </ul>
  );
}

export default function SitterProfilePage() {
  const params = useParams();
  const [sitter,     setSitter]     = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);
  const [imgSrc,     setImgSrc]     = useState(null);
  const [viewerRole, setViewerRole] = useState(null);

  useEffect(() => {
    async function checkViewer() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setViewerRole(user?.user_metadata?.user_type ?? null);
    }
    checkViewer();
  }, []);

  useEffect(() => {
    if (!params.id) return;
    async function fetchSitter() {
      try {
        setLoading(true);
        const response = await fetch(`/api/sitters/${params.id}`);
        const result   = await response.json();
        if (!response.ok) { setError(result.error || "Failed to fetch sitter"); return; }
        setSitter(result.data);
        setImgSrc(result.data?.image || null);
      } catch {
        setError("Failed to load sitter profile");
      } finally {
        setLoading(false);
      }
    }
    fetchSitter();
  }, [params.id]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff6b6b] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading sitter profile...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !sitter) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">
            {error || "Sitter not found"}
          </p>
          <Link href="/search">
            <Button>Back to Search</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          href="/search"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Search
        </Link>

        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 mb-6 w-[80%]">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Profile Image */}
            <div className="relative h-48 w-48 shrink-0 mx-auto md:mx-0">
              <Image
                src={imgSrc || Sitter}
                alt={sitter.name}
                fill
                className="object-cover rounded-xl"
                unoptimized={!!imgSrc}
                onError={() => setImgSrc(null)}
              />
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold flex items-center gap-2 mb-2">
                    {sitter.name}
                    {sitter.is_verified && (
                      <BadgeCheck className="w-6 h-6 text-blue-500" />
                    )}
                  </h1>
                  <div className="flex items-center gap-1 text-gray-600 mb-2">
                    <MapPin className="w-4 h-4" />
                    <span>{sitter.location}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center bg-yellow-100 px-3 py-1 rounded-lg">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400 mr-1" />
                      <span className="font-bold text-yellow-700">
                        {sitter.rating}
                      </span>
                      <span className="text-gray-600 ml-1">
                        ({sitter.reviews} reviews)
                      </span>
                    </div>
                    {sitter.background_check_status === "verified" && (
                      <div className="flex items-center bg-green-100 px-3 py-1 rounded-lg text-green-700">
                        <Shield className="w-4 h-4 mr-1" />
                        <span className="text-sm font-medium">
                          Background Checked
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-center md:text-right">
                  <div className="text-3xl font-bold text-[#ff6b6b] mb-1">
                    ${sitter.hourly_rate}
                    <span className="text-lg text-gray-600">/hr</span>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mb-4 w-[50%]">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#ff6b6b]" />
                  <div>
                    <p className="text-sm text-gray-600">Experience</p>
                    <p className="font-semibold">
                      {sitter.experience || 0} years
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#ff6b6b]" />
                  <div>
                    <p className="text-sm text-gray-600">Reviews</p>
                    <p className="font-semibold">{sitter.reviews}</p>
                  </div>
                </div>
                {/* <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#ff6b6b]" />
                  <div>
                    <p className="text-sm text-gray-600">Response Time</p>
                    <p className="font-semibold">Within 1 hour</p>
                  </div>
                </div> */}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                {viewerRole !== "sitter" && (
                  <Link href={`/booking?sitterId=${sitter.id}`}>
                    <Button className="flex-1 bg-[#ff6b6b] hover:bg-[#ff5252] cursor-pointer">
                      Book Now
                    </Button>
                  </Link>
                )}
                {/* <Button variant="outline" className="flex-1">
                  Send Message
                </Button> */}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - About & Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Section */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-bold mb-4">About Me</h2>
              <p className="text-gray-700 leading-relaxed">{sitter.bio}</p>
            </div>

            {/* Languages */}
            {sitter.languages && sitter.languages.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Languages className="w-5 h-5 text-[#ff6b6b]" />
                  <h2 className="text-xl font-bold">Languages</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {sitter.languages.map((lang) => (
                    <span
                      key={lang}
                      className="bg-[#ff6b6b]/10 text-[#ff6b6b] px-4 py-2 rounded-full font-medium"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Special Needs Experience */}
            {sitter.special_needs && sitter.special_needs.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-xl font-bold mb-4">
                  Special Needs Experience
                </h2>
                <div className="flex flex-wrap gap-2">
                  {sitter.special_needs.map((need) => (
                    <span
                      key={need}
                      className="bg-teal-50 text-teal-700 px-4 py-2 rounded-full font-medium"
                    >
                      {need}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {sitter.certifications && sitter.certifications.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Award className="w-5 h-5 text-[#ff6b6b]" />
                  <h2 className="text-xl font-bold">Certifications</h2>
                </div>
                <ul className="space-y-2">
                  {sitter.certifications.map((cert, index) => (
                    <li key={index} className="flex items-center gap-2 text-gray-700">
                      <div className="w-2 h-2 bg-[#ff6b6b] rounded-full" />
                      {cert}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Reviews */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <SitterReviews sitterId={params.id} />
            </div>
          </div>

          {/* Right Column - Additional Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Neighbourhood map */}
            {sitter.latitude && sitter.longitude && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#ff6b6b]" /> Location
                </h2>
                <NeighbourhoodMap
                  latitude={sitter.latitude}
                  longitude={sitter.longitude}
                  neighbourhood={sitter.neighbourhood}
                />
              </div>
            )}

            {/* Availability */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-bold mb-4">Availability</h2>
              <AvailabilityList availability={sitter.recurring_availability} />
            </div>

            {/* Contact Card */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-bold mb-4">Contact</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-700">
                  <DollarSign className="w-5 h-5 text-[#ff6b6b]" />
                  <span>${sitter.hourly_rate}/hour</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <MapPin className="w-5 h-5 text-[#ff6b6b]" />
                  <span>{sitter.location}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions — only shown to parents */}
            {viewerRole !== "sitter" && (
              <div className="bg-gradient-to-br from-[#ff6b6b]/10 to-teal-50 rounded-2xl shadow-sm p-6">
                <h3 className="font-bold mb-3">Ready to book?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Schedule a session with {sitter.name.split(" ")[0]} today!
                </p>
                <Link href={`/booking?sitterId=${sitter.id}`}>
                  <Button className="w-full bg-[#ff6b6b] hover:bg-[#ff5252] cursor-pointer">
                    Book Now
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
