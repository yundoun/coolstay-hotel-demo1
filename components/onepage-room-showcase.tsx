"use client";

import { useCallback } from "react";
import { RoomShowcase } from "@/components/room-showcase";
import { useReservation } from "@/lib/reservation-store";
import { SITE_HOTEL_ID } from "@/lib/hotels";
import type { Room } from "@/lib/types";

/**
 * Onepage 전용 RoomShowcase 래퍼.
 * 객실 클릭 시 페이지 이동 없이:
 * 1. 스토어에 hotelId + roomId 세팅
 * 2. #reservation 섹션으로 스크롤
 */
export function OnepageRoomShowcase({
  rooms,
  hotelId,
}: {
  rooms: Room[];
  hotelId: string;
}) {
  const store = useReservation();

  const handleRoomSelect = useCallback(
    (roomId: string) => {
      store.setHotel(SITE_HOTEL_ID);
      store.setRoom(roomId);

      // 스크롤 후 약간의 딜레이로 자연스럽게
      setTimeout(() => {
        const el = document.getElementById("reservation");
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    },
    [store],
  );

  return (
    <RoomShowcase
      rooms={rooms}
      hotelId={hotelId}
      onRoomSelect={handleRoomSelect}
    />
  );
}
