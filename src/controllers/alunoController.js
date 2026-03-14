import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export const cadastrarAluno = async (req, res) => {
  try {
    const { nome, email, telefone, dataNascimento, sexo, dataInicioContrato, pacoteId } = req.body

    if (!nome || !email || !telefone || !dataNascimento || !sexo || !pacoteId || !dataInicioContrato) {
      return res.status(400).json({ error: 'Campos obrigatórios faltando.' })
    }

    const pacote = await prisma.pacote.findUnique({ where: { id: Number(pacoteId) } })
    if (!pacote) {
      return res.status(404).json({ error: 'Pacote não encontrado.' })
    }

    const emailExistente = await prisma.aluno.findUnique({ where: { email } })
    if (emailExistente) {
      return res.status(409).json({ error: 'Email já cadastrado.' })
    }

    const aluno = await prisma.aluno.create({
      data: {
        nome,
        email,
        telefone,
        dataNascimento: new Date(dataNascimento),
        sexo,
        dataInicioContrato: new Date(dataInicioContrato),
        pacoteId: Number(pacoteId),
        peso: req.body.peso ? parseFloat(req.body.peso) : undefined,
        altura: req.body.altura ? parseFloat(req.body.altura) : undefined,
        objetivo: req.body.objetivo,
        restricaoMedica: req.body.restricaoMedica,
        nivelExperiencia: req.body.nivelExperiencia,
      }
    })

    res.status(201).json(aluno)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

export const listarAlunos = async (req, res) => {
  try {
    const alunos = await prisma.aluno.findMany({
      include: { pacote: true }
    })
    res.status(200).json(alunos)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const buscarAluno = async (req, res) => {
  try {
    const { id } = req.params
    const aluno = await prisma.aluno.findUnique({
      where: { id: Number(id) },
      include: { pacote: true, sessoes: true, avaliacoes: true }
    })

    if (!aluno) {
      return res.status(404).json({ error: 'Aluno não encontrado.' })
    }

    res.status(200).json(aluno)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const atualizarAluno = async (req, res) => {
  try {
    const { id } = req.params

    const aluno = await prisma.aluno.findUnique({ where: { id: Number(id) } })
    if (!aluno) {
      return res.status(404).json({ error: 'Aluno não encontrado.' })
    }

    const atualizado = await prisma.aluno.update({
      where: { id: Number(id) },
      data: req.body
    })

    res.status(200).json(atualizado)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

export const deletarAluno = async (req, res) => {
  try {
    const { id } = req.params

    const aluno = await prisma.aluno.findUnique({ where: { id: Number(id) } })
    if (!aluno) {
      return res.status(404).json({ error: 'Aluno não encontrado.' })
    }

    const sessaoAgendada = await prisma.sessao.findFirst({
      where: { alunoId: Number(id), status: 'AGENDADA' }
    })
    if (sessaoAgendada) {
      return res.status(409).json({ error: 'Aluno possui sessões agendadas. Cancele-as antes de deletar.' })
    }

    await prisma.sessao.deleteMany({ where: { alunoId: Number(id) } })
    await prisma.avaliacao.deleteMany({ where: { alunoId: Number(id) } })
    await prisma.pagamento.deleteMany({ where: { alunoId: Number(id) } })
    await prisma.aluno.delete({ where: { id: Number(id) } })

    res.status(200).json({ message: 'Aluno deletado com sucesso' })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}