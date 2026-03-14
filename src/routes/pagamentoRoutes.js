import express from 'express'
import {
  cadastrarPagamento,
  listarPagamentos,
  listarPagamentosAluno,
  atualizarStatusPagamento,
  deletarPagamento
} from '../controllers/pagamentoController.js'

const router = express.Router()

router.post('/cadastro', cadastrarPagamento)
router.get('/todos', listarPagamentos)
router.get('/aluno/:alunoId', listarPagamentosAluno)
router.patch('/status/:id', atualizarStatusPagamento)
router.delete('/deletar/:id', deletarPagamento)

export default router