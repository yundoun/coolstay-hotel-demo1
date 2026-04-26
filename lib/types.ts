export type Region = "수도권" | "영남" | "호남" | "제주" | "강원";

export type Hotel = {
  id: string;
  name: string;
  nameEn: string;
  city: string;
  region: Region;
  grade: 4 | 5;
  heroImage: string;
  galleryImages: string[];
  shortConcept: string;
  description: string;
  amenities: string[];
  address: string;
  checkInTime: string;
  checkOutTime: string;
  phone: string;
};

export type Room = {
  id: string;
  hotelId: string;
  name: string;
  concept: string;
  sizeSqm: number;
  bedType: "킹" | "트윈" | "더블" | "슈퍼킹";
  view: string;
  images: string[];
  amenities: string[];
  maxOccupancy: number;
  basePrice: number;
  currency: "KRW";
  tier: "DELUXE" | "PREMIER" | "SUITE" | "SIGNATURE";
};

export type Reservation = {
  id: string;
  reservationNumber: string;
  hotelId: string;
  roomId: string;
  checkIn: string;
  checkOut: string;
  guests: { adults: number; children: number };
  guest: { name: string; phone: string; email: string; requests?: string };
  totalPrice: number;
  createdAt: string;
};
