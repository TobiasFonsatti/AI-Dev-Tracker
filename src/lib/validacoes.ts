// Validações puras, sem dependência de banco/rede — reaproveitadas pelas
// server actions e cobertas por testes unitários (ver docs/plano-de-testes.md).

export function validarNomeProjeto(nome: string): string | null {
  if (!nome.trim()) return "O nome do projeto não pode ser vazio.";
  return null;
}

export function validarTituloTarefa(titulo: string): string | null {
  if (!titulo.trim()) return "O título da tarefa não pode ser vazio.";
  return null;
}

export function validarCadastro(nome: string, email: string, senha: string): string | null {
  if (!nome.trim() || !email.trim()) {
    return "Preencha nome e e-mail.";
  }
  if (senha.length < 6) {
    return "A senha precisa ter pelo menos 6 caracteres.";
  }
  return null;
}

export const STATUS_TAREFA = ["PENDENTE", "EM_ANDAMENTO", "CONCLUIDA", "CANCELADA"];
export const PRIORIDADES_TAREFA = ["BAIXA", "MEDIA", "ALTA"];
export const STATUS_USUARIO = ["ATIVO", "INATIVO", "BLOQUEADO"];

export function validarAceitePrivacidade(aceite: unknown): string | null {
  if (aceite !== "on") return "É preciso aceitar o aviso de privacidade para criar a conta.";
  return null;
}

export function validarDuracaoSessaoMinutos(duracaoMinutos: number): string | null {
  if (!Number.isFinite(duracaoMinutos) || duracaoMinutos <= 0) {
    return "A duração precisa ser um número positivo de minutos.";
  }
  return null;
}

export function validarEscalaAvaliacao(nota: number, campo: string): string | null {
  if (!Number.isInteger(nota) || nota < 1 || nota > 5) {
    return `O campo ${campo} deve ser uma nota inteira entre 1 e 5.`;
  }
  return null;
}

export interface ValidarSessaoInput {
  duracaoMinutos: number;
  usouIa: boolean;
  tipoAtividade?: string | null;
  idFerramenta?: number | null;
}

export function validarSessao(dados: ValidarSessaoInput): string | null {
  const erroDuracao = validarDuracaoSessaoMinutos(dados.duracaoMinutos);
  if (erroDuracao) return erroDuracao;

  if (!dados.tipoAtividade || !dados.tipoAtividade.trim()) {
    return "O tipo de atividade é obrigatório.";
  }

  if (dados.usouIa) {
    if (!dados.idFerramenta || dados.idFerramenta <= 0) {
      return "Selecione uma ferramenta de IA ao indicar uso de IA.";
    }
  }

  return null;
}
