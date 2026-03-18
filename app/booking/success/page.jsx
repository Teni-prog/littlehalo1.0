"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

export default function BookingSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const bookingId = searchParams.get("bookingId");

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Card className="max-w-md w-full mx-4">
        <CardContent className="pt-8 pb-8 text-center space-y-4">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
          <h1 className="text-2xl font-bold">Booking Confirmed!</h1>
          <p className="text-gray-600">
            Your booking has been successfully created.
          </p>
          {bookingId && (
            <p className="text-sm text-gray-400">
              Booking ID: <span className="font-mono">{bookingId}</span>
            </p>
          )}
          <Button
            onClick={() => router.push("/search")}
            className="w-full bg-[#ff6b6b] hover:bg-[#ff5a5f] text-white cursor-pointer"
          >
            Find Another Sitter
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
