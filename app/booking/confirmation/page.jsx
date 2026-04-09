"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Calendar,
  Clock,
  User,
  Sparkles,
  CreditCard,
  Check,
  MapPin,
  Star,
} from "lucide-react";
import Link from "next/link";

export default function BookingConfirmationPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [bookingData, setBookingData] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("card");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get booking data from localStorage (set by previous page)
    const storedData = localStorage.getItem("pendingBooking");
    if (storedData) {
      setBookingData(JSON.parse(storedData));
      setLoading(false);
    } else {
      // Redirect back if no booking data
      router.push("/search");
    }
  }, [router]);

  const calculateSubtotal = () => {
    if (!bookingData) return 0;

    const start = new Date(`2000-01-01T${bookingData.startTime}`);
    const end = new Date(`2000-01-01T${bookingData.endTime}`);
    const hours = (end - start) / (1000 * 60 * 60);

    return hours * bookingData.sitter.hourly_rate;
  };

  const calculateAdventureCost = () => {
    if (!bookingData?.selectedAdventure) return 0;
    return bookingData.selectedAdventure.price;
  };

  const calculateServiceFee = () => {
    const subtotal = calculateSubtotal() + calculateAdventureCost();
    return subtotal * 0.15; // 15% service fee
  };

  const calculateTotal = () => {
    return (
      calculateSubtotal() + calculateAdventureCost() + calculateServiceFee()
    );
  };

  const handlePayment = async () => {
    console.log("Processing payment...", {
      bookingData,
      paymentMethod: selectedPaymentMethod,
      total: calculateTotal(),
    });

    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sitterId: bookingData.sitter.id,
          parentId: "797d10d4-fa8c-437f-9044-7bc118678754", // demo: Wei Chen
          date: bookingData.date,
          startTime: bookingData.startTime,
          endTime: bookingData.endTime,
          children: bookingData.children,
          adventureId: bookingData.selectedAdventure?.id || null,
          notes: bookingData.additionalNotes,
          totalAmount: calculateTotal(),
        }),
      });

      if (!res.ok) throw new Error("Booking failed");

      const { bookingId, outcomeId } = await res.json();

      // Save context for the success/rating page before clearing booking data
      localStorage.setItem(
        "ratingContext",
        JSON.stringify({
          outcomeId: outcomeId ?? null,
          sitterName: bookingData.sitter.name,
          sitterImage: bookingData.sitter.profile_picture || bookingData.sitter.image || null,
          sessionDate: bookingData.date,
          sessionTime: `${bookingData.startTime} – ${bookingData.endTime}`,
        })
      );

      localStorage.removeItem("pendingBooking");
      localStorage.removeItem("bookingDetails");

      router.push(`/booking/success?bookingId=${bookingId}`);
    } catch (error) {
      console.error("Payment failed:", error);
    } 
  };

  // if (loading || !bookingData) {
  //   return (
  //     <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
  //       <div className="text-gray-500">Loading...</div>
  //     </div>
  //   );
  // }

  return (
    <>
      {loading ? (
        <div className="min-h-screen bg-gray-50 flex justify-center items-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-[#ff6b6b] rounded-full animate-spin" />
            <p className="text-gray-500 text-sm">Loading...</p>
          </div>
        </div>
      ) : (
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="container mx-auto px-4">
            <div className="mb-6">
              <Link href="/booking" className="text-[#ff6b6b] hover:underline">
                ← Back to Booking
              </Link>
              <h1 className="text-3xl font-bold mt-2">Confirm Your Booking</h1>
              <p className="text-gray-600 mt-1">
                Review your booking details and complete payment
              </p>
            </div>

            <div className="flex justify-between">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Side - Booking Details */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Booking Details Section */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-[#ff6b6b]" />
                        Booking Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Sitter Information */}
                      <div className="flex items-start gap-4 pb-4 border-b">
                        {bookingData.sitter.profile_picture ||
                        bookingData.sitter.image ? (
                          <img
                            src={
                              bookingData.sitter.profile_picture ||
                              bookingData.sitter.image
                            }
                            alt={bookingData.sitter.name}
                            className="w-16 h-16 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-semibold text-gray-600">
                            {bookingData.sitter.name.charAt(0)}
                          </div>
                        )}
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">
                            {bookingData.sitter.name}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                            <MapPin className="h-4 w-4" />
                            <span>{bookingData.sitter.location}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium">
                              {bookingData.sitter.rating}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Date and Time */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Date</p>
                          <p className="font-medium">
                            {new Date(bookingData.date).toLocaleDateString(
                              "en-US",
                              {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              },
                            )}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Time</p>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <p className="font-medium">
                              {bookingData.startTime} - {bookingData.endTime}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Duration */}
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Duration</p>
                        <p className="font-medium">
                          {(() => {
                            const start = new Date(
                              `2000-01-01T${bookingData.startTime}`,
                            );
                            const end = new Date(
                              `2000-01-01T${bookingData.endTime}`,
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
                        </p>
                      </div>

                      {/* Additional Notes */}
                      {bookingData.additionalNotes && (
                        <div>
                          <p className="text-sm text-gray-500 mb-1">
                            Special Instructions
                          </p>
                          <p className="text-sm bg-gray-50 p-3 rounded-lg">
                            {bookingData.additionalNotes}
                          </p>
                        </div>
                      )}
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
                      <div className="space-y-3">
                        {bookingData.children.map((child) => (
                          <div
                            key={child.id}
                            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                          >
                            <div className="w-10 h-10 rounded-full bg-[#ff6b6b]/10 flex items-center justify-center">
                              <User className="h-5 w-5 text-[#ff6b6b]" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">{child.name}</p>
                              <p className="text-sm text-gray-500">
                                {child.age} years old
                              </p>
                            </div>
                            <Check className="h-5 w-5 text-green-500" />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Selected Micro Adventure Section */}
                  {bookingData.selectedAdventure && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Sparkles className="h-5 w-5 text-[#ff6b6b]" />
                          Selected Micro Adventure
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="bg-gradient-to-r from-[#ff6b6b]/10 to-purple-50 p-4 rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold text-lg">
                              {bookingData.selectedAdventure.title}
                            </h3>
                            <span className="text-[#ff6b6b] font-bold text-lg">
                              ${bookingData.selectedAdventure.price}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {bookingData.selectedAdventure.description}
                          </p>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Clock className="h-4 w-4" />
                            <span>
                              {bookingData.selectedAdventure.duration} minutes
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Payment Method Section */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5 text-[#ff6b6b]" />
                        Payment Method
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <label className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition">
                          <input
                            type="radio"
                            name="payment"
                            value="card"
                            checked={selectedPaymentMethod === "card"}
                            onChange={(e) =>
                              setSelectedPaymentMethod(e.target.value)
                            }
                            className="h-4 w-4 text-[#ff6b6b] focus:ring-[#ff6b6b]"
                          />
                          <CreditCard className="h-5 w-5 text-gray-600" />
                          <div className="flex-1">
                            <p className="font-medium">Credit/Debit Card</p>
                            <p className="text-sm text-gray-500">
                              Pay securely with your card
                            </p>
                          </div>
                        </label>

                        {selectedPaymentMethod === "card" && (
                          <div className="pl-12 space-y-4 pt-2">
                            <div>
                              <label className="block text-sm font-medium mb-2">
                                Card Number
                              </label>
                              <input
                                type="text"
                                placeholder="1234 5678 9012 3456"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b6b]"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium mb-2">
                                  Expiry Date
                                </label>
                                <input
                                  type="text"
                                  placeholder="MM/YY"
                                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b6b]"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium mb-2">
                                  CVV
                                </label>
                                <input
                                  type="text"
                                  placeholder="123"
                                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b6b]"
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        <label className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition">
                          <input
                            type="radio"
                            name="payment"
                            value="paypal"
                            checked={selectedPaymentMethod === "paypal"}
                            onChange={(e) =>
                              setSelectedPaymentMethod(e.target.value)
                            }
                            className="h-4 w-4 text-[#ff6b6b] focus:ring-[#ff6b6b]"
                          />
                          <div className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
                            P
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">PayPal</p>
                            <p className="text-sm text-gray-500">
                              Pay with your PayPal account
                            </p>
                          </div>
                        </label>

                        {/* <label className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition">
                      <input
                        type="radio"
                        name="payment"
                        value="cash"
                        checked={selectedPaymentMethod === "cash"}
                        onChange={(e) =>
                          setSelectedPaymentMethod(e.target.value)
                        }
                        className="h-4 w-4 text-[#ff6b6b] focus:ring-[#ff6b6b]"
                      />
                      <div className="w-5 h-5 bg-green-600 rounded flex items-center justify-center text-white text-xs font-bold">
                        $
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Cash</p>
                        <p className="text-sm text-gray-500">
                          Pay in cash when service is provided
                        </p>
                      </div>
                    </label> */}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
              {/* Right Side - Payment Summary */}
              <div className="lg:col-span-1">
                <Card className="sticky top-4">
                  <CardHeader>
                    <CardTitle>Payment Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Price Breakdown */}
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Hourly Rate</span>
                        <span>${bookingData.sitter.hourly_rate}/hr</span>
                      </div>

                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Duration</span>
                        <span>
                          {(() => {
                            const start = new Date(
                              `2000-01-01T${bookingData.startTime}`,
                            );
                            const end = new Date(
                              `2000-01-01T${bookingData.endTime}`,
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

                      <div className="flex justify-between text-sm pb-3 border-b">
                        <span className="text-gray-600">
                          Babysitting Subtotal
                        </span>
                        <span className="font-medium">
                          ${calculateSubtotal().toFixed(2)}
                        </span>
                      </div>

                      {bookingData.selectedAdventure && (
                        <div className="flex justify-between text-sm pb-3 border-b">
                          <div>
                            <p className="text-gray-600">Micro Adventure</p>
                            <p className="text-xs text-gray-400 mt-1">
                              {bookingData.selectedAdventure.title}
                            </p>
                          </div>
                          <span className="font-medium">
                            ${bookingData.selectedAdventure.price.toFixed(2)}
                          </span>
                        </div>
                      )}

                      <div className="flex justify-between text-sm pb-3 border-b">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-medium">
                          $
                          {(
                            calculateSubtotal() + calculateAdventureCost()
                          ).toFixed(2)}
                        </span>
                      </div>

                      <div className="flex justify-between text-sm pb-3 border-b">
                        <div>
                          <span className="text-gray-600">Tax</span>
                          <p className="text-xs text-gray-400">15% </p>
                        </div>
                        <span className="font-medium">
                          ${calculateServiceFee().toFixed(2)}
                        </span>
                      </div>

                      <div className="flex justify-between font-bold text-xl pt-2">
                        <span>Total</span>
                        <span className="text-[#ff6b6b]">
                          ${calculateTotal().toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Pay Button */}
                    <Button
                      onClick={handlePayment}
                      className="w-full bg-[#ff6b6b] hover:bg-[#ff5a5f] text-white h-12 text-lg font-semibold cursor-pointer"
                    >
                      Pay ${calculateTotal().toFixed(2)}
                    </Button>

                    <p className="text-xs text-gray-500 text-center">
                      By confirming, you agree to our Terms of Service and
                      Cancellation Policy
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
