const chalk = require("chalk");
const {
  listarAlunos, buscarAlunoPorNome,
  criarAluno, atualizarAluno, deletarAluno, listarPacotes,
} = require("../api/api");
const { cabecalho, sucesso, erro, info, separador, titulo, pausar } = require("../utils/display");

function pergunta(rl, texto) {
  return new Promise((resolve) => rl.question(chalk.cyan("  → ") + texto + " ", resolve));
}

function formatarData(data) {
  return data ? new Date(data).toLocaleDateString("pt-BR", { timeZone: "UTC" }) : "—";
}

async function selecionarAlunoPorNome(rl, acao) {
  const nome = await pergunta(rl, `Nome do aluno para ${acao}:`);
  try {
    const res = await buscarAlunoPorNome(nome);
    const encontrados = res.data;
    if (encontrados.length === 0) {
      console.log(chalk.yellow(`\n  Nenhum aluno encontrado com "${nome}".`));
      await pausar(rl);
      return null;
    }
    if (encontrados.length > 1) {
      titulo(`${encontrados.length} alunos encontrados — escolha um:`);
      separador();
      encontrados.forEach((a, i) => {
        console.log(chalk.cyan(`  [${i + 1}] ${a.nome}`) + chalk.gray(` — ${a.email}`));
      });
      const escolha = await pergunta(rl, "Número da opção:");
      const idx = parseInt(escolha) - 1;
      if (isNaN(idx) || idx < 0 || idx >= encontrados.length) {
        erro("Opção inválida."); await pausar(rl); return null;
      }
      return encontrados[idx];
    }
    return encontrados[0];
  } catch (e) {
    erro("Erro na busca: " + e.message); await pausar(rl); return null;
  }
}

async function inserirAluno(rl) {
  cabecalho("Novo Aluno");
  let pacotes = [];
  try {
    const pkRes = await listarPacotes();
    pacotes = pkRes.data;
    titulo("Pacotes disponíveis:");
    separador();
    pacotes.forEach((p) => {
      console.log(chalk.cyan(`  [${p.id}] ${p.nome}`) +
        chalk.gray(` — ${p.frequenciaSemanal}x/semana`) +
        chalk.green(` — R$ ${Number(p.preco).toFixed(2)}/mês`));
    });
    separador();
  } catch { console.log(chalk.yellow("  (Não foi possível carregar os pacotes)")); }

  const nome = await pergunta(rl, "Nome:");
  const email = await pergunta(rl, "Email:");
  const telefone = await pergunta(rl, "Telefone:");
  const dataNascimento = await pergunta(rl, "Data de nascimento (AAAA-MM-DD):");
  console.log(chalk.cyan("  Sexo: ") + chalk.gray("[1] MASCULINO  [2] FEMININO  [3] OUTRO"));
  const sexoOp = await pergunta(rl, "Escolha (1/2/3):");
  const sexo = sexoOp === "1" ? "MASCULINO" : sexoOp === "2" ? "FEMININO" : "OUTRO";
  const dataInicioContrato = await pergunta(rl, "Data início contrato (AAAA-MM-DD):");
  const peso = await pergunta(rl, "Peso (kg):");
  const altura = await pergunta(rl, "Altura (m):");
  console.log(chalk.cyan("  Nível: ") + chalk.gray("[1] INICIANTE  [2] INTERMEDIARIO  [3] AVANCADO"));
  const nivelOp = await pergunta(rl, "Escolha (1/2/3):");
  const nivelExperiencia = nivelOp === "1" ? "INICIANTE" : nivelOp === "2" ? "INTERMEDIARIO" : "AVANCADO";
  const objetivo = await pergunta(rl, "Objetivo:");
  const restricaoMedica = await pergunta(rl, "Restrição médica (ou deixe vazio):");
  const pacoteEscolhido = await pergunta(rl, "ID do pacote (ou deixe vazio para sem pacote):");
  const pacote = pacotes.find(p => p.id === parseInt(pacoteEscolhido));
  if (pacoteEscolhido && !pacote) erro("Pacote não encontrado. Será cadastrado sem pacote.");
  else if (pacote) console.log(chalk.green(`\n  Pacote: ${pacote.nome} — R$ ${Number(pacote.preco).toFixed(2)}/mês`));

  try {
    await criarAluno({
      nome, email, telefone, dataNascimento, sexo, dataInicioContrato, objetivo,
      restricaoMedica: restricaoMedica || null,
      peso: peso ? parseFloat(peso) : null,
      altura: altura ? parseFloat(altura) : null,
      nivelExperiencia,
      pacoteId: pacote ? pacote.id : null,
    });
    sucesso(`Aluno "${nome}" cadastrado com sucesso!`);
  } catch (e) { erro("Erro ao cadastrar: " + (e?.response?.data?.error || e.message)); }
  await pausar(rl);
}

async function listarTodos(rl) {
  cabecalho("Lista de Alunos");
  try {
    const res = await listarAlunos();
    const alunos = res.data;
    if (alunos.length === 0) { console.log(chalk.yellow("  Nenhum aluno cadastrado.")); }
    else {
      titulo(`Total: ${alunos.length} aluno(s)`);
      separador();
      alunos.forEach((a) => {
        console.log(chalk.magenta.bold(`  ${a.nome}`));
        info("    Email", a.email);
        info("    Telefone", a.telefone);
        info("    Status", a.status);
        info("    Nível", a.nivelExperiencia);
        info("    Pacote", a.pacote ? `${a.pacote.nome} — R$ ${Number(a.pacote.preco).toFixed(2)}/mês` : "Sem pacote");
        info("    Objetivo", a.objetivo);
        separador();
      });
    }
  } catch (e) { erro("Erro ao listar: " + e.message); }
  await pausar(rl);
}

async function buscarPorNome(rl) {
  cabecalho("Buscar Aluno por Nome");
  const aluno = await selecionarAlunoPorNome(rl, "buscar");
  if (!aluno) return;
  titulo("Dados completos:");
  separador();
  info("Nome", aluno.nome);
  info("Email", aluno.email);
  info("Telefone", aluno.telefone);
  info("Data de Nascimento", formatarData(aluno.dataNascimento));
  info("Sexo", aluno.sexo);
  info("Peso", aluno.peso ? `${aluno.peso} kg` : null);
  info("Altura", aluno.altura ? `${aluno.altura} m` : null);
  if (aluno.peso && aluno.altura) info("IMC", (aluno.peso / (aluno.altura * aluno.altura)).toFixed(1));
  info("Nível", aluno.nivelExperiencia);
  info("Restrição Médica", aluno.restricaoMedica);
  info("Objetivo", aluno.objetivo);
  info("Status", aluno.status);
  info("Início do Contrato", formatarData(aluno.dataInicioContrato));
  info("Pacote", aluno.pacote ? `${aluno.pacote.nome} — R$ ${Number(aluno.pacote.preco).toFixed(2)}/mês` : "Sem pacote");
  separador();
  await pausar(rl);
}

async function alterarAluno(rl) {
  cabecalho("Alterar Aluno");
  const aluno = await selecionarAlunoPorNome(rl, "alterar");
  if (!aluno) return;
  console.log(chalk.yellow(`\n  Editando: ${aluno.nome} — deixe em branco para manter o valor atual\n`));
  let pacotes = [];
  try {
    const pkRes = await listarPacotes();
    pacotes = pkRes.data;
    titulo("Pacotes disponíveis:");
    pacotes.forEach((p) => {
      console.log(chalk.cyan(`  [${p.id}] ${p.nome}`) +
        chalk.gray(` — ${p.frequenciaSemanal}x/semana`) +
        chalk.green(` — R$ ${Number(p.preco).toFixed(2)}/mês`));
    });
    console.log();
  } catch { }

  const nome = await pergunta(rl, `Nome [${aluno.nome}]:`);
  const email = await pergunta(rl, `Email [${aluno.email}]:`);
  const telefone = await pergunta(rl, `Telefone [${aluno.telefone || ""}]:`);
  const peso = await pergunta(rl, `Peso [${aluno.peso || ""}]:`);
  const altura = await pergunta(rl, `Altura [${aluno.altura || ""}]:`);
  const nivelExperiencia = await pergunta(rl, `Nível [${aluno.nivelExperiencia || ""}]:`);
  const objetivo = await pergunta(rl, `Objetivo [${aluno.objetivo || ""}]:`);
  const status = await pergunta(rl, `Status [${aluno.status}]:`);
  const pacoteEscolhido = await pergunta(rl, `ID do pacote [${aluno.pacote?.nome || "sem pacote"}]:`);
  const pacote = pacotes.find(p => p.id === parseInt(pacoteEscolhido));

  try {
    await atualizarAluno(aluno.id, {
      nome: nome || aluno.nome,
      email: email || aluno.email,
      telefone: telefone || aluno.telefone,
      peso: peso ? parseFloat(peso) : aluno.peso,
      altura: altura ? parseFloat(altura) : aluno.altura,
      nivelExperiencia: nivelExperiencia || aluno.nivelExperiencia,
      objetivo: objetivo || aluno.objetivo,
      status: status || aluno.status,
      pacoteId: pacoteEscolhido ? (pacote ? pacote.id : aluno.pacoteId) : aluno.pacoteId,
    });
    sucesso("Aluno atualizado com sucesso!");
  } catch (e) { erro("Erro ao atualizar: " + (e?.response?.data?.error || e.message)); }
  await pausar(rl);
}

async function removerAluno(rl) {
  cabecalho("Remover Aluno");
  const aluno = await selecionarAlunoPorNome(rl, "remover");
  if (!aluno) return;
  const confirma = await pergunta(rl, chalk.red(`Confirmar remoção de "${aluno.nome}"? (s/n):`));
  if (confirma.toLowerCase() === "s") {
    try { await deletarAluno(aluno.id); sucesso("Aluno removido com sucesso!"); }
    catch (e) { erro("Erro ao remover: " + (e?.response?.data?.error || e.message)); }
  } else { console.log(chalk.yellow("\n  Operação cancelada.")); }
  await pausar(rl);
}

async function menuAlunos(rl) {
  let sair = false;
  while (!sair) {
    cabecalho("Gerenciar Alunos");
    console.log(chalk.white("  1. Inserir novo aluno"));
    console.log(chalk.white("  2. Listar todos os alunos"));
    console.log(chalk.white("  3. Buscar por nome"));
    console.log(chalk.white("  4. Alterar aluno"));
    console.log(chalk.white("  5. Remover aluno"));
    console.log(chalk.red("  0. Voltar"));
    const op = await pergunta(rl, "\nEscolha:");
    switch (op.trim()) {
      case "1": await inserirAluno(rl); break;
      case "2": await listarTodos(rl); break;
      case "3": await buscarPorNome(rl); break;
      case "4": await alterarAluno(rl); break;
      case "5": await removerAluno(rl); break;
      case "0": sair = true; break;
      default: erro("Opção inválida."); await pausar(rl);
    }
  }
}

module.exports = { menuAlunos };