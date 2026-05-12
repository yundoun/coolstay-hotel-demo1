"use client";

import { useState, useCallback } from "react";
import type { BookingItem } from "@/domain/reservation/types";

type LookupState =
  | { phase: "idle" }
  | { phase: "loading" }
  | { phase: "success"; books: BookingItem[] }
  | { phase: "error"; message: string };

export function useReservationLookup() {
  const [state, setState] = useState<LookupState>({ phase: "idle" });

  const lookup = useCallback(async (bookId: string, phoneNumber: string) => {
    setState({ phase: "loading" });

    try {
      const qs = new URLSearchParams({ book_id: bookId, phone_number: phoneNumber });
      const res = await fetch(`/api/reservation/lookup?${qs}`);
      const data = await res.json();

      if (!res.ok) {
        setState({ phase: "error", message: data.message ?? "조회에 실패했습니다." });
        return;
      }

      setState({ phase: "success", books: data.books });
    } catch {
      setState({ phase: "error", message: "서버와 연결할 수 없습니다." });
    }
  }, []);

  const reset = useCallback(() => setState({ phase: "idle" }), []);

  return { state, lookup, reset };
}
