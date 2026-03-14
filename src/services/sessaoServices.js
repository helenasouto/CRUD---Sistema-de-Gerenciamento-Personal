import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export const sessaoServices = {

  async cadastrar(dados) {
    const { nomeAluno, data, horarioInicio, horarioFim, diaSemana, tipo, observacoes } = dados
    if (!nomeAluno || !data || !horarioInicio || !horarioFim || !diaSemana)
      throw { status: 400, message: 'Campos obrigatórios: nomeAluno, data, horarioInicio, horarioFim, diaSemana.' }

    const alunos = await prisma.aluno.findMany({
      where: { nome: { contains: nomeAluno, mode: 'insensitive' } }
    })

    if (alunos.length === 0)
      throw { status: 404, message: `Nenhum aluno encontrado com o nome "${nomeAluno}".` }

    if (alunos.length > 1)
      throw { status: 409, message: `Mais de um aluno encontrado com o nome "${nomeAluno}". Seja mais específico.` }

    return prisma.sessao.create({
      data: {
        alunoId: alunos[0].id,
        data: new Date(data),
        horarioInicio: new Date(`1970-01-01T${horarioInicio}`),
        horarioFim: new Date(`1970-01-01T${horarioFim}`),
        diaSemana, tipo, observacoes
      }
    })
  },

  async listar() {
    return prisma.sessao.findMany({ include: { aluno: true } })
  },

  async listarPorAluno(alunoId) {
    return prisma.sessao.findMany({
      where: { alunoId: Number(alunoId) },
      include: { aluno: true }
    })
  },

  async listarPorNomeAluno(nome) {
    if (!nome) throw { status: 400, message: 'Informe o nome do aluno.' }

    const alunos = await prisma.aluno.findMany({
      where: { nome: { contains: nome, mode: 'insensitive' } }
    })

    if (alunos.length === 0)
      throw { status: 404, message: `Nenhum aluno encontrado com o nome "${nome}".` }

    const sessoes = await Promise.all(
      alunos.map(aluno =>
        prisma.sessao.findMany({
          where: { alunoId: aluno.id },
          include: { aluno: true }
        })
      )
    )

    return sessoes.flat()
  },

  async atualizarStatus(id, status) {
    const sessao = await prisma.sessao.findUnique({ where: { id: Number(id) } })
    if (!sessao) throw { status: 404, message: 'Sessão não encontrada.' }
    return prisma.sessao.update({ where: { id: Number(id) }, data: { status } })
  },

  async reagendar(id, dados) {
    const { data, horarioInicio, horarioFim, diaSemana } = dados
    const sessaoAtual = await prisma.sessao.findUnique({ where: { id: Number(id) } })
    if (!sessaoAtual) throw { status: 404, message: 'Sessão não encontrada.' }

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

    return prisma.sessao.update({
      where: { id: Number(id) },
      data: {
        data: new Date(data),
        horarioInicio: new Date(`1970-01-01T${horarioInicio}`),
        horarioFim: new Date(`1970-01-01T${horarioFim}`),
        diaSemana, status: 'REAGENDADA'
      }
    })
  },

  async deletar(id) {
    const sessao = await prisma.sessao.findUnique({ where: { id: Number(id) } })
    if (!sessao) throw { status: 404, message: 'Sessão não encontrada.' }
    await prisma.historicoSessao.deleteMany({ where: { sessaoId: Number(id) } })
    await prisma.sessao.delete({ where: { id: Number(id) } })
  }
}