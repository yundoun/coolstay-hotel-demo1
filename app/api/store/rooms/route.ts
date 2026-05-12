import { NextResponse } from "next/server";
import { fetchStoreDetail, toApiRoom } from "../_lib";

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

export type RoomsResponse = {
  motelKey: string;
  storeName: string;
  sitePayment: boolean;
  rooms: ApiRoom[];
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
    const rooms = (motel.items ?? []).map(toApiRoom).filter(Boolean) as ApiRoom[];

    return NextResponse.json({
      motelKey: motel.key,
      storeName: motel.name,
      sitePayment: motel.site_payment_yn === "Y",
      rooms,
    } satisfies RoomsResponse);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "객실 조회 실패";
    return NextResponse.json({ message: msg }, { status: 502 });
  }
}
