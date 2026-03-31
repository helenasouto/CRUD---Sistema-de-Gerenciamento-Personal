import express from 'express'
import {
  cadastrarPagamento,
  listarPagamentos,
  listarPagamentosPorNomeAluno,
  listarPagamentosAluno,
  atualizarStatusPagamento,
  deletarPagamento,
  aplicarDescontoIndicacao
} from '../controllers/pagamentoController.js'

const router = express.Router()

router.post('/cadastro', cadastrarPagamento)
router.post('/desconto/indicacao/:alunoId', aplicarDescontoIndicacao)
router.get('/todos', listarPagamentos)
router.get('/aluno/buscar', listarPagamentosPorNomeAluno)
router.get('/aluno/:alunoId', listarPagamentosAluno)
router.patch('/status/:id', atualizarStatusPagamento)
router.delete('/deletar/:id', deletarPagamento)

export default router