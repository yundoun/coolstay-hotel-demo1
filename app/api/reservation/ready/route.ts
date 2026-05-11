import { NextResponse } from "next/server";

/** 임시 토큰을 발급받아 { access_token, secret } 반환 */
async function getTemporaryToken(apiBase: string) {
  const res = await fetch(`${apiBase}/api/v2/mobile/auth/sessions/temporary`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    throw new Error(`임시 토큰 발급 실패 (${res.status})`);
  }

  const data = await res.json();
  if (data.code !== "20000000") {
    throw new Error(data.desc || `임시 토큰 발급 실패 (${data.code})`);
  }

  const token = data.result?.token;
  if (!token?.access_token) {
    throw new Error("임시 토큰 응답에 access_token이 없습니다");
  }

  return { accessToken: token.access_token, secret: token.secret };
}

export async function POST(request: Request) {
  const body = await request.json();
  const apiBase = process.env.COOLSTAY_API_BASE;

  // 실제 API 서버가 설정되어 있으면 프록시
  if (apiBase) {
    // 1) 임시 토큰 발급
    let accessToken: string;
    let secret: string;
    try {
      const token = await getTemporaryToken(apiBase);
      accessToken = token.accessToken;
      secret = token.secret;
    } catch (e) {
      console.error("[reservation proxy] token failed:", e);
      return NextResponse.json(
        { message: e instanceof Error ? e.message : "임시 토큰 발급 실패" },
        { status: 502 },
      );
    }

    // 2) 예약 요청 (app-token + app-secret-code 헤더 필수)
    let upstream: Response;
    try {
      upstream = await fetch(`${apiBase}/api/v2/mobile/reserv/ready`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "app-token": accessToken,
          "app-secret-code": secret,
        },
        body: JSON.stringify(body),
      });
    } catch (e) {
      console.error("[reservation proxy] fetch failed:", e);
      return NextResponse.json(
        { message: `API 서버 연결 실패: ${apiBase}` },
        { status: 502 },
      );
    }

    const contentType = upstream.headers.get("content-type") ?? "";
    if (!contentType.includes("application/json")) {
      const text = await upstream.text();
      console.error("[reservation proxy] non-JSON response:", upstream.status, text.slice(0, 200));
      return NextResponse.json(
        { message: `API 서버가 JSON이 아닌 응답을 반환했습니다 (${upstream.status})` },
        { status: 502 },
      );
    }

    const data = await upstream.json();

    if (!upstream.ok || data.code !== "20000000") {
      return NextResponse.json(
        { message: data.desc || "예약 요청이 실패했습니다.", code: data.code },
        { status: upstream.ok ? 400 : upstream.status },
      );
    }

    return NextResponse.json(data.result);
  }

  // Mock 모드 — 데모용 즉시 응답
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  const bookId = `MOCK-${ts}-${rand}`;

  return NextResponse.json({
    book_id: bookId,
    status: "CONFIRMED",
  });
}
