import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
import dotenv from 'dotenv'
dotenv.config()

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })  

export const cadastrarAluno = async (req, res) => {
  try {
    const { nome, email, telefone, dataNascimento, sexo, dataInicioContrato, pacoteId } = req.body

    const aluno = await prisma.aluno.create({
      data: {
        nome,
        email,
        telefone,
        dataNascimento: new Date(dataNascimento),
        sexo,
        dataInicioContrato: new Date(dataInicioContrato),
        pacoteId: Number(pacoteId)
      }
    })

    res.status(201).json(aluno)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

export const listarAlunos = async (req, res) => {
  try {
    const alunos = await prisma.aluno.findMany({
      include: { pacote: true }
    })

    res.status(200).json(alunos)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const deletarAluno = async (req, res) => {
  try {
    const { id } = req.params

    await prisma.sessao.deleteMany({
      where: { alunoId: Number(id) }
    })

    await prisma.avaliacao.deleteMany({
      where: { alunoId: Number(id) }
    })

    await prisma.pagamento.deleteMany({
      where: { alunoId: Number(id) }
    })

    await prisma.aluno.delete({
      where: { id: Number(id) }
    })

    res.status(200).json({ message: 'Aluno deletado com sucesso' })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}