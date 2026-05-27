"use client";

import { useEffect, useState } from "react";

export type Term = {
  code: string;
  name: string;
  url: string;
  required: boolean;
};

export type RefundPolicy = {
  until: string;
  percent: number;
  amount: number;
};

/** 예약 약관 코드 — 예약 동의에 표시할 약관만 필터 */
const RESERVATION_TERM_CODES = ["TC001", "TC002", "TC003"];

export function useTerms(params: {
  storeKey: string | null;
  itemKey: string | null;
  packKey: string | null;
  checkIn: string;
  checkOut: string;
}) {
  const [terms, setTerms] = useState<Term[]>([]);
  const [refundPolicies, setRefundPolicies] = useState<RefundPolicy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);

      // 약관 조회
      try {
        const res = await fetch("/api/terms");
        if (res.ok) {
          const data = await res.json();
          const raw: { code: string; name: string; url: string; required_yn: string }[] = data.terms ?? [];
          // 중복 제거 (서버에서 TC001 중복 반환 이슈) + 예약 관련 약관만 필터
          const seen = new Set<string>();
          const filtered: Term[] = [];
          for (const t of raw) {
            if (!RESERVATION_TERM_CODES.includes(t.code)) continue;
            if (seen.has(t.code)) continue;
            seen.add(t.code);
            filtered.push({
              code: t.code,
              name: t.name,
              url: t.url,
              required: t.required_yn === "Y",
            });
          }
          if (!cancelled) setTerms(filtered);
        }
      } catch { /* 약관 로드 실패 시 빈 배열 유지 */ }

      // 환불 규정 조회
      if (params.storeKey && params.itemKey && params.packKey) {
        try {
          const qs = new URLSearchParams({
            store_key: params.storeKey,
            item_key: params.itemKey,
            pack_key: params.packKey,
            check_in: params.checkIn,
            check_out: params.checkOut,
          });
          const res = await fetch(`/api/refund-policy?${qs}`);
          if (res.ok) {
            const data = await res.json();
            if (!cancelled) setRefundPolicies(data.refund_policies ?? []);
          }
        } catch { /* 환불 규정 로드 실패 시 빈 배열 유지 */ }
      }

      if (!cancelled) setLoading(false);
    }

    load();
    return () => { cancelled = true; };
  }, [params.storeKey, params.itemKey, params.packKey, params.checkIn, params.checkOut]);

  return { terms, refundPolicies, loading };
}
