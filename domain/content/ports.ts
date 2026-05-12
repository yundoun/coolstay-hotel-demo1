import type { SiteContent } from "./types";

export interface ContentProvider {
  getSiteContent(): SiteContent;
}

export type RoomTypeInfo = {
  itemKey: string;
  name: string;
  description: string;
  maxGuests: number;
  images: { url: string; thumbUrl: string }[];
  basePrice: number;
};

export type StoreInfoResult = {
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
  rooms: RoomTypeInfo[];
};

export interface StoreInfoRepository {
  fetchStoreInfo(): Promise<StoreInfoResult>;
}
