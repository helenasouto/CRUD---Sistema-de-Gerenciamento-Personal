-- CreateEnum
CREATE TYPE "Sexo" AS ENUM ('MASCULINO', 'FEMININO', 'OUTRO');

-- CreateEnum
CREATE TYPE "NivelExperiencia" AS ENUM ('INICIANTE', 'INTERMEDIARIO', 'AVANCADO');

-- CreateEnum
CREATE TYPE "StatusAluno" AS ENUM ('ATIVO', 'INATIVO', 'SUSPENSO');

-- CreateEnum
CREATE TYPE "Objetivo" AS ENUM ('HIPERTROFIA', 'EMAGRECIMENTO', 'DEFINICAO_MUSCULAR', 'TONIFICACAO', 'CONDICIONAMENTO_FISICO', 'GANHO_DE_FORCA', 'RESISTENCIA', 'MOBILIDADE', 'FLEXIBILIDADE', 'REABILITACAO', 'PREVENCAO_DE_LESOES', 'QUALIDADE_DE_VIDA', 'PERFORMANCE_ESPORTIVA');

-- CreateEnum
CREATE TYPE "TipoTreino" AS ENUM ('MUSCULACAO', 'CROSSFIT', 'FUNCIONAL', 'HIIT', 'PILATES', 'AEROBICO', 'MOBILIDADE', 'ALONGAMENTO', 'CALISTENIA', 'TREINO_ESPORTIVO');

-- CreateEnum
CREATE TYPE "DiaSemana" AS ENUM ('SEGUNDA', 'TERCA', 'QUARTA', 'QUINTA', 'SEXTA', 'SABADO', 'DOMINGO');

-- CreateEnum
CREATE TYPE "StatusSessao" AS ENUM ('AGENDADA', 'REALIZADA', 'CANCELADA', 'FALTA');

-- CreateEnum
CREATE TYPE "FormaPagamento" AS ENUM ('DINHEIRO', 'PIX', 'CARTAO_CREDITO', 'CARTAO_DEBITO', 'BOLETO');

-- CreateEnum
CREATE TYPE "StatusPagamento" AS ENUM ('PENDENTE', 'CONFIRMADO', 'CANCELADO');

-- CreateTable
CREATE TABLE "personals" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(100) NOT NULL,
    "email" VARCHAR(150) NOT NULL,
    "telefone" VARCHAR(20) NOT NULL,
    "cref" VARCHAR(20) NOT NULL,
    "especialidade" VARCHAR(100),
    "valorHora" DECIMAL(10,2) NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "personals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alunos" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(100) NOT NULL,
    "email" VARCHAR(150) NOT NULL,
    "telefone" VARCHAR(20) NOT NULL,
    "dataNascimento" DATE NOT NULL,
    "sexo" "Sexo" NOT NULL,
    "peso" DECIMAL(5,2),
    "altura" DECIMAL(4,2),
    "objetivo" "Objetivo",
    "nivelExperiencia" "NivelExperiencia" NOT NULL DEFAULT 'INICIANTE',
    "restricaoMedica" TEXT,
    "status" "StatusAluno" NOT NULL DEFAULT 'ATIVO',
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,
    "personalId" INTEGER NOT NULL,

    CONSTRAINT "alunos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessoes" (
    "id" SERIAL NOT NULL,
    "data" DATE NOT NULL,
    "horarioInicio" TIME NOT NULL,
    "horarioFim" TIME NOT NULL,
    "diaSemana" "DiaSemana" NOT NULL,
    "status" "StatusSessao" NOT NULL DEFAULT 'AGENDADA',
    "observacoes" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,
    "alunoId" INTEGER NOT NULL,
    "personalId" INTEGER NOT NULL,

    CONSTRAINT "sessoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pagamentos" (
    "id" SERIAL NOT NULL,
    "valor" DECIMAL(10,2) NOT NULL,
    "formaPagamento" "FormaPagamento" NOT NULL,
    "status" "StatusPagamento" NOT NULL DEFAULT 'PENDENTE',
    "dataVencimento" DATE NOT NULL,
    "dataPagamento" DATE,
    "mesReferencia" INTEGER NOT NULL,
    "anoReferencia" INTEGER NOT NULL,
    "observacoes" VARCHAR(255),
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,
    "alunoId" INTEGER NOT NULL,

    CONSTRAINT "pagamentos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "avaliacoes" (
    "id" SERIAL NOT NULL,
    "dataAvaliacao" DATE NOT NULL,
    "peso" DECIMAL(5,2) NOT NULL,
    "altura" DECIMAL(4,2) NOT NULL,
    "imc" DECIMAL(5,2) NOT NULL,
    "percentualGordura" DECIMAL(5,2),
    "massaMagra" DECIMAL(5,2),
    "circunferenciaAbdomen" DECIMAL(5,2),
    "observacoes" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "alunoId" INTEGER NOT NULL,

    CONSTRAINT "avaliacoes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "personals_email_key" ON "personals"("email");

-- CreateIndex
CREATE UNIQUE INDEX "personals_cref_key" ON "personals"("cref");

-- CreateIndex
CREATE INDEX "personals_nome_idx" ON "personals"("nome");

-- CreateIndex
CREATE INDEX "personals_cref_idx" ON "personals"("cref");

-- CreateIndex
CREATE UNIQUE INDEX "alunos_email_key" ON "alunos"("email");

-- CreateIndex
CREATE INDEX "alunos_nome_idx" ON "alunos"("nome");

-- CreateIndex
CREATE INDEX "alunos_personalId_idx" ON "alunos"("personalId");

-- CreateIndex
CREATE INDEX "alunos_status_idx" ON "alunos"("status");

-- CreateIndex
CREATE INDEX "sessoes_alunoId_idx" ON "sessoes"("alunoId");

-- CreateIndex
CREATE INDEX "sessoes_personalId_idx" ON "sessoes"("personalId");

-- CreateIndex
CREATE INDEX "sessoes_data_idx" ON "sessoes"("data");

-- CreateIndex
CREATE INDEX "sessoes_status_idx" ON "sessoes"("status");

-- CreateIndex
CREATE INDEX "pagamentos_alunoId_idx" ON "pagamentos"("alunoId");

-- CreateIndex
CREATE INDEX "pagamentos_status_idx" ON "pagamentos"("status");

-- CreateIndex
CREATE INDEX "pagamentos_mesReferencia_anoReferencia_idx" ON "pagamentos"("mesReferencia", "anoReferencia");

-- CreateIndex
CREATE INDEX "avaliacoes_alunoId_idx" ON "avaliacoes"("alunoId");

-- CreateIndex
CREATE INDEX "avaliacoes_dataAvaliacao_idx" ON "avaliacoes"("dataAvaliacao");

-- AddForeignKey
ALTER TABLE "alunos" ADD CONSTRAINT "alunos_personalId_fkey" FOREIGN KEY ("personalId") REFERENCES "personals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessoes" ADD CONSTRAINT "sessoes_alunoId_fkey" FOREIGN KEY ("alunoId") REFERENCES "alunos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessoes" ADD CONSTRAINT "sessoes_personalId_fkey" FOREIGN KEY ("personalId") REFERENCES "personals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pagamentos" ADD CONSTRAINT "pagamentos_alunoId_fkey" FOREIGN KEY ("alunoId") REFERENCES "alunos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "avaliacoes" ADD CONSTRAINT "avaliacoes_alunoId_fkey" FOREIGN KEY ("alunoId") REFERENCES "alunos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
