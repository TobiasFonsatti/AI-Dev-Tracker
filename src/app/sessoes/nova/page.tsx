import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getUsuarioAtual } from "@/lib/usuario-atual";
import FormularioNovaSessao from "./formulario";
import { PlusCircleIcon, ArrowRightIcon, AlertTriangleIcon } from "@/components/icons";

interface Props {
  searchParams: Promise<{ erro?: string }>;
}

export default async function NovaSessaoPage({ searchParams }: Props) {
  const usuario = await getUsuarioAtual();
  if (!usuario) redirect("/login");

  const params = await searchParams;

  // Carregar projetos onde o usuário participa (ou todos se administrador)
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
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-12">
        <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-8 text-center shadow-xs">
          <AlertTriangleIcon className="w-10 h-10 text-amber-600 mx-auto mb-3" />
          <h1 className="text-xl font-bold text-amber-900">Nenhum projeto associado</h1>
          <p className="text-sm text-amber-700 mt-2 max-w-md mx-auto">
            Você ainda não está vinculado a nenhum projeto ativo. Para registrar uma sessão de desenvolvimento, você precisa pertencer a pelo menos um projeto.
          </p>
          <div className="mt-6">
            <Link
              href="/projetos"
              className="inline-flex items-center gap-1.5 rounded-xl bg-amber-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-amber-700 transition-colors"
            >
              <span>Ir para Meus Projetos</span>
              <ArrowRightIcon className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const tarefas = await prisma.tarefa.findMany({
    where: {
      idProjeto: { in: projetos.map((p) => p.idProjeto) },
    },
    select: { idTarefa: true, titulo: true, idProjeto: true },
    orderBy: { titulo: "asc" },
  });

  const ferramentas = await prisma.ferramentaIa.findMany({
    where: { ativa: true },
    select: { idFerramenta: true, nome: true },
    orderBy: { nome: "asc" },
  });

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-4 sm:px-6 py-10">
      <div className="border-b border-slate-200/80 pb-6">
        <Link
          href="/historico"
          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors mb-2"
        >
          <ArrowRightIcon className="w-3.5 h-3.5 rotate-180" />
          <span>Voltar para Histórico</span>
        </Link>
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <PlusCircleIcon className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Registrar Sessão de Desenvolvimento</h1>
            <p className="text-sm text-slate-500">
              Documente seu período de trabalho, as ferramentas de IA empregadas e avalie o impacto na sua produtividade
            </p>
          </div>
        </div>
      </div>

      <FormularioNovaSessao
        projetos={projetos}
        tarefas={tarefas}
        ferramentas={ferramentas}
        erro={params.erro}
      />
    </main>
  );
}
