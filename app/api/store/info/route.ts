import { NextResponse } from "next/server";
import { fetchStoreDetail } from "../_lib";

export type StoreInfo = {
  motelKey: string;
  name: string;
  greetingMsg: string;
  phone: string;
  address: string;
  latitude: string;
  longitude: string;
  locationDesc: string;
  parkingYn: boolean;
  parkingInfo: string;
  sitePayment: boolean;
  images: { url: string; thumbUrl: string; description: string }[];
  rooms: RoomType[];
};

export type RoomType = {
  itemKey: string;
  name: string;
  description: string;
  maxGuests: number;
  images: { url: string; thumbUrl: string }[];
  basePrice: number;
};

/** 홈 페이지용 — 숙소 기본 정보 + 객실 유형 (날짜 불필요) */
export async function GET() {
  try {
    const motel = await fetchStoreDetail({});

    const extras = (item: any): Record<string, string> => {
      const map: Record<string, string> = {};
      for (const e of item.extras ?? []) map[e.code] = e.value;
      return map;
    };

    const rooms: RoomType[] = (motel.items ?? []).map((item: any) => {
      const ex = extras(item);
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
      } satisfies RoomType;
    });

    const storeImages = (motel.images ?? []).map((img: any) => ({
      url: img.url as string,
      thumbUrl: img.thumb_url as string,
      description: (img.description ?? "") as string,
    }));

    const info: StoreInfo = {
      motelKey: motel.key,
      name: motel.name,
      greetingMsg: motel.greeting_msg ?? "",
      phone: motel.phone_number ?? motel.safe_number ?? "",
      address: motel.location?.address ?? "",
      latitude: motel.location?.latitude ?? "",
      longitude: motel.location?.longitude ?? "",
      locationDesc: motel.location?.description ?? "",
      parkingYn: motel.parking_yn === "Y",
      parkingInfo: motel.parking_info ?? "",
      sitePayment: motel.site_payment_yn === "Y",
      images: storeImages,
      rooms,
    };

    return NextResponse.json(info);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "숙소 정보 조회 실패";
    return NextResponse.json({ message: msg }, { status: 502 });
  }
}
