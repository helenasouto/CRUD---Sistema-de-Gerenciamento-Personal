import { pacoteServices } from '../services/pacoteServices.js'

export const cadastrarPacote = async (req, res) => {
  try {
    const pacote = await pacoteServices.cadastrar(req.body)
    res.status(201).json(pacote)
  } catch (e) { res.status(e.status || 400).json({ error: e.message }) }
}

export const listarPacotes = async (req, res) => {
  try {
    const pacotes = await pacoteServices.listar()
    res.status(200).json(pacotes)
  } catch (e) { res.status(500).json({ error: e.message }) }
}

export const buscarPacote = async (req, res) => {
  try {
    const pacote = await pacoteServices.buscarPorId(req.params.id)
    res.status(200).json(pacote)
  } catch (e) { res.status(e.status || 500).json({ error: e.message }) }
}

export const deletarPacote = async (req, res) => {
  try {
    await pacoteServices.deletar(req.params.id)
    res.status(200).json({ message: 'Pacote deletado com sucesso.' })
  } catch (e) { res.status(e.status || 400).json({ error: e.message }) }
}

export const deletarPacotePorNome = async (req, res) => {
  try {
    const resultado = await pacoteServices.deletarPorNome(req.query.nome)
    res.status(200).json(resultado)
  } catch (e) { res.status(e.status || 400).json({ error: e.message }) }
}