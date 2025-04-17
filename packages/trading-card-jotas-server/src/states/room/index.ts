import type { Player } from "@/models/player";

type RoomType = Record<string, Player[]>;
let rooms: RoomType = {};

export const deleteRoom = (room: string) => {
  delete rooms[room];
};
export const setRooms = (setter: (current: RoomType) => RoomType) => {
  rooms = setter(rooms);
};
export const getRooms = () => rooms;
