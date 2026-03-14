import express from 'express'
import {
  cadastrarAvaliacao,
  listarAvaliacoes,
  listarAvaliacoesPorNomeAluno,
  deletarAvaliacao
} from '../controllers/avaliacaoController.js'

const router = express.Router()

router.post('/cadastro', cadastrarAvaliacao)
router.get('/todos', listarAvaliacoes)
router.get('/aluno/buscar', listarAvaliacoesPorNomeAluno)
router.delete('/deletar/:id', deletarAvaliacao)

export default router