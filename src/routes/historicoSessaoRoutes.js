import express from 'express'
import {
  listarHistorico,
  listarHistoricoPorSessao,
  listarHistoricoPorNomeAluno
} from '../controllers/historicoSessaoController.js'

const router = express.Router()

router.get('/todos', listarHistorico)
router.get('/aluno/buscar', listarHistoricoPorNomeAluno) 
router.get('/sessao/:sessaoId', listarHistoricoPorSessao)

export default router