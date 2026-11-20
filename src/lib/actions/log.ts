export async function logAcao({
  acao,
  tabela,
  registroId,
  novoValor,
}: {
  acao: string;
  tabela: string;
  registroId: string;
  novoValor: object;
}) {
  // Simple placeholder – replace with proper Prisma AuditLog write later
  console.log(`[AUDIT] ${acao} on ${tabela}#${registroId}`, novoValor);
}
