import express from 'express'
import alunoRoutes from './routes/alunoRoutes.js'

const app = express()
app.use(express.json())

app.use('/alunos', alunoRoutes)

app.listen(3000, ()=> console.log("Servidor Ativo"))