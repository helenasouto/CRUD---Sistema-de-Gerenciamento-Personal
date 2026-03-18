import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export const avaliacaoServices = {
    
    async cadastrar(dados) {
    const { nomeAluno, dataAvaliacao, peso, altura, percentualGordura, massaMagra } = dados
    if (!nomeAluno || !dataAvaliacao || !peso || !altura)
        throw { status: 400, message: 'Campos obrigatórios: nomeAluno, dataAvaliacao, peso, altura.' }

    const alunos = await prisma.aluno.findMany({
        where: { nome: { contains: nomeAluno, mode: 'insensitive' } }
    })

    if (alunos.length === 0)
        throw { status: 404, message: `Nenhum aluno encontrado com o nome "${nomeAluno}".` }

    if (alunos.length > 1)
        throw { status: 409, message: `Mais de um aluno encontrado com o nome "${nomeAluno}". Seja mais específico.` }

    const imc = parseFloat(peso) / (parseFloat(altura) * parseFloat(altura))

    return prisma.avaliacao.create({
        data: {
        alunoId: alunos[0].id,
        dataAvaliacao: new Date(dataAvaliacao),
        peso: parseFloat(peso),
        altura: parseFloat(altura),
        imc: parseFloat(imc.toFixed(2)),
        percentualGordura: percentualGordura ? parseFloat(percentualGordura) : undefined,
        massaMagra: massaMagra ? parseFloat(massaMagra) : undefined,
        }
    })
    },
  async listar() {
    return prisma.avaliacao.findMany({ include: { aluno: true } })
  },

  async listarPorNomeAluno(nome) {
    if (!nome) throw { status: 400, message: 'Informe o nome do aluno.' }

    const alunos = await prisma.aluno.findMany({
      where: { nome: { contains: nome, mode: 'insensitive' } }
    })

    if (alunos.length === 0)
      throw { status: 404, message: `Nenhum aluno encontrado com o nome "${nome}".` }

    const avaliacoes = await Promise.all(
      alunos.map(aluno =>
        prisma.avaliacao.findMany({
          where: { alunoId: aluno.id },
          include: { aluno: true }
        })
      )
    )

    return avaliacoes.flat()
  },

  async deletar(id) {
    const avaliacao = await prisma.avaliacao.findUnique({ where: { id: Number(id) } })
    if (!avaliacao) throw { status: 404, message: 'Avaliação não encontrada.' }
    await prisma.avaliacao.delete({ where: { id: Number(id) } })
  }
}