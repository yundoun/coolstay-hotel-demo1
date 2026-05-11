import { NextResponse } from "next/server";
import { fetchStoreDetail } from "../_lib";

export type ApiRoom = {
  itemKey: string;
  packageKey: string;
  name: string;
  maxGuests: number;
  image: string | null;
  price: number;
  dailyPrices: number[];
  checkInTime: string;
  checkOutTime: string;
};

/** 예약용 — 날짜 기반 객실 + 실시간 가격 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const checkIn = searchParams.get("checkIn");
  const checkOut = searchParams.get("checkOut");

  if (!checkIn || !checkOut) {
    return NextResponse.json({ message: "checkIn, checkOut 필수" }, { status: 400 });
  }

  try {
    const motel = await fetchStoreDetail({ checkIn, checkOut });

    const items: ApiRoom[] = (motel.items ?? []).map((item: any) => {
      const sub = item.sub_items?.[0];
      if (!sub) return null;

      const extras: Record<string, string> = {};
      for (const e of item.extras ?? []) extras[e.code] = e.value;

      const dailyPrices: number[] = [];
      let stime = "";
      let etime = "";
      for (const d of sub.daily_extras ?? []) {
        const dex: Record<string, string> = {};
        for (const e of d.extras ?? []) dex[e.code] = e.value;
        dailyPrices.push(Number(dex.PRICE ?? 0));
        if (!stime) stime = dex.STIME ?? "";
        etime = dex.ETIME ?? "";
      }

      return {
        itemKey: item.key,
        packageKey: sub.key,
        name: item.name,
        maxGuests: Number(extras.MAX ?? 2),
        image: item.images?.[0]?.thumb_url ?? null,
        price: sub.price ?? dailyPrices.reduce((a: number, b: number) => a + b, 0),
        dailyPrices,
        checkInTime: stime,
        checkOutTime: etime,
      } satisfies ApiRoom;
    }).filter(Boolean);

    return NextResponse.json({
      motelKey: motel.key,
      storeName: motel.name,
      sitePayment: motel.site_payment_yn === "Y",
      rooms: items,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "객실 조회 실패";
    return NextResponse.json({ message: msg }, { status: 502 });
  }
}
