import { avaliacaoServices } from '../services/avaliacaoServices.js'

export const cadastrarAvaliacao = async (req, res) => {
  try {
    const avaliacao = await avaliacaoServices.cadastrar(req.body)
    res.status(201).json(avaliacao)
  } catch (e) { res.status(e.status || 400).json({ error: e.message }) }
}

export const listarAvaliacoes = async (req, res) => {
  try {
    const avaliacoes = await avaliacaoServices.listar()
    res.status(200).json(avaliacoes)
  } catch (e) { res.status(500).json({ error: e.message }) }
}

export const listarAvaliacoesPorNomeAluno = async (req, res) => {
  try {
    const avaliacoes = await avaliacaoServices.listarPorNomeAluno(req.query.nome)
    res.status(200).json(avaliacoes)
  } catch (e) { res.status(e.status || 500).json({ error: e.message }) }
}

export const deletarAvaliacao = async (req, res) => {
  try {
    await avaliacaoServices.deletar(req.params.id)
    res.status(200).json({ message: 'Avaliação deletada com sucesso.' })
  } catch (e) { res.status(e.status || 400).json({ error: e.message }) }
}