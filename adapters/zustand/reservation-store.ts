"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { addDaysISO, todayISO } from "@/domain/shared/utils";
import { SITE_HOTEL_ID } from "@/adapters/static/hotel-provider";
import type { ApiRoomSelection } from "@/domain/reservation/types";

/* ── Re-export for consumer convenience ── */
export type { ApiRoomSelection } from "@/domain/reservation/types";

/* ── State + Actions ── */

export type ReservationState = {
  // Step 1
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  // Step 2
  hotelId: string | null;
  roomId: string | null;
  apiRoom: ApiRoomSelection | null;
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
  setApiRoom: (room: ApiRoomSelection) => void;
  clearApiRoom: () => void;
  setGuestInfo: (info: { name: string; phone: string; email: string; requests?: string }) => void;
  setReservationNumber: (n: string) => void;
  reset: () => void;
};

/* ── 초기값 (reset에서 재사용) ── */

const defaultCheckIn = addDaysISO(todayISO(), 14);
const defaultCheckOut = addDaysISO(defaultCheckIn, 2);

const INITIAL_STATE = {
  checkIn: defaultCheckIn,
  checkOut: defaultCheckOut,
  adults: 2,
  children: 0,
  hotelId: SITE_HOTEL_ID as string | null,
  roomId: null as string | null,
  apiRoom: null as ApiRoomSelection | null,
  guestName: "",
  guestPhone: "",
  guestEmail: "",
  guestRequests: "",
  reservationNumber: null as string | null,
} as const satisfies Omit<ReservationState,
  "setDates" | "setGuests" | "setHotel" | "setRoom" |
  "setApiRoom" | "clearApiRoom" | "setGuestInfo" | "setReservationNumber" | "reset"
>;

/* ── Store ── */

export const useReservation = create<ReservationState>()(
  persist(
    (set) => ({
      ...INITIAL_STATE,
      setDates: (checkIn, checkOut) => set({ checkIn, checkOut }),
      setGuests: (adults, children) => set({ adults, children }),
      setHotel: (hotelId) => set({ hotelId, roomId: null, apiRoom: null }),
      setRoom: (roomId) => set({ roomId }),
      setApiRoom: (room) => set({ apiRoom: room }),
      clearApiRoom: () => set({ apiRoom: null }),
      setGuestInfo: (info) =>
        set({
          guestName: info.name,
          guestPhone: info.phone,
          guestEmail: info.email,
          guestRequests: info.requests ?? "",
        }),
      setReservationNumber: (n) => set({ reservationNumber: n }),
      reset: () => set({ ...INITIAL_STATE }),
    }),
    {
      name: "coolstay-reservation",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
