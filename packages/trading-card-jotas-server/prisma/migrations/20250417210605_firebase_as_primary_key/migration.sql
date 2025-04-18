/*
  Warnings:

  - The primary key for the `Deck` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Deck` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Deck_userFirebaseId_key";

-- AlterTable
ALTER TABLE "Deck" DROP CONSTRAINT "Deck_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "Deck_pkey" PRIMARY KEY ("userFirebaseId");
