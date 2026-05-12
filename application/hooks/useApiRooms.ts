"use client";

import { useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import type { RoomsResponse } from "@/adapters/coolstay/types";

/**
 * 체크인/체크아웃 날짜 기반으로 API 객실 목록을 조회한다.
 * abort 처리 및 에러 핸들링을 캡슐화.
 */
export function useApiRooms(checkIn: string, checkOut: string, nights: number) {
  const [storeData, setStoreData] = useState<RoomsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!checkIn || !checkOut || nights <= 0) {
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const ci = format(parseISO(checkIn), "yyyyMMdd");
    const co = format(parseISO(checkOut), "yyyyMMdd");

    setLoading(true);
    setError(null);

    fetch(`/api/store/rooms?checkIn=${ci}&checkOut=${co}`, {
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error("객실 조회 실패");
        return res.json();
      })
      .then((data: RoomsResponse) => {
        setStoreData(data);
      })
      .catch((err) => {
        if (err.name !== "AbortError") setError(err.message);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [checkIn, checkOut, nights]);

  return { storeData, loading, error };
}
