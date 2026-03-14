import { pagamentoServices } from '../services/pagamentoServices.js'

export const cadastrarPagamento = async (req, res) => {
  try {
    const pagamento = await pagamentoServices.cadastrar(req.body)
    res.status(201).json(pagamento)
  } catch (e) { res.status(e.status || 400).json({ error: e.message }) }
}

export const listarPagamentos = async (req, res) => {
  try {
    const pagamentos = await pagamentoServices.listar()
    res.status(200).json(pagamentos)
  } catch (e) { res.status(500).json({ error: e.message }) }
}

export const listarPagamentosAluno = async (req, res) => {
  try {
    const pagamentos = await pagamentoServices.listarPorAluno(req.params.alunoId)
    res.status(200).json(pagamentos)
  } catch (e) { res.status(500).json({ error: e.message }) }
}

export const listarPagamentosPorNomeAluno = async (req, res) => {
  try {
    const pagamentos = await pagamentoServices.listarPorNomeAluno(req.query.nome)
    res.status(200).json(pagamentos)
  } catch (e) { res.status(e.status || 500).json({ error: e.message }) }
}

export const atualizarStatusPagamento = async (req, res) => {
  try {
    const atualizado = await pagamentoServices.atualizarStatus(req.params.id, req.body)
    res.status(200).json(atualizado)
  } catch (e) { res.status(e.status || 400).json({ error: e.message }) }
}

export const deletarPagamento = async (req, res) => {
  try {
    await pagamentoServices.deletar(req.params.id)
    res.status(200).json({ message: 'Pagamento deletado com sucesso.' })
  } catch (e) { res.status(e.status || 400).json({ error: e.message }) }
}