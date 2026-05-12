import type { ReservationReadyParams, ReservationResult } from "./types";

export interface RoomRepository {
  fetchRooms(checkIn: string, checkOut: string): Promise<{
    motelKey: string;
    storeName: string;
    sitePayment: boolean;
    rooms: {
      itemKey: string;
      packageKey: string;
      name: string;
      maxGuests: number;
      image: string | null;
      price: number;
      dailyPrices: number[];
      checkInTime: string;
      checkOutTime: string;
    }[];
  }>;
}

export interface ReservationGateway {
  submitReservation(params: ReservationReadyParams): Promise<ReservationResult>;
}
