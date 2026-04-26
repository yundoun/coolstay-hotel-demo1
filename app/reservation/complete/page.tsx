import { Suspense } from "react";
import { ReservationCompleteClient } from "@/components/reservation/complete-client";

export const metadata = { title: "예약 완료 — 꿀스테이" };

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-[60vh]" />}>
      <ReservationCompleteClient />
    </Suspense>
  );
}
