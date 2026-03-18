import { sessaoServices } from '../services/sessaoServices.js'

export const cadastrarSessao = async (req, res) => {
  try {
    const sessao = await sessaoServices.cadastrar(req.body)
    res.status(201).json(sessao)
  } catch (e) { res.status(e.status || 400).json({ error: e.message }) }
}

export const listarSessoes = async (req, res) => {
  try {
    const sessoes = await sessaoServices.listar()
    res.status(200).json(sessoes)
  } catch (e) { res.status(500).json({ error: e.message }) }
}

export const listarSessoesAluno = async (req, res) => {
  try {
    const sessoes = await sessaoServices.listarPorAluno(req.params.alunoId)
    res.status(200).json(sessoes)
  } catch (e) { res.status(500).json({ error: e.message }) }
}

export const listarSessoesPorNomeAluno = async (req, res) => {
  try {
    const sessoes = await sessaoServices.listarPorNomeAluno(req.query.nome)
    res.status(200).json(sessoes)
  } catch (e) { res.status(e.status || 500).json({ error: e.message }) }
}

export const atualizarStatus = async (req, res) => {
  try {
    const sessao = await sessaoServices.atualizarStatus(req.params.id, req.body.status)
    res.status(200).json(sessao)
  } catch (e) { res.status(e.status || 400).json({ error: e.message }) }
}

export const reagendarSessao = async (req, res) => {
  try {
    const sessao = await sessaoServices.reagendar(req.params.id, req.body)
    res.status(200).json(sessao)
  } catch (e) { res.status(e.status || 400).json({ error: e.message }) }
}

export const deletarSessao = async (req, res) => {
  try {
    await sessaoServices.deletar(req.params.id)
    res.status(200).json({ message: 'Sessão deletada com sucesso.' })
  } catch (e) { res.status(e.status || 400).json({ error: e.message }) }
}