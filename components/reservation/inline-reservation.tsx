"use client";

import { useState } from "react";
import { StepIndicator } from "@/components/step-indicator";
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

  const content = (() => {
    switch (step) {
      case 1:
        return <Step1Dates onNext={() => setStep(2)} />;
      case 2:
        return <Step2Hotel onNext={() => setStep(3)} onPrev={() => setStep(1)} />;
      case 3:
        return <Step3Guest onNext={() => setStep(4)} onPrev={() => setStep(2)} />;
      case 4:
        return <Step4Review onPrev={() => setStep(3)} />;
    }
  })();

  return (
    <div>
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
    </div>
  );
}
