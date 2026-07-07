"use client";

import { useState, useEffect, Suspense } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";
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
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";

function BookingConfirmationContent() {
  const t = useTranslations("bookingConfirmation");
  const searchParams = useSearchParams();
  const router = useRouter();
  const [bookingData,           setBookingData]           = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("card");
  const [loading,               setLoading]               = useState(true);
  const [userId,                setUserId]                = useState(null);
  const [payError,              setPayError]              = useState(null);
  const [paying,                setPaying]                = useState(false);

  useEffect(() => {
    async function init() {
      // Load booking data from localStorage
      const storedData = localStorage.getItem("pendingBooking");
      if (!storedData) { router.push("/search"); return; }
      setBookingData(JSON.parse(storedData));

      // Fetch the real logged-in user's ID
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUserId(user.id);

      setLoading(false);
    }
    init();
  }, [router]);

  const calculateSubtotal = () => {
    if (!bookingData) return 0;

    const start = new Date(`2000-01-01T${bookingData.startTime}`);
    const end = new Date(`2000-01-01T${bookingData.endTime}`);
    const hours = (end - start) / (1000 * 60 * 60);

    return hours * bookingData.sitter.hourly_rate;
  };

  const calculateAdventureCost = () => {
    if (!bookingData?.selectedAdventures?.length) return 0;
    return bookingData.selectedAdventures.reduce(
      (sum, a) => sum + (Number(a.price) || 0),
      0,
    );
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
    if (!userId) { setPayError(t("errors.mustBeLoggedIn")); return; }
    setPayError(null);
    setPaying(true);
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sitterId:    bookingData.sitter.id,
          parentId:    userId,
          date:        bookingData.date,
          startTime:   bookingData.startTime,
          endTime:     bookingData.endTime,
          children:    bookingData.children,
          adventureName: bookingData.selectedAdventures?.length
            ? bookingData.selectedAdventures.map((a) => a.title).join(", ")
            : null,
          notes:       bookingData.additionalNotes,
          totalAmount: calculateTotal(),
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        setPayError(json.error || t("errors.bookingFailed"));
        return;
      }

      const { bookingId, outcomeId } = json;

      localStorage.setItem(
        "ratingContext",
        JSON.stringify({
          outcomeId:   outcomeId ?? null,
          sitterName:  bookingData.sitter.name,
          sitterImage: bookingData.sitter.profile_picture || bookingData.sitter.image || null,
          sessionDate: bookingData.date,
          sessionTime: `${bookingData.startTime} – ${bookingData.endTime}`,
        })
      );

      localStorage.removeItem("pendingBooking");
      localStorage.removeItem("bookingDetails");
      router.push(`/booking/success?bookingId=${bookingId}`);
    } catch {
      setPayError(t("errors.somethingWrong"));
    } finally {
      setPaying(false);
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
            <p className="text-gray-500 text-sm">{t("loading")}</p>
          </div>
        </div>
      ) : (
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="container mx-auto px-4">
            <div className="mb-6">
              <Link href="/booking" className="text-[#ff6b6b] hover:underline">
                {t("backToBooking")}
              </Link>
              <h1 className="text-3xl font-bold mt-2">{t("title")}</h1>
              <p className="text-gray-600 mt-1">
                {t("subtitle")}
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
                        {t("bookingDetails.title")}
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
                          <p className="text-sm text-gray-500 mb-1">{t("bookingDetails.dateLabel")}</p>
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
                          <p className="text-sm text-gray-500 mb-1">{t("bookingDetails.timeLabel")}</p>
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
                        <p className="text-sm text-gray-500 mb-1">{t("bookingDetails.durationLabel")}</p>
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

                            if (hours === 0) return t("duration.minutesOnly", { minutes });
                            if (minutes === 0) return t("duration.hoursOnly", { hours });
                            return t("duration.hoursAndMinutes", { hours, minutes });
                          })()}
                        </p>
                      </div>

                      {/* Additional Notes */}
                      {bookingData.additionalNotes && (
                        <div>
                          <p className="text-sm text-gray-500 mb-1">
                            {t("bookingDetails.specialInstructions")}
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
                        {t("childInfo.title")}
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
                                {t("childInfo.yearsOld", { age: child.age })}
                              </p>
                            </div>
                            <Check className="h-5 w-5 text-green-500" />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Selected Micro Adventure Section */}
                  {bookingData.selectedAdventures?.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Sparkles className="h-5 w-5 text-[#ff6b6b]" />
                          {t("selectedAdventure.title")}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {bookingData.selectedAdventures.map((adventure) => (
                          <div
                            key={adventure.id}
                            className="bg-gradient-to-r from-[#ff6b6b]/10 to-purple-50 p-4 rounded-lg"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-semibold text-lg">
                                {adventure.title}
                              </h3>
                              <span className="text-[#ff6b6b] font-bold text-lg">
                                ${adventure.price}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                              {adventure.description}
                            </p>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Clock className="h-4 w-4" />
                              <span>{t("selectedAdventure.minutes", { duration: adventure.duration })}</span>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  )}

                  {/* Payment Method Section */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5 text-[#ff6b6b]" />
                        {t("paymentMethod.title")}
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
                            <p className="font-medium">{t("paymentMethod.cardLabel")}</p>
                            <p className="text-sm text-gray-500">
                              {t("paymentMethod.cardDescription")}
                            </p>
                          </div>
                        </label>

                        {selectedPaymentMethod === "card" && (
                          <div className="pl-12 space-y-4 pt-2">
                            <div>
                              <label className="block text-sm font-medium mb-2">
                                {t("paymentMethod.cardNumberLabel")}
                              </label>
                              <input
                                type="text"
                                placeholder={t("paymentMethod.cardNumberPlaceholder")}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b6b]"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium mb-2">
                                  {t("paymentMethod.expiryDateLabel")}
                                </label>
                                <input
                                  type="text"
                                  placeholder={t("paymentMethod.expiryPlaceholder")}
                                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b6b]"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium mb-2">
                                  {t("paymentMethod.cvvLabel")}
                                </label>
                                <input
                                  type="text"
                                  placeholder={t("paymentMethod.cvvPlaceholder")}
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
                            <p className="font-medium">{t("paymentMethod.paypalLabel")}</p>
                            <p className="text-sm text-gray-500">
                              {t("paymentMethod.paypalDescription")}
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
                    <CardTitle>{t("paymentSummary.title")}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Price Breakdown */}
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">{t("paymentSummary.hourlyRateLabel")}</span>
                        <span>{t("paymentSummary.hourlyRateValue", { rate: bookingData.sitter.hourly_rate })}</span>
                      </div>

                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">{t("paymentSummary.durationLabel")}</span>
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

                            if (hours === 0) return t("duration.minutesOnly", { minutes });
                            if (minutes === 0) return t("duration.hoursOnly", { hours });
                            return t("duration.hoursAndMinutes", { hours, minutes });
                          })()}
                        </span>
                      </div>

                      <div className="flex justify-between text-sm pb-3 border-b">
                        <span className="text-gray-600">
                          {t("paymentSummary.babysittingSubtotal")}
                        </span>
                        <span className="font-medium">
                          ${calculateSubtotal().toFixed(2)}
                        </span>
                      </div>

                      {bookingData.selectedAdventures?.length > 0 && (
                        <div className="flex justify-between text-sm pb-3 border-b">
                          <div>
                            <p className="text-gray-600">{t("paymentSummary.microAdventureLabel")}</p>
                            <p className="text-xs text-gray-400 mt-1">
                              {bookingData.selectedAdventures
                                .map((a) => a.title)
                                .join(", ")}
                            </p>
                          </div>
                          <span className="font-medium">
                            ${calculateAdventureCost().toFixed(2)}
                          </span>
                        </div>
                      )}

                      <div className="flex justify-between text-sm pb-3 border-b">
                        <span className="text-gray-600">{t("paymentSummary.subtotalLabel")}</span>
                        <span className="font-medium">
                          $
                          {(
                            calculateSubtotal() + calculateAdventureCost()
                          ).toFixed(2)}
                        </span>
                      </div>

                      <div className="flex justify-between text-sm pb-3 border-b">
                        <div>
                          <span className="text-gray-600">{t("paymentSummary.taxLabel")}</span>
                          <p className="text-xs text-gray-400">{t("paymentSummary.taxPercent")} </p>
                        </div>
                        <span className="font-medium">
                          ${calculateServiceFee().toFixed(2)}
                        </span>
                      </div>

                      <div className="flex justify-between font-bold text-xl pt-2">
                        <span>{t("paymentSummary.totalLabel")}</span>
                        <span className="text-[#ff6b6b]">
                          ${calculateTotal().toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Error message */}
                    {payError && (
                      <p className="text-sm text-red-500 text-center bg-red-50 rounded-xl px-4 py-2 border border-red-100">
                        {payError}
                      </p>
                    )}

                    {/* Pay Button */}
                    <Button
                      onClick={handlePayment}
                      disabled={paying || !userId}
                      className="w-full bg-[#ff6b6b] hover:bg-[#ff5a5f] text-white h-12 text-lg font-semibold cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {paying ? t("payButton.processing") : t("payButton.pay", { amount: calculateTotal().toFixed(2) })}
                    </Button>

                    <p className="text-xs text-gray-500 text-center">
                      {t("termsNotice")}
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

// useSearchParams() requires a Suspense boundary in the App Router — the
// content component reads it directly, so it's wrapped here rather than
// forcing every caller of this page to provide one.
export default function BookingConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex justify-center items-center">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-[#ff6b6b] rounded-full animate-spin" />
        </div>
      }
    >
      <BookingConfirmationContent />
    </Suspense>
  );
}
