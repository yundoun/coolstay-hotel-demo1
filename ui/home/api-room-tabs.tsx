"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { cn } from "@/ui/lib/cn";
import { krw } from "@/domain/shared/utils";
import { useStoreInfo } from "@/application/hooks/useStoreInfo";

/* ── helpers ── */

function formatTime(raw: string): string {
  if (!raw) return "";
  const h = raw.padStart(2, "0");
  return `${h}:00`;
}

function splitFacilities(text: string): string[] {
  if (!text.trim()) return [];
  return text
    .split(/[,\n]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/* ── Image Carousel ── */

function RoomCarousel({
  images,
  name,
}: {
  images: { url: string; thumbUrl: string }[];
  name: string;
}) {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const touchStartX = useRef(0);
  const total = images.length;

  const goTo = useCallback(
    (idx: number) => {
      if (isTransitioning || total <= 1) return;
      setIsTransitioning(true);
      setCurrent((idx + total) % total);
      setTimeout(() => setIsTransitioning(false), 500);
    },
    [isTransitioning, total],
  );

  const prev = useCallback(() => goTo(current - 1), [goTo, current]);
  const next = useCallback(() => goTo(current + 1), [goTo, current]);

  // Reset to 0 when images change (room tab switch)
  useEffect(() => {
    setCurrent(0);
    setIsTransitioning(false);
  }, [images]);

  if (total === 0) {
    return (
      <div className="flex h-full items-center justify-center t-caption text-[var(--color-ink-3)]">
        이미지 없음
      </div>
    );
  }

  return (
    <div
      className="relative h-full w-full group"
      onTouchStart={(e) => {
        touchStartX.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        const dx = e.changedTouches[0].clientX - touchStartX.current;
        if (Math.abs(dx) > 40) dx > 0 ? prev() : next();
      }}
    >
      {/* slides */}
      {images.map((img, i) => (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          key={img.url}
          src={img.url}
          alt={`${name} ${i + 1}`}
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ease-[var(--ease-out)]",
            i === current ? "opacity-100" : "opacity-0",
          )}
          draggable={false}
        />
      ))}

      {/* arrows — visible on hover (desktop) */}
      {total > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="이전 이미지"
            className="absolute left-3 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm text-[var(--color-ink)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white cursor-pointer"
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
          </button>
          <button
            onClick={next}
            aria-label="다음 이미지"
            className="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm text-[var(--color-ink)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white cursor-pointer"
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </>
      )}

      {/* counter badge */}
      {total > 1 && (
        <div className="absolute bottom-3 right-3 z-10 rounded-full bg-black/50 backdrop-blur-sm px-3 py-1 text-[11px] font-medium text-white/90 tracking-wide">
          {current + 1} / {total}
        </div>
      )}

      {/* dot indicators */}
      {total > 1 && total <= 8 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`이미지 ${i + 1}`}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300 cursor-pointer",
                i === current
                  ? "w-5 bg-white"
                  : "w-1.5 bg-white/50 hover:bg-white/70",
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Accordion Item ── */

function InfoAccordion({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | undefined>(
    defaultOpen ? undefined : 0,
  );

  useEffect(() => {
    if (!contentRef.current) return;
    if (open) {
      setHeight(contentRef.current.scrollHeight);
      const timer = setTimeout(() => setHeight(undefined), 350);
      return () => clearTimeout(timer);
    } else {
      setHeight(contentRef.current.scrollHeight);
      requestAnimationFrame(() => setHeight(0));
    }
  }, [open]);

  return (
    <div className="border-b border-[var(--color-line-soft)]">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-5 text-left cursor-pointer group/acc"
      >
        <span className="t-body-sm font-medium text-[var(--color-ink)]">
          {title}
        </span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className={cn(
            "text-[var(--color-mute)] transition-transform duration-300 shrink-0 ml-4",
            open && "rotate-180",
          )}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </button>
      <div
        className="overflow-hidden transition-[height] duration-300 ease-[var(--ease-out)]"
        style={{ height: height != null ? `${height}px` : "auto" }}
      >
        <div ref={contentRef} className="pb-6">
          {children}
        </div>
      </div>
    </div>
  );
}

/* ── Main Component ── */

export function ApiRoomTabs() {
  const { data, loading } = useStoreInfo();
  const [active, setActive] = useState(0);

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
  const checkIn = formatTime(room.checkInTime);
  const checkOut = formatTime(room.checkOutTime);

  const roomFacilities = splitFacilities(data.benefitRoom);
  const sharedFacilities = splitFacilities(data.benefitExtra);
  const hasPolicy = data.policyMsg.trim().length > 0;
  const hasRefund = data.refundPolicy.trim().length > 0;
  const hasFacilitySection =
    roomFacilities.length > 0 ||
    sharedFacilities.length > 0 ||
    hasPolicy ||
    hasRefund;

  return (
    <div>
      {/* Tab bar — preserved as-is */}
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

      {/* Room Content */}
      <div className="mt-8 flex flex-col gap-6 md:flex-row md:gap-10">
        {/* Image Carousel */}
        <div className="relative aspect-[16/10] w-full md:w-[56%] shrink-0 overflow-hidden rounded-[2px] bg-[var(--color-line-soft)]">
          <RoomCarousel images={room.images} name={room.name} />
        </div>

        {/* Info */}
        <div className="flex flex-1 flex-col justify-between">
          <div>
            <h3 className="t-h3">{room.name}</h3>
            {room.description && (
              <p className="t-body mt-3 text-[var(--color-ink-3)]">
                {room.description}
              </p>
            )}

            {/* Meta row: guests + check-in/out */}
            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] text-[var(--color-ink-2)]">
              <span className="flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
                최대 {room.maxGuests}인
              </span>
              {(checkIn || checkOut) && (
                <>
                  <span className="text-[var(--color-line)]" aria-hidden>|</span>
                  <span className="flex items-center gap-1.5">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    {checkIn && <>IN {checkIn}</>}
                    {checkIn && checkOut && <span className="mx-0.5">·</span>}
                    {checkOut && <>OUT {checkOut}</>}
                  </span>
                </>
              )}
            </div>

            {/* Price */}
            {room.basePrice > 0 && (
              <div className="mt-6 pt-5 border-t border-[var(--color-line-soft)]">
                <span className="t-caption text-[var(--color-ink-3)]">
                  1박 기준
                </span>
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

      {/* ── Facility & Policy Section ── */}
      {hasFacilitySection && (
        <div className="mt-16 pt-12 border-t border-[var(--color-line)]">
          <span className="eyebrow">Facilities & Info</span>
          <h3 className="t-h3 mt-3 mb-8">이용 안내</h3>

          {/* Facility pills */}
          {(roomFacilities.length > 0 || sharedFacilities.length > 0) && (
            <div className="grid gap-8 md:grid-cols-2 mb-8">
              {roomFacilities.length > 0 && (
                <div>
                  <p className="t-caption text-[var(--color-ink-3)] mb-3">
                    객실 내 시설
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {roomFacilities.map((f) => (
                      <span
                        key={f}
                        className="inline-block rounded-full border border-[var(--color-line)] px-3.5 py-1.5 text-[13px] text-[var(--color-ink-2)] leading-tight"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {sharedFacilities.length > 0 && (
                <div>
                  <p className="t-caption text-[var(--color-ink-3)] mb-3">
                    공용 시설
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {sharedFacilities.map((f) => (
                      <span
                        key={f}
                        className="inline-block rounded-full border border-[var(--color-line)] px-3.5 py-1.5 text-[13px] text-[var(--color-ink-2)] leading-tight"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Policy accordions */}
          {(hasPolicy || hasRefund) && (
            <div className="border-t border-[var(--color-line-soft)]">
              {hasPolicy && (
                <InfoAccordion title="이용 규정" defaultOpen>
                  <p className="t-body-sm text-[var(--color-ink-3)] whitespace-pre-line leading-relaxed">
                    {data.policyMsg}
                  </p>
                </InfoAccordion>
              )}
              {hasRefund && (
                <InfoAccordion title="취소 및 환불 규정">
                  <p className="t-body-sm text-[var(--color-ink-3)] whitespace-pre-line leading-relaxed">
                    {data.refundPolicy}
                  </p>
                </InfoAccordion>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
