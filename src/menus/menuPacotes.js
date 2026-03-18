const chalk = require("chalk");
const { listarPacotes, criarPacote, atualizarPacote, deletarPacote } = require("../api/api");
const { cabecalho, sucesso, erro, info, separador, titulo, pausar } = require("../utils/display");

function pergunta(rl, texto) {
  return new Promise((resolve) => rl.question(chalk.cyan("  → ") + texto + " ", resolve));
}

async function menuPacotes(rl) {
  let sair = false;
  while (!sair) {
    cabecalho("Pacotes de Aulas");
    console.log(chalk.white("  1. Listar todos os pacotes"));
    console.log(chalk.white("  2. Criar novo pacote"));
    console.log(chalk.white("  3. Alterar pacote"));
    console.log(chalk.white("  4. Remover pacote"));
    console.log(chalk.red("  0. Voltar"));
    const op = await pergunta(rl, "\nEscolha:");

    switch (op.trim()) {

      case "1": {
        cabecalho("Lista de Pacotes");
        try {
          const res = await listarPacotes();
          const pacotes = res.data;
          if (pacotes.length === 0) {
            console.log(chalk.yellow("  Nenhum pacote cadastrado."));
          } else {
            titulo(`Total: ${pacotes.length} pacote(s)`);
            separador();
            pacotes.forEach((p) => {
              console.log(chalk.magenta.bold(`  ID ${p.id} — `) + chalk.white.bold(p.nome));
              info("    Frequência semanal", `${p.frequenciaSemanal}x por semana`);
              info("    Preço", `R$ ${Number(p.preco).toFixed(2)}`);
              info("    Limite de reposições", p.limiteReposicoes);
              info("    Status", p.ativo ? "Ativo" : "Inativo");
              separador();
            });
          }
        } catch (e) {
          erro("Erro ao listar: " + e.message);
        }
        await pausar(rl);
        break;
      }

      case "2": {
        cabecalho("Novo Pacote");
        const nome = await pergunta(rl, "Nome do pacote:");
        const frequenciaSemanal = await pergunta(rl, "Frequência semanal (quantas vezes por semana):");
        const preco = await pergunta(rl, "Preço (R$):");
        const limiteReposicoes = await pergunta(rl, "Limite de reposições:");
        try {
          await criarPacote({
            nome,
            frequenciaSemanal: parseInt(frequenciaSemanal),
            preco: parseFloat(preco),
            limiteReposicoes: parseInt(limiteReposicoes),
            ativo: true,
          });
          sucesso(`Pacote "${nome}" criado com sucesso!`);
        } catch (e) {
          erro("Erro ao criar: " + (e?.response?.data?.message || e.message));
        }
        await pausar(rl);
        break;
      }

      case "3": {
        cabecalho("Alterar Pacote");
        try {
          const res = await listarPacotes();
          res.data.forEach(p => console.log(chalk.cyan(`  [${p.id}] ${p.nome} — R$ ${Number(p.preco).toFixed(2)}`)));
          const id = await pergunta(rl, "\nID do pacote a alterar:");
          const pacote = res.data.find(p => p.id === parseInt(id));
          if (!pacote) { erro("Pacote não encontrado."); await pausar(rl); break; }

          console.log(chalk.yellow(`\n  Deixe em branco para manter o valor atual\n`));
          const nome = await pergunta(rl, `Nome [${pacote.nome}]:`);
          const frequenciaSemanal = await pergunta(rl, `Frequência semanal [${pacote.frequenciaSemanal}]:`);
          const preco = await pergunta(rl, `Preço [${pacote.preco}]:`);
          const limiteReposicoes = await pergunta(rl, `Limite de reposições [${pacote.limiteReposicoes}]:`);
          const ativo = await pergunta(rl, `Ativo? [${pacote.ativo ? "sim" : "nao"}] (sim/nao):`);

          await atualizarPacote(parseInt(id), {
            nome: nome || pacote.nome,
            frequenciaSemanal: frequenciaSemanal ? parseInt(frequenciaSemanal) : pacote.frequenciaSemanal,
            preco: preco ? parseFloat(preco) : pacote.preco,
            limiteReposicoes: limiteReposicoes ? parseInt(limiteReposicoes) : pacote.limiteReposicoes,
            ativo: ativo ? ativo.toLowerCase() === "sim" : pacote.ativo,
          });
          sucesso("Pacote atualizado!");
        } catch (e) {
          erro("Erro ao alterar: " + e.message);
        }
        await pausar(rl);
        break;
      }

      case "4": {
        cabecalho("Remover Pacote");
        try {
          const res = await listarPacotes();
          res.data.forEach(p => console.log(chalk.cyan(`  [${p.id}] ${p.nome}`)));
          const id = await pergunta(rl, "\nID do pacote a remover:");
          const confirma = await pergunta(rl, chalk.red("Confirmar remoção? (s/n):"));
          if (confirma.toLowerCase() === "s") {
            await deletarPacote(parseInt(id));
            sucesso("Pacote removido!");
          } else {
            console.log(chalk.yellow("\n  Cancelado."));
          }
        } catch (e) {
          erro("Erro ao remover: " + e.message);
        }
        await pausar(rl);
        break;
      }

      case "0": sair = true; break;
      default:
        erro("Opção inválida.");
        await pausar(rl);
    }
  }
}

module.exports = { menuPacotes };