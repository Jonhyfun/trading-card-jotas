import type { PlayerSyncData, GameState } from "trading-card-jotas-types";
import { ConnectedSocket } from "@/states/socket";
import { Player } from "./player";

export class PlayerSocket {
  #socket: ConnectedSocket;
  #player: Player;

  constructor(socket: ConnectedSocket, player: Player) {
    this.#player = player;
    this.#socket = socket;
  }

  handleRoomJoin(onclose: VoidFunction) {
    this.#socket.onclose = onclose;
    this.sendSyncData();
  }

  sendError(message: string, redirectPath?: string) {
    this.#socket.sendEvent("error", { message, redirectPath });
  }

  sendMatchStatus(status: GameState, message?: string) {
    this.#socket.sendEvent("matchStatus", { status, message });
  }

  sendSyncData() {
    this.#socket.sendEvent("syncData", {
      points: this.#player.getPoints().toString(),
      hand: this.#player.hand,
      stack: this.#player.stack.cards,
      stance: this.#player.stance,
      effects: this.#player.effects,
    });
  }
}
