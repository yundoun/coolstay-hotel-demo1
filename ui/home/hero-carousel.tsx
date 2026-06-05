"use client";

import { useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/effect-fade";

type Props = {
  images: string[];
  alt: string;
};

export function HeroCarousel({ images, alt }: Props) {
  const count = images.length;
  const shouldAnimate = count > 1;
  const [activeIndex, setActiveIndex] = useState(0);
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);

  return (
    <div className="absolute inset-0">
      <Swiper
        modules={[Autoplay, EffectFade]}
        effect="fade"
        autoplay={{ delay: 10_000, disableOnInteraction: false }}
        onSwiper={setSwiperInstance}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        loop={shouldAnimate}
        className="h-full w-full"
      >
        {images.map((src, i) => (
          <SwiperSlide key={i}>
            <div className="relative h-full w-full">
              <Image
                src={src}
                alt={`${alt} ${i + 1}`}
                fill
                priority={i === 0}
                sizes="100vw"
                className="object-cover scale-105 transition-transform duration-[8000ms] ease-out"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Dots indicator */}
      {shouldAnimate && (
        <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => swiperInstance?.slideTo(i + 1)}
              aria-label={`이미지 ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === activeIndex
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
