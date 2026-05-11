import { NextResponse } from "next/server";

const API_BASE = process.env.COOLSTAY_API_BASE;
const MOTEL_KEY = "D_KCST_20250619130000_Gr0DTs";

async function getToken() {
  const res = await fetch(`${API_BASE}/api/v2/mobile/auth/sessions/temporary`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  const data = await res.json();
  const token = data.result?.token;
  return { accessToken: token.access_token, secret: token.secret };
}

export type ApiRoom = {
  itemKey: string; // 객실 키
  packageKey: string; // sub_item(패키지) 키 — 예약에 사용
  name: string;
  maxGuests: number;
  image: string | null;
  price: number; // 총 가격
  dailyPrices: number[];
  checkInTime: string; // "17"
  checkOutTime: string; // "08"
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const checkIn = searchParams.get("checkIn"); // yyyyMMdd
  const checkOut = searchParams.get("checkOut"); // yyyyMMdd

  if (!checkIn || !checkOut) {
    return NextResponse.json({ message: "checkIn, checkOut 필수" }, { status: 400 });
  }

  if (!API_BASE) {
    return NextResponse.json({ message: "COOLSTAY_API_BASE 미설정" }, { status: 500 });
  }

  let accessToken: string;
  let secret: string;
  try {
    const token = await getToken();
    accessToken = token.accessToken;
    secret = token.secret;
  } catch {
    return NextResponse.json({ message: "토큰 발급 실패" }, { status: 502 });
  }

  const url = `${API_BASE}/api/v2/mobile/contents/details/list?motel_key=${MOTEL_KEY}&search_start=${checkIn}&search_end=${checkOut}&pure_click_yn=N`;
  const upstream = await fetch(url, {
    headers: {
      "app-token": accessToken,
      "app-secret-code": secret,
    },
  });

  const raw = await upstream.text();
  const data = JSON.parse(raw.replace(/[\x00-\x1f]/g, " "));

  if (data.code !== "20000000") {
    return NextResponse.json({ message: data.desc || "숙소 조회 실패" }, { status: 400 });
  }

  const motel = data.result.motel;
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
}
