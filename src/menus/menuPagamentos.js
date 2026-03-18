const chalk = require("chalk");
const { listarPagamentos, criarPagamento, atualizarStatusPagamento, deletarPagamento, listarAlunos, listarPagamentosPorAluno, buscarAlunoPorNome } = require("../api/api");
const { cabecalho, sucesso, erro, info, separador, titulo, pausar } = require("../utils/display");

function pergunta(rl, texto) {
  return new Promise((resolve) => rl.question(chalk.cyan("  → ") + texto + " ", resolve));
}

function formatarData(data) {
  return data ? new Date(data).toLocaleDateString("pt-BR", { timeZone: "UTC" }) : "—";
}

async function menuPagamentos(rl) {
  let sair = false;
  while (!sair) {
    cabecalho("Pagamentos");
    console.log(chalk.white("  1. Registrar pagamento"));
    console.log(chalk.white("  2. Listar todos os pagamentos"));
    console.log(chalk.white("  3. Listar pagamentos de um aluno"));
    console.log(chalk.white("  4. Alterar status do pagamento"));
    console.log(chalk.white("  5. Remover pagamento"));
    console.log(chalk.red("  0. Voltar"));
    const op = await pergunta(rl, "\nEscolha:");

    switch (op.trim()) {
      case "1": {
        cabecalho("Novo Pagamento");
        try {
          const alunosRes = await listarAlunos();
          const alunos = alunosRes.data;
          titulo("Alunos disponíveis:");
          alunos.forEach((a, i) => console.log(chalk.cyan(`  [${i + 1}] ${a.nome}`)));
          const alunoIdx = await pergunta(rl, "Número do aluno:");
          const alunoEscolhido = alunos[parseInt(alunoIdx) - 1];
          if (!alunoEscolhido) { erro("Aluno inválido."); await pausar(rl); break; }
          const valor = await pergunta(rl, "Valor (R$):");
          console.log(chalk.cyan("  Forma de pagamento:"));
          console.log(chalk.gray("  [1] PIX  [2] CARTAO_CREDITO  [3] CARTAO_DEBITO  [4] DINHEIRO  [5] BOLETO"));
          const formaOp = await pergunta(rl, "Escolha (1-5):");
          const formas = ["PIX", "CARTAO_CREDITO", "CARTAO_DEBITO", "DINHEIRO", "BOLETO"];
          const formaPagamento = formas[parseInt(formaOp) - 1] || "PIX";
          const dataVencimento = await pergunta(rl, "Vencimento (AAAA-MM-DD):");
          await criarPagamento({
            alunoId: alunoEscolhido.id,
            valor: parseFloat(valor),
            formaPagamento,
            dataVencimento: dataVencimento ? new Date(dataVencimento).toISOString() : null,
          });
          sucesso(`Pagamento de R$ ${parseFloat(valor).toFixed(2)} registrado para ${alunoEscolhido.nome}!`);
        } catch (e) { erro("Erro: " + (e?.response?.data?.error || e.message)); }
        await pausar(rl);
        break;
      }

      case "2": {
        cabecalho("Lista de Pagamentos");
        try {
          const res = await listarPagamentos();
          const pags = res.data;
          if (pags.length === 0) { console.log(chalk.yellow("  Nenhum pagamento cadastrado.")); }
          else {
            const totalPago = pags.filter(p => p.status === "CONFIRMADO").reduce((s, p) => s + Number(p.valor), 0);
            titulo(`Total: ${pags.length} | Recebido: R$ ${totalPago.toFixed(2)}`);
            separador();
            pags.forEach(p => {
              const cor = p.status === "CONFIRMADO" ? chalk.green : p.status === "CANCELADO" ? chalk.red : chalk.yellow;
              console.log(chalk.magenta.bold(`  ID ${p.id} — `) + chalk.white.bold(p.aluno?.nome || `Aluno #${p.alunoId}`));
              info("    Valor", `R$ ${Number(p.valor).toFixed(2)}`);
              info("    Forma", p.formaPagamento);
              console.log(chalk.cyan("    Status: ") + cor.bold(p.status));
              info("    Vencimento", formatarData(p.dataVencimento));
              info("    Pago em", formatarData(p.dataPagamento));
              separador();
            });
          }
        } catch (e) { erro("Erro: " + e.message); }
        await pausar(rl);
        break;
      }

      case "3": {
        cabecalho("Pagamentos por Aluno");
        const nome = await pergunta(rl, "Nome do aluno:");
        try {
          const encontrados = await buscarAlunoPorNome(nome);
          const alunos = encontrados.data;
          if (alunos.length === 0) { console.log(chalk.yellow(`  Nenhum aluno encontrado com "${nome}".`)); await pausar(rl); break; }
          let alunoEscolhido;
          if (alunos.length === 1) {
            alunoEscolhido = alunos[0];
          } else {
            titulo(`${alunos.length} alunos encontrados:`);
            alunos.forEach((a, i) => console.log(chalk.cyan(`  [${i + 1}] ${a.nome}`) + chalk.gray(` — ${a.email}`)));
            const escolha = await pergunta(rl, "Número da opção:");
            alunoEscolhido = alunos[parseInt(escolha) - 1];
            if (!alunoEscolhido) { erro("Opção inválida."); await pausar(rl); break; }
          }
          const res = await listarPagamentosPorAluno(alunoEscolhido.id);
          const pags = res.data;
          titulo(`Pagamentos de ${alunoEscolhido.nome}:`);
          separador();
          if (pags.length === 0) {
            console.log(chalk.yellow("  Nenhum pagamento encontrado."));
          } else {
            const totalPago = pags.filter(p => p.status === "CONFIRMADO").reduce((s, p) => s + Number(p.valor), 0);
            pags.forEach(p => {
              const cor = p.status === "CONFIRMADO" ? chalk.green : p.status === "CANCELADO" ? chalk.red : chalk.yellow;
              console.log(chalk.magenta.bold(`  ID ${p.id}`));
              info("    Valor", `R$ ${Number(p.valor).toFixed(2)}`);
              info("    Forma", p.formaPagamento);
              console.log(chalk.cyan("    Status: ") + cor.bold(p.status));
              info("    Vencimento", formatarData(p.dataVencimento));
              info("    Pago em", formatarData(p.dataPagamento));
              separador();
            });
            console.log(chalk.green.bold(`  Total confirmado: R$ ${totalPago.toFixed(2)}`));
          }
        } catch (e) { erro("Erro: " + (e?.response?.data?.error || e.message)); }
        await pausar(rl);
        break;
      }

      case "4": {
        cabecalho("Alterar Status do Pagamento");
        try {
          const res = await listarPagamentos();
          const pags = res.data;
          if (pags.length === 0) { console.log(chalk.yellow("  Nenhum pagamento cadastrado.")); await pausar(rl); break; }
          titulo("Pagamentos disponíveis:");
          separador();
          pags.forEach(p => {
            const cor = p.status === "CONFIRMADO" ? chalk.green : p.status === "CANCELADO" ? chalk.red : chalk.yellow;
            console.log(chalk.cyan(`  [${p.id}] ${p.aluno?.nome || `Aluno #${p.alunoId}`}`) +
              chalk.gray(` — R$ ${Number(p.valor).toFixed(2)}`) +
              chalk.gray(" — ") + cor(p.status));
          });
          separador();
          const id = await pergunta(rl, "ID do pagamento:");
          console.log(chalk.cyan("  Novo status:"));
          console.log(chalk.gray("  [1] PENDENTE  [2] CONFIRMADO  [3] CANCELADO"));
          const statusOp = await pergunta(rl, "Escolha (1-3):");
          const statusOpcoes = ["PENDENTE", "CONFIRMADO", "CANCELADO"];
          const status = statusOpcoes[parseInt(statusOp) - 1] || "PENDENTE";
          let dataPagamento = undefined;
          if (status === "CONFIRMADO") {
            const dataInput = await pergunta(rl, "Data do pagamento (AAAA-MM-DD, ou vazio para hoje):");
            dataPagamento = dataInput ? new Date(dataInput).toISOString() : new Date().toISOString();
          }
          await atualizarStatusPagamento(parseInt(id), { status, dataPagamento });
          sucesso("Status atualizado para " + status + "!");
        } catch (e) { erro("Erro: " + (e?.response?.data?.error || e.message)); }
        await pausar(rl);
        break;
      }

      case "5": {
        cabecalho("Remover Pagamento");
        try {
          const res = await listarPagamentos();
          const pags = res.data;
          if (pags.length === 0) { console.log(chalk.yellow("  Nenhum pagamento cadastrado.")); await pausar(rl); break; }
          titulo("Pagamentos disponíveis:");
          separador();
          pags.forEach(p => {
            const cor = p.status === "CONFIRMADO" ? chalk.green : p.status === "CANCELADO" ? chalk.red : chalk.yellow;
            console.log(chalk.cyan(`  [${p.id}] ${p.aluno?.nome || `Aluno #${p.alunoId}`}`) +
              chalk.gray(` — R$ ${Number(p.valor).toFixed(2)}`) +
              chalk.gray(" — ") + cor(p.status));
          });
          separador();
          const id = await pergunta(rl, "ID do pagamento a remover:");
          const confirma = await pergunta(rl, chalk.red("Confirmar remoção? (s/n):"));
          if (confirma.toLowerCase() === "s") {
            await deletarPagamento(parseInt(id)); sucesso("Pagamento removido!");
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

module.exports = { menuPagamentos };