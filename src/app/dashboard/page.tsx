import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getUsuarioAtual } from "@/lib/usuario-atual";
import {
  consolidarIndicadores,
  lerIdPositivo,
  lerPeriodo,
  podeAcompanharSituacao,
} from "@/lib/indicadores";
import { marcarSituacaoAcompanhada } from "@/lib/actions/sessoes";
import {
  LayoutDashboardIcon,
  AlertTriangleIcon,
  SparklesIcon,
  FilterIcon,
  ClockIcon,
  BotIcon,
  CheckCircleIcon,
} from "@/components/icons";

interface Props {
  searchParams: Promise<{
    projetoId?: string;
    desenvolvedorId?: string;
    inicio?: string;
    fim?: string;
  }>;
}

export default async function DashboardPage({ searchParams }: Props) {
  const usuario = await getUsuarioAtual();
  if (!usuario) redirect("/login");

  if (!podeAcompanharSituacao(usuario.perfil.nome)) redirect("/historico");

  const params = await searchParams;
  const filtroProjetoId = lerIdPositivo(params.projetoId);
  const filtroDevId = lerIdPositivo(params.desenvolvedorId);
  const periodo = lerPeriodo(params.inicio, params.fim);

  const filtroSessao = {
    ...(filtroProjetoId ? { idProjeto: filtroProjetoId } : {}),
    ...(filtroDevId ? { idUsuario: filtroDevId } : {}),
    ...(periodo.where ? { dataSessao: periodo.where } : {}),
  };

  const [projetos, desenvolvedores, situacoes] = await Promise.all([
    prisma.projeto.findMany({ select: { idProjeto: true, nome: true }, orderBy: { nome: "asc" } }),
    prisma.usuario.findMany({ select: { idUsuario: true, nome: true }, orderBy: { nome: "asc" } }),
    prisma.situacaoAtencao.findMany({
      where: { acompanhada: false, sessao: filtroSessao },
      include: { usuario: true, sessao: { include: { projeto: true } } },
      orderBy: { dataIdentificacao: "desc" },
    }),
  ]);

  const sessoes = await prisma.sessaoDesenvolvimento.findMany({
    where: filtroSessao,
    include: {
      usuario: true,
      projeto: true,
      avaliacao: true,
      sessaoFerramentas: { include: { ferramenta: true } },
    },
    orderBy: { dataSessao: "desc" },
  });

  const indicadores = consolidarIndicadores(sessoes);

  const sessoesPorData = new Map<string, { total: number; comIa: number }>();
  for (const s of sessoes) {
    const dataIso = s.dataSessao.toISOString().split("T")[0];
    const item = sessoesPorData.get(dataIso) ?? { total: 0, comIa: 0 };
    item.total += 1;
    if (s.usouIa) item.comIa += 1;
    sessoesPorData.set(dataIso, item);
  }
  const serieTemporal = Array.from(sessoesPorData.entries()).sort();

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 sm:px-6 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <LayoutDashboardIcon className="w-4 h-4" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard da Equipe</h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Métricas analíticas consolidadas, taxa de adoção de IA e monitoramento de situações de atenção
          </p>
        </div>
      </div>

      {/* Situações de Atenção */}
      <section className="rounded-2xl border border-red-200/90 bg-red-50/60 p-6 shadow-xs">
        <div className="flex items-center justify-between border-b border-red-200/60 pb-3">
          <div className="flex items-center gap-2 text-red-900 font-bold text-base">
            <AlertTriangleIcon className="w-5 h-5 text-red-600 shrink-0" />
            <span>Situações de Atenção Pendentes ({situacoes.length})</span>
          </div>
          <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-700">
            Ação preventiva
          </span>
        </div>

        {situacoes.length === 0 ? (
          <div className="flex items-center gap-2 mt-4 text-xs font-medium text-emerald-800 bg-white/80 rounded-xl p-3 border border-emerald-200/60">
            <CheckCircleIcon className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Nenhuma situação de atenção aberta no momento. A equipe está operando com bons indicadores.</span>
          </div>
        ) : (
          <div className="mt-4 flex flex-col gap-3">
            {situacoes.map((sit) => (
              <div
                key={sit.idSituacao}
                className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-xl border border-red-200/80 bg-white p-4 shadow-2xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-sm text-slate-900">{sit.usuario.nome}</p>
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600">
                      Projeto: {sit.sessao.projeto.nome}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-red-700 mt-1">{sit.motivo}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Identificado em {new Date(sit.dataIdentificacao).toLocaleDateString("pt-BR", { timeZone: "UTC" })}
                  </p>
                </div>

                <form action={marcarSituacaoAcompanhada} className="flex items-center gap-2 shrink-0">
                  <input type="hidden" name="idSituacao" value={sit.idSituacao} />
                  <input
                    type="text"
                    name="observacoes"
                    placeholder="Nota de suporte/orientação..."
                    className="rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-1.5 text-xs text-slate-900 w-56 focus:bg-white"
                  />
                  <button
                    type="submit"
                    className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-red-700 active:scale-[0.99] transition-all cursor-pointer whitespace-nowrap"
                  >
                    Marcar Acompanhada
                  </button>
                </form>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Filtros Analíticos */}
      <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
          <FilterIcon className="w-4 h-4 text-slate-400" />
          <span>Filtros do Dashboard:</span>
        </div>

        <form method="GET" action="/dashboard" className="flex flex-wrap items-center gap-3">
          <select
            name="projetoId"
            defaultValue={filtroProjetoId || ""}
            className="rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-800 font-medium cursor-pointer"
          >
            <option value="">Todos os Projetos</option>
            {projetos.map((p) => (
              <option key={p.idProjeto} value={p.idProjeto}>
                {p.nome}
              </option>
            ))}
          </select>

          <select
            name="desenvolvedorId"
            defaultValue={filtroDevId || ""}
            className="rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-800 font-medium cursor-pointer"
          >
            <option value="">Todos os Desenvolvedores</option>
            {desenvolvedores.map((d) => (
              <option key={d.idUsuario} value={d.idUsuario}>
                {d.nome}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-1.5 bg-slate-50/50 border border-slate-200 rounded-xl px-2.5 py-1">
            <span className="text-xs text-slate-500">De</span>
            <input
              type="date"
              name="inicio"
              defaultValue={params.inicio ?? ""}
              className="bg-transparent text-xs text-slate-800"
            />
            <span className="text-xs text-slate-400">até</span>
            <input
              type="date"
              name="fim"
              defaultValue={params.fim ?? ""}
              className="bg-transparent text-xs text-slate-800"
            />
          </div>

          <button
            type="submit"
            className="rounded-xl bg-indigo-600 text-white px-4 py-2 text-xs font-semibold shadow-xs hover:bg-indigo-700 transition-colors cursor-pointer"
          >
            Aplicar Filtros
          </button>

          {(filtroProjetoId || filtroDevId || params.inicio || params.fim) && (
            <Link
              href="/dashboard"
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 hover:underline ml-1"
            >
              Limpar Filtros
            </Link>
          )}
        </form>

        {periodo.erro && <p className="text-xs font-medium text-red-600">{periodo.erro}</p>}
      </section>

      {/* Grid de Métricas Principais */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Sessões Totais</span>
            <ClockIcon className="w-4 h-4" />
          </div>
          <p className="text-3xl font-bold text-slate-900">{indicadores.totalSessoes}</p>
          <p className="text-xs text-slate-400 mt-1">No escopo selecionado</p>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-emerald-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Adoção de IA</span>
            <SparklesIcon className="w-4 h-4" />
          </div>
          <p className="text-3xl font-bold text-emerald-600">{indicadores.percentualIa}%</p>
          <p className="text-xs text-slate-500 mt-1">
            {indicadores.totalComIa} de {indicadores.totalSessoes} sessões
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-indigo-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Produtividade Média</span>
            <span className="text-xs font-bold text-indigo-600 font-mono">DevEx</span>
          </div>
          <div className="flex items-baseline gap-1">
            <p className="text-3xl font-bold text-slate-900">{indicadores.produtividadeMedia}</p>
            <span className="text-xs text-slate-400 font-semibold">/ 5</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Escala padronizada</p>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-blue-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Confiança Média</span>
            <span className="text-xs font-bold text-blue-600 font-mono">Qualidade</span>
          </div>
          <div className="flex items-baseline gap-1">
            <p className="text-3xl font-bold text-slate-900">{indicadores.confiancaMedia}</p>
            <span className="text-xs text-slate-400 font-semibold">/ 5</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Segurança técnica</p>
        </div>
      </section>

      {/* Gráficos e Rankings */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
            <BotIcon className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-base text-slate-900">Ferramentas de IA mais Utilizadas</h3>
          </div>

          {indicadores.ferramentasMaisUsadas.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">Nenhum registro de uso de IA para os filtros aplicados.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {indicadores.ferramentasMaisUsadas.map((f, idx) => {
                const totalIa = indicadores.totalComIa || 1;
                const percentual = Math.round((f.quantidade / totalIa) * 100);
                return (
                  <div key={f.nome} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-700">
                          {idx + 1}
                        </span>
                        <span className="font-semibold text-slate-800">{f.nome}</span>
                      </div>
                      <span className="font-mono text-slate-600 text-[11px] font-medium">
                        {f.quantidade} {f.quantidade === 1 ? "sessão" : "sessões"} ({percentual}%)
                      </span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="bg-indigo-600 h-full rounded-full transition-all"
                        style={{ width: `${percentual}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
            <SparklesIcon className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-base text-slate-900">Evolução Temporal de Adoção de IA</h3>
          </div>

          {serieTemporal.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">Sem dados históricos para o período selecionado.</p>
          ) : (
            <div className="flex flex-col gap-2.5">
              {serieTemporal.slice(-7).map(([data, contagem]) => {
                const perc = Math.round((contagem.comIa / contagem.total) * 100);
                return (
                  <div key={data} className="flex items-center justify-between text-xs">
                    <span className="font-mono text-slate-600 w-24 shrink-0">{data}</span>
                    <div className="flex items-center gap-3 flex-1 justify-end">
                      <div className="w-36 bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-emerald-500 h-full rounded-full transition-all"
                          style={{ width: `${perc}%` }}
                        />
                      </div>
                      <span className="font-mono font-medium text-slate-700 text-[11px] w-20 text-right">
                        {contagem.comIa}/{contagem.total} ({perc}%)
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
