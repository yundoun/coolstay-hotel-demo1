import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getHotel, getHotelRooms, hotels } from "@/lib/hotels";
import { Reveal } from "@/components/reveal";
import { RoomCard } from "@/components/room-card";
import { starString } from "@/lib/utils";
import {
  MapPin,
  Clock,
  Phone,
  Sparkles,
  Leaf,
  Waves,
  Utensils,
  Dumbbell,
  Wine,
  BookOpen,
  Bike,
  Baby,
  Flame,
  Flower2,
  Mountain,
  Bed,
  Trees,
} from "lucide-react";

export async function generateStaticParams() {
  return hotels.map((h) => ({ id: h.id }));
}

export function generateMetadata({
  params,
}: {
  params: { id: string };
}) {
  const h = getHotel(params.id);
  return h ? { title: `${h.name} — 꿀스테이` } : {};
}

const AMENITY_ICONS: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  스파: Sparkles,
  "포레스트 스파": Leaf,
  "한방 웰니스 스파": Leaf,
  "프라이빗 온천": Flame,
  "온천 스파": Flame,
  "비치 액세스": Waves,
  "실내 수영장": Waves,
  "오션뷰 인피니티 풀": Waves,
  "루프탑 풀": Waves,
  "실내외 풀": Waves,
  "실내 풀": Waves,
  "로컬 파인다이닝": Utensils,
  "로컬 다이닝": Utensils,
  "지역 식재 다이닝": Utensils,
  피트니스: Dumbbell,
  "요가 데크": Flower2,
  "요가 스튜디오": Flower2,
  명상: Flower2,
  "루프탑 바": Wine,
  "재즈 라운지": Wine,
  "도서 라운지": BookOpen,
  "북 컬렉션": BookOpen,
  "이그제큐티브 라운지": BookOpen,
  "장작 라운지": Flame,
  "24시간 룸서비스": Bed,
  "키즈 클럽": Baby,
  "키즈 플레이룸": Baby,
  "자전거 대여": Bike,
  "사이클링 루트": Bike,
  "사이클 투어": Bike,
  "승마 체험": Mountain,
  "등산 컨시어지": Mountain,
  "하버 뷰 테라스": Waves,
  "송림 산책로": Trees,
};

export default function HotelDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const hotel = getHotel(params.id);
  if (!hotel) return notFound();
  const rooms = getHotelRooms(hotel.id);

  const galleryLayout = [
    "md:col-span-7",
    "md:col-span-5",
    "md:col-span-4",
    "md:col-span-4",
    "md:col-span-4",
    "md:col-span-6",
    "md:col-span-6",
  ];

  return (
    <>
      {/* ============ HERO ============ */}
      <section className="relative h-[72svh] min-h-[560px] w-full overflow-hidden">
        <Image
          src={hotel.heroImage}
          alt={hotel.name}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 hero-veil" aria-hidden />
        <div className="absolute inset-x-0 bottom-0 pb-[72px]">
          <div className="container-page">
            <Reveal>
              <span className="t-label-caps text-white/80">
                {hotel.city} · {hotel.grade}-Star Hotel
              </span>
            </Reveal>
            <Reveal delay={0.08}>
              <h1 className="t-h1 mt-4 text-white">{hotel.name}</h1>
            </Reveal>
            <Reveal delay={0.14}>
              <div className="mt-4 text-white/80 tracking-[0.16em]">
                {starString(hotel.grade)}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============ CONCEPT ============ */}
      <section className="py-[120px]">
        <div className="container-page grid grid-cols-1 gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <Reveal>
              <span className="eyebrow">Concept</span>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="t-h2 mt-6">{hotel.shortConcept}</h2>
            </Reveal>
          </div>
          <div className="md:col-span-6 md:col-start-7">
            <Reveal delay={0.1}>
              <p className="t-body-lg text-[var(--color-ink-2)]">
                {hotel.description}
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============ AMENITIES ============ */}
      <section className="bg-[var(--color-bg-soft)] py-[80px]">
        <div className="container-page">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <span className="eyebrow">Amenities</span>
              <h3 className="t-h3 mt-4">시설 & 서비스</h3>
            </div>
          </div>
          <ul className="grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-3">
            {hotel.amenities.map((a, i) => {
              const Icon = AMENITY_ICONS[a] ?? Sparkles;
              return (
                <Reveal key={a} delay={(i % 3) * 0.04} as="li">
                  <div className="flex flex-col gap-3">
                    <Icon className="h-8 w-8 text-[var(--color-ink)]" strokeWidth={1.5} />
                    <div className="t-h4">{a}</div>
                  </div>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ============ ROOMS ============ */}
      <section className="py-[120px]">
        <div className="container-page">
          <div className="mb-[64px] flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <Reveal>
                <span className="eyebrow">Accommodations</span>
              </Reveal>
              <Reveal delay={0.05}>
                <h2 className="t-h2 mt-4">객실</h2>
              </Reveal>
            </div>
            <Reveal delay={0.1}>
              <p className="t-body text-[var(--color-ink-3)] md:max-w-[36ch] md:text-right">
                호텔의 서사가 가장 짙게 남는 공간.
                {rooms.length}개의 객실에서 각기 다른 뷰와 분위기를 만나보세요.
              </p>
            </Reveal>
          </div>
          <ul className="grid grid-cols-1 gap-x-10 gap-y-[72px] md:grid-cols-2">
            {rooms.map((r, i) => (
              <Reveal key={r.id} delay={(i % 2) * 0.05} as="li">
                <RoomCard room={r} hotelId={hotel.id} />
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* ============ GALLERY ============ */}
      <section className="py-[120px]">
        <div className="container-page">
          <div className="mb-[48px]">
            <span className="eyebrow">Gallery</span>
            <h2 className="t-h2 mt-4">공간의 기록</h2>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-12 md:gap-4">
            {hotel.galleryImages.slice(0, 7).map((src, i) => {
              const col = galleryLayout[i] ?? "md:col-span-4";
              const aspect = i === 0 ? "aspect-[16/10]" : i === 1 ? "aspect-[4/5]" : i % 2 === 0 ? "aspect-[3/4]" : "aspect-[4/3]";
              return (
                <Reveal key={src + i} delay={(i % 4) * 0.04} className={`col-span-2 ${col}`}>
                  <div className={`img-hover relative w-full overflow-hidden rounded-[2px] bg-[var(--color-line-soft)] ${aspect}`}>
                    <Image
                      src={src}
                      alt={`${hotel.name} 갤러리 ${i + 1}`}
                      fill
                      sizes="(max-width: 768px) 50vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ INFO ============ */}
      <section className="border-t border-[var(--color-line)] py-[80px]">
        <div className="container-page grid grid-cols-1 gap-10 md:grid-cols-3">
          <InfoBlock icon={<MapPin strokeWidth={1.5} className="h-6 w-6" />} label="주소" value={hotel.address} />
          <InfoBlock
            icon={<Clock strokeWidth={1.5} className="h-6 w-6" />}
            label="체크인 · 체크아웃"
            value={`체크인 ${hotel.checkInTime} · 체크아웃 ${hotel.checkOutTime}`}
          />
          <InfoBlock icon={<Phone strokeWidth={1.5} className="h-6 w-6" />} label="문의" value={hotel.phone} />
        </div>
      </section>

      {/* ============ BOTTOM CTA ============ */}
      <section className="bg-[var(--color-bg-soft)] py-[96px]">
        <div className="container-page flex flex-col items-center gap-8 text-center">
          <Reveal>
            <span className="eyebrow">Reservation</span>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="t-h2 max-w-[20ch]">
              {hotel.name}에서,<br />지금 예약을 시작하세요.
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <Link
              href={`/reservation?step=1&hotelId=${hotel.id}`}
              className="btn btn-primary"
            >
              예약하기 →
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}

function InfoBlock({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="text-[var(--color-ink)]">{icon}</div>
      <span className="t-label-caps text-[var(--color-ink-3)]">{label}</span>
      <p className="t-body text-[var(--color-ink)]">{value}</p>
    </div>
  );
}
