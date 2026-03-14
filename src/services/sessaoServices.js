import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

function parseHorario(horario) {
  const [h, m, s] = horario.split(':')
  const d = new Date(0)
  d.setUTCHours(Number(h), Number(m), Number(s || 0), 0)
  return d
}

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

  if (alunos[0].status === 'INATIVO')
    throw { status: 403, message: `Aluno "${alunos[0].nome}" está inativo e não pode agendar sessões.` }

  if (alunos[0].status === 'SUSPENSO')
    throw { status: 403, message: `Aluno "${alunos[0].nome}" está suspenso e não pode agendar sessões.` }

  const conflito = await prisma.sessao.findFirst({
    where: {
      alunoId: alunos[0].id,
      data: new Date(data),
      status: { not: 'CANCELADA' },
      OR: [
        {
          horarioInicio: { lte: parseHorario(horarioInicio) },
          horarioFim: { gt: parseHorario(horarioInicio) }
        },
        {
          horarioInicio: { lt: parseHorario(horarioFim) },
          horarioFim: { gte: parseHorario(horarioFim) }
        }
      ]
    }
  })

  if (conflito)
    throw { status: 409, message: `Aluno "${alunos[0].nome}" já possui sessão agendada nesse horário.` }

  const pacote = await prisma.pacote.findUnique({ where: { id: alunos[0].pacoteId } })

  const inicioDaSemana = new Date(data)
inicioDaSemana.setUTCHours(0, 0, 0, 0)
const diaSemanaNum = inicioDaSemana.getUTCDay() === 0 ? 6 : inicioDaSemana.getUTCDay() - 1
inicioDaSemana.setUTCDate(inicioDaSemana.getUTCDate() - diaSemanaNum)

const fimDaSemana = new Date(inicioDaSemana)
fimDaSemana.setUTCDate(fimDaSemana.getUTCDate() + 6)
fimDaSemana.setUTCHours(23, 59, 59, 999)

  const sessoesNaSemana = await prisma.sessao.count({
    where: {
      alunoId: alunos[0].id,
      data: { gte: inicioDaSemana, lte: fimDaSemana },
      status: { not: 'CANCELADA' }
    }
  })

  if (sessoesNaSemana >= pacote.frequenciaSemanal)
    throw { status: 409, message: `Aluno "${alunos[0].nome}" já atingiu o limite de ${pacote.frequenciaSemanal} sessões por semana do pacote "${pacote.nome}".` }

  return prisma.sessao.create({
    data: {
      alunoId: alunos[0].id,
      data: new Date(data),
      horarioInicio: parseHorario(horarioInicio),
      horarioFim: parseHorario(horarioFim),
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
        horarioInicioAlterado: parseHorario(horarioInicio),
        horarioFimAlterado: parseHorario(horarioFim)
      }
    })

    return prisma.sessao.update({
      where: { id: Number(id) },
      data: {
        data: new Date(data),
        horarioInicio: parseHorario(horarioInicio),
        horarioFim: parseHorario(horarioFim),
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