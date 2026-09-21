// Seed de referência — perfis, permissões e ferramentas de IA.
// Roda com: npx tsx prisma/seed.ts (ou `npm run db:seed`)
// Equivalente aos INSERTs de referência de db/schema.sql, mas via Prisma —
// necessário porque criamos as tabelas com `prisma db push`, não executando
// o .sql diretamente.

import "dotenv/config";
import { prisma } from "../src/lib/prisma";

async function main() {
  const perfis = await Promise.all(
    [
      { nome: "ADMINISTRADOR", descricao: "Gerencia usuários, permissões e ferramentas de IA" },
      { nome: "GESTOR", descricao: "Acompanha indicadores, equipes e situações de atenção" },
      { nome: "DESENVOLVEDOR", descricao: "Registra projetos, tarefas, sessões e avaliações" },
    ].map((p) =>
      prisma.perfil.upsert({
        where: { nome: p.nome },
        update: {},
        create: p,
      })
    )
  );

  const permissoes = await Promise.all(
    [
      { codigo: "USUARIO_GERENCIAR", descricao: "Gerenciar usuários" },
      { codigo: "DASHBOARD_CONSULTAR", descricao: "Consultar dashboard da equipe" },
      { codigo: "SESSAO_REGISTRAR", descricao: "Registrar sessão de desenvolvimento" },
    ].map((p) =>
      prisma.permissao.upsert({
        where: { codigo: p.codigo },
        update: {},
        create: p,
      })
    )
  );

  const admin = perfis.find((p) => p.nome === "ADMINISTRADOR")!;
  const gestor = perfis.find((p) => p.nome === "GESTOR")!;
  const dev = perfis.find((p) => p.nome === "DESENVOLVEDOR")!;
  const usuarioGerenciar = permissoes.find((p) => p.codigo === "USUARIO_GERENCIAR")!;
  const dashboardConsultar = permissoes.find((p) => p.codigo === "DASHBOARD_CONSULTAR")!;
  const sessaoRegistrar = permissoes.find((p) => p.codigo === "SESSAO_REGISTRAR")!;

  const vinculos = [
    { idPerfil: admin.idPerfil, idPermissao: usuarioGerenciar.idPermissao },
    { idPerfil: admin.idPerfil, idPermissao: dashboardConsultar.idPermissao },
    { idPerfil: admin.idPerfil, idPermissao: sessaoRegistrar.idPermissao },
    { idPerfil: gestor.idPerfil, idPermissao: dashboardConsultar.idPermissao },
    { idPerfil: dev.idPerfil, idPermissao: sessaoRegistrar.idPermissao },
  ];

  for (const v of vinculos) {
    await prisma.perfilPermissao.upsert({
      where: { idPerfil_idPermissao: v },
      update: {},
      create: v,
    });
  }

  const ferramentas = [
    { nome: "GitHub Copilot", fornecedor: "GitHub/Microsoft" },
    { nome: "ChatGPT", fornecedor: "OpenAI" },
    { nome: "Claude", fornecedor: "Anthropic" },
    { nome: "Cursor", fornecedor: "Anysphere" },
  ];
  for (const f of ferramentas) {
    await prisma.ferramentaIa.upsert({
      where: { nome: f.nome },
      update: {},
      create: f,
    });
  }

  console.log("Seed concluído:", {
    perfis: perfis.length,
    permissoes: permissoes.length,
    vinculos: vinculos.length,
    ferramentas: ferramentas.length,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
