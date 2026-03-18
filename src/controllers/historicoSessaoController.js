import { historicoSessaoServices } from '../services/historicoSessaoServices.js'

export const listarHistorico = async (req, res) => {
  try {
    const historico = await historicoSessaoServices.listar()
    res.status(200).json(historico)
  } catch (e) { res.status(500).json({ error: e.message }) }
}

export const listarHistoricoPorSessao = async (req, res) => {
  try {
    const historico = await historicoSessaoServices.listarPorSessao(req.params.sessaoId)
    res.status(200).json(historico)
  } catch (e) { res.status(e.status || 500).json({ error: e.message }) }
}

export const listarHistoricoPorNomeAluno = async (req, res) => {
  try {
    const historico = await historicoSessaoServices.listarPorNomeAluno(req.query.nome)
    res.status(200).json(historico)
  } catch (e) { res.status(e.status || 500).json({ error: e.message }) }
}