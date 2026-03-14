import express from 'express'
import { atualizarstatus, cadastrarSessao, deletarSessao, listarSessoesAlunoEspecifico,  reagendarSessao} from './controllers/sessaoController.js'
import { listarSessoes } from './controllers/sessaoController.js'


const router = express.Router()
router.post('/cadastrar', cadastrarSessao)
router.get('/listar', listarSessoes)
router.get('/listar/:alunoId', listarSessoesAlunoEspecifico)
router.patch('/status', atualizarstatus)
router.patch('/reagendar', reagendarSessao)
router.delete('/deletar/:id', deletarSessao)
export default router;