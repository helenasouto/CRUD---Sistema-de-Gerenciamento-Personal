import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'



const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

export const cadastrarPacote = async (req, res) => {
  try {
    const { nome, frequenciaSemanal, preco, limiteReposicoes } = req.body

    if (!nome || !frequenciaSemanal || !preco) {
      return res.status(400).json({ error: 'Campos obrigatórios: nome, frequenciaSemanal, preco.' })
    }

    const pacote = await prisma.pacote.create({
      data: {
        nome,
        frequenciaSemanal: Number(frequenciaSemanal),
        preco: Number(preco),
        limiteReposicoes: limiteReposicoes ? Number(limiteReposicoes) : 1
      }
    })

    res.status(201).json(pacote)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

export const listarPacotes = async (req, res) => {
  try {
    const pacotes = await prisma.pacote.findMany()
    res.status(200).json(pacotes)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const buscarPacote = async (req, res) => {
  try {
    const { id } = req.params

    const pacote = await prisma.pacote.findUnique({
      where: { id: Number(id) },
      include: { alunos: true }
    })

    if (!pacote) {
      return res.status(404).json({ error: 'Pacote não encontrado.' })
    }

    res.status(200).json(pacote)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const deletarPacote = async (req, res) => {
  try {
    const { id } = req.params

    const pacote = await prisma.pacote.findUnique({ where: { id: Number(id) } })
    if (!pacote) {
      return res.status(404).json({ error: 'Pacote não encontrado.' })
    }

    // Regra: não deletar pacote que tem alunos vinculados
    const alunosVinculados = await prisma.aluno.findFirst({ where: { pacoteId: Number(id) } })
    if (alunosVinculados) {
      return res.status(409).json({ error: 'Pacote possui alunos vinculados. Remova-os antes de deletar.' })
    }

    await prisma.pacote.delete({ where: { id: Number(id) } })
    res.status(200).json({ message: 'Pacote deletado com sucesso.' })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}