import express from 'express'
import { cadastrarAluno, listarAlunos, buscarAluno, atualizarAluno, deletarAluno } from '../controllers/alunoController.js'

const router = express.Router()

router.post('/cadastro', cadastrarAluno)
router.get('/todos', listarAlunos)
router.get('/:id', buscarAluno)
router.put('/atualizar/:id', atualizarAluno)
router.delete('/deletar/:id', deletarAluno)

export default router