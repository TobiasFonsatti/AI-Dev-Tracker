import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getUsuarioAtual } from "@/lib/usuario-atual";
import { consolidarIndicadores, lerIdPositivo, lerPeriodo } from "@/lib/indicadores";
import {
  HistoryIcon,
  PlusCircleIcon,
  SparklesIcon,
  AlertTriangleIcon,
  FilterIcon,
  ClockIcon,
} from "@/components/icons";

interface Props {
  searchParams: Promise<{ projetoId?: string; inicio?: string; fim?: string }>;
}

export default async function HistoricoPage({ searchParams }: Props) {
  const usuario = await getUsuarioAtual();
  if (!usuario) redirect("/login");

  const params = await searchParams;
  const filtroProjetoId = lerIdPositivo(params.projetoId);
  const periodo = lerPeriodo(params.inicio, params.fim);

  const linkFiltro = (projetoId?: number) => {
    const query = new URLSearchParams();
    if (projetoId) query.set("projetoId", String(projetoId));
    if (periodo.inicio) query.set("inicio", periodo.inicio);
    if (periodo.fim) query.set("fim", periodo.fim);
    const texto = query.toString();
    return texto ? `/historico?${texto}` : "/historico";
  };

  // Projetos do usuário para o filtro
  const projetos = await prisma.projeto.findMany({
    where: {
      usuarioProjetos: { some: { idUsuario: usuario.idUsuario } },
    },
    select: { idProjeto: true, nome: true },
    orderBy: { nome: "asc" },
  });

  // Alertas de situação de atenção ativos para o usuário
  const situacoesAtivas = await prisma.situacaoAtencao.findMany({
    where: {
      idUsuario: usuario.idUsuario,
      acompanhada: false,
    },
    orderBy: { dataIdentificacao: "desc" },
  });

  // Buscar sessões do usuário
  const sessoes = await prisma.sessaoDesenvolvimento.findMany({
    where: {
      idUsuario: usuario.idUsuario,
      ...(filtroProjetoId ? { idProjeto: filtroProjetoId } : {}),
      ...(periodo.where ? { dataSessao: periodo.where } : {}),
    },
    include: {
      projeto: true,
      tarefa: true,
      avaliacao: true,
      sessaoFerramentas: { include: { ferramenta: true } },
    },
    orderBy: { dataSessao: "desc" },
  });

  const indicadores = consolidarIndicadores(sessoes);

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 sm:px-6 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Meu Histórico e Indicadores</h1>
          <p className="text-sm text-slate-500 mt-1">
            Acompanhe seu registro contínuo de trabalho, adoção de IA e métricas de experiência do desenvolvedor
          </p>
        </div>
        <Link
          href="/sessoes/nova"
          className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm shadow-indigo-600/25 hover:bg-indigo-700 transition-all self-start sm:self-auto cursor-pointer"
        >
          <PlusCircleIcon className="w-4 h-4" />
          <span>Registrar Sessão</span>
        </Link>
      </div>

      {/* Alertas de Situação de Atenção */}
      {situacoesAtivas.length > 0 && (
        <section className="rounded-2xl border border-amber-200 bg-amber-50/80 p-5 shadow-xs">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
            <AlertTriangleIcon className="w-5 h-5 text-amber-600 shrink-0" />
            <span>Situação de Atenção Identificada para seu Perfil</span>
          </div>
          <div className="mt-3 flex flex-col gap-2.5 pl-7">
            {situacoesAtivas.map((sit) => (
              <div key={sit.idSituacao} className="text-xs text-amber-800 bg-white/70 rounded-xl p-3 border border-amber-200/70">
                <p className="font-semibold text-slate-900">• {sit.motivo}</p>
                <span className="text-[11px] text-amber-700 mt-0.5 block">
                  Identificado em {new Date(sit.dataIdentificacao).toLocaleDateString("pt-BR", { timeZone: "UTC" })} — Seu gestor foi notificado para apoiar suas atividades.
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Painel de Indicadores Pessoais */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total de Sessões</span>
            <ClockIcon className="w-4 h-4" />
          </div>
          <p className="text-3xl font-bold text-slate-900">{indicadores.totalSessoes}</p>
          <p className="text-xs text-slate-400 mt-1">Registradas no sistema</p>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-emerald-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Taxa de Adoção de IA</span>
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
          <p className="text-xs text-slate-400 mt-1">Autoavaliação percebida</p>
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
          <p className="text-xs text-slate-400 mt-1">Segurança no código entregue</p>
        </div>
      </section>

      {/* Filtros Combinados */}
      <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <FilterIcon className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">Filtrar por Projeto:</span>
            <div className="flex gap-1.5 flex-wrap ml-2">
              <Link
                href={linkFiltro()}
                className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                  !filtroProjetoId
                    ? "bg-indigo-600 text-white shadow-2xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Todos
              </Link>
              {projetos.map((p) => (
                <Link
                  key={p.idProjeto}
                  href={linkFiltro(p.idProjeto)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                    filtroProjetoId === p.idProjeto
                      ? "bg-indigo-600 text-white shadow-2xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {p.nome}
                </Link>
              ))}
            </div>
          </div>

          <form method="GET" action="/historico" className="flex items-center gap-2 flex-wrap">
            {filtroProjetoId && <input type="hidden" name="projetoId" value={filtroProjetoId} />}
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">Período:</span>
            <input
              type="date"
              name="inicio"
              defaultValue={params.inicio ?? ""}
              className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs text-slate-800"
            />
            <span className="text-xs text-slate-400">até</span>
            <input
              type="date"
              name="fim"
              defaultValue={params.fim ?? ""}
              className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs text-slate-800"
            />
            <button
              type="submit"
              className="rounded-lg bg-slate-900 text-white px-3 py-1 text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Aplicar
            </button>
            {(params.inicio || params.fim) && (
              <Link href={linkFiltro(filtroProjetoId)} className="text-xs text-slate-500 hover:underline">
                Limpar datas
              </Link>
            )}
          </form>
        </div>
        {periodo.erro && <p className="text-xs font-medium text-red-600">{periodo.erro}</p>}
      </section>

      {/* Tabela de Histórico */}
      <section className="rounded-2xl border border-slate-200/90 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/80 border-b border-slate-200/80 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="py-3.5 px-4">Data</th>
                <th className="py-3.5 px-4">Projeto & Tarefa</th>
                <th className="py-3.5 px-4">Duração</th>
                <th className="py-3.5 px-4">Uso de IA</th>
                <th className="py-3.5 px-4 text-center">Prod.</th>
                <th className="py-3.5 px-4 text-center">Conf.</th>
                <th className="py-3.5 px-4 text-center">Dific.</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sessoes.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 text-sm">
                    <HistoryIcon className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    Nenhuma sessão de desenvolvimento encontrada para os filtros aplicados.
                  </td>
                </tr>
              ) : (
                sessoes.map((s) => (
                  <tr key={s.idSessao} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono text-xs text-slate-500 whitespace-nowrap">
                      {new Date(s.dataSessao).toLocaleDateString("pt-BR", { timeZone: "UTC" })}
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-semibold text-slate-900 text-sm">{s.projeto.nome}</p>
                      {s.tarefa ? (
                        <p className="text-xs text-slate-500">{s.tarefa.titulo}</p>
                      ) : (
                        <p className="text-xs text-slate-400 italic">Geral / Sem tarefa</p>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono text-xs text-slate-700 whitespace-nowrap">
                      {s.duracaoMinutos} min
                    </td>
                    <td className="py-3 px-4">
                      {s.usouIa ? (
                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 border border-indigo-200/60 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                          <SparklesIcon className="w-3.5 h-3.5" />
                          <span>
                            {s.sessaoFerramentas.map((sf) => sf.ferramenta.nome).join(", ") || "IA"}
                          </span>
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400 font-medium">Sem IA</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-block rounded-md bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-800 font-mono">
                        {s.avaliacao?.produtividade ?? "-"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-block rounded-md bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-800 font-mono">
                        {s.avaliacao?.confianca ?? "-"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-block rounded-md bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-800 font-mono">
                        {s.avaliacao?.dificuldade ?? "-"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
