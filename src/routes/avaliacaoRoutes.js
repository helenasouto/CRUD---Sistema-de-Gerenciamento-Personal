import express from 'express'
import {
  cadastrarAvaliacao,
  listarAvaliacoes,
  listarAvaliacoesAluno,
  deletarAvaliacao
} from '../controllers/avaliacaoController.js'

const router = express.Router()

router.post('/cadastro', cadastrarAvaliacao)
router.get('/todos', listarAvaliacoes)
router.get('/aluno/:alunoId', listarAvaliacoesAluno)
router.delete('/deletar/:id', deletarAvaliacao)

export default router