import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

export const listarHistorico = async (req, res) => {
  try {
    const historico = await prisma.historicoSessao.findMany({
      include: { sessao: true }
    })
    res.status(200).json(historico)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const listarHistoricoSessao = async (req, res) => {
  try {
    const { sessaoId } = req.params
    const historico = await prisma.historicoSessao.findMany({
      where: { sessaoId: Number(sessaoId) },
      include: { sessao: true }
    })
    res.status(200).json(historico)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}