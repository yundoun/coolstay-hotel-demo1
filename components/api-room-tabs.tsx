"use client";

import { useEffect, useState } from "react";
import { cn, krw } from "@/lib/utils";
import type { StoreInfo, RoomType } from "@/app/api/store/info/route";

export function ApiRoomTabs() {
  const [data, setData] = useState<StoreInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(0);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-[var(--color-ink-3)] t-body-sm">
        객실 정보를 불러오는 중...
      </div>
    );
  }

  if (!data || data.rooms.length === 0) {
    return (
      <div className="flex items-center justify-center py-20 text-[var(--color-ink-3)] t-body-sm">
        객실 정보를 불러올 수 없습니다.
      </div>
    );
  }

  const room = data.rooms[active];

  return (
    <div>
      {/* Tab bar */}
      <div className="flex gap-1 overflow-x-auto border-b border-[var(--color-line)] scrollbar-hide">
        {data.rooms.map((r, i) => (
          <button
            key={r.itemKey}
            onClick={() => setActive(i)}
            className={cn(
              "shrink-0 px-5 py-3 text-[13px] tracking-[0.02em] transition-colors whitespace-nowrap cursor-pointer",
              i === active
                ? "border-b-2 border-[var(--color-ink)] text-[var(--color-ink)] font-medium"
                : "text-[var(--color-ink-3)] hover:text-[var(--color-ink-2)]",
            )}
          >
            {r.name}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="mt-8 flex flex-col gap-6 md:flex-row md:gap-10">
        {/* Image */}
        <div className="relative aspect-[16/10] w-full md:w-[56%] shrink-0 overflow-hidden rounded-[2px] bg-[var(--color-line-soft)]">
          {room.images[0] ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={room.images[0].url}
              alt={room.name}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center t-caption text-[var(--color-ink-3)]">
              이미지 없음
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-1 flex-col justify-between">
          <div>
            <h3 className="t-h3">{room.name}</h3>
            {room.description && (
              <p className="t-body mt-3 text-[var(--color-ink-3)]">{room.description}</p>
            )}
            <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-[var(--color-ink-2)]">
              <span>최대 {room.maxGuests}인</span>
            </div>
            {room.basePrice > 0 && (
              <div className="mt-5">
                <span className="t-caption text-[var(--color-ink-3)]">1박 기준</span>
                <div className="t-price mt-1">{krw(room.basePrice)}</div>
              </div>
            )}
          </div>

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById("step-indicator");
                if (el) {
                  const top = el.getBoundingClientRect().top + window.scrollY - 72;
                  window.scrollTo({ top, behavior: "smooth" });
                }
              }}
              className="btn btn-primary"
            >
              예약하기 →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
