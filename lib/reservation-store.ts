"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { addDaysISO, todayISO } from "./utils";
import { SITE_HOTEL_ID } from "./hotels";

export type ReservationState = {
  // Step 1
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  // Step 2
  hotelId: string | null;
  roomId: string | null;
  // Step 2 — API 연동용
  apiMotelKey: string | null;
  apiPackageKey: string | null;
  apiRoomName: string | null;
  apiPrice: number | null;
  apiCheckInTime: string | null; // "17"
  apiCheckOutTime: string | null; // "08"
  // Step 3
  guestName: string;
  guestPhone: string;
  guestEmail: string;
  guestRequests: string;
  // Step 4 outcome
  reservationNumber: string | null;
  // Actions
  setDates: (checkIn: string, checkOut: string) => void;
  setGuests: (adults: number, children: number) => void;
  setHotel: (hotelId: string | null) => void;
  setRoom: (roomId: string | null) => void;
  setApiRoom: (info: {
    motelKey: string;
    packageKey: string;
    roomName: string;
    price: number;
    checkInTime: string;
    checkOutTime: string;
  }) => void;
  setGuestInfo: (info: { name: string; phone: string; email: string; requests?: string }) => void;
  setReservationNumber: (n: string) => void;
  reset: () => void;
};

const defaultCheckIn = addDaysISO(todayISO(), 14);
const defaultCheckOut = addDaysISO(defaultCheckIn, 2);

export const useReservation = create<ReservationState>()(
  persist(
    (set) => ({
      checkIn: defaultCheckIn,
      checkOut: defaultCheckOut,
      adults: 2,
      children: 0,
      hotelId: SITE_HOTEL_ID,
      roomId: null,
      apiMotelKey: null,
      apiPackageKey: null,
      apiRoomName: null,
      apiPrice: null,
      apiCheckInTime: null,
      apiCheckOutTime: null,
      guestName: "",
      guestPhone: "",
      guestEmail: "",
      guestRequests: "",
      reservationNumber: null,
      setDates: (checkIn, checkOut) => set({ checkIn, checkOut }),
      setGuests: (adults, children) => set({ adults, children }),
      setHotel: (hotelId) =>
        set({ hotelId, roomId: null, apiMotelKey: null, apiPackageKey: null, apiRoomName: null, apiPrice: null, apiCheckInTime: null, apiCheckOutTime: null }),
      setRoom: (roomId) => set({ roomId }),
      setApiRoom: (info) =>
        set({
          apiMotelKey: info.motelKey,
          apiPackageKey: info.packageKey,
          apiRoomName: info.roomName,
          apiPrice: info.price,
          apiCheckInTime: info.checkInTime,
          apiCheckOutTime: info.checkOutTime,
        }),
      setGuestInfo: (info) =>
        set({
          guestName: info.name,
          guestPhone: info.phone,
          guestEmail: info.email,
          guestRequests: info.requests ?? "",
        }),
      setReservationNumber: (n) => set({ reservationNumber: n }),
      reset: () =>
        set({
          checkIn: defaultCheckIn,
          checkOut: defaultCheckOut,
          adults: 2,
          children: 0,
          hotelId: SITE_HOTEL_ID,
          roomId: null,
          apiMotelKey: null,
          apiPackageKey: null,
          apiRoomName: null,
          apiPrice: null,
          apiCheckInTime: null,
          apiCheckOutTime: null,
          guestName: "",
          guestPhone: "",
          guestEmail: "",
          guestRequests: "",
          reservationNumber: null,
        }),
    }),
    {
      name: "coolstay-reservation",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
