"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Status = "idle" | "sending" | "sent" | "verifying" | "verified" | "expired";

const TIMEOUT_SEC = 180; // 3분
const MOCK_DELAY = 800; // 목업용 딜레이

export function usePhoneVerification() {
  const [status, setStatus] = useState<Status>("idle");
  const [remaining, setRemaining] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // 타이머 정리
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // 카운트다운
  useEffect(() => {
    if (status !== "sent") return;

    timerRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setStatus("expired");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [status]);

  const send = useCallback(async (phone: string) => {
    if (!phone || phone.replace(/[^0-9]/g, "").length < 10) {
      setError("올바른 휴대폰 번호를 입력해 주세요.");
      return;
    }
    setError(null);
    setStatus("sending");

    // 목업: API 호출 시뮬레이션
    await new Promise((r) => setTimeout(r, MOCK_DELAY));

    setStatus("sent");
    setRemaining(TIMEOUT_SEC);
  }, []);

  const verify = useCallback(async (code: string) => {
    if (!code || code.length < 6) {
      setError("인증번호 6자리를 입력해 주세요.");
      return;
    }
    setError(null);
    setStatus("verifying");

    // 목업: 아무 6자리나 통과
    await new Promise((r) => setTimeout(r, MOCK_DELAY));

    if (timerRef.current) clearInterval(timerRef.current);
    setStatus("verified");
    setRemaining(0);
  }, []);

  const resetVerification = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setStatus("idle");
    setRemaining(0);
    setError(null);
  }, []);

  const formatRemaining = remaining > 0
    ? `${String(Math.floor(remaining / 60)).padStart(2, "0")}:${String(remaining % 60).padStart(2, "0")}`
    : "";

  return { status, remaining, formatRemaining, error, send, verify, resetVerification };
}
