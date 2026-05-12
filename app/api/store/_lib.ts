/** 쿨스테이 API 공통 유틸 */

const API_BASE = process.env.COOLSTAY_API_BASE;
export const MOTEL_KEY = "D_KCST_20250619130000_Gr0DTs";

export function getApiBase() {
  if (!API_BASE) throw new Error("COOLSTAY_API_BASE 미설정");
  return API_BASE;
}

export async function getToken() {
  const res = await fetch(`${getApiBase()}/api/v2/mobile/auth/sessions/temporary`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  const data = await res.json();
  const token = data.result?.token;
  return { accessToken: token.access_token as string, secret: token.secret as string };
}

/** details/list upstream 호출 공통 */
export async function fetchStoreDetail(params: { checkIn?: string; checkOut?: string }) {
  const { accessToken, secret } = await getToken();

  const qs = new URLSearchParams({ motel_key: MOTEL_KEY, pure_click_yn: "N" });
  if (params.checkIn) qs.set("search_start", params.checkIn);
  if (params.checkOut) qs.set("search_end", params.checkOut);

  const url = `${getApiBase()}/api/v2/mobile/contents/details/list?${qs}`;
  const upstream = await fetch(url, {
    headers: { "app-token": accessToken, "app-secret-code": secret },
  });

  // upstream이 control character를 포함한 JSON을 반환하는 경우 방어
  const raw = await upstream.text();
  const data = JSON.parse(raw.replace(/[\x00-\x1f]/g, " "));

  if (data.code !== "20000000") {
    throw new Error(data.desc || "숙소 조회 실패");
  }

  return data.result.motel;
}

/* ── 공통 파서 ── */

/** item.extras 배열 → { code: value } 맵 */
export function parseExtras(item: any): Record<string, string> {
  const map: Record<string, string> = {};
  for (const e of item.extras ?? []) map[e.code] = e.value;
  return map;
}

/** upstream item → ApiRoom (예약용 객실, 날짜 기반 가격 포함) */
export function toApiRoom(item: any): {
  itemKey: string;
  packageKey: string;
  name: string;
  maxGuests: number;
  image: string | null;
  price: number;
  dailyPrices: number[];
  checkInTime: string;
  checkOutTime: string;
} | null {
  const sub = item.sub_items?.[0];
  if (!sub) return null;

  const extras = parseExtras(item);

  const dailyPrices: number[] = [];
  let stime = "";
  let etime = "";
  for (const d of sub.daily_extras ?? []) {
    const dex = parseExtras(d);
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
  };
}

/** upstream item → RoomType (홈페이지용, 기본 정보만) */
export function toRoomType(item: any): {
  itemKey: string;
  name: string;
  description: string;
  maxGuests: number;
  images: { url: string; thumbUrl: string }[];
  basePrice: number;
} {
  const ex = parseExtras(item);
  const sub = item.sub_items?.[0];
  return {
    itemKey: item.key,
    name: item.name,
    description: item.description ?? "",
    maxGuests: Number(ex.MAX ?? 2),
    images: (item.images ?? []).map((img: any) => ({
      url: img.url,
      thumbUrl: img.thumb_url,
    })),
    basePrice: sub?.price ?? Number(item.price ?? 0),
  };
}
