/*
  Warnings:

  - You are about to drop the column `personalId` on the `alunos` table. All the data in the column will be lost.
  - You are about to drop the column `personalId` on the `sessoes` table. All the data in the column will be lost.
  - You are about to drop the `personals` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "alunos" DROP CONSTRAINT "alunos_personalId_fkey";

-- DropForeignKey
ALTER TABLE "sessoes" DROP CONSTRAINT "sessoes_personalId_fkey";

-- DropIndex
DROP INDEX "alunos_personalId_idx";

-- DropIndex
DROP INDEX "sessoes_personalId_idx";

-- AlterTable
ALTER TABLE "alunos" DROP COLUMN "personalId";

-- AlterTable
ALTER TABLE "sessoes" DROP COLUMN "personalId";

-- DropTable
DROP TABLE "personals";
