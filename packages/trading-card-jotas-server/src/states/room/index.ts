import type { ConnectedSocket } from "../socket";

type RoomType = { [key in string]: ConnectedSocket[] };
let rooms: RoomType = {};

export const deleteRoom = (room: string) => {
  delete rooms[room];
};
export const setRooms = (setter: (current: RoomType) => RoomType) => {
  rooms = setter(rooms);
};
export const getRooms = () => rooms;
