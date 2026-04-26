import { Suspense } from "react";
import { ReservationShell } from "@/components/reservation/reservation-shell";

export const metadata = { title: "예약 — 꿀스테이" };

export default function ReservationPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh]" />}>
      <ReservationShell />
    </Suspense>
  );
}
