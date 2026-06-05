"use client";

import { useCallback, useState } from "react";
import { useReservation } from "@/adapters/zustand/reservation-store";
import { formatKoDate, formatKoDateShort, nightsBetween } from "@/domain/shared/utils";
import { StepIndicator } from "@/ui/shared/step-indicator";
import { Step1Dates } from "./step-1-dates";
import { Step2Hotel } from "./step-2-hotel";
import { Step3Guest } from "./step-3-guest";
import { Step4Review } from "./step-4-review";
import { AnimatePresence, motion } from "framer-motion";

type Step = 1 | 2 | 3 | 4;

/**
 * Self-contained reservation flow for embedding in a single page.
 * Uses local state instead of URL query params for step navigation.
 */
export function InlineReservation() {
  const [step, setStep] = useState<Step>(1);
  const store = useReservation();

  const scrollToTop = useCallback(() => {
    setTimeout(() => {
      const anchor = document.getElementById("step-scroll-anchor");
      if (anchor) {
        const top = anchor.getBoundingClientRect().top + window.scrollY - 72;
        window.scrollTo({ top, behavior: "instant" });
      }
    }, 50);
  }, []);

  const goTo = useCallback((next: Step) => {
    setStep(next);
    scrollToTop();
  }, [scrollToTop]);

  const goToWithReset = useCallback((target: Step) => {
    if (target >= step) return;
    // 이동하는 단계 이후의 데이터를 모두 초기화
    if (target <= 1) {
      store.setRoom(null);
      store.clearApiRoom();
      store.setGuestInfo({ name: "", phone: "" });
      store.setPhoneVerified(false);
    } else if (target <= 2) {
      store.setGuestInfo({ name: "", phone: "" });
      store.setPhoneVerified(false);
    }
    // target === 3: 4단계 동의 상태는 로컬 state라 자동 초기화
    setStep(target);
    scrollToTop();
  }, [step, store, scrollToTop]);

  const content = (() => {
    switch (step) {
      case 1:
        return <Step1Dates onNext={() => goTo(2)} />;
      case 2:
        return <Step2Hotel onNext={() => goTo(3)} onPrev={() => goTo(1)} />;
      case 3:
        return <Step3Guest onNext={() => goTo(4)} onPrev={() => goTo(2)} />;
      case 4:
        return <Step4Review onPrev={() => goTo(3)} />;
    }
  })();

  return (
    <div>
      <div id="step-scroll-anchor" aria-hidden />
      <StepIndicator current={step} onStepClick={goToWithReset} />
      {step >= 2 && (
        <div className="sticky top-[calc(72px+58px)] z-[39] border-b border-[var(--color-line)] bg-white">
          <div className="container-page flex items-center gap-2 py-2.5 text-[13px] text-[var(--color-ink-3)]">
            <span className="font-medium text-[var(--color-ink)] sm:hidden">{formatKoDateShort(store.checkIn)}</span>
            <span className="font-medium text-[var(--color-ink)] hidden sm:inline">{formatKoDate(store.checkIn)}</span>
            <span className="text-[var(--color-mute)]">→</span>
            <span className="font-medium text-[var(--color-ink)] sm:hidden">{formatKoDateShort(store.checkOut)}</span>
            <span className="font-medium text-[var(--color-ink)] hidden sm:inline">{formatKoDate(store.checkOut)}</span>
            <span className="text-[var(--color-line)]">·</span>
            <span>{nightsBetween(store.checkIn, store.checkOut)}박 · 성인 {store.adults}인</span>
          </div>
        </div>
      )}
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
    </div>
  );
}
