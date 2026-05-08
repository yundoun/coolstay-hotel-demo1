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
      guestName: "",
      guestPhone: "",
      guestEmail: "",
      guestRequests: "",
      reservationNumber: null,
      setDates: (checkIn, checkOut) => set({ checkIn, checkOut }),
      setGuests: (adults, children) => set({ adults, children }),
      setHotel: (hotelId) => set({ hotelId, roomId: null }),
      setRoom: (roomId) => set({ roomId }),
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
