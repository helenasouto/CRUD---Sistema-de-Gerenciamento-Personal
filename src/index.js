const readline = require("readline");
const chalk = require("chalk");
const { menuAlunos } = require("./menus/menuAlunos");
const { menuSessoes } = require("./menus/menuSessoes");
const { menuAvaliacoes } = require("./menus/menuAvaliacoes");
const { menuPagamentos } = require("./menus/menuPagamentos");
const { menuRelatorio } = require("./menus/menuRelatorio");
const { cabecalho, erro, pausar } = require("./utils/display");
const { menuPacotes } = require("./menus/menuPacotes");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function pergunta(texto) {
  return new Promise((resolve) => rl.question(chalk.cyan("  → ") + texto + " ", resolve));
}

async function main() {
  let sair = false;
  while (!sair) {
    console.clear();
    console.log(chalk.magenta.bold("\n╔════════════════════════════════════════╗"));
    console.log(chalk.magenta.bold("  ║            PERSONAL TRAINER            ║"));
    console.log(chalk.magenta.bold("  ║        Sistema de Gerenciamento        ║"));
    console.log(chalk.magenta.bold("  ╚════════════════════════════════════════╝\n"));
    console.log(chalk.white("  1. Gerenciar Alunos"));
    console.log(chalk.white("  2. Gerenciar Sessões"));
    console.log(chalk.white("  3. Gerenciar Avaliações Físicas"));
    console.log(chalk.white("  4. Gerenciar Pagamentos"));
    console.log(chalk.white("  5. Gerenciar Pacotes de Aulas"));  // ← novo
    console.log(chalk.yellow("  6. Gerar Relatório Geral"));      // ← era 5
    console.log(chalk.red("  0. Sair\n"));

    const op = await pergunta("Escolha uma opção:");
    switch (op.trim()) {
      case "1": await menuAlunos(rl); break;
      case "2": await menuSessoes(rl); break;
      case "3": await menuAvaliacoes(rl); break;
      case "4": await menuPagamentos(rl); break;
      case "5": await menuPacotes(rl); break;   // ← novo
      case "6": await menuRelatorio(rl); break; // ← era case "5"
      case "0":
        console.log(chalk.magenta.bold("\n  Até logo! \n"));
        rl.close();
        sair = true;
        break;
      default:
        erro("Opção inválida.");
        await pausar(rl);
    }
  }
}

main();