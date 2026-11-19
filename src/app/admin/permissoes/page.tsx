import { prisma } from "@/lib/prisma";
import { exigirAdmin } from "@/lib/usuario-atual";
import { associarPermissao, removerPermissao } from "@/lib/actions/admin";
import { ShieldCheckIcon } from "@/components/icons";

export default async function AdminPermissoesPage() {
  await exigirAdmin();

  const [perfis, permissoes, vinculos] = await Promise.all([
    prisma.perfil.findMany({ orderBy: { idPerfil: "asc" } }),
    prisma.permissao.findMany({ orderBy: { idPermissao: "asc" } }),
    prisma.perfilPermissao.findMany(),
  ]);

  const temPermissao = (idPerfil: number, idPermissao: number) =>
    vinculos.some((v) => v.idPerfil === idPerfil && v.idPermissao === idPermissao);

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-4 sm:px-6 py-10">
      <div className="flex items-center gap-3 border-b border-slate-200/80 pb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
          <ShieldCheckIcon className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Permissões por Perfil</h1>
          <p className="text-xs text-slate-500">Matriz de controle de privilégios de acesso às telas e ações da plataforma</p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200/90 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/80 border-b border-slate-200/80 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="py-3.5 px-4 w-1/2">Permissão & Descrição</th>
                {perfis.map((p) => (
                  <th key={p.idPerfil} className="py-3.5 px-4 text-center">
                    {p.nome}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {permissoes.map((perm) => (
                <tr key={perm.idPermissao} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-slate-900 font-mono text-xs">{perm.codigo}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{perm.descricao}</p>
                  </td>
                  {perfis.map((perfil) => {
                    const concedida = temPermissao(perfil.idPerfil, perm.idPermissao);
                    return (
                      <td key={perfil.idPerfil} className="py-3.5 px-4 text-center">
                        <form action={concedida ? removerPermissao : associarPermissao}>
                          <input type="hidden" name="idPerfil" value={perfil.idPerfil} />
                          <input type="hidden" name="idPermissao" value={perm.idPermissao} />
                          <button
                            type="submit"
                            title={concedida ? "Clique para revogar" : "Clique para conceder"}
                            className={`inline-flex items-center justify-center h-8 w-8 rounded-lg transition-all cursor-pointer ${
                              concedida
                                ? "bg-emerald-50 border border-emerald-300 text-emerald-600 hover:bg-emerald-100 shadow-2xs"
                                : "bg-slate-50 border border-slate-200 text-slate-300 hover:bg-slate-100 hover:text-slate-500"
                            }`}
                          >
                            {concedida ? "✓" : "—"}
                          </button>
                        </form>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
