import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export const pagamentoServices = {
  async cadastrar(dados) {
    const { alunoId, valor, formaPagamento, dataVencimento, dataPagamento } = dados
    if (!alunoId || !valor || !formaPagamento || !dataVencimento)
      throw { status: 400, message: 'Campos obrigatórios: alunoId, valor, formaPagamento, dataVencimento.' }

    const aluno = await prisma.aluno.findUnique({ where: { id: Number(alunoId) } })
    if (!aluno) throw { status: 404, message: 'Aluno não encontrado.' }

    return prisma.pagamento.create({
      data: {
        alunoId: Number(alunoId),
        valor: parseFloat(valor),
        formaPagamento,
        dataVencimento: new Date(dataVencimento),
        dataPagamento: dataPagamento ? new Date(dataPagamento) : undefined,
      }
    })
  },

  async listar() {
    return prisma.pagamento.findMany({ include: { aluno: true } })
  },

  async listarPorAluno(alunoId) {
    return prisma.pagamento.findMany({
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

  const ids = alunos.map(a => a.id)

  return prisma.pagamento.findMany({
    where: { alunoId: { in: ids } },
    include: { aluno: true }
  })
},

  async atualizarStatus(id, dados) {
    const pagamento = await prisma.pagamento.findUnique({ where: { id: Number(id) } })
    if (!pagamento) throw { status: 404, message: 'Pagamento não encontrado.' }

    return prisma.pagamento.update({
      where: { id: Number(id) },
      data: {
        status: dados.status,
        dataPagamento: dados.dataPagamento ? new Date(dados.dataPagamento) : undefined,
      }
    })
  },

  async deletar(id) {
    const pagamento = await prisma.pagamento.findUnique({ where: { id: Number(id) } })
    if (!pagamento) throw { status: 404, message: 'Pagamento não encontrado.' }
    await prisma.pagamento.delete({ where: { id: Number(id) } })
  },

  async aplicarDescontoIndicacao(alunoId) {
    if (!alunoId) throw { status: 400, message: 'Informe o ID do aluno.' }

    const aluno = await prisma.aluno.findUnique({ where: { id: Number(alunoId) } })
    if (!aluno) throw { status: 404, message: 'Aluno não encontrado.' }

    if (!aluno.indicadoPorId)
      throw { status: 400, message: 'Aluno não foi indicado por ninguém.' }

    if (aluno.descontoUsado)
      throw { status: 409, message: 'Desconto de indicação já foi utilizado.' }

    await prisma.$executeRaw`CALL aplicar_desconto_indicacao(${Number(alunoId)}::integer)`

    return { message: 'Desconto de 10% aplicado com sucesso no primeiro pagamento pendente.' }
  }
}