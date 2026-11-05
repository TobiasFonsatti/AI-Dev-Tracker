import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getUsuarioAtual } from "@/lib/usuario-atual";

export default async function SessoesPage({
  searchParams,
}: {
  searchParams: Promise<{
    sucesso?: string;
    idProjeto?: string;
    dataInicio?: string;
    dataFim?: string;
  }>;
}) {
  const usuario = await getUsuarioAtual();
  if (!usuario) redirect("/login");

  const params = await searchParams;
  const idProjetoFiltro = params.idProjeto ? Number(params.idProjeto) : undefined;
  const dataInicioFiltro = params.dataInicio ? new Date(params.dataInicio) : undefined;
  const dataFimFiltro = params.dataFim ? new Date(params.dataFim) : undefined;

  // Projetos do usuário para o filtro
  const projetos = await prisma.projeto.findMany({
    where:
      usuario.perfil.nome === "ADMINISTRADOR"
        ? {}
        : { usuarioProjetos: { some: { idUsuario: usuario.idUsuario } } },
    select: { idProjeto: true, nome: true },
    orderBy: { nome: "asc" },
  });

  // Alertas de situação de atenção ativas do usuário (#10 / #11)
  const situacoesAtencaoAtivas = await prisma.situacaoAtencao.findMany({
    where: {
      idUsuario: usuario.idUsuario,
      acompanhada: false,
    },
    orderBy: { dataIdentificacao: "desc" },
    take: 3,
  });

  // Condições de filtro para as sessões
  const whereClause: {
    idUsuario: number;
    idProjeto?: number;
    dataSessao?: { gte?: Date; lte?: Date };
  } = {
    idUsuario: usuario.idUsuario,
  };

  if (idProjetoFiltro) {
    whereClause.idProjeto = idProjetoFiltro;
  }
  if (dataInicioFiltro || dataFimFiltro) {
    whereClause.dataSessao = {};
    if (dataInicioFiltro) whereClause.dataSessao.gte = dataInicioFiltro;
    if (dataFimFiltro) whereClause.dataSessao.lte = dataFimFiltro;
  }

  // Buscar sessões do usuário
  const sessoes = await prisma.sessaoDesenvolvimento.findMany({
    where: whereClause,
    orderBy: [{ dataSessao: "desc" }, { idSessao: "desc" }],
    include: {
      projeto: true,
      tarefa: true,
      sessaoFerramentas: { include: { ferramenta: true } },
      avaliacao: true,
    },
  });

  // Métricas pessoais agregadas (#11)
  const totalSessoes = sessoes.length;
  const totalMinutos = sessoes.reduce((acc, s) => acc + s.duracaoMinutos, 0);
  const sessoesComIa = sessoes.filter((s) => s.usouIa).length;
  const percentualIa = totalSessoes > 0 ? Math.round((sessoesComIa / totalSessoes) * 100) : 0;

  const sessoesComAvaliacao = sessoes.filter((s) => s.avaliacao);
  const mediaProdutividade =
    sessoesComAvaliacao.length > 0
      ? (
          sessoesComAvaliacao.reduce((acc, s) => acc + s.avaliacao!.produtividade, 0) /
          sessoesComAvaliacao.length
        ).toFixed(1)
      : "-";

  const mediaDificuldade =
    sessoesComAvaliacao.length > 0
      ? (
          sessoesComAvaliacao.reduce((acc, s) => acc + s.avaliacao!.dificuldade, 0) /
          sessoesComAvaliacao.length
        ).toFixed(1)
      : "-";

  const mediaConfianca =
    sessoesComAvaliacao.length > 0
      ? (
          sessoesComAvaliacao.reduce((acc, s) => acc + s.avaliacao!.confianca, 0) /
          sessoesComAvaliacao.length
        ).toFixed(1)
      : "-";

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-8">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Minhas Sessões de Desenvolvimento</h1>
          <p className="text-sm text-gray-600">
            História #11 — Acompanhe seu histórico, uso de ferramentas e percepção.
          </p>
        </div>
        <Link
          href="/sessoes/nova"
          className="inline-flex items-center justify-center rounded bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition"
        >
          + Nova Sessão
        </Link>
      </div>

      {params.sucesso && (
        <div className="rounded bg-green-50 p-3 text-sm text-green-800 border border-green-200">
          Sessão e avaliação registradas com sucesso!
        </div>
      )}

      {/* Alerta de Situação de Atenção (#10 / #11) */}
      {situacoesAtencaoAtivas.length > 0 && (
        <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-amber-900">
          <div className="flex items-start gap-3">
            <span className="text-xl">⚠️</span>
            <div>
              <h2 className="font-semibold text-sm">Situação de Atenção Identificada</h2>
              <p className="text-xs mt-1">
                O sistema detectou um padrão recente que requer atenção:
              </p>
              <ul className="list-disc list-inside mt-2 text-xs space-y-1">
                {situacoesAtencaoAtivas.map((sit) => (
                  <li key={sit.idSituacao}>
                    <strong>
                      {new Date(sit.dataIdentificacao).toLocaleDateString("pt-BR")}:
                    </strong>{" "}
                    {sit.motivo}
                  </li>
                ))}
              </ul>
              <p className="text-xs text-amber-700 mt-2">
                Essa informação é visível também para os gestores do projeto para apoio.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Painel de Indicadores Pessoais (#11) */}
      <section className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="rounded border bg-white p-3">
          <span className="text-xs text-gray-500 uppercase font-medium">Sessões</span>
          <p className="text-2xl font-bold mt-1">{totalSessoes}</p>
          <span className="text-xs text-gray-400">{Math.round(totalMinutos / 60)}h {totalMinutos % 60}m</span>
        </div>

        <div className="rounded border bg-white p-3">
          <span className="text-xs text-gray-500 uppercase font-medium">Uso de IA</span>
          <p className="text-2xl font-bold mt-1 text-blue-600">{percentualIa}%</p>
          <span className="text-xs text-gray-400">{sessoesComIa} de {totalSessoes} sessões</span>
        </div>

        <div className="rounded border bg-white p-3">
          <span className="text-xs text-gray-500 uppercase font-medium">Produtividade</span>
          <p className="text-2xl font-bold mt-1">{mediaProdutividade}<span className="text-sm font-normal text-gray-400">/5</span></p>
          <span className="text-xs text-gray-400">Média geral</span>
        </div>

        <div className="rounded border bg-white p-3">
          <span className="text-xs text-gray-500 uppercase font-medium">Confiança</span>
          <p className="text-2xl font-bold mt-1">{mediaConfianca}<span className="text-sm font-normal text-gray-400">/5</span></p>
          <span className="text-xs text-gray-400">Média geral</span>
        </div>

        <div className="rounded border bg-white p-3 col-span-2 md:col-span-1">
          <span className="text-xs text-gray-500 uppercase font-medium">Dificuldade</span>
          <p className="text-2xl font-bold mt-1">{mediaDificuldade}<span className="text-sm font-normal text-gray-400">/5</span></p>
          <span className="text-xs text-gray-400">Média geral</span>
        </div>
      </section>

      {/* Filtros (#13 / #11) */}
      <section className="rounded border bg-gray-50 p-4">
        <form method="get" className="flex flex-wrap items-end gap-3 text-sm">
          <label className="flex flex-col gap-1">
            <span className="font-medium text-xs text-gray-600">Filtrar por Projeto</span>
            <select
              name="idProjeto"
              defaultValue={params.idProjeto ?? ""}
              className="rounded border bg-white px-3 py-1.5"
            >
              <option value="">Todos os projetos</option>
              {projetos.map((p) => (
                <option key={p.idProjeto} value={p.idProjeto}>
                  {p.nome}
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

          <button
            type="submit"
            className="rounded bg-gray-900 px-3 py-1.5 text-white hover:bg-black font-medium"
          >
            Filtrar
          </button>

          {(params.idProjeto || params.dataInicio || params.dataFim) && (
            <Link
              href="/sessoes"
              className="px-2 py-1.5 text-xs text-gray-600 underline hover:text-black self-center"
            >
              Limpar filtros
            </Link>
          )}
        </form>
      </section>

      {/* Lista de Sessões */}
      <section className="flex flex-col gap-3">
        {sessoes.length === 0 ? (
          <div className="rounded border border-dashed p-8 text-center text-sm text-gray-500 bg-white">
            Nenhuma sessão encontrada para os critérios selecionados.{" "}
            <Link href="/sessoes/nova" className="underline font-medium text-black">
              Registrar uma nova sessão
            </Link>
          </div>
        ) : (
          sessoes.map((s) => (
            <div
              key={s.idSessao}
              className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded border bg-white p-4 hover:shadow-xs transition"
            >
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm">{s.projeto.nome}</span>
                  {s.tarefa && (
                    <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-700">
                      Tarefa: {s.tarefa.titulo}
                    </span>
                  )}
                  {s.usouIa ? (
                    <span className="rounded bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-800">
                      IA: {s.sessaoFerramentas.map((sf) => sf.ferramenta.nome).join(", ") || "Sim"}
                    </span>
                  ) : (
                    <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                      Sem IA
                    </span>
                  )}
                </div>

                <p className="text-xs text-gray-600">
                  {s.tipoAtividade} · {s.duracaoMinutos} min ·{" "}
                  {new Date(s.dataSessao).toLocaleDateString("pt-BR")}
                </p>

                {s.observacoes && (
                  <p className="text-xs text-gray-500 italic mt-1">{s.observacoes}</p>
                )}
              </div>

              {s.avaliacao && (
                <div className="flex flex-wrap items-center gap-3 border-t md:border-t-0 md:border-l pt-2 md:pt-0 md:pl-4 text-xs text-gray-600">
                  <div className="text-center">
                    <span className="block font-bold text-gray-900">{s.avaliacao.produtividade}</span>
                    <span className="text-[10px] text-gray-500">Prod.</span>
                  </div>
                  <div className="text-center">
                    <span className="block font-bold text-gray-900">{s.avaliacao.dificuldade}</span>
                    <span className="text-[10px] text-gray-500">Dific.</span>
                  </div>
                  <div className="text-center">
                    <span className="block font-bold text-gray-900">{s.avaliacao.confianca}</span>
                    <span className="text-[10px] text-gray-500">Conf.</span>
                  </div>
                  {s.usouIa && (
                    <>
                      <div className="text-center">
                        <span className="block font-bold text-blue-700">{s.avaliacao.foco}</span>
                        <span className="text-[10px] text-blue-700">Foco</span>
                      </div>
                      <div className="text-center">
                        <span className="block font-bold text-blue-700">{s.avaliacao.fluidez}</span>
                        <span className="text-[10px] text-blue-700">Fluidez</span>
                      </div>
                      <div className="text-center">
                        <span className="block font-bold text-blue-700">{s.avaliacao.qualidadeFeedback}</span>
                        <span className="text-[10px] text-blue-700">Feedback</span>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </section>
    </main>
  );
}

