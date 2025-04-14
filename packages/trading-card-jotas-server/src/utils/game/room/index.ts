import type { ConnectedSocket } from "@/states/socket";
import { setRooms } from "@/states/room";

export const removeUserFromRoom = (ws: ConnectedSocket, room: string) => {
  setRooms((current) => {
    const roomWithoutLeavingUser = current[room]?.filter(
      (user) => user.uid !== ws.uid
    );
    if (!roomWithoutLeavingUser) return current;

    if (roomWithoutLeavingUser.length === 0) {
      const newCurrent = { ...current };
      delete newCurrent[room];
      return newCurrent;
    }
    return { ...current, [room]: roomWithoutLeavingUser };
  });
};
