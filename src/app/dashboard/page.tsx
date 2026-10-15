import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getUsuarioAtual } from "@/lib/usuario-atual";
import { consolidarIndicadores } from "@/lib/indicadores";
import { marcarSituacaoAcompanhada } from "@/lib/actions/sessoes";

interface Props {
  searchParams: Promise<{
    projetoId?: string;
    desenvolvedorId?: string;
  }>;
}

export default async function DashboardPage({ searchParams }: Props) {
  const usuario = await getUsuarioAtual();
  if (!usuario) redirect("/login");

  if (usuario.perfil.nome !== "GESTOR" && usuario.perfil.nome !== "ADMINISTRADOR") {
    redirect("/historico");
  }

  const params = await searchParams;
  const filtroProjetoId = params.projetoId ? Number(params.projetoId) : undefined;
  const filtroDevId = params.desenvolvedorId ? Number(params.desenvolvedorId) : undefined;

  const [projetos, desenvolvedores, situacoes] = await Promise.all([
    prisma.projeto.findMany({ select: { idProjeto: true, nome: true }, orderBy: { nome: "asc" } }),
    prisma.usuario.findMany({ select: { idUsuario: true, nome: true }, orderBy: { nome: "asc" } }),
    prisma.situacaoAtencao.findMany({
      where: { acompanhada: false },
      include: { usuario: true, sessao: { include: { projeto: true } } },
      orderBy: { dataIdentificacao: "desc" },
    }),
  ]);

  const sessoes = await prisma.sessaoDesenvolvimento.findMany({
    where: {
      ...(filtroProjetoId ? { idProjeto: filtroProjetoId } : {}),
      ...(filtroDevId ? { idUsuario: filtroDevId } : {}),
    },
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
                    Detectado em {new Date(sit.dataIdentificacao).toLocaleDateString("pt-BR")}
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

          <button
            type="submit"
            className="rounded bg-gray-900 text-white px-3 py-1.5 text-xs font-medium hover:bg-black"
          >
            Aplicar Filtros
          </button>

          {(filtroProjetoId || filtroDevId) && (
            <Link href="/dashboard" className="text-xs underline text-gray-600">
              Limpar
            </Link>
          )}
        </form>
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
