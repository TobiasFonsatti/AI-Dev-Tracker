<<<<<<< HEAD
import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getUsuarioAtual } from "@/lib/usuario-atual";
import FormNovaSessao from "./FormNovaSessao";

export default async function NovaSessaoPage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  const usuario = await getUsuarioAtual();
  if (!usuario) redirect("/login");

  const { erro } = await searchParams;

  // Buscar projetos do usuário (ou todos se for administrador)
  const projetos = await prisma.projeto.findMany({
    where:
      usuario.perfil.nome === "ADMINISTRADOR"
        ? {}
        : { usuarioProjetos: { some: { idUsuario: usuario.idUsuario } } },
=======
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getUsuarioAtual } from "@/lib/usuario-atual";
import FormularioNovaSessao from "./formulario";

interface Props {
  searchParams: Promise<{ erro?: string }>;
}

export default async function NovaSessaoPage({ searchParams }: Props) {
  const usuario = await getUsuarioAtual();
  if (!usuario) redirect("/login");

  const params = await searchParams;

  // Carregar projetos onde o usuário participa
  const projetos = await prisma.projeto.findMany({
    where: {
      usuarioProjetos: {
        some: { idUsuario: usuario.idUsuario },
      },
    },
>>>>>>> 32aa3998cf216287cd92033ae9e4a91c0e83323c
    select: { idProjeto: true, nome: true },
    orderBy: { nome: "asc" },
  });

<<<<<<< HEAD
  if (projetos.length === 0) {
    return (
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-10">
        <h1 className="text-2xl font-semibold">Registrar sessão</h1>
        <div className="rounded border bg-yellow-50 p-4 text-sm text-yellow-800">
          Você ainda não está vinculado a nenhum projeto.{" "}
          <Link href="/projetos" className="font-semibold underline">
            Crie ou vincule-se a um projeto
          </Link>{" "}
          antes de registrar sessões.
        </div>
      </main>
    );
  }

  // Buscar tarefas dos projetos disponíveis
=======
>>>>>>> 32aa3998cf216287cd92033ae9e4a91c0e83323c
  const tarefas = await prisma.tarefa.findMany({
    where: {
      idProjeto: { in: projetos.map((p) => p.idProjeto) },
    },
<<<<<<< HEAD
    select: { idTarefa: true, idProjeto: true, titulo: true },
    orderBy: { titulo: "asc" },
  });

  // Buscar ferramentas de IA ativas
=======
    select: { idTarefa: true, titulo: true, idProjeto: true },
    orderBy: { titulo: "asc" },
  });

>>>>>>> 32aa3998cf216287cd92033ae9e4a91c0e83323c
  const ferramentas = await prisma.ferramentaIa.findMany({
    where: { ativa: true },
    select: { idFerramenta: true, nome: true },
    orderBy: { nome: "asc" },
  });

  return (
<<<<<<< HEAD
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Registrar Sessão de Desenvolvimento</h1>
          <p className="text-sm text-gray-600">
            Histórias #7, #8 e #9 — Registre suas atividades e o impacto do uso de IA.
          </p>
        </div>
        <Link href="/sessoes" className="text-sm text-gray-600 hover:underline">
          Voltar às sessões
        </Link>
      </div>

      {erro && (
        <div className="rounded bg-red-50 p-3 text-sm text-red-800 border border-red-200">
          {erro}
        </div>
      )}

      <FormNovaSessao
        projetos={projetos}
        tarefas={tarefas}
        ferramentas={ferramentas}
=======
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Registrar Sessão de Desenvolvimento</h1>
        <p className="text-sm text-gray-600 mt-1">
          Documente seu período de trabalho, o uso de IA e registre sua avaliação de experiência.
        </p>
      </div>

      <FormularioNovaSessao
        projetos={projetos}
        tarefas={tarefas}
        ferramentas={ferramentas}
        erro={params.erro}
>>>>>>> 32aa3998cf216287cd92033ae9e4a91c0e83323c
      />
    </main>
  );
}
<<<<<<< HEAD

=======
>>>>>>> 32aa3998cf216287cd92033ae9e4a91c0e83323c
