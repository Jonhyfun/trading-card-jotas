import type { Room } from "@/models/room";

type RoomType = Record<string, Room>;
let rooms: RoomType = {};

export const deleteRoom = (room: string) => {
  delete rooms[room];
};
export const setRooms = (setter: (current: RoomType) => RoomType) => {
  rooms = setter(rooms);
};
export const getRooms = () => rooms;
export const getRoom = (roomId: keyof typeof rooms) => rooms[roomId];
