import express from 'express'
import { cadastrarAluno, listarAlunos, deletarAluno } from '../controllers/alunoController.js'
const router = express.Router()

router.post('/cadastro', cadastrarAluno)
router.get('/todos', listarAlunos)
router.delete('/deletar/:id', deletarAluno)

export default router;