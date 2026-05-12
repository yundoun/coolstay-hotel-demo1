"use client";

import { useEffect, useState } from "react";
import type { StoreInfo } from "@/adapters/coolstay/types";

/**
 * 숙소 기본 정보를 조회한다 (홈페이지 객실 안내용).
 * abort 처리 및 에러 핸들링을 캡슐화.
 */
export function useStoreInfo() {
  const [data, setData] = useState<StoreInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/store/info", { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error("객실 조회 실패");
        return res.json();
      })
      .then((d: StoreInfo) => setData(d))
      .catch((err) => {
        if (err.name !== "AbortError") console.error(err);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  return { data, loading };
}
