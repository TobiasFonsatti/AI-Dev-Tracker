import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getUsuarioAtual } from "@/lib/usuario-atual";
import { consolidarIndicadores } from "@/lib/indicadores";

interface Props {
  searchParams: Promise<{ projetoId?: string }>;
}

export default async function HistoricoPage({ searchParams }: Props) {
  const usuario = await getUsuarioAtual();
  if (!usuario) redirect("/login");

  const params = await searchParams;
  const filtroProjetoId = params.projetoId ? Number(params.projetoId) : undefined;

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
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Meu Histórico e Indicadores</h1>
          <p className="text-sm text-gray-600">
            Acompanhe sua evolução, métricas de produtividade e histórico de sessões.
          </p>
        </div>
        <Link
          href="/sessoes/nova"
          className="rounded bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 self-start sm:self-auto"
        >
          + Registrar Sessão
        </Link>
      </div>

      {/* Alertas de Situação de Atenção */}
      {situacoesAtivas.length > 0 && (
        <section className="rounded-lg border border-amber-300 bg-amber-50 p-4">
          <h2 className="font-semibold text-amber-900 flex items-center gap-2">
            ⚠️ Situação de Atenção Identificada
          </h2>
          <div className="mt-2 flex flex-col gap-2">
            {situacoesAtivas.map((sit) => (
              <div key={sit.idSituacao} className="text-sm text-amber-800">
                <p>• {sit.motivo}</p>
                <span className="text-xs text-amber-600">
                  Identificado em {new Date(sit.dataIdentificacao).toLocaleDateString("pt-BR")}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Painel de Indicadores Pessoais */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded border bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-500 uppercase">Total de Sessões</p>
          <p className="text-2xl font-bold mt-1">{indicadores.totalSessoes}</p>
        </div>
        <div className="rounded border bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-500 uppercase">Uso de IA</p>
          <p className="text-2xl font-bold mt-1">
            {indicadores.percentualIa}%{" "}
            <span className="text-xs font-normal text-gray-500">
              ({indicadores.totalComIa} sessões)
            </span>
          </p>
        </div>
        <div className="rounded border bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-500 uppercase">Produtividade Média</p>
          <p className="text-2xl font-bold mt-1">
            {indicadores.produtividadeMedia}{" "}
            <span className="text-xs font-normal text-gray-500">/ 5</span>
          </p>
        </div>
        <div className="rounded border bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-500 uppercase">Confiança Média</p>
          <p className="text-2xl font-bold mt-1">
            {indicadores.confiancaMedia}{" "}
            <span className="text-xs font-normal text-gray-500">/ 5</span>
          </p>
        </div>
      </section>

      {/* Filtro por Projeto */}
      <section className="flex items-center gap-3">
        <span className="text-sm font-medium">Filtrar por Projeto:</span>
        <div className="flex gap-2 flex-wrap">
          <Link
            href="/historico"
            className={`rounded px-3 py-1 text-xs font-medium border ${
              !filtroProjetoId
                ? "bg-black text-white border-black"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Todos
          </Link>
          {projetos.map((p) => (
            <Link
              key={p.idProjeto}
              href={`/historico?projetoId=${p.idProjeto}`}
              className={`rounded px-3 py-1 text-xs font-medium border ${
                filtroProjetoId === p.idProjeto
                  ? "bg-black text-white border-black"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              {p.nome}
            </Link>
          ))}
        </div>
      </section>

      {/* Tabela de Histórico */}
      <section className="rounded border bg-white overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="py-3 px-4">Data</th>
              <th className="py-3 px-4">Projeto / Tarefa</th>
              <th className="py-3 px-4">Duração</th>
              <th className="py-3 px-4">Uso de IA</th>
              <th className="py-3 px-4">Produtividade</th>
              <th className="py-3 px-4">Confiança</th>
              <th className="py-3 px-4">Dificuldade</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {sessoes.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-gray-500">
                  Nenhuma sessão de desenvolvimento registrada até o momento.
                </td>
              </tr>
            ) : (
              sessoes.map((s) => (
                <tr key={s.idSessao} className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-mono text-xs">
                    {new Date(s.dataSessao).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-medium">{s.projeto.nome}</p>
                    {s.tarefa && (
                      <p className="text-xs text-gray-500">{s.tarefa.titulo}</p>
                    )}
                  </td>
                  <td className="py-3 px-4">{s.duracaoMinutos} min</td>
                  <td className="py-3 px-4">
                    {s.usouIa ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        ✨ Sim (
                        {s.sessaoFerramentas.map((sf) => sf.ferramenta.nome).join(", ") ||
                          "IA"}
                        )
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">Não</span>
                    )}
                  </td>
                  <td className="py-3 px-4 font-semibold text-center">
                    {s.avaliacao?.produtividade ?? "-"}
                  </td>
                  <td className="py-3 px-4 font-semibold text-center">
                    {s.avaliacao?.confianca ?? "-"}
                  </td>
                  <td className="py-3 px-4 font-semibold text-center">
                    {s.avaliacao?.dificuldade ?? "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>
    </main>
  );
}
