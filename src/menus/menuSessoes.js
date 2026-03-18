const chalk = require("chalk");
const { listarSessoes, criarSessao, atualizarStatusSessao, reagendarSessao, deletarSessao, buscarSessoesPorNomeAluno } = require("../api/api");
const { cabecalho, sucesso, erro, info, separador, titulo, pausar } = require("../utils/display");

function pergunta(rl, texto) {
  return new Promise((resolve) => rl.question(chalk.cyan("  → ") + texto + " ", resolve));
}

function formatarData(data) {
  return data ? new Date(data).toLocaleDateString("pt-BR", { timeZone: "UTC" }) : "—";
}

function formatarHorario(raw) {
  return raw.includes(":") ? raw : `${raw}:00`;
}

function exibirSessao(s) {
  console.log(chalk.magenta.bold(`  ID ${s.id} — `) + chalk.white.bold(s.aluno?.nome || `Aluno #${s.alunoId}`));
  info("    Data", formatarData(s.data));
  const horaInicio = s.horarioInicio ? new Date(s.horarioInicio).toISOString().slice(11, 16) : "—";
  const horaFim = s.horarioFim ? new Date(s.horarioFim).toISOString().slice(11, 16) : "—";
  info("    Horário", `${horaInicio} – ${horaFim}`);
  info("    Dia", s.diaSemana);
  info("    Tipo", s.tipo);
  info("    Status", s.status);
  info("    Observações", s.observacoes);
}

async function menuSessoes(rl) {
  let sair = false;
  while (!sair) {
    cabecalho("Gerenciar Sessões");
    console.log(chalk.white("  1. Inserir nova sessão"));
    console.log(chalk.white("  2. Listar todas as sessões"));
    console.log(chalk.white("  3. Listar sessões de um aluno"));
    console.log(chalk.white("  4. Alterar status da sessão"));
    console.log(chalk.white("  5. Reagendar sessão"));
    console.log(chalk.white("  6. Remover sessão"));
    console.log(chalk.red("  0. Voltar"));
    const op = await pergunta(rl, "\nEscolha:");

    switch (op.trim()) {
      case "1": {
        cabecalho("Nova Sessão");
        try {
          const nomeAluno = await pergunta(rl, "Nome do aluno:");
          const data = await pergunta(rl, "Data (AAAA-MM-DD):");
          const horarioInicioRaw = await pergunta(rl, "Horário início (HH:MM):");
          const horarioFimRaw = await pergunta(rl, "Horário fim (HH:MM):");
          const horarioInicio = formatarHorario(horarioInicioRaw);
          const horarioFim = formatarHorario(horarioFimRaw);
          console.log(chalk.cyan("  Dia da semana:"));
          console.log(chalk.gray("  [1] SEGUNDA  [2] TERCA  [3] QUARTA  [4] QUINTA"));
          console.log(chalk.gray("  [5] SEXTA  [6] SABADO  [7] DOMINGO"));
          const diaOp = await pergunta(rl, "Escolha (1-7):");
          const dias = ["SEGUNDA","TERCA","QUARTA","QUINTA","SEXTA","SABADO","DOMINGO"];
          const diaSemana = dias[parseInt(diaOp) - 1] || "SEGUNDA";
          console.log(chalk.cyan("  Tipo:") + chalk.gray("  [1] NORMAL  [2] REPOSICAO"));
          const tipoOp = await pergunta(rl, "Escolha (1/2):");
          const tipo = tipoOp === "2" ? "REPOSICAO" : "NORMAL";
          const observacoes = await pergunta(rl, "Observações (ou deixe vazio):");
          await criarSessao({ nomeAluno, data, horarioInicio, horarioFim, diaSemana, tipo, observacoes: observacoes || null });
          sucesso(`Sessão criada para ${nomeAluno}!`);
        } catch (e) { erro("Erro: " + (e?.response?.data?.error || e.message)); }
        await pausar(rl);
        break;
      }

      case "2": {
        cabecalho("Lista de Sessões");
        try {
          const res = await listarSessoes();
          const sessoes = res.data;
          if (sessoes.length === 0) { console.log(chalk.yellow("  Nenhuma sessão cadastrada.")); }
          else {
            titulo(`Total: ${sessoes.length} sessão(ões)`);
            separador();
            sessoes.forEach(s => { exibirSessao(s); separador(); });
          }
        } catch (e) { erro("Erro: " + e.message); }
        await pausar(rl);
        break;
      }

      case "3": {
        cabecalho("Sessões de um Aluno");
        const nome = await pergunta(rl, "Nome do aluno:");
        try {
          const res = await buscarSessoesPorNomeAluno(nome);
          const sessoes = res.data;
          if (sessoes.length === 0) {
            console.log(chalk.yellow(`  Nenhuma sessão encontrada para "${nome}".`));
          } else {
            titulo(`Sessões de ${nome}:`);
            separador();
            sessoes.forEach(s => { exibirSessao(s); separador(); });
          }
        } catch (e) {
          if (e?.response?.status === 404) console.log(chalk.yellow(`  Nenhuma sessão encontrada para "${nome}".`));
          else erro("Erro: " + (e?.response?.data?.error || e.message));
        }
        await pausar(rl);
        break;
      }

      case "4": {
        cabecalho("Alterar Status da Sessão");
        try {
          const res = await listarSessoes();
          const sessoes = res.data;
          if (sessoes.length === 0) { console.log(chalk.yellow("  Nenhuma sessão cadastrada.")); await pausar(rl); break; }
          titulo("Sessões disponíveis:");
          separador();
          sessoes.forEach(s => {
            console.log(chalk.cyan(`  [${s.id}] ${s.aluno?.nome || `Aluno #${s.alunoId}`}`) +
              chalk.gray(` — ${formatarData(s.data)}`) +
              chalk.gray(` — ${s.diaSemana}`) +
              chalk.yellow(` — ${s.status}`));
          });
          separador();
          const id = await pergunta(rl, "ID da sessão:");
          console.log(chalk.cyan("  Novo status:"));
          console.log(chalk.gray("  [1] AGENDADA  [2] REALIZADA  [3] CANCELADA  [4] FALTA  [5] REAGENDADA"));
          const statusOp = await pergunta(rl, "Escolha (1-5):");
          const statusOpcoes = ["AGENDADA", "REALIZADA", "CANCELADA", "FALTA", "REAGENDADA"];
          const status = statusOpcoes[parseInt(statusOp) - 1] || "AGENDADA";
          await atualizarStatusSessao(parseInt(id), { status });
          sucesso("Status atualizado para " + status + "!");
        } catch (e) { erro("Erro: " + (e?.response?.data?.error || e.message)); }
        await pausar(rl);
        break;
      }

      case "5": {
        cabecalho("Reagendar Sessão");
        try {
          const res = await listarSessoes();
          const sessoes = res.data;
          if (sessoes.length === 0) { console.log(chalk.yellow("  Nenhuma sessão cadastrada.")); await pausar(rl); break; }
          titulo("Sessões disponíveis:");
          separador();
          sessoes.forEach(s => {
            console.log(chalk.cyan(`  [${s.id}] ${s.aluno?.nome || `Aluno #${s.alunoId}`}`) +
              chalk.gray(` — ${formatarData(s.data)}`) +
              chalk.gray(` — ${s.diaSemana}`) +
              chalk.yellow(` — ${s.status}`));
          });
          separador();
          const id = await pergunta(rl, "ID da sessão a reagendar:");
          const novaData = await pergunta(rl, "Nova data (AAAA-MM-DD):");
          const novoInicioRaw = await pergunta(rl, "Novo horário início (HH:MM):");
          const novoFimRaw = await pergunta(rl, "Novo horário fim (HH:MM):");
          const horarioInicio = formatarHorario(novoInicioRaw);
          const horarioFim = formatarHorario(novoFimRaw);
          console.log(chalk.cyan("  Novo dia da semana:"));
          console.log(chalk.gray("  [1] SEGUNDA  [2] TERCA  [3] QUARTA  [4] QUINTA"));
          console.log(chalk.gray("  [5] SEXTA  [6] SABADO  [7] DOMINGO"));
          const diaOp = await pergunta(rl, "Escolha (1-7):");
          const dias = ["SEGUNDA","TERCA","QUARTA","QUINTA","SEXTA","SABADO","DOMINGO"];
          const diaSemana = dias[parseInt(diaOp) - 1] || "SEGUNDA";
          await reagendarSessao(parseInt(id), { data: novaData, horarioInicio, horarioFim, diaSemana });
          sucesso("Sessão reagendada com sucesso!");
        } catch (e) { erro("Erro: " + (e?.response?.data?.error || e.message)); }
        await pausar(rl);
        break;
      }

      case "6": {
        cabecalho("Remover Sessão");
        try {
          const res = await listarSessoes();
          const sessoes = res.data;
          if (sessoes.length === 0) { console.log(chalk.yellow("  Nenhuma sessão cadastrada.")); await pausar(rl); break; }
          titulo("Sessões disponíveis:");
          separador();
          sessoes.forEach(s => {
            console.log(chalk.cyan(`  [${s.id}] ${s.aluno?.nome || `Aluno #${s.alunoId}`}`) +
              chalk.gray(` — ${formatarData(s.data)}`) +
              chalk.gray(` — ${s.diaSemana}`) +
              chalk.yellow(` — ${s.status}`));
          });
          separador();
          const id = await pergunta(rl, "ID da sessão a remover:");
          const confirma = await pergunta(rl, chalk.red("Confirmar remoção? (s/n):"));
          if (confirma.toLowerCase() === "s") {
            await deletarSessao(parseInt(id)); sucesso("Sessão removida!");
          } else { console.log(chalk.yellow("\n  Cancelado.")); }
        } catch (e) { erro("Erro: " + (e?.response?.data?.error || e.message)); }
        await pausar(rl);
        break;
      }

      case "0": sair = true; break;
      default: erro("Opção inválida."); await pausar(rl);
    }
  }
}

module.exports = { menuSessoes };