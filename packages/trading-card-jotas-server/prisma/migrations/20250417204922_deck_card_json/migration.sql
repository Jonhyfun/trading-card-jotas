/*
  Warnings:

  - You are about to drop the `Card` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `cards` to the `Deck` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Card" DROP CONSTRAINT "Card_deckId_fkey";

-- AlterTable
ALTER TABLE "Deck" ADD COLUMN     "cards" JSONB NOT NULL;

-- DropTable
DROP TABLE "Card";
