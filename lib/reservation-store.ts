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
  apiStoreName: string | null;
  apiSitePayment: boolean;
  apiPackageKey: string | null;
  apiRoomName: string | null;
  apiRoomImage: string | null;
  apiMaxGuests: number | null;
  apiPrice: number | null;
  apiDailyPrices: number[] | null;
  apiCheckInTime: string | null;
  apiCheckOutTime: string | null;
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
  setApiStore: (info: {
    motelKey: string;
    storeName: string;
    sitePayment: boolean;
  }) => void;
  setApiRoom: (info: {
    motelKey: string;
    packageKey: string;
    roomName: string;
    roomImage: string | null;
    maxGuests: number;
    price: number;
    dailyPrices: number[];
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
      apiStoreName: null,
      apiSitePayment: false,
      apiPackageKey: null,
      apiRoomName: null,
      apiRoomImage: null,
      apiMaxGuests: null,
      apiPrice: null,
      apiDailyPrices: null,
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
        set({ hotelId, roomId: null, apiMotelKey: null, apiStoreName: null, apiSitePayment: false, apiPackageKey: null, apiRoomName: null, apiRoomImage: null, apiMaxGuests: null, apiPrice: null, apiDailyPrices: null, apiCheckInTime: null, apiCheckOutTime: null }),
      setRoom: (roomId) => set({ roomId }),
      setApiStore: (info) =>
        set({
          apiMotelKey: info.motelKey,
          apiStoreName: info.storeName,
          apiSitePayment: info.sitePayment,
        }),
      setApiRoom: (info) =>
        set({
          apiMotelKey: info.motelKey,
          apiPackageKey: info.packageKey,
          apiRoomName: info.roomName,
          apiRoomImage: info.roomImage,
          apiMaxGuests: info.maxGuests,
          apiPrice: info.price,
          apiDailyPrices: info.dailyPrices,
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
          apiStoreName: null,
          apiSitePayment: false,
          apiPackageKey: null,
          apiRoomName: null,
          apiRoomImage: null,
          apiMaxGuests: null,
          apiPrice: null,
          apiDailyPrices: null,
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
