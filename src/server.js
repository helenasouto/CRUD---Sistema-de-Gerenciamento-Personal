import express from 'express'
import sessaoRoutes from './route_sessao.js'

const app = express()
app.use(express.json())

app.use('/sessao', sessaoRoutes)

app.listen(3000, ()=> console.log("Servidor Ativo"))