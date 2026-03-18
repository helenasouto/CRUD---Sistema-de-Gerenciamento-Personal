import express from 'express'
import { cadastrarAluno, listarAlunos, buscarAluno, atualizarAluno, deletarAluno, buscarPorNome, deletarAlunoPorNome } from '../controllers/alunoController.js'

const router = express.Router()

router.post('/cadastro', cadastrarAluno)
router.get('/todos', listarAlunos)
router.get('/buscar', buscarPorNome)
router.get('/:id', buscarAluno)
router.put('/atualizar/:id', atualizarAluno)
router.delete('/deletar/nome', deletarAlunoPorNome) 
router.delete('/deletar/:id', deletarAluno)

export default router