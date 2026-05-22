"use client";

import { useEffect, useState } from "react";
import { InlineReservation } from "./inline-reservation";

export function OnepageReservation() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  if (!hydrated) return null;

  return <InlineReservation />;
}
