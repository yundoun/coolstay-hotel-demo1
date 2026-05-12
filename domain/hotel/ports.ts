import type { Hotel, Room } from "./types";

export interface HotelProvider {
  getHotel(id: string): Hotel | undefined;
  getRoom(id: string): Room | undefined;
  getSiteHotel(): Hotel;
  getSiteHotelId(): string;
  getAllRooms(): Room[];
}
