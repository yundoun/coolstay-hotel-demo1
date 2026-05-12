/** CoolStay upstream API 클라이언트 */

const API_BASE = process.env.COOLSTAY_API_BASE;
export const MOTEL_KEY = process.env.COOLSTAY_MOTEL_KEY ?? "";

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
  if (!MOTEL_KEY) throw new Error("COOLSTAY_MOTEL_KEY 미설정");
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
