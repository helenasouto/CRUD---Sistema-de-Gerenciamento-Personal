import express from 'express'
import 'dotenv/config'
import alunoRoutes from './routes/alunoRoutes.js'
import pacoteRoutes from './routes/pacoteRoutes.js'
import sessaoRoutes from './routes/sessaoRoutes.js'
import pagamentoRoutes from './routes/pagamentoRoutes.js'

const app = express()
app.use(express.json())

app.use('/alunos', alunoRoutes)
app.use('/pacotes', pacoteRoutes)
app.use('/sessoes', sessaoRoutes)
app.use('/pagamentos', pagamentoRoutes)

app.listen(3000, ()=> console.log("Servidor Ativo"))