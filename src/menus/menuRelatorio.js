const chalk = require("chalk");
const { listarAlunos, listarSessoes, listarAvaliacoes, listarPagamentos, listarPacotes } = require("../api/api");
const { cabecalho, info, separador, titulo, pausar } = require("../utils/display");

async function menuRelatorio(rl) {
  cabecalho("Relatório Geral");
  console.log(chalk.gray(`  Gerado em: ${new Date().toLocaleString("pt-BR")}\n`));

  try {
    const [aRes, sRes, avRes, pRes, pkRes] = await Promise.all([
      listarAlunos(), listarSessoes(), listarAvaliacoes(), listarPagamentos(), listarPacotes()
    ]);

    const alunos = aRes.data;
    const sessoes = sRes.data;
    const avaliacoes = avRes.data;
    const pagamentos = pRes.data;
    const pacotes = pkRes.data;

    // ── ALUNOS ──────────────────────────────────────────
    titulo(" ALUNOS");
    separador();
    info("Total cadastrados", alunos.length);
    info("Ativos", alunos.filter(a => a.status === "ATIVO").length);
    info("Inativos", alunos.filter(a => a.status === "INATIVO").length);
    info("Suspensos", alunos.filter(a => a.status === "SUSPENSO").length);

    const niveis = alunos.reduce((acc, a) => {
      const n = a.nivelExperiencia || "não informado";
      acc[n] = (acc[n] || 0) + 1;
      return acc;
    }, {});
    console.log(chalk.cyan("\n  Distribuição por nível:"));
    Object.entries(niveis).forEach(([n, q]) => console.log(chalk.white(`    • ${n}: ${q}`)));

    const sexos = alunos.reduce((acc, a) => {
      const s = a.sexo || "não informado";
      acc[s] = (acc[s] || 0) + 1;
      return acc;
    }, {});
    console.log(chalk.cyan("\n  Distribuição por sexo:"));
    Object.entries(sexos).forEach(([s, q]) => console.log(chalk.white(`    • ${s}: ${q}`)));

    // ── SESSÕES ──────────────────────────────────────────
    titulo(" SESSÕES");
    separador();
    info("Total de sessões", sessoes.length);
    info("Agendadas",   sessoes.filter(s => s.status === "AGENDADA").length);
    info("Realizadas",  sessoes.filter(s => s.status === "REALIZADA").length);
    info("Canceladas",  sessoes.filter(s => s.status === "CANCELADA").length);
    info("Faltas",      sessoes.filter(s => s.status === "FALTA").length);
    info("Reagendadas", sessoes.filter(s => s.status === "REAGENDADA").length);

    const diasSemana = sessoes.reduce((acc, s) => {
      const d = s.diaSemana || "não informado";
      acc[d] = (acc[d] || 0) + 1;
      return acc;
    }, {});
    console.log(chalk.cyan("\n  Sessões por dia da semana:"));
    Object.entries(diasSemana).forEach(([d, q]) => console.log(chalk.white(`    • ${d}: ${q}`)));

    // ── AVALIAÇÕES ───────────────────────────────────────
    titulo(" AVALIAÇÕES FÍSICAS");
    separador();
    info("Total de avaliações", avaliacoes.length);
    if (avaliacoes.length > 0) {
      const pesoMedio = (avaliacoes.reduce((s, av) => s + Number(av.peso || 0), 0) / avaliacoes.length).toFixed(1);
      const imcMedio = (avaliacoes.reduce((s, av) => s + Number(av.imc || 0), 0) / avaliacoes.length).toFixed(1);
      info("Peso médio", `${pesoMedio} kg`);
      info("IMC médio", imcMedio);
    }
    info("Alunos com avaliação", [...new Set(avaliacoes.map(av => av.alunoId))].length);
    info("Alunos sem avaliação", alunos.length - [...new Set(avaliacoes.map(av => av.alunoId))].length);

    // ── PAGAMENTOS ───────────────────────────────────────
    titulo(" FINANCEIRO");
    separador();
    const totalConfirmado = pagamentos.filter(p => p.status === "CONFIRMADO").reduce((s, p) => s + Number(p.valor), 0);
    const totalPendente = pagamentos.filter(p => p.status === "PENDENTE").reduce((s, p) => s + Number(p.valor), 0);
    const totalCancelado = pagamentos.filter(p => p.status === "CANCELADO").reduce((s, p) => s + Number(p.valor), 0);
    const pagosQtd = pagamentos.filter(p => p.status === "CONFIRMADO").length;
    info("Total de pagamentos", pagamentos.length);
    info("Total confirmado", `R$ ${totalConfirmado.toFixed(2)}`);
    info("Total pendente", `R$ ${totalPendente.toFixed(2)}`);
    info("Total cancelado", `R$ ${totalCancelado.toFixed(2)}`);
    if (pagosQtd > 0) info("Ticket médio", `R$ ${(totalConfirmado / pagosQtd).toFixed(2)}`);

    const formas = pagamentos.reduce((acc, p) => {
      const f = p.formaPagamento || "não informado";
      acc[f] = (acc[f] || 0) + 1;
      return acc;
    }, {});
    console.log(chalk.cyan("\n  Formas de pagamento:"));
    Object.entries(formas).forEach(([f, q]) => console.log(chalk.white(`    • ${f}: ${q}`)));

    // ── PACOTES ──────────────────────────────────────────
    titulo(" PACOTES");
    separador();
    info("Total de pacotes", pacotes.length);
    pacotes.forEach(pk => {
      const qtd = alunos.filter(a => a.pacoteId === pk.id).length;
      console.log(chalk.white(`    • ${pk.nome}: ${qtd} aluno(s) — R$ ${Number(pk.preco).toFixed(2)}/mês`));
    });

    // ── TOP 5 ALUNOS ─────────────────────────────────────
    titulo(" TOP 5 — ALUNOS COM MAIS SESSÕES");
    separador();
    const ranking = alunos
      .map(a => ({ nome: a.nome, total: sessoes.filter(s => s.alunoId === a.id).length }))
      .filter(a => a.total > 0)
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
    if (ranking.length === 0) {
      console.log(chalk.yellow("  Sem dados suficientes."));
    } else {
      ranking.forEach((a, i) => {
        console.log(chalk.yellow(`  ${i + 1}º `) + chalk.white(`${a.nome} — ${a.total} sessão(ões)`));
      });
    }

    separador();
    console.log(chalk.gray("\n  Fim do relatório.\n"));
  } catch (e) {
    console.log(chalk.red("\n  Erro ao gerar relatório: " + e.message));
    console.log(chalk.yellow("  (Verifique se o backend está rodando em localhost:3000)\n"));
  }

  await pausar(rl);
}

module.exports = { menuRelatorio };