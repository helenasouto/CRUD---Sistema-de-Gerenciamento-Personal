import express from 'express'
import alunoRoutes from './routes/alunoRoutes.js'
import pacoteRoutes from './routes/pacoteRoutes.js'

const app = express()
app.use(express.json())

app.use('/alunos', alunoRoutes)
app.use('/pacotes', pacoteRoutes)

app.listen(3000, ()=> console.log("Servidor Ativo"))