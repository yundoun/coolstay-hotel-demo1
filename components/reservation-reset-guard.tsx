"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useReservation } from "@/lib/reservation-store";

/** /reservation 경로를 벗어나면 예약 스토어를 초기화한다. */
export function ReservationResetGuard() {
  const pathname = usePathname();
  const reset = useReservation((s) => s.reset);
  const prevPath = useRef(pathname);

  useEffect(() => {
    const wasInReservation = prevPath.current.startsWith("/reservation");
    const isInReservation = pathname.startsWith("/reservation");

    if (wasInReservation && !isInReservation) {
      reset();
    }

    prevPath.current = pathname;
  }, [pathname, reset]);

  return null;
}
