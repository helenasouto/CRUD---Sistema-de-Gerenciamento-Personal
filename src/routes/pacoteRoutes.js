import express from 'express'
import { cadastrarPacote, listarPacotes, buscarPacote, deletarPacote } from '../controllers/pacoteController.js'

const router = express.Router()

router.post('/cadastro', cadastrarPacote)
router.get('/todos', listarPacotes)
router.get('/:id', buscarPacote)
router.delete('/deletar/:id', deletarPacote)

export default router