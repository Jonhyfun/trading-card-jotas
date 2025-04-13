import { initialUserData as shallowInitialUserData } from "@/utils/mock";
import { deepCopy } from "@/utils/object";
import { wrapRoute } from "../types";
import { getRooms } from "@/states/room";
import { getSocket } from "@/states/socket";
import { getAuth } from "firebase-admin/auth";

export const getRoomsRoute = wrapRoute("roomsRoute", (req, res) => {
  return res.send(
    Object.entries(getRooms()).map(([key, players]) => ({
      room: key,
      playerCount: players.length,
    }))
  );
});

getRoomsRoute.route = { params: [], method: "get" };

export const currentSocket = wrapRoute("currentSocket", (req, res) => {
  const token = (req.headers["authorization"] as string).split("Bearer ")[1];
  if (!token) return res.status(403).end();

  getAuth()
    .verifyIdToken(token)
    .then((user) => {
      res.send(getSocket(user.uid).uid);
    });
});

currentSocket.route = { params: [], method: "get" };

// export const joinRoom = (ws: ConnectedSocket, payload: string) => {
//   const joinData = JSON.parse(payload) as { room: string; deck?: string[] };
//   if (!joinData?.room) return;

//   if (joinData.deck) {
//     baseSetCurrentDeck(ws, JSON.stringify(joinData.deck));
//   }

//   const initialUserData = deepCopy(shallowInitialUserData);
//   initialUserData.room = joinData.room;

//   //? (o tipo) WebSocket não suporta spread (e tem muita coisa dentro que poderia cagar a performance)
//   Object.entries(initialUserData).forEach(([key, value]) => {
//     ws[key] = value;
//   });

//   ws.room = joinData.room;

//   const onUserJoinRoom = () => {
//     ws.onclose = () => {
//       removeUserFromRoom(ws, joinData.room);
//     };
//     ws.send(`setStance/${ws.stance}`);
//     ws.send("joinedRoom");
//   };

//   setRooms((current) => {
//     const alreadyConnectedUserIndex = current[joinData.room]
//       ? current[joinData.room].findIndex(({ ip }) => ip === ws.uid)
//       : -1;

//     if (
//       alreadyConnectedUserIndex !== -1 &&
//       alreadyConnectedUserIndex !== undefined
//     ) {
//       const removedUser = current[joinData.room].splice(
//         alreadyConnectedUserIndex,
//         1
//       )[0];

//       Object.keys(initialUserData).forEach((key) => {
//         ws[key] = removedUser[key];
//       });

//       onUserJoinRoom();
//       console.log(`${ws.uid} reconectou em ${joinData.room} como ${ws.stance}`);

//       return { ...current, [joinData.room]: [...current[joinData.room], ws] };
//     }

//     if (!ws.deck || ws.deck.length !== 20) {
//       ws.send("error/Deck inválido!");
//       ws.send("redirect/-");
//       return current;
//     }

//     if (current[joinData.room]?.length === 2) {
//       ws.send("error/Sala cheia!");
//       ws.send("redirect/rooms");
//       return current;
//     }

//     if (current[joinData.room]?.[0]) {
//       onUserJoinRoom();
//       console.log(`${ws.uid} entrou em ${joinData.room} como ${ws.stance}`);

//       current[joinData.room][0].send("setGameState/running");
//       ws.send("setGameState/running");
//       return { ...current, [joinData.room]: [current[joinData.room][0], ws] };
//     }

//     onUserJoinRoom();
//     console.log(`${ws.uid} entrou em ${joinData.room} como ${ws.stance}`);
//     return { ...current, [joinData.room]: [ws] };
//   });
// };
