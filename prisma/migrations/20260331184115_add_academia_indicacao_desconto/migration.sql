-- AlterTable
ALTER TABLE "alunos" ADD COLUMN     "academia" VARCHAR(100),
ADD COLUMN     "descontoUsado" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "indicadoPorId" INTEGER;
