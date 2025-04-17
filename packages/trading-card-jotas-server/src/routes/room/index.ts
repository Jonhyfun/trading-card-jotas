import { wrapRoute } from "../types";
import { getRooms, setRooms } from "@/states/room";
import { withAuthorization } from "../middlewares";
import { removeUserFromRoom } from "@/utils/game/room";
import { validDeck } from "../../utils/game/deck/validations";
import { RoomPlayer } from "@/states/socket";

export const getRoomsRoute = wrapRoute("rooms", (req, res, close) => {
  res.send(
    Object.entries(getRooms()).map(([key, players]) => ({
      room: key,
      playerCount: players.length,
    }))
  );
  close();
});

getRoomsRoute.route = { params: [], method: "get" };

export const currentSocket = wrapRoute("currentSocket", (req, res, close) =>
  withAuthorization(req, res, close, (user, socket) => res.send(socket.uid))
);

currentSocket.route = { params: [], method: "get" };

export const joinRoom = wrapRoute<Record<"room", string>>(
  "joinRoom",
  (req, res, close) =>
    withAuthorization(req, res, close, (user, socket) => {
      //TODO zod please lol
      const room = req.params.room;
      console.log(req.cookies);

      socket.room = room;

      const onUserJoinRoom = () => {
        socket.onclose = () => {
          removeUserFromRoom(socket, room);
        };
        socket.send(`setStance/${socket.player.stance}`);
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

          Object.keys(removedUser).forEach((key) => {
            socket[key as keyof RoomPlayer] = removedUser[
              key as keyof RoomPlayer
            ] as never;
          });

          onUserJoinRoom();

          console.log("forced A");
          return {
            ...current,
            [room]: [...current[room], socket],
          };
        }

        if (!validDeck(socket.player.deck.map(({ cardKey }) => cardKey))) {
          socket.send("error/Deck inválido!");
          socket.send("redirect/-");
          console.log("forced B");
          return current;
        }

        if (current[room]?.length === 2) {
          socket.send("error/Sala cheia!");
          socket.send("redirect/rooms");
          console.log("forced C");
          return current;
        }

        if (current[room]?.[0]) {
          onUserJoinRoom();
          console.log(
            `${socket.uid} entrou em ${room} como ${socket.player.stance}`
          );

          current[room][0].send("setGameState/running");
          socket.send("setGameState/running");
          console.log("forced D");
          return {
            ...current,
            [room]: [current[room][0], socket],
          };
        }

        onUserJoinRoom();

        console.log(
          `${socket.uid} entrou em ${room} como ${socket.player.stance}`
        );

        return { ...current, [room]: [socket] };
      });

      return { success: true };
    })
);

joinRoom.route = { params: ["room"], method: "get" };
