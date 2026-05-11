import Image from "next/image";
import { siteHotel, siteRooms } from "@/lib/hotels";
import { siteContent } from "@/lib/site-content";
import { Reveal } from "@/components/reveal";
import { AboutBlocks } from "@/components/about-blocks";
import { RoomTabs } from "@/components/room-tabs";
import { OnepageReservation } from "@/components/onepage-reservation";
import { MapPin, Clock, Phone, Car, Train } from "lucide-react";

const DIRECTION_ICONS: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  "map-pin": MapPin,
  car: Car,
  train: Train,
  phone: Phone,
  clock: Clock,
};

export default function HomePage() {
  const { greeting, about, directions } = siteContent;

  return (
    <>
      {/* ============== HERO ============== */}
      <section id="top" className="relative w-full">
        <div className="relative h-[92vh] min-h-[720px] w-full overflow-hidden">
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
                {siteRooms.length}개의 객실에서 각기 다른 뷰와 분위기를 만나보세요.
              </p>
            </Reveal>
          </div>

          <RoomTabs rooms={siteRooms} />
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

          {/* 지도 대체 영역 */}
          <Reveal delay={0.1}>
            <div className="relative aspect-[21/9] w-full overflow-hidden rounded-[2px] bg-[var(--color-line-soft)]">
              <Image
                src={directions.mapImage ?? siteHotel.heroImage}
                alt={`${siteHotel.name} 위치`}
                fill
                sizes="100vw"
                className="object-cover opacity-40"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="mx-auto h-10 w-10 text-[var(--color-ink)]" strokeWidth={1.5} />
                  <p className="t-h4 mt-4">{siteHotel.address}</p>
                </div>
              </div>
            </div>
          </Reveal>

          {/* 교통 정보 — 데이터 기반 */}
          <div className="mt-[64px] grid grid-cols-1 gap-10 md:grid-cols-3">
            {directions.transport.map((t, i) => {
              const Icon = DIRECTION_ICONS[t.icon] ?? MapPin;
              return (
                <Reveal key={t.label} as="div" delay={i * 0.04}>
                  <div className="flex flex-col gap-3">
                    <Icon className="h-8 w-8 text-[var(--color-ink)]" strokeWidth={1.5} />
                    <span className="t-label-caps text-[var(--color-ink-3)]">{t.label}</span>
                    <p className="t-body text-[var(--color-ink)]">{t.description}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>

          {/* 연락처 */}
          <div className="mt-[64px] border-t border-[var(--color-line)] pt-[48px] grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="flex flex-col gap-2">
              <Phone className="h-6 w-6 text-[var(--color-ink)]" strokeWidth={1.5} />
              <span className="t-label-caps text-[var(--color-ink-3)]">전화</span>
              <p className="t-body">{siteHotel.phone}</p>
            </div>
            <div className="flex flex-col gap-2">
              <Clock className="h-6 w-6 text-[var(--color-ink)]" strokeWidth={1.5} />
              <span className="t-label-caps text-[var(--color-ink-3)]">체크인 · 체크아웃</span>
              <p className="t-body">체크인 {siteHotel.checkInTime} · 체크아웃 {siteHotel.checkOutTime}</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
