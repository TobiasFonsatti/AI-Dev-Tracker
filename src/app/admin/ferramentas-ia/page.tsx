import { prisma } from "@/lib/prisma";
import { exigirAdmin } from "@/lib/usuario-atual";
import { criarFerramenta, alternarStatusFerramenta } from "@/lib/actions/admin";

export default async function AdminFerramentasIaPage() {
  await exigirAdmin();

  const ferramentas = await prisma.ferramentaIa.findMany({
    orderBy: { idFerramenta: "asc" },
  });

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-4 py-10">
      <h1 className="text-2xl font-semibold">Ferramentas de IA</h1>

      <ul className="flex flex-col gap-2">
        {ferramentas.map((f) => (
          <li
            key={f.idFerramenta}
            className="flex items-center justify-between rounded border px-4 py-3"
          >
            <div>
              <p className="font-medium">{f.nome}</p>
              {f.fornecedor && <p className="text-sm text-gray-600">{f.fornecedor}</p>}
            </div>
            <form action={alternarStatusFerramenta}>
              <input type="hidden" name="idFerramenta" value={f.idFerramenta} />
              <input type="hidden" name="ativa" value={String(f.ativa)} />
              <button type="submit" className="text-sm underline">
                {f.ativa ? "Desativar" : "Reativar"}
              </button>
            </form>
          </li>
        ))}
      </ul>

      <section className="rounded border p-4">
        <h2 className="mb-3 text-lg font-medium">Nova ferramenta</h2>
        <form action={criarFerramenta} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-sm">
            Nome
            <input type="text" name="nome" required className="rounded border px-3 py-2" />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Fornecedor (opcional)
            <input type="text" name="fornecedor" className="rounded border px-3 py-2" />
          </label>
          <button
            type="submit"
            className="self-start rounded bg-black px-3 py-2 text-white hover:bg-gray-800"
          >
            Adicionar
          </button>
        </form>
      </section>
    </main>
  );
}
