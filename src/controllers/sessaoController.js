import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

export const cadastrarSessao = async (req, res) => {
  try {
    const { alunoId, data, horarioInicio, horarioFim, diaSemana, tipo, observacoes } = req.body
    const sessao = await prisma.sessao.create({
      data: {
        alunoId: Number(alunoId),
        data: new Date(data),
        horarioInicio: new Date(`1970-01-01T${horarioInicio}`),
        horarioFim: new Date(`1970-01-01T${horarioFim}`),
        diaSemana,
        tipo,
        observacoes
      }
    })
    res.status(201).json(sessao)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

export const listarSessoes = async (req, res) => {
  try {
    const sessoes = await prisma.sessao.findMany({
      include: { aluno: true }
    })
    res.status(200).json(sessoes)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const listarSessoesAlunoEspecifico = async (req, res) => {
  try {
    const { alunoId } = req.params
    const sessoes = await prisma.sessao.findMany({
      where: { alunoId: Number(alunoId) },
      include: { aluno: true }
    })
    res.status(200).json(sessoes)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const atualizarStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body
    const sessao = await prisma.sessao.update({
      where: { id: Number(id) },
      data: { status }
    })
    res.status(200).json(sessao)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

export const reagendarSessao = async (req, res) => {
  try {
    const { id } = req.params
    const { data, horarioFim, horarioInicio, diaSemana } = req.body

    const sessaoAtual = await prisma.sessao.findUnique({
      where: { id: Number(id) }
    })

    if (!sessaoAtual) {
      return res.status(404).json({ error: 'Sessão não encontrada.' })
    }

    await prisma.historicoSessao.create({
      data: {
        sessaoId: Number(id),
        dataOriginal: sessaoAtual.data,
        horarioInicioOriginal: sessaoAtual.horarioInicio,
        horarioFimOriginal: sessaoAtual.horarioFim,
        dataAlterada: new Date(data),
        horarioInicioAlterado: new Date(`1970-01-01T${horarioInicio}`),
        horarioFimAlterado: new Date(`1970-01-01T${horarioFim}`)
      }
    })

    const sessao = await prisma.sessao.update({
      where: { id: Number(id) },
      data: {
        data: new Date(data),
        horarioInicio: new Date(`1970-01-01T${horarioInicio}`),
        horarioFim: new Date(`1970-01-01T${horarioFim}`),
        diaSemana,
        status: 'REAGENDADA'
      }
    })

    res.status(200).json(sessao)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

export const deletarSessao = async (req, res) => {
  try {
    const { id } = req.params
    await prisma.historicoSessao.deleteMany({
      where: { sessaoId: Number(id) }
    })
    await prisma.sessao.delete({
      where: { id: Number(id) }
    })
    res.status(200).json({ message: 'Sessão deletada com sucesso' })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}