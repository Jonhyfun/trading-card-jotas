import { Game } from "./game";
import { Player } from "./player";

export class Room {
  id: string;
  game: Game;

  constructor(_id: string, _game: Game) {
    this.id = _id;
    this.game = _game;
  }

  join(player: Player) {
    this.game.players[player.uid] = player;
    player.onJoinRoom(this);
  }

  leave(player: Player) {
    delete this.game.players[player.uid];
  }
}
