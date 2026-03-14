import { alunoService } from '../services/alunoServices.js'

export const cadastrarAluno = async (req, res) => {
  try {
    const aluno = await alunoService.cadastrar(req.body)
    res.status(201).json(aluno)
  } catch (e) { res.status(e.status || 400).json({ error: e.message }) }
}

export const listarAlunos = async (req, res) => {
  try {
    const alunos = await alunoService.listar()
    res.status(200).json(alunos)
  } catch (e) { res.status(500).json({ error: e.message }) }
}

export const buscarAluno = async (req, res) => {
  try {
    const aluno = await alunoService.buscarPorId(req.params.id)
    res.status(200).json(aluno)
  } catch (e) { res.status(e.status || 500).json({ error: e.message }) }
}

export const buscarPorNome = async (req, res) => {
  try {
    const alunos = await alunoService.buscarPorNome(req.query.nome)
    res.status(200).json(alunos)
  } catch (e) { res.status(e.status || 500).json({ error: e.message }) }
}

export const atualizarAluno = async (req, res) => {
  try {
    const atualizado = await alunoService.atualizar(req.params.id, req.body)
    res.status(200).json(atualizado)
  } catch (e) { res.status(e.status || 400).json({ error: e.message }) }
}

export const deletarAluno = async (req, res) => {
  try {
    await alunoService.deletar(req.params.id)
    res.status(200).json({ message: 'Aluno deletado com sucesso.' })
  } catch (e) { res.status(e.status || 400).json({ error: e.message }) }
}

export const deletarAlunoPorNome = async (req, res) => {
  try {
    const resultado = await alunoService.deletarPorNome(req.query.nome)
    res.status(200).json(resultado)
  } catch (e) { res.status(e.status || 400).json({ error: e.message }) }
}
