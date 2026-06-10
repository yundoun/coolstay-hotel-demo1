import { Suspense } from "react";
import { ReservationLookup } from "@/ui/reservation/reservation-lookup";

export const metadata = { title: "예약 조회 — 꿀스테이" };

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-[60vh]" />}>
      <ReservationLookup />
    </Suspense>
  );
}
