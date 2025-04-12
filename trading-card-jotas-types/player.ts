export type ServerCard = {
  cardKey: string;
  id: string;
};

type VisualEffects = "overwritten" | "copied" | "ghost";

export type Player = {
  stance: "attack" | "defense";
  hand: ServerCard[];
  stack: ServerCard[];
  visualEffects: VisualEffects[];
  points: string;
};
