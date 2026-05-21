"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  images: string[];
  alt: string;
  intervalMs?: number;
};

export function HeroCarousel({ images, alt, intervalMs = 7000 }: Props) {
  const [current, setCurrent] = useState(0);
  const count = images.length;
  const shouldAnimate = count > 1;

  const next = useCallback(() => {
    setCurrent((i) => (i + 1) % count);
  }, [count]);

  const prev = useCallback(() => {
    setCurrent((i) => (i - 1 + count) % count);
  }, [count]);

  useEffect(() => {
    if (!shouldAnimate) return;
    const id = setInterval(next, intervalMs);
    return () => clearInterval(id);
  }, [shouldAnimate, next, intervalMs]);

  return (
    <div className="absolute inset-0">
      {images.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt={`${alt} ${i + 1}`}
          fill
          priority={i === 0}
          sizes="100vw"
          className={`object-cover transition-opacity duration-1000 ease-in-out ${
            i === current ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      {/* Arrow buttons — desktop hover only */}
      {shouldAnimate && (
        <>
          <button
            onClick={prev}
            aria-label="이전 이미지"
            className="absolute top-1/2 z-10 -translate-y-1/2 left-[max(var(--page-gutter),calc((100vw-var(--container-max))/2+var(--page-gutter)))] hidden md:flex h-10 w-10 items-center justify-center rounded-full bg-black/20 text-white opacity-40 backdrop-blur-sm transition-opacity duration-300 hover:opacity-100"
          >
            <ChevronLeft size={22} strokeWidth={1.5} />
          </button>
          <button
            onClick={next}
            aria-label="다음 이미지"
            className="absolute top-1/2 z-10 -translate-y-1/2 right-[max(var(--page-gutter),calc((100vw-var(--container-max))/2+var(--page-gutter)))] hidden md:flex h-10 w-10 items-center justify-center rounded-full bg-black/20 text-white opacity-40 backdrop-blur-sm transition-opacity duration-300 hover:opacity-100"
          >
            <ChevronRight size={22} strokeWidth={1.5} />
          </button>
        </>
      )}

      {/* Dots indicator */}
      {shouldAnimate && (
        <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`이미지 ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === current
                  ? "w-6 bg-white"
                  : "w-2 bg-white/50 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
