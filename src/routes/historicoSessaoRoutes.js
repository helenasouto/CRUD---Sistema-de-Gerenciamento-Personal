import express from 'express'
import {
  listarHistorico,
  listarHistoricoSessao
} from '../controllers/historicoSessaoController.js'

const router = express.Router()

router.get('/todos', listarHistorico)
router.get('/sessao/:sessaoId', listarHistoricoSessao)

export default router