import express from 'express'
import {
  cadastrarSessao,
  listarSessoes,
  listarSessoesAlunoEspecifico,
  atualizarStatus,
  reagendarSessao,
  deletarSessao
} from '../controllers/sessaoController.js'

const router = express.Router()

router.post('/cadastro', cadastrarSessao)
router.get('/todos', listarSessoes)
router.get('/aluno/:alunoId', listarSessoesAlunoEspecifico)
router.patch('/status/:id', atualizarStatus)
router.patch('/reagendar/:id', reagendarSessao)
router.delete('/deletar/:id', deletarSessao)

export default router