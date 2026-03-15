import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
export const pacoteServices = {
  async cadastrar(dados) {
    const { nome, frequenciaSemanal, preco, limiteReposicoes } = dados
    if (!nome || !frequenciaSemanal || !preco)
      throw { status: 400, message: 'Campos obrigatórios: nome, frequenciaSemanal, preco.' }
    return prisma.pacote.create({
      data: {
        nome,
        frequenciaSemanal: Number(frequenciaSemanal),
        preco: Number(preco),
        limiteReposicoes: limiteReposicoes ? Number(limiteReposicoes) : 1
      }
    })
  },
  async listar() {
    return prisma.pacote.findMany()
  },
  async buscarPorId(id) {
    const pacote = await prisma.pacote.findUnique({
      where: { id: Number(id) },
      include: { alunos: true }
    })
    if (!pacote) throw { status: 404, message: 'Pacote não encontrado.' }
    return pacote
  },
  async atualizar(id, dados) {
    const pacote = await prisma.pacote.findUnique({ where: { id: Number(id) } })
    if (!pacote) throw { status: 404, message: 'Pacote não encontrado.' }
    return prisma.pacote.update({
      where: { id: Number(id) },
      data: {
        nome: dados.nome ?? pacote.nome,
        frequenciaSemanal: dados.frequenciaSemanal ? Number(dados.frequenciaSemanal) : pacote.frequenciaSemanal,
        preco: dados.preco ? Number(dados.preco) : pacote.preco,
        limiteReposicoes: dados.limiteReposicoes ? Number(dados.limiteReposicoes) : pacote.limiteReposicoes,
        ativo: dados.ativo ?? pacote.ativo,
      }
    })
  },
  async deletar(id) {
    const pacote = await prisma.pacote.findUnique({ where: { id: Number(id) } })
    if (!pacote) throw { status: 404, message: 'Pacote não encontrado.' }
    const alunosVinculados = await prisma.aluno.findFirst({ where: { pacoteId: Number(id) } })
    if (alunosVinculados)
      throw { status: 409, message: 'Pacote possui alunos vinculados. Remova-os antes de deletar.' }
    await prisma.pacote.delete({ where: { id: Number(id) } })
  },
  async deletarPorNome(nome) {
    if (!nome) throw { status: 400, message: 'Informe o nome para deletar.' }
    const pacotes = await prisma.pacote.findMany({
      where: { nome: { contains: nome, mode: 'insensitive' } }
    })
    if (pacotes.length === 0)
      throw { status: 404, message: `Nenhum pacote encontrado com o nome "${nome}".` }
    if (pacotes.length > 1)
      throw { status: 409, message: `Mais de um pacote encontrado com o nome "${nome}". Use deletar por ID.` }
    const id = pacotes[0].id
    const alunosVinculados = await prisma.aluno.findFirst({ where: { pacoteId: id } })
    if (alunosVinculados)
      throw { status: 409, message: 'Pacote possui alunos vinculados. Remova-os antes de deletar.' }
    await prisma.pacote.delete({ where: { id } })
    return { message: `Pacote "${pacotes[0].nome}" deletado com sucesso.` }
  }
}