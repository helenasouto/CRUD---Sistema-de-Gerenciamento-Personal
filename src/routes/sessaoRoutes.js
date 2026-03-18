import express from 'express'
import {
  cadastrarSessao,
  listarSessoes,
  listarSessoesAluno,
  listarSessoesPorNomeAluno,
  atualizarStatus,
  reagendarSessao,
  deletarSessao
} from '../controllers/sessaoController.js'

const router = express.Router()

router.post('/cadastro', cadastrarSessao)
router.get('/todos', listarSessoes)
router.get('/aluno/buscar', listarSessoesPorNomeAluno)
router.get('/aluno/:alunoId', listarSessoesAluno)
router.patch('/status/:id', atualizarStatus)
router.patch('/reagendar/:id', reagendarSessao)
router.delete('/deletar/:id', deletarSessao)

export default router