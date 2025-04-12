type GameState = "waitingForPlayers" | "running" | "victory" | "loss";

export type GameData = {
  id: string;
  state: GameState;
  players: 0 | 1 | 2;
  spectators?: number;
};
