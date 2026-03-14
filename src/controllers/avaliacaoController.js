import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export const cadastrarAvaliacao = async (req, res) => {
  try {
    const { alunoId, dataAvaliacao, peso, altura, percentualGordura, massaMagra, observacoes } = req.body

    if (!alunoId || !dataAvaliacao || !peso || !altura) {
      return res.status(400).json({ error: 'Campos obrigatórios: alunoId, dataAvaliacao, peso, altura.' })
    }

    const aluno = await prisma.aluno.findUnique({ where: { id: Number(alunoId) } })
    if (!aluno) {
      return res.status(404).json({ error: 'Aluno não encontrado.' })
    }

    const imc = parseFloat(peso) / (parseFloat(altura) * parseFloat(altura))

const avaliacao = await prisma.avaliacao.create({
  data: {
    alunoId: Number(alunoId),
    dataAvaliacao: new Date(dataAvaliacao),
    peso: parseFloat(peso),
    altura: parseFloat(altura),
    imc: parseFloat(imc.toFixed(2)),
    percentualGordura: percentualGordura ? parseFloat(percentualGordura) : undefined,
    massaMagra: massaMagra ? parseFloat(massaMagra) : undefined,
  }
})

    res.status(201).json(avaliacao)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

export const listarAvaliacoes = async (req, res) => {
  try {
    const avaliacoes = await prisma.avaliacao.findMany({
      include: { aluno: true }
    })
    res.status(200).json(avaliacoes)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const listarAvaliacoesAluno = async (req, res) => {
  try {
    const { alunoId } = req.params
    const avaliacoes = await prisma.avaliacao.findMany({
      where: { alunoId: Number(alunoId) },
      include: { aluno: true }
    })
    res.status(200).json(avaliacoes)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const deletarAvaliacao = async (req, res) => {
  try {
    const { id } = req.params

    const avaliacao = await prisma.avaliacao.findUnique({ where: { id: Number(id) } })
    if (!avaliacao) {
      return res.status(404).json({ error: 'Avaliação não encontrada.' })
    }

    await prisma.avaliacao.delete({ where: { id: Number(id) } })
    res.status(200).json({ message: 'Avaliação deletada com sucesso.' })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}