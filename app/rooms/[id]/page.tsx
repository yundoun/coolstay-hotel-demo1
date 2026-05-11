import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getRoom, siteHotel } from "@/lib/hotels";
import { krw } from "@/lib/utils";

export default async function RoomDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const room = getRoom(id);
  if (!room) notFound();

  return (
    <>
      {/* Hero */}
      <section className="relative h-[50svh] min-h-[400px] w-full overflow-hidden">
        <Image
          src={room.images[0]}
          alt={room.name}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 hero-veil" aria-hidden />
        <div className="absolute inset-x-0 bottom-0 pb-[64px]">
          <div className="container-page">
            <span className="t-label-caps text-white/70">
              {siteHotel.name} · {room.tier.replace("_", " ")}
            </span>
            <h1 className="t-display mt-3 text-white">{room.name}</h1>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-[80px]">
        <div className="container-page max-w-[960px]">
          {/* 상단 요약 */}
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="t-body-lg text-[var(--color-ink-2)]">{room.concept}</p>
              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-[14px] text-[var(--color-ink-2)]">
                <span>{room.sizeSqm}㎡</span>
                <span className="text-[var(--color-mute)]">·</span>
                <span>{room.bedType}베드</span>
                <span className="text-[var(--color-mute)]">·</span>
                <span>{room.view}</span>
                <span className="text-[var(--color-mute)]">·</span>
                <span>최대 {room.maxOccupancy}인</span>
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="t-caption text-[var(--color-ink-3)]">1박 기준</div>
              <div className="t-price mt-1">{krw(room.basePrice)}</div>
            </div>
          </div>

          <div className="my-10 h-px bg-[var(--color-line)]" />

          {/* 갤러리 */}
          {room.images.length > 1 && (
            <>
              <h2 className="t-h3 mb-6">갤러리</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {room.images.slice(1).map((img, i) => (
                  <div
                    key={i}
                    className="relative aspect-[16/10] overflow-hidden rounded-[2px] bg-[var(--color-line-soft)]"
                  >
                    <Image
                      src={img}
                      alt={`${room.name} ${i + 2}`}
                      fill
                      sizes="(max-width: 640px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
              <div className="my-10 h-px bg-[var(--color-line)]" />
            </>
          )}

          {/* 어메니티 */}
          <h2 className="t-h3 mb-6">객실 편의시설</h2>
          <ul className="flex flex-wrap gap-2">
            {room.amenities.map((a) => (
              <li
                key={a}
                className="border border-[var(--color-line)] px-3 py-1.5 text-[13px] text-[var(--color-ink-2)]"
              >
                {a}
              </li>
            ))}
          </ul>

          <div className="my-10 h-px bg-[var(--color-line)]" />

          {/* CTA */}
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            <Link href="/#rooms" className="btn-tertiary">
              ← 객실 목록
            </Link>
            <Link href="/#reservation" className="btn btn-primary">
              예약하기 →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
