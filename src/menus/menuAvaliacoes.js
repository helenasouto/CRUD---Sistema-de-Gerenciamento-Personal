const chalk = require("chalk");
const { listarAvaliacoes, criarAvaliacao, deletarAvaliacao, buscarAvaliacoesPorNomeAluno } = require("../api/api");
const { cabecalho, sucesso, erro, info, separador, titulo, pausar } = require("../utils/display");

function pergunta(rl, texto) {
  return new Promise((resolve) => rl.question(chalk.cyan("  → ") + texto + " ", resolve));
}

function formatarData(data) {
  return data ? new Date(data).toLocaleDateString("pt-BR", { timeZone: "UTC" }) : "—";
}

function exibirAvaliacao(av) {
  console.log(chalk.magenta.bold(`  ID ${av.id} — `) + chalk.white.bold(av.aluno?.nome || `Aluno #${av.alunoId}`));
  info("    Data", formatarData(av.dataAvaliacao));
  info("    Peso", `${av.peso} kg`);
  info("    Altura", `${av.altura} m`);
  info("    IMC", av.imc);
  info("    % Gordura", av.percentualGordura ? `${av.percentualGordura}%` : null);
  info("    Massa Magra", av.massaMagra ? `${av.massaMagra} kg` : null);
}

async function menuAvaliacoes(rl) {
  let sair = false;
  while (!sair) {
    cabecalho("Avaliações Físicas");
    console.log(chalk.white("  1. Registrar nova avaliação"));
    console.log(chalk.white("  2. Listar todas as avaliações"));
    console.log(chalk.white("  3. Listar avaliações de um aluno"));
    console.log(chalk.white("  4. Remover avaliação"));
    console.log(chalk.red("  0. Voltar"));
    const op = await pergunta(rl, "\nEscolha:");

    switch (op.trim()) {
      case "1": {
        cabecalho("Nova Avaliação");
        try {
          const nomeAluno = await pergunta(rl, "Nome do aluno:");
          const dataAvaliacao = await pergunta(rl, "Data da avaliação (AAAA-MM-DD):");
          const peso = await pergunta(rl, "Peso (kg):");
          const altura = await pergunta(rl, "Altura (m):");
          const percentualGordura = await pergunta(rl, "% Gordura (ou deixe vazio):");
          const massaMagra = await pergunta(rl, "Massa Magra (kg) (ou deixe vazio):");
          const p = parseFloat(peso);
          const h = parseFloat(altura);
          console.log(chalk.green(`\n  IMC calculado: ${(p / (h * h)).toFixed(2)}`));
          await criarAvaliacao({
            nomeAluno, dataAvaliacao,
            peso: p, altura: h,
            percentualGordura: percentualGordura ? parseFloat(percentualGordura) : null,
            massaMagra: massaMagra ? parseFloat(massaMagra) : null,
          });
          sucesso("Avaliação registrada!");
        } catch (e) { erro("Erro: " + (e?.response?.data?.error || e.message)); }
        await pausar(rl);
        break;
      }

      case "2": {
        cabecalho("Lista de Avaliações");
        try {
          const res = await listarAvaliacoes();
          const avs = res.data;
          if (avs.length === 0) { console.log(chalk.yellow("  Nenhuma avaliação cadastrada.")); }
          else {
            titulo(`Total: ${avs.length} avaliação(ões)`);
            separador();
            avs.forEach(av => { exibirAvaliacao(av); separador(); });
          }
        } catch (e) { erro("Erro: " + e.message); }
        await pausar(rl);
        break;
      }

      case "3": {
        cabecalho("Avaliações de um Aluno");
        const nome = await pergunta(rl, "Nome do aluno:");
        try {
          const res = await buscarAvaliacoesPorNomeAluno(nome);
          const avs = res.data;
          if (avs.length === 0) {
            console.log(chalk.yellow(`  Nenhuma avaliação encontrada para "${nome}".`));
          } else {
            titulo(`Avaliações de ${nome}:`);
            separador();
            avs.forEach(av => { exibirAvaliacao(av); separador(); });
          }
        } catch (e) {
          if (e?.response?.status === 404) console.log(chalk.yellow(`  Nenhuma avaliação encontrada para "${nome}".`));
          else erro("Erro: " + (e?.response?.data?.error || e.message));
        }
        await pausar(rl);
        break;
      }

      case "4": {
        cabecalho("Remover Avaliação");
        try {
          const res = await listarAvaliacoes();
          const avs = res.data;
          if (avs.length === 0) { console.log(chalk.yellow("  Nenhuma avaliação cadastrada.")); await pausar(rl); break; }
          titulo("Avaliações disponíveis:");
          separador();
          avs.forEach(av => {
            console.log(chalk.cyan(`  [${av.id}] ${av.aluno?.nome || `Aluno #${av.alunoId}`}`) +
              chalk.gray(` — ${formatarData(av.dataAvaliacao)}`) +
              chalk.gray(` — IMC: ${av.imc}`));
          });
          separador();
          const id = await pergunta(rl, "ID da avaliação a remover:");
          const confirma = await pergunta(rl, chalk.red("Confirmar remoção? (s/n):"));
          if (confirma.toLowerCase() === "s") {
            await deletarAvaliacao(parseInt(id)); sucesso("Avaliação removida!");
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

module.exports = { menuAvaliacoes };