import { NextResponse } from "next/server";
import { getApiBase, getToken } from "@/adapters/coolstay/client";

export async function POST(request: Request) {
  const body = await request.json();

  // 1) 임시 토큰 발급
  let accessToken: string;
  let secret: string;
  try {
    const token = await getToken();
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
    upstream = await fetch(`${getApiBase()}/api/v2/mobile/reserv/ready`, {
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
      { message: `API 서버 연결 실패` },
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
