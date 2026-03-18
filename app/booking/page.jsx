"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, User, Sparkles, FileText, Check } from "lucide-react";
import Link from "next/link";
import { adventures as adventuresData } from "@/lib/mock-data/adventures";

export default function BookingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sitterId = searchParams.get("sitterId");

  const DEMO_PARENT_ID = "c51a0e4c-f7d4-4b23-a7b9-029c31d86c0b";

  const [selectedSitter, setSelectedSitter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingDetails, setBookingDetails] = useState(() => {
    try {
      const saved = localStorage.getItem("bookingDetails");
      return saved
        ? JSON.parse(saved)
        : {
            date: "",
            startTime: "",
            endTime: "",
            selectedChildren: [],
            selectedAdventure: "",
            additionalNotes: "",
          };
    } catch {
      return {
        date: "",
        startTime: "",
        endTime: "",
        selectedChildren: [],
        selectedAdventure: "",
        additionalNotes: "",
      };
    }
  });
  const [children, setChildren] = useState([]);
  const [adventures] = useState(adventuresData.slice(0, 3));

  useEffect(() => {
    if (!sitterId) router.replace("/search");
  }, [sitterId, router]);

  // Auto-save booking details to localStorage
  useEffect(() => {
    localStorage.setItem("bookingDetails", JSON.stringify(bookingDetails));
  }, [bookingDetails]);
  // Fetch sitter and children data
  useEffect(() => {
    async function fetchData() {
      try {
        const [sitterRes, childrenRes] = await Promise.all([
          fetch(`/api/sitters/${sitterId}`),
          fetch(`/api/children?parentId=${DEMO_PARENT_ID}`),
        ]);

        if (sitterRes.ok) {
          const { data } = await sitterRes.json();
          setSelectedSitter(data);
        }

        if (childrenRes.ok) {
          const { data } = await childrenRes.json();
          setChildren(data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    if (sitterId) fetchData();
  }, [sitterId]);

  const handleChildSelection = (childId) => {
    setBookingDetails((prev) => ({
      ...prev,
      selectedChildren: prev.selectedChildren.includes(childId)
        ? prev.selectedChildren.filter((id) => id !== childId)
        : [...prev.selectedChildren, childId],
    }));
  };

  const calculateTotal = () => {
    if (!bookingDetails.startTime || !bookingDetails.endTime || !selectedSitter)
      return 0;

    const start = new Date(`2000-01-01T${bookingDetails.startTime}`);
    const end = new Date(`2000-01-01T${bookingDetails.endTime}`);
    const hours = (end - start) / (1000 * 60 * 60);
    let total = hours * selectedSitter.hourly_rate;

    const adventure = adventures.find(
      (a) => a.id === parseInt(bookingDetails.selectedAdventure),
    );
    if (adventure) total += adventure.price;

    return total.toFixed(2);
  };

  const handleSubmitBooking = () => {
    const bookingData = {
      sitter: selectedSitter,
      parentId: DEMO_PARENT_ID,
      ...bookingDetails,
      children: bookingDetails.selectedChildren
        .map((id) => children.find((c) => c.id === id))
        .filter(Boolean),
      selectedAdventure:
        adventures.find(
          (a) => a.id === parseInt(bookingDetails.selectedAdventure),
        ) || null,
    };

    localStorage.setItem("pendingBooking", JSON.stringify(bookingData));
    localStorage.setItem("lastSitterId", sitterId);
    router.push("/booking/confirmation");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6 ">
          <Link href="/search" className="text-[#ff6b6b] hover:underline">
            ← Back to Search
          </Link>
          <h1 className="text-3xl font-bold mt-2 ml-105">
            Complete Your Booking
          </h1>
          <p className="text-gray-600 mt-1 ml-110">
            Fill in the details below to book your sitter
          </p>
        </div>

        {loading ? (
          <div className="min-h-screen bg-gray-50 flex justify-center items-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-4 border-gray-200 border-t-[#ff6b6b] rounded-full animate-spin" />
              <p className="text-gray-500 text-sm">Loading...</p>
            </div>
          </div>
        ) : (
          <div className="flex justify-between gap-8">
            {/* Left Side - Booking Form */}
            <div className=" grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {/* Date & Time Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-[#ff6b6b] " />
                      Date & Time
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="cursor-pointer">
                      <label className="block text-sm font-medium mb-2">
                        Date
                      </label>
                      <Input
                        type="date"
                        value={bookingDetails.date}
                        onChange={(e) =>
                          setBookingDetails((prev) => ({
                            ...prev,
                            date: e.target.value,
                          }))
                        }
                        className="w-full cursor-pointer"
                        min={new Date().toISOString().split("T")[0]}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Start Time
                        </label>
                        <div className="relative">
                          <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 " />
                          <Input
                            type="time"
                            value={bookingDetails.startTime}
                            onChange={(e) =>
                              setBookingDetails((prev) => ({
                                ...prev,
                                startTime: e.target.value,
                              }))
                            }
                            className="pl-10 cursor-pointer"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          End Time
                        </label>
                        <div className="relative">
                          <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 " />
                          <Input
                            type="time"
                            value={bookingDetails.endTime}
                            onChange={(e) =>
                              setBookingDetails((prev) => ({
                                ...prev,
                                endTime: e.target.value,
                              }))
                            }
                            className="pl-10 cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Child Information Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5 text-[#ff6b6b]" />
                      Child Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">
                      Select which child needs care
                    </p>
                    <div className="space-y-3">
                      {children.map((child) => (
                        <label
                          key={child.id}
                          className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition"
                        >
                          <input
                            type="checkbox"
                            checked={bookingDetails.selectedChildren.includes(
                              child.id,
                            )}
                            onChange={() => handleChildSelection(child.id)}
                            className="h-5 w-5 rounded border-gray-300 text-[#ff6b6b] focus:ring-[#ff6b6b]"
                          />
                          <div className="flex-1">
                            <p className="font-medium">{child.name}</p>
                            <p className="text-sm text-gray-500">
                              {child.age} years old
                            </p>
                          </div>
                          {bookingDetails.selectedChildren.includes(
                            child.id,
                          ) && <Check className="h-5 w-5 text-[#ff6b6b]" />}
                        </label>
                      ))}
                    </div>
                    <Link href="/profile/Parents">
                      <Button
                        variant="outline"
                        className="w-full mt-4 cursor-pointer"
                      >
                        + Add New Child
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                {/* Micro Adventure Section */}
                <Card>
                  <CardHeader>
                    <span className="flex justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-[#ff6b6b]" />
                        Micro Adventures (Optional)
                      </CardTitle>
                      <Link href="/microadventure">
                        <i className="text-sm text-red-500">Browse More</i>
                      </Link>
                    </span>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">
                      Add a fun activity to your booking
                    </p>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition">
                        <input
                          type="radio"
                          name="adventure"
                          value=""
                          checked={bookingDetails.selectedAdventure === ""}
                          onChange={(e) =>
                            setBookingDetails((prev) => ({
                              ...prev,
                              selectedAdventure: e.target.value,
                            }))
                          }
                          className="h-4 w-4 text-[#ff6b6b] focus:ring-[#ff6b6b]"
                        />
                        <div className="flex-1">
                          <p className="font-medium">No Adventure</p>
                          <p className="text-sm text-gray-500">
                            Regular babysitting only
                          </p>
                        </div>
                      </label>
                      {adventures.map((adventure) => (
                        <label
                          key={adventure.id}
                          className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition"
                        >
                          <input
                            type="radio"
                            name="adventure"
                            value={adventure.id}
                            checked={
                              bookingDetails.selectedAdventure ===
                              adventure.id.toString()
                            }
                            onChange={(e) =>
                              setBookingDetails((prev) => ({
                                ...prev,
                                selectedAdventure: e.target.value,
                              }))
                            }
                            className="h-4 w-4 text-[#ff6b6b] focus:ring-[#ff6b6b]"
                          />
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <p className="font-medium">{adventure.title}</p>
                              <span className="text-[#ff6b6b] font-semibold">
                                +${adventure.price}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                              {adventure.description}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              Duration: {adventure.duration}
                            </p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Additional Notes Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-[#ff6b6b]" />
                      Additional Notes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <textarea
                      value={bookingDetails.additionalNotes}
                      onChange={(e) =>
                        setBookingDetails((prev) => ({
                          ...prev,
                          additionalNotes: e.target.value,
                        }))
                      }
                      placeholder="Share any important information with your sitter (allergies, bedtime routines, emergency contacts, etc.)"
                      className="w-full min-h-[120px] p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b6b] resize-none"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Include details about allergies, preferences, routines, or
                      special instructions
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
            {/* Right Side - Booking Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Booking Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Sitter Info */}
                  {selectedSitter && (
                    <div className="pb-4 border-b">
                      <p className="text-sm text-gray-500 mb-1">Sitter</p>
                      <p className="font-semibold text-lg">
                        {selectedSitter.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {selectedSitter.location}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-yellow-500">★</span>
                        <span className="font-medium">
                          {selectedSitter.rating}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Date & Time Summary */}
                  <div className="pb-4 border-b">
                    <p className="text-sm text-gray-500 mb-2">Date & Time</p>
                    {bookingDetails.date ? (
                      <p className="font-medium">
                        {new Date(bookingDetails.date).toLocaleDateString(
                          "en-US",
                          {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          },
                        )}
                      </p>
                    ) : (
                      <p className="text-gray-400 italic">No date selected</p>
                    )}
                    {bookingDetails.startTime && bookingDetails.endTime ? (
                      <p className="text-sm text-gray-600 mt-1">
                        {bookingDetails.startTime} - {bookingDetails.endTime}
                      </p>
                    ) : (
                      <p className="text-gray-400 italic text-sm mt-1">
                        No time selected
                      </p>
                    )}
                  </div>

                  {/* Children Summary */}
                  <div className="pb-4 border-b">
                    <p className="text-sm text-gray-500 mb-2">Children</p>
                    {bookingDetails.selectedChildren.length > 0 ? (
                      <ul className="space-y-1">
                        {bookingDetails.selectedChildren
                          .map((id) => children.find((c) => c.id === id))
                          .filter(Boolean)
                          .map((child) => (
                            <li key={child.id} className="text-sm">
                              • {child.name} ({child.age}y)
                            </li>
                          ))}
                      </ul>
                    ) : (
                      <p className="text-gray-400 italic">
                        No children selected
                      </p>
                    )}
                  </div>

                  {/* Adventure Summary */}
                  {bookingDetails.selectedAdventure &&
                    adventures.find(
                      (a) =>
                        a.id === parseInt(bookingDetails.selectedAdventure),
                    ) && (
                      <div className="pb-4 border-b">
                        <p className="text-sm text-gray-500 mb-2">
                          Micro Adventure
                        </p>
                        {(() => {
                          const adventure = adventures.find(
                            (a) =>
                              a.id ===
                              parseInt(bookingDetails.selectedAdventure),
                          );
                          return (
                            <>
                              <p className="font-medium text-sm">
                                {adventure.title}
                              </p>
                              <p className="text-xs text-gray-600 mt-1">
                                {adventure.description}
                              </p>
                            </>
                          );
                        })()}
                      </div>
                    )}

                  {/* Price Breakdown */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Hourly Rate</span>
                      <span>${selectedSitter?.hourly_rate}/hr</span>
                    </div>
                    {bookingDetails.startTime && bookingDetails.endTime && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Duration</span>
                        <span>
                          {(() => {
                            const start = new Date(
                              `2000-01-01T${bookingDetails.startTime}`,
                            );
                            const end = new Date(
                              `2000-01-01T${bookingDetails.endTime}`,
                            );
                            const totalMinutes = Math.round(
                              (end - start) / (1000 * 60),
                            );
                            const hours = Math.floor(totalMinutes / 60);
                            const minutes = totalMinutes % 60;

                            if (hours === 0) return `${minutes}m`;
                            if (minutes === 0) return `${hours}h`;
                            return `${hours}h ${minutes}m`;
                          })()}
                        </span>
                      </div>
                    )}
                    {bookingDetails.selectedAdventure && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Adventure</span>
                        <span>
                          +$
                          {adventures.find(
                            (a) =>
                              a.id ===
                              parseInt(bookingDetails.selectedAdventure),
                          )?.price || 0}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-lg pt-2 border-t">
                      <span>Total</span>
                      <span className="text-[#ff6b6b]">
                        ${calculateTotal()}
                      </span>
                    </div>
                  </div>

                  {/* Book Button */}
                  <Button
                    onClick={handleSubmitBooking}
                    className="w-full bg-[#ff6b6b] hover:bg-[#ff5a5f] text-white h-12 text-lg font-semibold cursor-pointer"
                    disabled={
                      !bookingDetails.date ||
                      !bookingDetails.startTime ||
                      !bookingDetails.endTime ||
                      bookingDetails.selectedChildren.length === 0
                    }
                  >
                    Confirm Booking
                  </Button>

                  {(!bookingDetails.date ||
                    !bookingDetails.startTime ||
                    !bookingDetails.endTime ||
                    bookingDetails.selectedChildren.length === 0) && (
                    <p className="text-xs text-gray-500 text-center">
                      Please fill in all required fields
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
