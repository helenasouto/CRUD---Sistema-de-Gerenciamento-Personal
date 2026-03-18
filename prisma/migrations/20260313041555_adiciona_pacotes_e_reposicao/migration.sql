/*
  Warnings:

  - The `objetivo` column on the `alunos` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `pagamentos` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `dataInicioContrato` to the `alunos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pacoteId` to the `alunos` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TipoSessao" AS ENUM ('NORMAL', 'REPOSICAO');

-- DropForeignKey
ALTER TABLE "pagamentos" DROP CONSTRAINT "pagamentos_alunoId_fkey";

-- AlterTable
ALTER TABLE "alunos" ADD COLUMN     "dataInicioContrato" DATE NOT NULL,
ADD COLUMN     "pacoteId" INTEGER NOT NULL,
DROP COLUMN "objetivo",
ADD COLUMN     "objetivo" VARCHAR(255);

-- AlterTable
ALTER TABLE "sessoes" ADD COLUMN     "tipo" "TipoSessao" NOT NULL DEFAULT 'NORMAL';

-- DropTable
DROP TABLE "pagamentos";

-- DropEnum
DROP TYPE "FormaPagamento";

-- DropEnum
DROP TYPE "Objetivo";

-- DropEnum
DROP TYPE "StatusPagamento";

-- DropEnum
DROP TYPE "TipoTreino";

-- CreateTable
CREATE TABLE "pacotes" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(100) NOT NULL,
    "frequenciaSemanal" INTEGER NOT NULL,
    "preco" DECIMAL(10,2) NOT NULL,
    "limiteReposicoes" INTEGER NOT NULL DEFAULT 1,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pacotes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "pacotes_ativo_idx" ON "pacotes"("ativo");

-- CreateIndex
CREATE INDEX "alunos_pacoteId_idx" ON "alunos"("pacoteId");

-- CreateIndex
CREATE INDEX "sessoes_tipo_idx" ON "sessoes"("tipo");

-- AddForeignKey
ALTER TABLE "alunos" ADD CONSTRAINT "alunos_pacoteId_fkey" FOREIGN KEY ("pacoteId") REFERENCES "pacotes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
