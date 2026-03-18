const chalk = require("chalk");

function cabecalho(titulo) {
  console.log("\n" + chalk.bgMagenta.white.bold(` ═════════════════════════════ `));
  console.log(chalk.bgMagenta.white.bold(`    SGPT — ${titulo.toUpperCase()}   `));
  console.log(chalk.bgMagenta.white.bold(` ═════════════════════════════ `) + "\n");
}

function sucesso(msg) {
  console.log("\n" + chalk.green.bold("✔ " + msg));
}

function erro(msg) {
  console.log("\n" + chalk.red.bold("✖ " + msg));
}

function info(label, valor) {
  console.log(chalk.cyan("  " + label + ": ") + chalk.white(valor || "—"));
}

function separador() {
  console.log(chalk.gray("  ─────────────────────────────────────"));
}

function titulo(msg) {
  console.log("\n" + chalk.yellow.bold("  » " + msg));
}

function pausar(rl) {
  return new Promise((resolve) => {
    rl.question(chalk.gray("\n  Pressione ENTER para continuar..."), () => resolve());
  });
}

module.exports = { cabecalho, sucesso, erro, info, separador, titulo, pausar };