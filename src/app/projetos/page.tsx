import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getUsuarioAtual } from "@/lib/usuario-atual";
import { criarProjeto } from "@/lib/actions/projetos";
import { FolderIcon, PlusCircleIcon, ArrowRightIcon, AlertTriangleIcon } from "@/components/icons";

export default async function ProjetosPage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  const usuario = await getUsuarioAtual();
  if (!usuario) redirect("/login");
  const { erro } = await searchParams;

  const projetos = await prisma.projeto.findMany({
    where: { usuarioProjetos: { some: { idUsuario: usuario.idUsuario } } },
    orderBy: { dataCriacao: "desc" },
    include: { _count: { select: { tarefas: true } } },
  });

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-4 sm:px-6 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Meus Projetos</h1>
          <p className="text-sm text-slate-500 mt-1">
            Gerencie seus contextos de desenvolvimento, tarefas e associados
          </p>
        </div>
      </div>

      {erro && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-200/80 px-4 py-3 text-sm text-red-800">
          <AlertTriangleIcon className="w-4 h-4 text-red-600 shrink-0" />
          <span>{erro}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
            Projetos Ativos ({projetos.length})
          </h2>

          {projetos.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white/50 p-10 text-center">
              <FolderIcon className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-medium text-slate-700">Você ainda não participa de nenhum projeto.</p>
              <p className="text-xs text-slate-500 mt-1">Crie seu primeiro projeto no formulário ao lado para começar.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {projetos.map((p) => (
                <Link
                  key={p.idProjeto}
                  href={`/projetos/${p.idProjeto}`}
                  className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        <FolderIcon className="w-4 h-4" />
                      </div>
                      <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                        {p._count.tarefas} {p._count.tarefas === 1 ? "tarefa" : "tarefas"}
                      </span>
                    </div>
                    <h3 className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {p.nome}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                      {p.descricao || "Sem descrição informada."}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                    <span>Criado em {new Date(p.dataCriacao).toLocaleDateString("pt-BR")}</span>
                    <span className="flex items-center gap-1 font-medium text-indigo-600 group-hover:translate-x-0.5 transition-transform">
                      Acessar <ArrowRightIcon className="w-3 h-3" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <section className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <PlusCircleIcon className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">Novo Projeto</h2>
          </div>

          <form action={criarProjeto} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Nome do Projeto *
              </label>
              <input
                type="text"
                name="nome"
                placeholder="Ex.: App de Reconhecimento Facial"
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm text-slate-900 placeholder-slate-400 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Descrição (opcional)
              </label>
              <textarea
                name="descricao"
                rows={3}
                placeholder="Breve resumo dos objetivos do projeto..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm text-slate-900 placeholder-slate-400 focus:bg-white resize-none"
              />
            </div>

            <button
              type="submit"
              className="mt-1 w-full rounded-xl bg-indigo-600 py-2.5 px-4 text-sm font-semibold text-white shadow-sm shadow-indigo-600/25 hover:bg-indigo-700 active:scale-[0.99] transition-all cursor-pointer"
            >
              Criar Projeto
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
