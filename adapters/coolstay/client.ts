/** CoolStay upstream API 클라이언트 */

const API_BASE = process.env.COOLSTAY_API_BASE;

/** yyyy-MM-dd → yyyyMMdd (검수기 내부 서비스 호환) */
function toCompactDate(iso: string): string {
  return iso.replace(/-/g, "");
}
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

/** 비회원 예약 조회 */
export async function fetchGuestReservation(bookId: string, phoneNumber: string) {
  const { accessToken, secret } = await getToken();

  const qs = new URLSearchParams({ book_id: bookId, phone_number: phoneNumber });
  const url = `${getApiBase()}/api/v2/mobile/reserv/guest/list?${qs}`;

  const upstream = await fetch(url, {
    headers: { "app-token": accessToken, "app-secret-code": secret },
  });

  const raw = await upstream.text();
  const data = JSON.parse(raw.replace(/[\x00-\x1f]/g, " "));

  if (data.code !== "20000000") {
    throw new Error(data.desc || "예약 조회 실패");
  }

  return data.result;
}

/** 예약 취소 */
export async function cancelReservation(bookId: string) {
  const { accessToken, secret } = await getToken();

  const url = `${getApiBase()}/api/v2/mobile/reserv/delete`;
  const upstream = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "app-token": accessToken,
      "app-secret-code": secret,
    },
    body: JSON.stringify({ book_id: bookId }),
  });

  const raw = await upstream.text();
  const data = JSON.parse(raw.replace(/[\x00-\x1f]/g, " "));

  if (data.code !== "20000000") {
    throw new Error(data.desc || "예약 취소 실패");
  }

  return data.result;
}

/** SMS 인증번호 발송 */
export async function sendSmsCode(phoneNumber: string) {
  const { accessToken, secret } = await getToken();
  const url = `${getApiBase()}/api/v2/mobile/auth/code/send`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "app-token": accessToken,
      "app-secret-code": secret,
    },
    body: JSON.stringify({ phone_number: phoneNumber.replace(/-/g, "") }),
  });
  const raw = await res.text();
  const data = JSON.parse(raw.replace(/[\x00-\x1f]/g, " "));
  if (data.code !== "20000000") {
    throw new Error(data.desc || "인증번호 발송 실패");
  }
  return { smsAuthKey: data.result.sms_auth_key as string };
}

/** SMS 인증번호 확인 */
export async function verifySmsCode(smsAuthKey: string, smsAuthCode: string, phoneNumber: string) {
  const { accessToken, secret } = await getToken();
  const url = `${getApiBase()}/api/v2/mobile/auth/code/check`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "app-token": accessToken,
      "app-secret-code": secret,
    },
    body: JSON.stringify({
      sms_auth_key: smsAuthKey,
      sms_auth_code: smsAuthCode,
      auth_method: phoneNumber.replace(/-/g, ""),
    }),
  });
  const raw = await res.text();
  console.log("[verifySmsCode] upstream raw:", raw);
  const data = JSON.parse(raw.replace(/[\x00-\x1f]/g, " "));
  console.log("[verifySmsCode] parsed result:", JSON.stringify(data.result));
  if (data.code !== "20000000") {
    throw new Error(data.desc || "인증번호 확인 실패");
  }
  return { isVerified: (data.result.isVerified ?? data.result.is_verified) as boolean };
}

/** 약관 목록 조회 */
export async function fetchTermsList() {
  const { accessToken, secret } = await getToken();
  const url = `${getApiBase()}/api/v2/mobile/manage/terms/list`;
  console.log("[fetchTermsList] url:", url);
  const res = await fetch(url, {
    headers: { "app-token": accessToken, "app-secret-code": secret },
  });
  const raw = await res.text();
  console.log("[fetchTermsList] status:", res.status, "raw:", raw.slice(0, 500));
  const data = JSON.parse(raw.replace(/[\x00-\x1f]/g, " "));
  if (data.code !== "20000000") {
    throw new Error(data.desc || "약관 조회 실패");
  }
  return data.result.terms as {
    code: string;
    name: string;
    url: string;
    required_yn: string;
    version: string;
  }[];
}

/** 취소 환불 규정 조회 */
export async function fetchRefundPolicy(params: {
  storeKey: string;
  itemKey: string;
  packKey: string;
  checkIn: string;
  checkOut: string;
}) {
  const { accessToken, secret } = await getToken();
  const qs = new URLSearchParams({
    store_key: params.storeKey,
    item_key: params.itemKey,
    pack_key: params.packKey,
    search_start_date: toCompactDate(params.checkIn),
    search_end_date: toCompactDate(params.checkOut),
  });
  const url = `${getApiBase()}/api/v2/mobile/contents/refund-policy/list?${qs}`;
  const res = await fetch(url, {
    headers: { "app-token": accessToken, "app-secret-code": secret },
  });
  const raw = await res.text();
  const data = JSON.parse(raw.replace(/[\x00-\x1f]/g, " "));
  if (data.code !== "20000000") {
    throw new Error(data.desc || "환불 규정 조회 실패");
  }
  return (data.result.refund_policies ?? data.result.refundPolicies ?? []) as {
    until: string;
    percent: number;
    amount: number;
  }[];
}

/** details/list upstream 호출 공통 */
export async function fetchStoreDetail(params: { checkIn?: string; checkOut?: string }) {
  if (!MOTEL_KEY) throw new Error("COOLSTAY_MOTEL_KEY 미설정");
  const { accessToken, secret } = await getToken();

  const qs = new URLSearchParams({ motel_key: MOTEL_KEY, pure_click_yn: "N" });
  if (params.checkIn) qs.set("search_start", toCompactDate(params.checkIn));
  if (params.checkOut) qs.set("search_end", toCompactDate(params.checkOut));

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
