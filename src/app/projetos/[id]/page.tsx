import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getUsuarioAtual } from "@/lib/usuario-atual";
import { criarTarefa } from "@/lib/actions/tarefas";
import TarefaStatusForm from "@/components/TarefaStatusForm";
import { ArrowRightIcon, PlusCircleIcon, AlertTriangleIcon, CheckCircleIcon } from "@/components/icons";

export default async function ProjetoDetalhePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ erro?: string }>;
}) {
  const usuario = await getUsuarioAtual();
  if (!usuario) redirect("/login");

  const { id } = await params;
  const idProjeto = Number(id);
  const { erro } = await searchParams;

  const projeto = await prisma.projeto.findUnique({
    where: { idProjeto },
    include: {
      usuarioProjetos: { where: { idUsuario: usuario.idUsuario } },
      tarefas: { orderBy: { idTarefa: "asc" } },
    },
  });

  if (!projeto || (projeto.usuarioProjetos.length === 0 && usuario.perfil.nome !== "ADMINISTRADOR")) {
    notFound();
  }

  const concluidas = projeto.tarefas.filter((t) => t.status === "CONCLUIDA").length;
  const percentualConclusao = projeto.tarefas.length > 0 ? Math.round((concluidas / projeto.tarefas.length) * 100) : 0;

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-4 sm:px-6 py-10">
      <div>
        <Link
          href="/projetos"
          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors mb-3"
        >
          <ArrowRightIcon className="w-3.5 h-3.5 rotate-180" />
          <span>Voltar para Projetos</span>
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">{projeto.nome}</h1>
            {projeto.descricao && (
              <p className="text-sm text-slate-500 mt-1">{projeto.descricao}</p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/sessoes/nova"
              className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm shadow-indigo-600/25 hover:bg-indigo-700 transition-all"
            >
              <PlusCircleIcon className="w-4 h-4" />
              <span>Registrar Sessão</span>
            </Link>
          </div>
        </div>
      </div>

      {erro && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-200/80 px-4 py-3 text-sm text-red-800">
          <AlertTriangleIcon className="w-4 h-4 text-red-600 shrink-0" />
          <span>{erro}</span>
        </div>
      )}

      {/* Progress Card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total de Tarefas</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{projeto.tarefas.length}</p>
        </div>
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Tarefas Concluídas</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{concluidas}</p>
        </div>
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Progresso Geral</p>
          <div className="flex items-center gap-3 mt-1.5">
            <div className="flex-1 bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-indigo-600 h-full rounded-full transition-all"
                style={{ width: `${percentualConclusao}%` }}
              />
            </div>
            <span className="text-sm font-bold text-slate-800 font-mono">{percentualConclusao}%</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
            Lista de Tarefas ({projeto.tarefas.length})
          </h2>

          {projeto.tarefas.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white/50 p-10 text-center">
              <CheckCircleIcon className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-medium text-slate-700">Nenhuma tarefa criada para este projeto.</p>
              <p className="text-xs text-slate-500 mt-1">Cadastre as atividades no formulário ao lado para organizar seu trabalho.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {projeto.tarefas.map((t) => (
                <div
                  key={t.idTarefa}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs hover:border-slate-300 transition-all"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-slate-900">{t.titulo}</span>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                          t.prioridade === "ALTA"
                            ? "bg-red-100 text-red-700"
                            : t.prioridade === "MEDIA"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {t.prioridade}
                      </span>
                    </div>
                    {t.descricao && <p className="text-xs text-slate-500">{t.descricao}</p>}
                  </div>

                  <div className="shrink-0">
                    <TarefaStatusForm
                      idTarefa={t.idTarefa}
                      idProjeto={idProjeto}
                      statusAtual={t.status}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <section className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <PlusCircleIcon className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">Nova Tarefa</h2>
          </div>

          <form action={criarTarefa} className="flex flex-col gap-4">
            <input type="hidden" name="idProjeto" value={idProjeto} />

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Título da Tarefa *
              </label>
              <input
                type="text"
                name="titulo"
                placeholder="Ex.: Desenvolver endpoint de autenticação"
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
                rows={2}
                placeholder="Detalhes ou critérios de aceitação..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm text-slate-900 placeholder-slate-400 focus:bg-white resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Prioridade
              </label>
              <select
                name="prioridade"
                defaultValue="MEDIA"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm text-slate-900 focus:bg-white cursor-pointer"
              >
                <option value="BAIXA">Baixa</option>
                <option value="MEDIA">Média</option>
                <option value="ALTA">Alta</option>
              </select>
            </div>

            <button
              type="submit"
              className="mt-1 w-full rounded-xl bg-indigo-600 py-2.5 px-4 text-sm font-semibold text-white shadow-sm shadow-indigo-600/25 hover:bg-indigo-700 active:scale-[0.99] transition-all cursor-pointer"
            >
              Criar Tarefa
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
