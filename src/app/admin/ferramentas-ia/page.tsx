import { prisma } from "@/lib/prisma";
import { exigirAdmin } from "@/lib/usuario-atual";
import { criarFerramenta, alternarStatusFerramenta } from "@/lib/actions/admin";
import { BotIcon, PlusCircleIcon } from "@/components/icons";

export default async function AdminFerramentasIaPage() {
  await exigirAdmin();

  const ferramentas = await prisma.ferramentaIa.findMany({
    orderBy: { idFerramenta: "asc" },
  });

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-4 sm:px-6 py-10">
      <div className="flex items-center gap-3 border-b border-slate-200/80 pb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
          <BotIcon className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Catálogo de Ferramentas de IA</h1>
          <p className="text-xs text-slate-500">Cadastre e gerencie as ferramentas de inteligência artificial disponíveis para seleção</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
            Ferramentas Cadastradas ({ferramentas.length})
          </h2>

          <div className="space-y-3">
            {ferramentas.map((f) => {
              const isAtiva = f.ativa;
              return (
                <div
                  key={f.idFerramenta}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs hover:border-slate-300 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${isAtiva ? "bg-indigo-50 text-indigo-600" : "bg-slate-100 text-slate-400"}`}>
                      <BotIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">{f.nome}</p>
                      <p className="text-xs text-slate-500">{f.fornecedor || "Fornecedor não informado"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        isAtiva
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                          : "bg-slate-100 text-slate-500 border border-slate-200"
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${isAtiva ? "bg-emerald-500" : "bg-slate-400"}`} />
                      {isAtiva ? "Ativa" : "Desativada"}
                    </span>

                    <form action={alternarStatusFerramenta}>
                      <input type="hidden" name="idFerramenta" value={f.idFerramenta} />
                      <input type="hidden" name="ativa" value={String(f.ativa)} />
                      <button
                        type="submit"
                        className={`rounded-lg px-3 py-1 text-xs font-semibold transition-all cursor-pointer ${
                          isAtiva
                            ? "bg-red-50 text-red-700 border border-red-200 hover:bg-red-100"
                            : "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                        }`}
                      >
                        {isAtiva ? "Desativar" : "Reativar"}
                      </button>
                    </form>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <section className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <PlusCircleIcon className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">Nova Ferramenta</h2>
          </div>

          <form action={criarFerramenta} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Nome da Ferramenta *
              </label>
              <input
                type="text"
                name="nome"
                placeholder="Ex.: Cursor, Claude Code"
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm text-slate-900 placeholder-slate-400 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Fornecedor (opcional)
              </label>
              <input
                type="text"
                name="fornecedor"
                placeholder="Ex.: Anthropic, Anysphere"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-sm text-slate-900 placeholder-slate-400 focus:bg-white"
              />
            </div>

            <button
              type="submit"
              className="mt-1 w-full rounded-xl bg-indigo-600 py-2.5 px-4 text-sm font-semibold text-white shadow-sm shadow-indigo-600/25 hover:bg-indigo-700 active:scale-[0.99] transition-all cursor-pointer"
            >
              Adicionar Ferramenta
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
