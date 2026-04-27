"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Offer } from "@/lib/offers";
import { Reveal } from "./reveal";

export function SpecialOffers({ offers }: { offers: Offer[] }) {
  const [active, setActive] = useState(0);
  const offer = offers[active];

  return (
    <section className="py-[120px] bg-[var(--color-bg-soft)]">
      <div className="container-page">
        <Reveal>
          <span className="eyebrow">Special Offers</span>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="t-h2 mt-4">지금, 놓치지 말아야 할 제안.</h2>
        </Reveal>

        <div className="mt-[56px] grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Featured image */}
          <Reveal delay={0.1} className="lg:col-span-7">
            <Link
              href={`/hotels/${offer.hotelId}`}
              className="group relative block aspect-[16/10] w-full overflow-hidden rounded-[2px] bg-[var(--color-line-soft)]"
            >
              <Image
                src={offer.image}
                alt={offer.title}
                fill
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover transition-transform duration-500 ease-[var(--ease-out)] group-hover:scale-[1.03]"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

              {/* Badge */}
              <div className="absolute top-6 left-6">
                <span className="inline-block bg-[var(--color-honey-500)] px-3 py-1.5 text-[11px] font-semibold tracking-[0.1em] uppercase text-[var(--color-ink)]">
                  {offer.badge}
                </span>
              </div>

              {/* Bottom copy */}
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                <p className="t-label-caps text-white/70">{offer.subtitle}</p>
                <h3 className="t-h3 mt-2 text-white">{offer.title}</h3>
                <div className="mt-3 flex items-center gap-4">
                  <span className="text-[15px] font-semibold text-[var(--color-honey-300)]">
                    {offer.discountLabel}
                  </span>
                  <span className="t-body-sm text-white/60">{offer.period}</span>
                </div>
              </div>
            </Link>
          </Reveal>

          {/* Offer list */}
          <div className="flex flex-col gap-0 lg:col-span-5">
            {offers.map((o, i) => (
              <Reveal key={o.id} delay={0.08 + i * 0.04}>
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  className={`group w-full text-left border-b border-[var(--color-line)] py-6 transition-colors ${
                    i === active
                      ? "border-b-[var(--color-ink)]"
                      : "hover:bg-[var(--color-bg-tint)]/50"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <span
                      className={`shrink-0 mt-0.5 flex h-7 w-7 items-center justify-center rounded-full text-[12px] font-semibold transition-colors ${
                        i === active
                          ? "bg-[var(--color-ink)] text-white"
                          : "bg-[var(--color-line-soft)] text-[var(--color-ink-3)]"
                      }`}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="t-label-caps text-[var(--color-ink-3)]">
                        {o.badge}
                      </p>
                      <h4
                        className={`mt-1 text-[18px] font-medium leading-snug transition-colors ${
                          i === active
                            ? "text-[var(--color-ink)]"
                            : "text-[var(--color-ink-2)]"
                        }`}
                      >
                        {o.title}
                      </h4>
                      {i === active && (
                        <p className="mt-2 t-body-sm text-[var(--color-ink-3)] line-clamp-2">
                          {o.description}
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              </Reveal>
            ))}

            <Reveal delay={0.3}>
              <div className="mt-8">
                <Link
                  href={`/hotels/${offer.hotelId}`}
                  className="t-label-caps border-b border-current pb-1 hover:opacity-70 transition-opacity"
                >
                  오퍼 자세히 보기 →
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
