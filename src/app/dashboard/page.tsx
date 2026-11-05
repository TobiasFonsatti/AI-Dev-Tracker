import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getUsuarioAtual } from "@/lib/usuario-atual";
<<<<<<< HEAD
import { marcarSituacaoAcompanhada } from "@/lib/actions/sessoes";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{
    idProjeto?: string;
    idUsuario?: string;
    dataInicio?: string;
    dataFim?: string;
    erro?: string;
  }>;
}) {
  const usuario = await getUsuarioAtual();
  if (!usuario) redirect("/login");

  const params = await searchParams;
  const idProjetoFiltro = params.idProjeto ? Number(params.idProjeto) : undefined;
  const idUsuarioFiltro = params.idUsuario ? Number(params.idUsuario) : undefined;
  const dataInicioFiltro = params.dataInicio ? new Date(params.dataInicio) : undefined;
  const dataFimFiltro = params.dataFim ? new Date(params.dataFim) : undefined;

  // Carregar listas para os filtros (#13)
  const projetos = await prisma.projeto.findMany({
    select: { idProjeto: true, nome: true },
    orderBy: { nome: "asc" },
  });

  const desenvolvedores = await prisma.usuario.findMany({
    select: { idUsuario: true, nome: true },
    orderBy: { nome: "asc" },
  });

  // Condição de busca de sessões
  const whereClause: {
    idProjeto?: number;
    idUsuario?: number;
    dataSessao?: { gte?: Date; lte?: Date };
  } = {};

  if (idProjetoFiltro) whereClause.idProjeto = idProjetoFiltro;
  if (idUsuarioFiltro) whereClause.idUsuario = idUsuarioFiltro;
  if (dataInicioFiltro || dataFimFiltro) {
    whereClause.dataSessao = {};
    if (dataInicioFiltro) whereClause.dataSessao.gte = dataInicioFiltro;
    if (dataFimFiltro) whereClause.dataSessao.lte = dataFimFiltro;
  }

  // Buscar todas as sessões que batem com os filtros
  const sessoes = await prisma.sessaoDesenvolvimento.findMany({
    where: whereClause,
    orderBy: { dataSessao: "desc" },
    include: {
      usuario: true,
      projeto: true,
      sessaoFerramentas: { include: { ferramenta: true } },
      avaliacao: true,
    },
  });

  // Métricas agregadas (#12)
  const totalSessoes = sessoes.length;
  const totalMinutos = sessoes.reduce((acc, s) => acc + s.duracaoMinutos, 0);
  const totalHoras = (totalMinutos / 60).toFixed(1);
  const sessoesComIa = sessoes.filter((s) => s.usouIa).length;
  const percentualIa = totalSessoes > 0 ? Math.round((sessoesComIa / totalSessoes) * 100) : 0;

  const sessoesComAvaliacao = sessoes.filter((s) => s.avaliacao);
  const totalAv = sessoesComAvaliacao.length;

  const mediaProdutividade =
    totalAv > 0
      ? (sessoesComAvaliacao.reduce((a, s) => a + s.avaliacao!.produtividade, 0) / totalAv).toFixed(1)
      : "-";

  const mediaDificuldade =
    totalAv > 0
      ? (sessoesComAvaliacao.reduce((a, s) => a + s.avaliacao!.dificuldade, 0) / totalAv).toFixed(1)
      : "-";

  const mediaConfianca =
    totalAv > 0
      ? (sessoesComAvaliacao.reduce((a, s) => a + s.avaliacao!.confianca, 0) / totalAv).toFixed(1)
      : "-";

  const sessoesIaComAvaliacao = sessoes.filter((s) => s.usouIa && s.avaliacao);
  const mediaQualidadeFeedback =
    sessoesIaComAvaliacao.length > 0
      ? (
          sessoesIaComAvaliacao.reduce((a, s) => a + s.avaliacao!.qualidadeFeedback, 0) /
          sessoesIaComAvaliacao.length
        ).toFixed(1)
      : "-";

  // Ferramentas mais usadas (#12)
  const contagemFerramentas: Record<string, number> = {};
  sessoes.forEach((s) => {
    s.sessaoFerramentas.forEach((sf) => {
      const nome = sf.ferramenta.nome;
      contagemFerramentas[nome] = (contagemFerramentas[nome] || 0) + 1;
    });
  });

  const rankingFerramentas = Object.entries(contagemFerramentas)
    .sort((a, b) => b[1] - a[1]);

  // Situações de Atenção (#14)
  const situacoesAtencao = await prisma.situacaoAtencao.findMany({
    orderBy: [{ acompanhada: "asc" }, { dataIdentificacao: "desc" }],
    include: {
      usuario: true,
      sessao: { include: { projeto: true } },
    },
  });

  const situacoesPendentes = situacoesAtencao.filter((s) => !s.acompanhada);
  const situacoesAcompanhadas = situacoesAtencao.filter((s) => s.acompanhada);

  // Evolução temporal das semanas recentes (#15)
  // Agrupa sessões por semana (YYYY-WW)
  const evolucaoSemanal: Record<
    string,
    { semana: string; total: number; comIa: number; somaConfianca: number; qtdConfianca: number }
  > = {};

  sessoes.forEach((s) => {
    const data = new Date(s.dataSessao);
    // Identificador aproximado da semana
    const startOfYear = new Date(data.getFullYear(), 0, 1);
    const pastDaysOfYear = (data.getTime() - startOfYear.getTime()) / 86400000;
    const weekNum = Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
    const chave = `Semana ${weekNum}/${data.getFullYear()}`;

    if (!evolucaoSemanal[chave]) {
      evolucaoSemanal[chave] = { semana: chave, total: 0, comIa: 0, somaConfianca: 0, qtdConfianca: 0 };
    }

    evolucaoSemanal[chave].total += 1;
    if (s.usouIa) evolucaoSemanal[chave].comIa += 1;
    if (s.avaliacao) {
      evolucaoSemanal[chave].somaConfianca += s.avaliacao.confianca;
      evolucaoSemanal[chave].qtdConfianca += 1;
    }
  });

  const listaEvolucao = Object.values(evolucaoSemanal).slice(0, 8);

  const podeGerenciarSituacoes =
    usuario.perfil.nome === "GESTOR" || usuario.perfil.nome === "ADMINISTRADOR";

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-8">
      {/* Cabeçalho */}
      <div>
        <h1 className="text-2xl font-bold">Dashboard de Indicadores e Equipe</h1>
        <p className="text-sm text-gray-600">
          Histórias #12, #13, #14 e #15 — Métricas de uso de IA, percepção e acompanhamento de situações de atenção.
        </p>
      </div>

      {params.erro && (
        <div className="rounded bg-red-50 p-3 text-sm text-red-800 border border-red-200">
          {params.erro}
        </div>
      )}

      {/* Filtros Combinados (#13) */}
      <section className="rounded border bg-gray-50 p-4">
        <h2 className="text-xs uppercase font-semibold text-gray-500 mb-3">Filtros de Análise (#13)</h2>
        <form method="get" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 text-sm">
          <label className="flex flex-col gap-1">
            <span className="font-medium text-xs text-gray-600">Projeto</span>
            <select
              name="idProjeto"
              defaultValue={params.idProjeto ?? ""}
              className="rounded border bg-white px-3 py-1.5"
            >
              <option value="">Todos</option>
              {projetos.map((p) => (
                <option key={p.idProjeto} value={p.idProjeto}>
                  {p.nome}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1">
            <span className="font-medium text-xs text-gray-600">Desenvolvedor</span>
            <select
              name="idUsuario"
              defaultValue={params.idUsuario ?? ""}
              className="rounded border bg-white px-3 py-1.5"
            >
              <option value="">Todos</option>
              {desenvolvedores.map((d) => (
                <option key={d.idUsuario} value={d.idUsuario}>
                  {d.nome}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1">
            <span className="font-medium text-xs text-gray-600">A partir de</span>
            <input
              type="date"
              name="dataInicio"
              defaultValue={params.dataInicio ?? ""}
              className="rounded border bg-white px-3 py-1.5"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="font-medium text-xs text-gray-600">Até</span>
            <input
              type="date"
              name="dataFim"
              defaultValue={params.dataFim ?? ""}
              className="rounded border bg-white px-3 py-1.5"
            />
          </label>

          <div className="flex items-end gap-2">
            <button
              type="submit"
              className="flex-1 rounded bg-black py-2 text-white font-medium hover:bg-gray-800"
            >
              Aplicar
            </button>
            {(params.idProjeto || params.idUsuario || params.dataInicio || params.dataFim) && (
              <Link
                href="/dashboard"
                className="py-2 px-2 text-xs text-gray-600 underline hover:text-black self-center"
              >
                Limpar
              </Link>
            )}
          </div>
        </form>
      </section>

      {/* Indicadores Agregados (#12) */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded border bg-white p-4">
          <span className="text-xs text-gray-500 uppercase font-semibold">Total de Sessões</span>
          <p className="text-3xl font-extrabold mt-2">{totalSessoes}</p>
          <p className="text-xs text-gray-500 mt-1">{totalHoras} horas de desenvolvimento</p>
        </div>

        <div className="rounded border bg-white p-4">
          <span className="text-xs text-gray-500 uppercase font-semibold">Adoção de IA</span>
          <p className="text-3xl font-extrabold mt-2 text-blue-600">{percentualIa}%</p>
          <p className="text-xs text-gray-500 mt-1">{sessoesComIa} sessões usaram IA</p>
        </div>

        <div className="rounded border bg-white p-4">
          <span className="text-xs text-gray-500 uppercase font-semibold">Confiança Média</span>
          <p className="text-3xl font-extrabold mt-2">{mediaConfianca}<span className="text-sm font-normal text-gray-400">/5</span></p>
          <p className="text-xs text-gray-500 mt-1">Produtividade média: {mediaProdutividade}/5</p>
        </div>

        <div className="rounded border bg-white p-4">
          <span className="text-xs text-gray-500 uppercase font-semibold">Qualidade Feedback IA</span>
          <p className="text-3xl font-extrabold mt-2 text-purple-600">{mediaQualidadeFeedback}<span className="text-sm font-normal text-gray-400">/5</span></p>
          <p className="text-xs text-gray-500 mt-1">Dificuldade média: {mediaDificuldade}/5</p>
        </div>
      </section>

      {/* Grid de Ferramentas e Evolução Temporal (#12 / #15) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Ranking de Ferramentas (#12) */}
        <section className="rounded border bg-white p-5">
          <h2 className="text-base font-semibold mb-3">Ferramentas de IA Mais Utilizadas</h2>
          {rankingFerramentas.length === 0 ? (
            <p className="text-sm text-gray-500">Nenhum uso de ferramenta registrado no período.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {rankingFerramentas.map(([nome, contagem]) => {
                const perc = totalSessoes > 0 ? Math.round((contagem / sessoesComIa) * 100) : 0;
                return (
                  <div key={nome} className="flex flex-col gap-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{nome}</span>
                      <span className="text-gray-600 font-semibold">{contagem} sessões ({perc}%)</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${Math.min(100, perc)}%` }}
                      />
=======
import {
  consolidarIndicadores,
  lerIdPositivo,
  lerPeriodo,
  podeAcompanharSituacao,
} from "@/lib/indicadores";
import { marcarSituacaoAcompanhada } from "@/lib/actions/sessoes";

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
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard da Equipe</h1>
        <p className="text-sm text-gray-600">
          Visão agregada de adoção de IA, métricas de produtividade e situações de atenção.
        </p>
      </div>

      <section className="rounded-lg border border-red-200 bg-red-50 p-5">
        <h2 className="text-lg font-bold text-red-900 flex items-center justify-between">
          <span>🚨 Situações de Atenção da Equipe ({situacoes.length})</span>
          <span className="text-xs font-normal text-red-700">Ação necessária</span>
        </h2>

        {situacoes.length === 0 ? (
          <p className="text-sm text-red-700 mt-2">
            Nenhuma situação de atenção pendente de acompanhamento no momento.
          </p>
        ) : (
          <div className="mt-4 flex flex-col gap-3">
            {situacoes.map((sit) => (
              <div
                key={sit.idSituacao}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded border border-red-100 shadow-sm"
              >
                <div>
                  <p className="font-semibold text-gray-900">
                    {sit.usuario.nome} ·{" "}
                    <span className="text-xs text-gray-500 font-normal">
                      {sit.sessao.projeto.nome} (Sessão #{sit.idSessao})
                    </span>
                  </p>
                  <p className="text-sm text-red-700 mt-1">{sit.motivo}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Detectado em {new Date(sit.dataIdentificacao).toLocaleDateString("pt-BR", { timeZone: "UTC" })}
                  </p>
                </div>
                <form action={marcarSituacaoAcompanhada} className="flex items-center gap-2">
                  <input type="hidden" name="idSituacao" value={sit.idSituacao} />
                  <input
                    type="text"
                    name="observacoes"
                    placeholder="Nota de acompanhamento..."
                    className="rounded border text-xs px-2 py-1.5 w-48"
                  />
                  <button
                    type="submit"
                    className="rounded bg-black px-3 py-1.5 text-xs font-medium text-white hover:bg-gray-800"
                  >
                    Marcar Acompanhada
                  </button>
                </form>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="flex flex-wrap items-center gap-4 rounded border bg-gray-50 p-4">
        <span className="text-sm font-semibold">Filtros:</span>
        <form method="GET" action="/dashboard" className="flex flex-wrap items-center gap-3">
          <select
            name="projetoId"
            defaultValue={filtroProjetoId || ""}
            className="rounded border p-1.5 text-xs bg-white"
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
            className="rounded border p-1.5 text-xs bg-white"
          >
            <option value="">Todos os Desenvolvedores</option>
            {desenvolvedores.map((d) => (
              <option key={d.idUsuario} value={d.idUsuario}>
                {d.nome}
              </option>
            ))}
          </select>

          <label className="flex items-center gap-1 text-xs text-gray-600">
            De
            <input
              type="date"
              name="inicio"
              defaultValue={params.inicio ?? ""}
              className="rounded border p-1.5 text-xs bg-white"
            />
          </label>

          <label className="flex items-center gap-1 text-xs text-gray-600">
            Até
            <input
              type="date"
              name="fim"
              defaultValue={params.fim ?? ""}
              className="rounded border p-1.5 text-xs bg-white"
            />
          </label>

          <button
            type="submit"
            className="rounded bg-gray-900 text-white px-3 py-1.5 text-xs font-medium hover:bg-black"
          >
            Aplicar Filtros
          </button>

          {(filtroProjetoId || filtroDevId || params.inicio || params.fim) && (
            <Link href="/dashboard" className="text-xs underline text-gray-600">
              Limpar
            </Link>
          )}
        </form>
        {periodo.erro && <p className="w-full text-xs text-red-700">{periodo.erro}</p>}
      </section>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded border bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-500 uppercase">Total de Sessões</p>
          <p className="text-3xl font-bold mt-1">{indicadores.totalSessoes}</p>
        </div>
        <div className="rounded border bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-500 uppercase">Taxa de Adoção de IA</p>
          <p className="text-3xl font-bold mt-1 text-emerald-600">
            {indicadores.percentualIa}%
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {indicadores.totalComIa} de {indicadores.totalSessoes} sessões
          </p>
        </div>
        <div className="rounded border bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-500 uppercase">Produtividade Média</p>
          <p className="text-3xl font-bold mt-1">{indicadores.produtividadeMedia} / 5</p>
        </div>
        <div className="rounded border bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-500 uppercase">Confiança Média</p>
          <p className="text-3xl font-bold mt-1">{indicadores.confiancaMedia} / 5</p>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded border bg-white p-5 shadow-sm">
          <h3 className="font-semibold text-base mb-4">Ferramentas de IA mais utilizadas</h3>
          {indicadores.ferramentasMaisUsadas.length === 0 ? (
            <p className="text-sm text-gray-500">Nenhum uso de ferramenta registrado.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {indicadores.ferramentasMaisUsadas.map((f) => (
                <div key={f.nome} className="flex items-center justify-between text-sm">
                  <span className="font-medium">{f.nome}</span>
                  <span className="bg-gray-100 px-2 py-0.5 rounded text-xs font-mono font-semibold">
                    {f.quantidade} sessões
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded border bg-white p-5 shadow-sm">
          <h3 className="font-semibold text-base mb-4">Evolução de Sessões por Data</h3>
          {serieTemporal.length === 0 ? (
            <p className="text-sm text-gray-500">Sem histórico temporal para exibição.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {serieTemporal.slice(-7).map(([data, contagem]) => {
                const perc = Math.round((contagem.comIa / contagem.total) * 100);
                return (
                  <div key={data} className="flex items-center justify-between text-xs">
                    <span className="font-mono text-gray-600">{data}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 h-2.5 rounded-full overflow-hidden">
                        <div
                          className="bg-emerald-500 h-full rounded-full"
                          style={{ width: `${perc}%` }}
                        />
                      </div>
                      <span className="font-mono font-medium">
                        {contagem.comIa}/{contagem.total} ({perc}%)
                      </span>
>>>>>>> 32aa3998cf216287cd92033ae9e4a91c0e83323c
                    </div>
                  </div>
                );
              })}
            </div>
          )}
<<<<<<< HEAD
        </section>

        {/* Evolução Temporal (#15) */}
        <section className="rounded border bg-white p-5">
          <h2 className="text-base font-semibold mb-3">Evolução Temporal (#15)</h2>
          {listaEvolucao.length === 0 ? (
            <p className="text-sm text-gray-500">Sem dados históricos suficientes para exibir evolução.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b text-gray-500 uppercase">
                    <th className="py-2">Período</th>
                    <th className="py-2">Sessões</th>
                    <th className="py-2">% IA</th>
                    <th className="py-2">Confiança Média</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {listaEvolucao.map((ev) => {
                    const percIa = ev.total > 0 ? Math.round((ev.comIa / ev.total) * 100) : 0;
                    const mediaConf = ev.qtdConfianca > 0 ? (ev.somaConfianca / ev.qtdConfianca).toFixed(1) : "-";
                    return (
                      <tr key={ev.semana}>
                        <td className="py-2 font-medium">{ev.semana}</td>
                        <td className="py-2">{ev.total}</td>
                        <td className="py-2 font-semibold text-blue-600">{percIa}%</td>
                        <td className="py-2">{mediaConf}/5</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      {/* Situações de Atenção (#14) */}
      <section className="rounded border bg-white p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-semibold flex items-center gap-2">
              <span>Situações de Atenção (#14)</span>
              {situacoesPendentes.length > 0 && (
                <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-bold text-red-800">
                  {situacoesPendentes.length} pendente(s)
                </span>
              )}
            </h2>
            <p className="text-xs text-gray-500">
              Disparadas automaticamente quando confiança média &lt; 2,5 ou dificuldade &gt; 3,5 nas últimas 5 sessões.
            </p>
          </div>
        </div>

        {situacoesAtencao.length === 0 ? (
          <p className="text-sm text-gray-500">Nenhuma situação de atenção registrada no sistema.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b text-gray-500 uppercase">
                  <th className="py-2">Data</th>
                  <th className="py-2">Desenvolvedor</th>
                  <th className="py-2">Projeto</th>
                  <th className="py-2">Motivo</th>
                  <th className="py-2">Status</th>
                  {podeGerenciarSituacoes && <th className="py-2 text-right">Ação</th>}
                </tr>
              </thead>
              <tbody className="divide-y">
                {situacoesAtencao.map((sit) => (
                  <tr key={sit.idSituacao} className={sit.acompanhada ? "bg-gray-50/50" : "bg-red-50/30"}>
                    <td className="py-2 font-medium">
                      {new Date(sit.dataIdentificacao).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="py-2">{sit.usuario.nome}</td>
                    <td className="py-2">{sit.sessao.projeto.nome}</td>
                    <td className="py-2 text-gray-800">{sit.motivo}</td>
                    <td className="py-2">
                      {sit.acompanhada ? (
                        <span className="rounded bg-green-100 px-2 py-0.5 text-xs text-green-800 font-medium">
                          Acompanhada
                        </span>
                      ) : (
                        <span className="rounded bg-amber-100 px-2 py-0.5 text-xs text-amber-800 font-bold">
                          Requer Atenção
                        </span>
                      )}
                    </td>
                    {podeGerenciarSituacoes && (
                      <td className="py-2 text-right">
                        {!sit.acompanhada && (
                          <form action={marcarSituacaoAcompanhada} className="inline">
                            <input type="hidden" name="idSituacao" value={sit.idSituacao} />
                            <button
                              type="submit"
                              className="rounded border border-gray-300 bg-white px-2 py-1 text-[11px] font-medium hover:bg-gray-100"
                            >
                              Marcar como acompanhada
                            </button>
                          </form>
                        )}
                        {sit.acompanhada && sit.observacoes && (
                          <span className="text-[11px] text-gray-500 italic">
                            {sit.observacoes}
                          </span>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
=======
        </div>
>>>>>>> 32aa3998cf216287cd92033ae9e4a91c0e83323c
      </section>
    </main>
  );
}
<<<<<<< HEAD

=======
>>>>>>> 32aa3998cf216287cd92033ae9e4a91c0e83323c
