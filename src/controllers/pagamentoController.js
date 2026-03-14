import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export const cadastrarPagamento = async (req, res) => {
  try {
    const { alunoId, valor, formaPagamento, dataVencimento, dataPagamento } = req.body

    if (!alunoId || !valor || !formaPagamento || !dataVencimento) {
      return res.status(400).json({ error: 'Campos obrigatórios: alunoId, valor, formaPagamento, dataVencimento.' })
    }

    const aluno = await prisma.aluno.findUnique({ where: { id: Number(alunoId) } })
    if (!aluno) {
      return res.status(404).json({ error: 'Aluno não encontrado.' })
    }

    const pagamento = await prisma.pagamento.create({
      data: {
        alunoId: Number(alunoId),
        valor: parseFloat(valor),
        formaPagamento,
        dataVencimento: new Date(dataVencimento),
        dataPagamento: dataPagamento ? new Date(dataPagamento) : undefined,
      }
    })

    res.status(201).json(pagamento)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

export const listarPagamentos = async (req, res) => {
  try {
    const pagamentos = await prisma.pagamento.findMany({
      include: { aluno: true }
    })
    res.status(200).json(pagamentos)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const listarPagamentosAluno = async (req, res) => {
  try {
    const { alunoId } = req.params
    const pagamentos = await prisma.pagamento.findMany({
      where: { alunoId: Number(alunoId) },
      include: { aluno: true }
    })
    res.status(200).json(pagamentos)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const atualizarStatusPagamento = async (req, res) => {
  try {
    const { id } = req.params
    const { status, dataPagamento } = req.body

    const pagamento = await prisma.pagamento.findUnique({ where: { id: Number(id) } })
    if (!pagamento) {
      return res.status(404).json({ error: 'Pagamento não encontrado.' })
    }

    const atualizado = await prisma.pagamento.update({
      where: { id: Number(id) },
      data: {
        status,
        dataPagamento: dataPagamento ? new Date(dataPagamento) : undefined,
      }
    })

    res.status(200).json(atualizado)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

export const deletarPagamento = async (req, res) => {
  try {
    const { id } = req.params

    const pagamento = await prisma.pagamento.findUnique({ where: { id: Number(id) } })
    if (!pagamento) {
      return res.status(404).json({ error: 'Pagamento não encontrado.' })
    }

    await prisma.pagamento.delete({ where: { id: Number(id) } })
    res.status(200).json({ message: 'Pagamento deletado com sucesso.' })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}