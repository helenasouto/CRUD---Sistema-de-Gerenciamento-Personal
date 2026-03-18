/*
  Warnings:

  - You are about to drop the column `observacoes` on the `avaliacoes` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "FormaPagamento" AS ENUM ('DINHEIRO', 'PIX', 'CARTAO_CREDITO', 'CARTAO_DEBITO', 'BOLETO');

-- CreateEnum
CREATE TYPE "StatusPagamento" AS ENUM ('PENDENTE', 'CONFIRMADO', 'CANCELADO');

-- AlterEnum
ALTER TYPE "StatusSessao" ADD VALUE 'REAGENDADA';

-- AlterTable
ALTER TABLE "avaliacoes" DROP COLUMN "observacoes";

-- CreateTable
CREATE TABLE "historico_sessoes" (
    "id" SERIAL NOT NULL,
    "dataOriginal" DATE NOT NULL,
    "horarioInicioOriginal" TIME NOT NULL,
    "horarioFimOriginal" TIME NOT NULL,
    "dataAlterada" DATE NOT NULL,
    "horarioInicioAlterado" TIME NOT NULL,
    "horarioFimAlterado" TIME NOT NULL,
    "alteradoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sessaoId" INTEGER NOT NULL,

    CONSTRAINT "historico_sessoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pagamentos" (
    "id" SERIAL NOT NULL,
    "valor" DECIMAL(10,2) NOT NULL,
    "formaPagamento" "FormaPagamento" NOT NULL,
    "status" "StatusPagamento" NOT NULL DEFAULT 'PENDENTE',
    "dataVencimento" DATE NOT NULL,
    "dataPagamento" DATE,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,
    "alunoId" INTEGER NOT NULL,

    CONSTRAINT "pagamentos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "historico_sessoes_sessaoId_idx" ON "historico_sessoes"("sessaoId");

-- CreateIndex
CREATE INDEX "pagamentos_alunoId_idx" ON "pagamentos"("alunoId");

-- CreateIndex
CREATE INDEX "pagamentos_status_idx" ON "pagamentos"("status");

-- CreateIndex
CREATE INDEX "pagamentos_dataVencimento_idx" ON "pagamentos"("dataVencimento");

-- AddForeignKey
ALTER TABLE "historico_sessoes" ADD CONSTRAINT "historico_sessoes_sessaoId_fkey" FOREIGN KEY ("sessaoId") REFERENCES "sessoes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pagamentos" ADD CONSTRAINT "pagamentos_alunoId_fkey" FOREIGN KEY ("alunoId") REFERENCES "alunos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
