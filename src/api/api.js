const axios = require("axios");

const api = axios.create({
  baseURL: "http://localhost:3000",
  headers: { "Content-Type": "application/json" },
});

// ── ALUNOS ──────────────────────────────────────────
const listarAlunos = () => api.get("/alunos/todos");
const buscarAlunoPorNome = async (nome) => {
  try {
    return await api.get(`/alunos/buscar?nome=${nome}`);
  } catch (e) {
    if (e?.response?.status === 404) return { data: [] };
    throw e;
  }
};const buscarAlunoPorId = (id) => api.get(`/alunos/${id}`);
const criarAluno = (dados) => api.post("/alunos/cadastro", dados);
const atualizarAluno = (id, dados) => api.put(`/alunos/atualizar/${id}`, dados);
const deletarAluno = (id) => api.delete(`/alunos/deletar/${id}`);

// ── PACOTES ─────────────────────────────────────────
const listarPacotes = () => api.get("/pacotes/todos");
const criarPacote = (dados) => api.post("/pacotes/cadastro", dados);
const atualizarPacote = (id, dados) => api.put(`/pacotes/atualizar/${id}`, dados);
const deletarPacote = (id) => api.delete(`/pacotes/deletar/${id}`);

// ── SESSÕES ─────────────────────────────────────────
const listarSessoes = () => api.get("/sessoes/todos");
const listarSessoesPorAluno = (alunoId) => api.get(`/sessoes/aluno/${alunoId}`);
const buscarSessoesPorNomeAluno = (nome) => api.get(`/sessoes/aluno/buscar?nome=${nome}`);
const criarSessao = (dados) => api.post("/sessoes/cadastro", dados);
const atualizarStatusSessao = (id, dados) => api.patch(`/sessoes/status/${id}`, dados);
const reagendarSessao = (id, dados) => api.patch(`/sessoes/reagendar/${id}`, dados);
const deletarSessao = (id) => api.delete(`/sessoes/deletar/${id}`);

// ── AVALIAÇÕES ──────────────────────────────────────
const listarAvaliacoes = () => api.get("/avaliacoes/todos");
const listarAvaliacoesPorAluno = (alunoId) => api.get(`/avaliacoes/aluno/${alunoId}`);
const buscarAvaliacoesPorNomeAluno = (nome) => api.get(`/avaliacoes/aluno/buscar?nome=${nome}`);
const criarAvaliacao = (dados) => api.post("/avaliacoes/cadastro", dados);
const deletarAvaliacao = (id) => api.delete(`/avaliacoes/deletar/${id}`);

// ── PAGAMENTOS ──────────────────────────────────────
const listarPagamentos = () => api.get("/pagamentos/todos");
const listarPagamentosPorAluno = (alunoId) => api.get(`/pagamentos/aluno/${alunoId}`);
const buscarPagamentosPorNomeAluno = (nome) => api.get(`/pagamentos/aluno/buscar?nome=${nome}`);
const criarPagamento = (dados) => api.post("/pagamentos/cadastro", dados);
const atualizarStatusPagamento = (id, dados) => api.patch(`/pagamentos/status/${id}`, dados);
const deletarPagamento = (id) => api.delete(`/pagamentos/deletar/${id}`);

module.exports = {
  listarAlunos, buscarAlunoPorNome, buscarAlunoPorId,
  criarAluno, atualizarAluno, deletarAluno,
  listarPacotes, criarPacote, atualizarPacote, deletarPacote,
  listarSessoes, listarSessoesPorAluno, buscarSessoesPorNomeAluno,
  criarSessao, atualizarStatusSessao, reagendarSessao, deletarSessao,
  listarAvaliacoes, listarAvaliacoesPorAluno, buscarAvaliacoesPorNomeAluno,
  criarAvaliacao, deletarAvaliacao,
  listarPagamentos, listarPagamentosPorAluno, buscarPagamentosPorNomeAluno,
  criarPagamento, atualizarStatusPagamento, deletarPagamento,
};