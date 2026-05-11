import Image from "next/image";
import { siteHotel } from "@/lib/hotels";
import { siteContent } from "@/lib/site-content";
import { Reveal } from "@/components/reveal";
import { AboutBlocks } from "@/components/about-blocks";
import { ApiRoomTabs } from "@/components/api-room-tabs";
import { OnepageReservation } from "@/components/onepage-reservation";

export default function HomePage() {
  const { greeting, about, directions } = siteContent;

  return (
    <>
      {/* ============== HERO ============== */}
      <section id="top" className="relative w-full">
        <div className="relative h-svh w-full overflow-hidden">
          <Image
            src={siteHotel.heroImage}
            alt={siteHotel.name}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 hero-veil" aria-hidden />

          <div className="absolute inset-x-0 top-0 bottom-0 flex items-end">
            <div className="container-page pb-[72px]">
              <Reveal>
                <span className="t-label-caps block text-white/80">
                  {siteHotel.city} · {siteHotel.grade}-Star Hotel
                </span>
              </Reveal>
              <Reveal delay={0.08}>
                <h1 className="t-display mt-4 max-w-[16ch] text-white">
                  {siteHotel.name}
                </h1>
              </Reveal>
              <Reveal delay={0.18}>
                <p className="t-serif-en t-body-lg mt-6 text-white/80">
                  {siteHotel.shortConcept}
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ============== 사장님 인사말 ============== */}
      <section id="greeting" className="py-[120px]">
        <div className="container-page max-w-[800px] text-center">
          <Reveal>
            <span className="eyebrow">Welcome</span>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="t-h2 mt-6 whitespace-pre-line">
              {greeting.headline}
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="t-body-lg mt-8 text-[var(--color-ink-2)] leading-[1.9] whitespace-pre-line">
              {greeting.body}
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <p className="t-serif-en mt-10 text-[var(--color-ink-3)] italic">
              — {greeting.signature}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ============== ABOUT (데이터 기반 블록) ============== */}
      <div id="about">
        <AboutBlocks blocks={about} />
      </div>

      {/* ============== 객실 안내 (간단 그리드) ============== */}
      <section id="rooms" className="py-[120px]">
        <div className="container-page">
          <div className="mb-[64px]">
            <Reveal>
              <span className="eyebrow">Rooms</span>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="t-h2 mt-4">객실 안내</h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="t-body mt-4 text-[var(--color-ink-3)] max-w-[48ch]">
                객실별 특징과 요금을 확인해 보세요.
              </p>
            </Reveal>
          </div>

          <ApiRoomTabs />
        </div>
      </section>

      {/* ============== 예약 (임베디드) ============== */}
      <section id="reservation" className="py-[120px]">
        <div className="container-page">
          <div className="border-t border-[var(--color-line)] pt-[120px] text-center mb-[64px]">
            <Reveal>
              <span className="eyebrow">Reservation</span>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="t-h2 mt-6">온라인 예약</h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="t-body mt-4 text-[var(--color-ink-3)]">
                일정과 객실을 선택하고 바로 예약하세요.
              </p>
            </Reveal>
          </div>
          <OnepageReservation />
        </div>
      </section>

      {/* ============== 찾아오는 길 ============== */}
      <section id="location" className="bg-[var(--color-bg-soft)] py-[120px]">
        <div className="container-page">
          <div className="text-center mb-[64px]">
            <Reveal>
              <span className="eyebrow">Location</span>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="t-h2 mt-6">찾아오는 길</h2>
            </Reveal>
          </div>

          {/* 구글 지도 */}
          <Reveal delay={0.1}>
            <div className="relative aspect-[21/9] w-full overflow-hidden rounded-[2px]">
              <iframe
                src={`https://maps.google.com/maps?q=${encodeURIComponent(directions.mapQuery)}&t=&z=16&ie=UTF8&iwloc=&output=embed`}
                width="100%"
                height="100%"
                className="absolute inset-0 border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`${siteHotel.name} 위치`}
              />
            </div>
          </Reveal>

          {/* 안내 항목 — 라벨+값 그리드 */}
          <Reveal delay={0.15}>
            <div className="mt-[48px] grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-3 md:grid-cols-5">
              {directions.items.map((item) => (
                <div key={item.label}>
                  <span className="t-label-caps text-[var(--color-ink-3)]">{item.label}</span>
                  <p className="t-body mt-1 text-[var(--color-ink)]">{item.value}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
