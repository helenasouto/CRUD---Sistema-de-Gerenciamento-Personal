import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export const alunoServices = {
  async cadastrar(dados) {
    const { nome, email, telefone, dataNascimento, sexo, dataInicioContrato, pacoteId } = dados
    if (!nome || !email || !telefone || !dataNascimento || !sexo || !pacoteId || !dataInicioContrato)
      throw { status: 400, message: 'Campos obrigatórios faltando.' }

    const pacote = await prisma.pacote.findUnique({ where: { id: Number(pacoteId) } })
    if (!pacote) throw { status: 404, message: 'Pacote não encontrado.' }

    const emailExistente = await prisma.aluno.findUnique({ where: { email } })
    if (emailExistente) throw { status: 409, message: 'Email já cadastrado.' }

    return prisma.aluno.create({
      data: {
        nome, email, telefone, sexo,
        dataNascimento: new Date(dataNascimento),
        dataInicioContrato: new Date(dataInicioContrato),
        pacoteId: Number(pacoteId),
        peso: dados.peso ? parseFloat(dados.peso) : undefined,
        altura: dados.altura ? parseFloat(dados.altura) : undefined,
        objetivo: dados.objetivo,
        restricaoMedica: dados.restricaoMedica,
        nivelExperiencia: dados.nivelExperiencia,
      }
    })
  },

  async listar() {
    return prisma.aluno.findMany({ include: { pacote: true } })
  },

async buscarPorId(id) {
  if (!id) throw { status: 400, message: 'ID não informado.' }
  
  const aluno = await prisma.aluno.findUnique({
    where: { id: Number(id) },
    include: { pacote: true, sessoes: true, avaliacoes: true }
  })
  if (!aluno) throw { status: 404, message: 'Aluno não encontrado.' }
  return aluno
},

async buscarPorNome(nome) {
  if (!nome) throw { status: 400, message: 'Informe o nome para buscar.' }
  
  const alunos = await prisma.aluno.findMany({
    where: { nome: { contains: nome, mode: 'insensitive' } },
    include: { pacote: true }
  })

  if (alunos.length === 0)
    throw { status: 404, message: `Nenhum aluno encontrado com o nome "${nome}".` }

  return alunos
},

  async atualizar(id, dados) {
    const aluno = await prisma.aluno.findUnique({ where: { id: Number(id) } })
    if (!aluno) throw { status: 404, message: 'Aluno não encontrado.' }
    return prisma.aluno.update({ where: { id: Number(id) }, data: dados })
  },

  async deletar(id) {
    const aluno = await prisma.aluno.findUnique({ where: { id: Number(id) } })
    if (!aluno) throw { status: 404, message: 'Aluno não encontrado.' }

    const sessaoAgendada = await prisma.sessao.findFirst({
      where: { alunoId: Number(id), status: 'AGENDADA' }
    })
    if (sessaoAgendada) throw { status: 409, message: 'Aluno possui sessões agendadas. Cancele-as antes de deletar.' }

    await prisma.sessao.deleteMany({ where: { alunoId: Number(id) } })
    await prisma.avaliacao.deleteMany({ where: { alunoId: Number(id) } })
    await prisma.pagamento.deleteMany({ where: { alunoId: Number(id) } })
    await prisma.aluno.delete({ where: { id: Number(id) } })
  },
    async deletarPorNome(nome) {
    if (!nome) throw { status: 400, message: 'Informe o nome para deletar.' }

    const alunos = await prisma.aluno.findMany({
        where: { nome: { contains: nome, mode: 'insensitive' } }
    })

    if (alunos.length === 0)
        throw { status: 404, message: `Nenhum aluno encontrado com o nome "${nome}".` }

    if (alunos.length > 1)
        throw { status: 409, message: `Mais de um aluno encontrado com o nome "${nome}". Use deletar por ID.` }

    const id = alunos[0].id

    const sessaoAgendada = await prisma.sessao.findFirst({
        where: { alunoId: id, status: 'AGENDADA' }
    })
    if (sessaoAgendada)
        throw { status: 409, message: 'Aluno possui sessões agendadas. Cancele-as antes de deletar.' }

    await prisma.sessao.deleteMany({ where: { alunoId: id } })
    await prisma.avaliacao.deleteMany({ where: { alunoId: id } })
    await prisma.pagamento.deleteMany({ where: { alunoId: id } })
    await prisma.aluno.delete({ where: { id } })

    return { message: `Aluno "${alunos[0].nome}" deletado com sucesso.` }
    }
}