"use client";

import { useCallback } from "react";
import { RoomShowcase } from "@/components/room-showcase";
import type { Room } from "@/lib/types";

/**
 * Onepage 전용 RoomShowcase 래퍼.
 * 객실 클릭 시 #reservation 섹션으로 스크롤만 수행.
 * 객실 선택은 예약 플로우 Step 2에서 직접 하도록 위임.
 */
export function OnepageRoomShowcase({
  rooms,
  hotelId,
}: {
  rooms: Room[];
  hotelId: string;
}) {
  const handleRoomSelect = useCallback((_roomId: string) => {
    const el = document.getElementById("reservation");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  return (
    <RoomShowcase
      rooms={rooms}
      hotelId={hotelId}
      onRoomSelect={handleRoomSelect}
    />
  );
}
