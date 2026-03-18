import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export const historicoSessaoServices = {
  async listar() {
    return prisma.historicoSessao.findMany({ include: { sessao: true } })
  },

  async listarPorSessao(sessaoId) {
    const sessao = await prisma.sessao.findUnique({ where: { id: Number(sessaoId) } })
    if (!sessao) throw { status: 404, message: 'Sessão não encontrada.' }

    return prisma.historicoSessao.findMany({
      where: { sessaoId: Number(sessaoId) },
      include: { sessao: true }
    })
  },

  async listarPorNomeAluno(nome) {
    if (!nome) throw { status: 400, message: 'Informe o nome do aluno.' }

    const alunos = await prisma.aluno.findMany({
      where: { nome: { contains: nome, mode: 'insensitive' } }
    })

    if (alunos.length === 0)
      throw { status: 404, message: `Nenhum aluno encontrado com o nome "${nome}".` }

    const sessoes = await prisma.sessao.findMany({
      where: { alunoId: { in: alunos.map(a => a.id) } }
    })

    if (sessoes.length === 0)
      throw { status: 404, message: 'Nenhuma sessão encontrada para esse aluno.' }

    const historicos = await Promise.all(
      sessoes.map(sessao =>
        prisma.historicoSessao.findMany({
          where: { sessaoId: sessao.id },
          include: { sessao: true }
        })
      )
    )

    return historicos.flat()
  }
}