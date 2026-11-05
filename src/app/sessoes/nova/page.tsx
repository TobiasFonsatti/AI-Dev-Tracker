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
    select: { idProjeto: true, nome: true },
    orderBy: { nome: "asc" },
  });

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
  const tarefas = await prisma.tarefa.findMany({
    where: {
      idProjeto: { in: projetos.map((p) => p.idProjeto) },
    },
    select: { idTarefa: true, idProjeto: true, titulo: true },
    orderBy: { titulo: "asc" },
  });

  // Buscar ferramentas de IA ativas
  const ferramentas = await prisma.ferramentaIa.findMany({
    where: { ativa: true },
    select: { idFerramenta: true, nome: true },
    orderBy: { nome: "asc" },
  });

  return (
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
      />
    </main>
  );
}

