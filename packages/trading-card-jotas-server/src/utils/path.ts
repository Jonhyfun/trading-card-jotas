import path from "path";

const typesRoot = path.dirname(
  require.resolve("trading-card-jotas-types/package.json")
);

export function getCardImagePath(cardName: string) {
  return path.join(typesRoot, "cards", cardName, `${cardName}.png`);
}
