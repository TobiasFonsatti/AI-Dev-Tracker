import { prisma } from "@/lib/prisma";
import { exigirAdmin } from "@/lib/usuario-atual";
import { associarPermissao, removerPermissao } from "@/lib/actions/admin";

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
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-10">
      <h1 className="text-2xl font-semibold">Permissões por perfil</h1>

      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b">
            <th className="py-2">Permissão</th>
            {perfis.map((p) => (
              <th key={p.idPerfil} className="py-2 text-center">
                {p.nome}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {permissoes.map((perm) => (
            <tr key={perm.idPermissao} className="border-b">
              <td className="py-2">
                {perm.codigo}
                <p className="text-xs text-gray-500">{perm.descricao}</p>
              </td>
              {perfis.map((perfil) => {
                const concedida = temPermissao(perfil.idPerfil, perm.idPermissao);
                return (
                  <td key={perfil.idPerfil} className="py-2 text-center">
                    <form action={concedida ? removerPermissao : associarPermissao}>
                      <input type="hidden" name="idPerfil" value={perfil.idPerfil} />
                      <input type="hidden" name="idPermissao" value={perm.idPermissao} />
                      <button type="submit" className="text-lg">
                        {concedida ? "✅" : "⬜"}
                      </button>
                    </form>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
