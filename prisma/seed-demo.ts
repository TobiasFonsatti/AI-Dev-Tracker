// Seed de demonstração — contas, projeto, tarefas e sessões para o dashboard
// abrir preenchido. Rode depois de `npm run db:seed`:
//   SEED_DEMO_SENHA="<senha-de-teste>" npm run db:seed:demo
// Pode rodar mais de uma vez: contas são reaproveitadas e as sessões só são
// criadas se o projeto de demonstração ainda não tiver nenhuma.

import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import { prisma } from "../src/lib/prisma";
import { calcularSituacaoAtencao } from "../src/lib/indicadores";

const CONTAS = [
  { nome: "Administrador Demo", email: "demo.admin@aidevtracker.test", perfil: "ADMINISTRADOR" },
  { nome: "Gestora Demo", email: "demo.gestor@aidevtracker.test", perfil: "GESTOR" },
  { nome: "Ana Demo", email: "demo.ana@aidevtracker.test", perfil: "DESENVOLVEDOR" },
  { nome: "Bruno Demo", email: "demo.bruno@aidevtracker.test", perfil: "DESENVOLVEDOR" },
];

const NOME_PROJETO = "Projeto de Demonstração";
const TOTAL_SESSOES = 12;
const INTERVALO_DIAS = 3;

function diasAtras(dias: number): Date {
  const data = new Date();
  data.setUTCHours(0, 0, 0, 0);
  data.setUTCDate(data.getUTCDate() - dias);
  return data;
}

function clienteAdmin() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
}

async function garantirContaAuth(
  supabase: ReturnType<typeof clienteAdmin>,
  email: string,
  senha: string
): Promise<string> {
  const { data, error } = await supabase.auth.admin.listUsers({ perPage: 1000 });
  if (error) throw error;

  const existente = data.users.find((u) => u.email === email);
  if (existente) return existente.id;

  const criado = await supabase.auth.admin.createUser({
    email,
    password: senha,
    email_confirm: true,
  });
  if (criado.error) throw criado.error;
  return criado.data.user.id;
}

async function main() {
  const senha = process.env.SEED_DEMO_SENHA;
  if (!senha || senha.length < 6) {
    throw new Error("Defina SEED_DEMO_SENHA com pelo menos 6 caracteres.");
  }

  const supabase = clienteAdmin();

  const usuarios = [];
  for (const conta of CONTAS) {
    const authUserId = await garantirContaAuth(supabase, conta.email, senha);
    const perfil = await prisma.perfil.findUniqueOrThrow({ where: { nome: conta.perfil } });
    usuarios.push(
      await prisma.usuario.upsert({
        where: { email: conta.email },
        update: {},
        create: { nome: conta.nome, email: conta.email, authUserId, idPerfil: perfil.idPerfil },
      })
    );
  }
  const [, , ana, bruno] = usuarios;

  const projeto =
    (await prisma.projeto.findFirst({ where: { nome: NOME_PROJETO } })) ??
    (await prisma.projeto.create({
      data: {
        nome: NOME_PROJETO,
        descricao: "Dados fictícios para demonstrar o dashboard e os alertas.",
        dataCriacao: diasAtras(TOTAL_SESSOES * INTERVALO_DIAS),
      },
    }));

  const sessoesExistentes = await prisma.sessaoDesenvolvimento.count({
    where: { idProjeto: projeto.idProjeto },
  });
  if (sessoesExistentes > 0) {
    console.log("Projeto de demonstração já tem sessões; nada a criar.");
    return;
  }

  for (const dev of [ana, bruno]) {
    await prisma.usuarioProjeto.upsert({
      where: {
        idUsuario_idProjeto: { idUsuario: dev.idUsuario, idProjeto: projeto.idProjeto },
      },
      update: {},
      create: {
        idUsuario: dev.idUsuario,
        idProjeto: projeto.idProjeto,
        papelNoProjeto: "DESENVOLVEDOR",
      },
    });
  }

  const tarefa = await prisma.tarefa.create({
    data: {
      idProjeto: projeto.idProjeto,
      titulo: "Implementar tela de relatórios",
      status: "EM_ANDAMENTO",
    },
  });
  const ferramentas = await prisma.ferramentaIa.findMany({ where: { ativa: true } });

  // Ana mantém boa confiança; Bruno usa IA com confiança baixa e dificuldade
  // alta, o que dispara a situação de atenção nas 5 sessões mais recentes.
  const perfisDeUso = [
    { dev: ana, confianca: 4, dificuldade: 2, produtividade: 4 },
    { dev: bruno, confianca: 2, dificuldade: 4, produtividade: 3 },
  ];

  for (const { dev, confianca, dificuldade, produtividade } of perfisDeUso) {
    for (let i = 0; i < TOTAL_SESSOES; i++) {
      const usouIa = dev === bruno || i % 3 !== 0;
      await prisma.sessaoDesenvolvimento.create({
        data: {
          idUsuario: dev.idUsuario,
          idProjeto: projeto.idProjeto,
          idTarefa: tarefa.idTarefa,
          dataSessao: diasAtras(i * INTERVALO_DIAS),
          duracaoMinutos: 45 + (i % 4) * 15,
          usouIa,
          tipoAtividade: usouIa ? "Geração de código" : "Desenvolvimento manual",
          sessaoFerramentas: usouIa
            ? { create: { idFerramenta: ferramentas[i % ferramentas.length].idFerramenta } }
            : undefined,
          avaliacao: {
            create: { produtividade, dificuldade, confianca, foco: 3, fluidez: 3, qualidadeFeedback: 3 },
          },
        },
      });
    }

    const ultimas = await prisma.sessaoDesenvolvimento.findMany({
      where: { idUsuario: dev.idUsuario, usouIa: true },
      include: { avaliacao: true },
      orderBy: { dataSessao: "desc" },
      take: 5,
    });
    const checagem = calcularSituacaoAtencao(ultimas);
    if (checagem.disparar && checagem.motivo) {
      await prisma.situacaoAtencao.create({
        data: {
          idSessao: ultimas[0].idSessao,
          idUsuario: dev.idUsuario,
          motivo: checagem.motivo,
          dataIdentificacao: diasAtras(0),
        },
      });
    }
  }

  console.log("Seed de demonstração concluído:", {
    contas: CONTAS.length,
    sessoes: TOTAL_SESSOES * perfisDeUso.length,
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
