import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getUsuarioAtual } from "@/lib/usuario-atual";
import { criarTarefa } from "@/lib/actions/tarefas";
import TarefaStatusForm from "@/components/TarefaStatusForm";

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

  if (!projeto || projeto.usuarioProjetos.length === 0) notFound();

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-4 py-10">
      <div>
        <Link href="/projetos" className="text-sm text-gray-500 hover:underline">
          ← Meus projetos
        </Link>
        <h1 className="text-2xl font-semibold">{projeto.nome}</h1>
        {projeto.descricao && <p className="text-gray-600">{projeto.descricao}</p>}
      </div>

      {erro && (
        <p className="rounded bg-red-50 px-3 py-2 text-sm text-red-800">{erro}</p>
      )}

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-medium">Tarefas</h2>
        {projeto.tarefas.length === 0 && (
          <p className="text-sm text-gray-500">Nenhuma tarefa ainda.</p>
        )}
        <ul className="flex flex-col gap-2">
          {projeto.tarefas.map((t) => (
            <li
              key={t.idTarefa}
              className="flex items-center justify-between gap-4 rounded border px-4 py-3"
            >
              <div>
                <p className="font-medium">{t.titulo}</p>
                {t.descricao && <p className="text-sm text-gray-600">{t.descricao}</p>}
                <p className="text-xs text-gray-500">Prioridade: {t.prioridade}</p>
              </div>
              <TarefaStatusForm
                idTarefa={t.idTarefa}
                idProjeto={idProjeto}
                statusAtual={t.status}
              />
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded border p-4">
        <h2 className="mb-3 text-lg font-medium">Nova tarefa</h2>
        <form action={criarTarefa} className="flex flex-col gap-4">
          <input type="hidden" name="idProjeto" value={idProjeto} />
          <label className="flex flex-col gap-1 text-sm">
            Título
            <input type="text" name="titulo" required className="rounded border px-3 py-2" />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Descrição (opcional)
            <textarea name="descricao" rows={2} className="rounded border px-3 py-2" />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Prioridade
            <select name="prioridade" defaultValue="MEDIA" className="rounded border px-3 py-2">
              <option value="BAIXA">Baixa</option>
              <option value="MEDIA">Média</option>
              <option value="ALTA">Alta</option>
            </select>
          </label>
          <button
            type="submit"
            className="self-start rounded bg-black px-3 py-2 text-white hover:bg-gray-800"
          >
            Criar tarefa
          </button>
        </form>
      </section>
    </main>
  );
}
