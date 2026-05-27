import type { Hotel } from "@/domain/hotel/types";

import {
  siteHotel as gyeongjuHotel,
  SITE_HOTEL_ID as gyeongjuId,
} from "./gyeongju-palace/hotel";
import {
  siteHotel as daeguHotel,
  SITE_HOTEL_ID as daeguId,
} from "./daegu-february/hotel";

const profile = process.env.NEXT_PUBLIC_HOTEL_PROFILE ?? "gyeongju-palace";

const hotels: Record<string, { hotel: Hotel; id: string }> = {
  "gyeongju-palace": { hotel: gyeongjuHotel, id: gyeongjuId },
  "daegu-february": { hotel: daeguHotel, id: daeguId },
};

const selected = hotels[profile] ?? hotels["gyeongju-palace"];

export const siteHotel = selected.hotel;
export const SITE_HOTEL_ID = selected.id;
