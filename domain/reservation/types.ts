export type ApiRoomSelection = {
  motelKey: string;
  storeName: string;
  sitePayment: boolean;
  packageKey: string;
  roomName: string;
  roomImage: string | null;
  maxGuests: number;
  price: number;
  dailyPrices: number[];
  checkInTime: string;
  checkOutTime: string;
};

export type ReservationReadyParams = {
  hotelId: string;
  roomId: string;
  checkIn: string;
  checkOut: string;
  guestName: string;
  guestPhone: string;
  totalPrice: number;
  basePrice: number;
  checkInTime: string;
  checkOutTime: string;
};

export type ReservationResult = {
  bookId: string;
  status: string;
};
