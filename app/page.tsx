import Image from "next/image";
import { siteHotel, siteRooms } from "@/lib/hotels";
import { Reveal } from "@/components/reveal";
import { RoomCard } from "@/components/room-card";
import { MapPin, Clock, Phone, Car, Train, Sparkles, Leaf, Waves, Utensils, Dumbbell, Wine, BookOpen, Bike, Baby, Flame, Flower2, Mountain, Bed, Trees } from "lucide-react";
import { OnepageReservation } from "@/components/onepage-reservation";

const AMENITY_ICONS: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  스파: Sparkles, "포레스트 스파": Leaf, "한방 웰니스 스파": Leaf,
  "프라이빗 온천": Flame, "온천 스파": Flame,
  "비치 액세스": Waves, "실내 수영장": Waves, "오션뷰 인피니티 풀": Waves,
  "루프탑 풀": Waves, "실내외 풀": Waves, "실내 풀": Waves,
  "로컬 파인다이닝": Utensils, "로컬 다이닝": Utensils, "지역 식재 다이닝": Utensils,
  피트니스: Dumbbell, "요가 데크": Flower2, "요가 스튜디오": Flower2, 명상: Flower2,
  "루프탑 바": Wine, "재즈 라운지": Wine,
  "도서 라운지": BookOpen, "북 컬렉션": BookOpen, "이그제큐티브 라운지": BookOpen,
  "장작 라운지": Flame, "24시간 룸서비스": Bed,
  "키즈 클럽": Baby, "키즈 플레이룸": Baby,
  "자전거 대여": Bike, "사이클링 루트": Bike, "사이클 투어": Bike,
  "승마 체험": Mountain, "등산 컨시어지": Mountain,
  "하버 뷰 테라스": Waves, "송림 산책로": Trees,
};

export default function HomePage() {
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
            <h2 className="t-h2 mt-6">
              머무는 모든 순간이<br />기억이 되도록.
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="t-body-lg mt-8 text-[var(--color-ink-2)] leading-[1.9]">
              안녕하세요, {siteHotel.name}을 찾아주셔서 감사합니다.
              <br />
              저희는 한 분 한 분의 여정이 특별해지기를 바라며,
              <br />
              정성스러운 서비스와 아늑한 공간으로
              <br />
              잊지 못할 시간을 선사하고자 합니다.
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <p className="t-serif-en mt-10 text-[var(--color-ink-3)] italic">
              — {siteHotel.name} 대표 일동
            </p>
          </Reveal>
        </div>
      </section>

      {/* ============== 호텔소개 ============== */}
      <section id="about" className="bg-[var(--color-bg-soft)] py-[120px]">
        <div className="container-page">
          {/* 컨셉 */}
          <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
            <div className="md:col-span-5">
              <Reveal>
                <span className="eyebrow">About</span>
              </Reveal>
              <Reveal delay={0.05}>
                <h2 className="t-h2 mt-6">{siteHotel.shortConcept}</h2>
              </Reveal>
            </div>
            <div className="md:col-span-6 md:col-start-7">
              <Reveal delay={0.1}>
                <p className="t-body-lg text-[var(--color-ink-2)]">
                  {siteHotel.description}
                </p>
              </Reveal>
            </div>
          </div>

          {/* 어메니티 */}
          <div className="mt-[96px]">
            <div className="mb-12">
              <span className="eyebrow">Amenities</span>
              <h3 className="t-h3 mt-4">시설 & 서비스</h3>
            </div>
            <ul className="grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-3">
              {siteHotel.amenities.map((a, i) => {
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

          {/* 객실 미리보기 */}
          <div className="mt-[96px]">
            <div className="mb-[64px]">
              <Reveal>
                <span className="eyebrow">Rooms</span>
              </Reveal>
              <Reveal delay={0.05}>
                <h2 className="t-h2 mt-4">객실 안내</h2>
              </Reveal>
            </div>
            <ul className="grid grid-cols-1 gap-x-10 gap-y-[72px] md:grid-cols-3">
              {siteRooms.map((r, i) => (
                <Reveal key={r.id} delay={(i % 3) * 0.05} as="li">
                  <RoomCard room={r} hotelId={siteHotel.id} />
                </Reveal>
              ))}
            </ul>
          </div>

          {/* 갤러리 */}
          <div className="mt-[96px]">
            <div className="mb-[48px]">
              <span className="eyebrow">Gallery</span>
              <h2 className="t-h2 mt-4">공간의 기록</h2>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-12 md:gap-4">
              {siteHotel.galleryImages.slice(0, 6).map((src, i) => {
                const cols = ["md:col-span-7", "md:col-span-5", "md:col-span-4", "md:col-span-4", "md:col-span-4", "md:col-span-6"];
                const col = cols[i] ?? "md:col-span-4";
                const aspect = i === 0 ? "aspect-[16/10]" : i === 1 ? "aspect-[4/5]" : "aspect-[4/3]";
                return (
                  <Reveal key={src + i} delay={(i % 4) * 0.04} className={`col-span-2 ${col}`}>
                    <div className={`img-hover relative w-full overflow-hidden rounded-[2px] bg-[var(--color-line-soft)] ${aspect}`}>
                      <Image
                        src={src}
                        alt={`${siteHotel.name} 갤러리 ${i + 1}`}
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
        </div>
      </section>

      {/* ============== 예약 ============== */}
      <section id="reservation" className="py-[120px]">
        <div className="container-page text-center mb-[64px]">
          <Reveal>
            <span className="eyebrow">Reservation</span>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="t-h2 mt-6">온라인 예약</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="t-body mt-4 text-[var(--color-ink-3)]">
              아래에서 일정과 객실을 선택하고 바로 예약하세요.
            </p>
          </Reveal>
        </div>
        <OnepageReservation />
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
                src={siteHotel.heroImage}
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

          {/* 교통 정보 */}
          <div className="mt-[64px] grid grid-cols-1 gap-10 md:grid-cols-3">
            <Reveal as="div" delay={0}>
              <div className="flex flex-col gap-3">
                <MapPin className="h-8 w-8 text-[var(--color-ink)]" strokeWidth={1.5} />
                <span className="t-label-caps text-[var(--color-ink-3)]">주소</span>
                <p className="t-body text-[var(--color-ink)]">{siteHotel.address}</p>
              </div>
            </Reveal>
            <Reveal as="div" delay={0.04}>
              <div className="flex flex-col gap-3">
                <Car className="h-8 w-8 text-[var(--color-ink)]" strokeWidth={1.5} />
                <span className="t-label-caps text-[var(--color-ink-3)]">자가용</span>
                <p className="t-body text-[var(--color-ink)]">
                  호텔 지하 주차장 이용 (발레파킹 가능)
                </p>
              </div>
            </Reveal>
            <Reveal as="div" delay={0.08}>
              <div className="flex flex-col gap-3">
                <Train className="h-8 w-8 text-[var(--color-ink)]" strokeWidth={1.5} />
                <span className="t-label-caps text-[var(--color-ink-3)]">대중교통</span>
                <p className="t-body text-[var(--color-ink)]">
                  지하철 4호선 명동역 3번 출구 도보 10분
                </p>
              </div>
            </Reveal>
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
