import type { Cards } from "trading-card-jotas-types/cards/types";
import prisma from "@/providers/prisma";
import { wrapRoute } from "../types";
import { getRoom, getRooms, setRooms } from "@/states/room";
import { withAuthorization } from "../middlewares";
import { validDeck } from "../../utils/game/deck/validations";
import { Room } from "@/models/room";
import { Game } from "@/models/game";

export const getRoomsRoute = wrapRoute("rooms", (req, res, close) => {
  res.send(
    Object.entries(getRooms()).map(([key, room]) => ({
      room: key,
      playerCount: Object.keys(room.game.players).length,
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
    withAuthorization(req, res, close, async (user, socket) => {
      const roomId = req.params.room;

      const onUserJoinRoom = () => {
        socket.onclose = () => {
          room.leave(socket.player);
        };
        socket.send(`setStance/${socket.player.stance}`);
        socket.send("joinedRoom");
      };

      const userDeck = await prisma.deck.findFirstOrThrow({
        where: {
          userFirebaseId: socket.uid,
        },
      });

      if (!userDeck || !validDeck(userDeck.cards as Cards[])) {
        socket.send("error/Deck inválido!");
        socket.send("redirect/-");
        console.log(`${socket.uid} has an invalid deck!`);
        return { error: true };
      }

      socket.player.dispatchDeck(userDeck.cards as Cards[]);

      let room: Room = getRoom(roomId);
      if (!room) {
        room = new Room(roomId, new Game());
        setRooms((current) => ({ ...current, [roomId]: room }));
      }

      socket.room = roomId;

      //console.log(room);

      if (room.game.players[socket.uid]) {
        const disconnectedUser = room.game.players[socket.uid];
        socket.player = disconnectedUser;

        console.log(`${socket.uid} rejoined!`);

        onUserJoinRoom();
        return { success: true };
      }

      if (Object.keys(room.game.players).length === 2) {
        socket.send("error/Sala cheia!");
        socket.send("redirect/rooms");
        console.log(`${socket.uid} tried to join a full room!`);
        return { error: true };
      }

      room.join(socket.player);
      onUserJoinRoom();
      console.log(`${socket.uid} joined ${room.id} as ${socket.player.stance}`);

      if (Object.keys(room.game.players).length === 2) {
        Object.values(room.game.players).forEach((player) => {
          player.loadDeck();
          player.dealHand();
        });
        room.broadcast("setGameState/running");
      }

      return { success: true };
    })
);

joinRoom.route = { params: ["room"], method: "get" };
