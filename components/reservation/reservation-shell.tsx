"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { StepIndicator } from "@/components/step-indicator";
import { useReservation } from "@/lib/reservation-store";
import { Step1Dates } from "./step-1-dates";
import { Step2Room } from "./step-2-room";
import { Step3Guest } from "./step-3-guest";
import { Step4Review } from "./step-4-review";
import { AnimatePresence, motion } from "framer-motion";

type Step = 1 | 2 | 3 | 4;

function parseStep(raw: string | null): Step {
  const n = Number(raw);
  return (n >= 1 && n <= 4 ? n : 1) as Step;
}

export function ReservationShell() {
  const search = useSearchParams();
  const router = useRouter();
  const step = parseStep(search.get("step"));
  const store = useReservation();

  // Pre-fill from URL query on first mount if provided
  useEffect(() => {
    const ci = search.get("checkIn");
    const co = search.get("checkOut");
    const a = search.get("adults");
    const c = search.get("children");
    const hotelId = search.get("hotelId");
    const roomId = search.get("roomId");
    if (ci && co) store.setDates(ci, co);
    if (a || c) store.setGuests(Number(a ?? store.adults), Number(c ?? store.children));
    if (hotelId) store.setHotel(hotelId);
    if (roomId) store.setRoom(roomId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Step guards: redirect if required prior data missing
  useEffect(() => {
    if (step >= 2 && (!store.checkIn || !store.checkOut)) {
      router.replace("/reservation?step=1");
      return;
    }
    if (step >= 3 && (!store.hotelId || !store.roomId)) {
      router.replace("/reservation?step=2");
      return;
    }
    if (step === 4 && (!store.guestName || !store.guestPhone || !store.guestEmail)) {
      router.replace("/reservation?step=3");
      return;
    }
  }, [step, store, router]);

  const content = useMemo(() => {
    switch (step) {
      case 1:
        return <Step1Dates />;
      case 2:
        return <Step2Room />;
      case 3:
        return <Step3Guest />;
      case 4:
        return <Step4Review />;
    }
  }, [step]);

  return (
    <>
      <div className="h-[72px]" aria-hidden />
      <StepIndicator current={step} />
      <div className="container-page py-[64px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
          >
            {content}
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
}
