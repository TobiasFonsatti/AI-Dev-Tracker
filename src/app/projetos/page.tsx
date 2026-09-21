import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getUsuarioAtual } from "@/lib/usuario-atual";
import { criarProjeto } from "@/lib/actions/projetos";

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
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-4 py-10">
      <h1 className="text-2xl font-semibold">Meus projetos</h1>

      {erro && (
        <p className="rounded bg-red-50 px-3 py-2 text-sm text-red-800">{erro}</p>
      )}

      <ul className="flex flex-col gap-2">
        {projetos.length === 0 && (
          <li className="text-sm text-gray-500">Você ainda não tem projetos.</li>
        )}
        {projetos.map((p) => (
          <li key={p.idProjeto}>
            <Link
              href={`/projetos/${p.idProjeto}`}
              className="flex items-center justify-between rounded border px-4 py-3 hover:bg-gray-50"
            >
              <div>
                <p className="font-medium">{p.nome}</p>
                {p.descricao && (
                  <p className="text-sm text-gray-600">{p.descricao}</p>
                )}
              </div>
              <span className="text-sm text-gray-500">{p._count.tarefas} tarefa(s)</span>
            </Link>
          </li>
        ))}
      </ul>

      <section className="rounded border p-4">
        <h2 className="mb-3 text-lg font-medium">Novo projeto</h2>
        <form action={criarProjeto} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-sm">
            Nome
            <input type="text" name="nome" required className="rounded border px-3 py-2" />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Descrição (opcional)
            <textarea name="descricao" rows={2} className="rounded border px-3 py-2" />
          </label>
          <button
            type="submit"
            className="self-start rounded bg-black px-3 py-2 text-white hover:bg-gray-800"
          >
            Criar projeto
          </button>
        </form>
      </section>
    </main>
  );
}
