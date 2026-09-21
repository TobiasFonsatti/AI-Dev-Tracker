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

export function validarDuracaoSessaoMinutos(duracaoMinutos: number): string | null {
  if (!Number.isFinite(duracaoMinutos) || duracaoMinutos <= 0) {
    return "A duração precisa ser um número positivo de minutos.";
  }
  return null;
}
