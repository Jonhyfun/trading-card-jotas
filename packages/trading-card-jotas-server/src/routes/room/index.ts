import type { UserData } from "@/states/socket";
import { initialUserData as shallowInitialUserData } from "@/utils/mock";
import { deepCopy } from "@/utils/object";
import { wrapRoute } from "../types";
import { getRooms, setRooms } from "@/states/room";
import { withAuthorization } from "../middlewares";
import { removeUserFromRoom } from "@/utils/game/room";

export const getRoomsRoute = wrapRoute("rooms", (req, res) => {
  return res.send(
    Object.entries(getRooms()).map(([key, players]) => ({
      room: key,
      playerCount: players.length,
    }))
  );
});

getRoomsRoute.route = { params: [], method: "get" };

export const currentSocket = wrapRoute("currentSocket", (req, res) =>
  withAuthorization(req, res, (user, socket) => res.send(socket.uid))
);

currentSocket.route = { params: [], method: "get" };

export const joinRoom = wrapRoute<Record<"room", string>>(
  "joinRoom",
  (req, res) =>
    withAuthorization(req, res, (user, socket) => {
      //TODO zod please lol
      const room = req.params.room;

      const initialUserData = deepCopy(shallowInitialUserData);
      initialUserData.room = room;

      Object.entries(initialUserData).forEach(([key, value]) => {
        socket[key as keyof UserData] = value;
      });

      socket.room = room;

      const onUserJoinRoom = () => {
        socket.onclose = () => {
          removeUserFromRoom(socket, room);
        };
        socket.send(`setStance/${socket.stance}`);
        socket.send("joinedRoom");
      };

      setRooms((current) => {
        const alreadyConnectedUserIndex = current[room]
          ? current[room].findIndex(({ uid }) => uid === socket.uid)
          : -1;

        if (
          alreadyConnectedUserIndex !== -1 &&
          alreadyConnectedUserIndex !== undefined
        ) {
          const removedUser = current[room].splice(
            alreadyConnectedUserIndex,
            1
          )[0];

          Object.keys(initialUserData).forEach((key) => {
            socket[key as keyof UserData] = removedUser[
              key as keyof UserData
            ] as never;
          });

          onUserJoinRoom();

          return {
            ...current,
            [room]: [...current[room], socket],
          };
        }

        if (!socket.deck || socket.deck.length !== 20) {
          socket.send("error/Deck inválido!");
          socket.send("redirect/-");
          return current;
        }

        if (current[room]?.length === 2) {
          socket.send("error/Sala cheia!");
          socket.send("redirect/rooms");
          return current;
        }

        if (current[room]?.[0]) {
          onUserJoinRoom();
          console.log(`${socket.uid} entrou em ${room} como ${socket.stance}`);

          current[room][0].send("setGameState/running");
          socket.send("setGameState/running");
          return {
            ...current,
            [room]: [current[room][0], socket],
          };
        }

        onUserJoinRoom();

        console.log(`${socket.uid} entrou em ${room} como ${socket.stance}`);

        return { ...current, [room]: [socket] };
      });

      return { success: true };
    })
);

joinRoom.route = { params: ["room"], method: "get" };
