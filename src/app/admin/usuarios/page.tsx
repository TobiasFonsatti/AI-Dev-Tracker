import { prisma } from "@/lib/prisma";
import { exigirAdmin } from "@/lib/usuario-atual";
import { alternarStatusUsuario } from "@/lib/actions/admin";

export default async function AdminUsuariosPage() {
  await exigirAdmin();

  const usuarios = await prisma.usuario.findMany({
    include: { perfil: true },
    orderBy: { idUsuario: "asc" },
  });

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-10">
      <h1 className="text-2xl font-semibold">Usuários</h1>

      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b">
            <th className="py-2">Nome</th>
            <th className="py-2">E-mail</th>
            <th className="py-2">Perfil</th>
            <th className="py-2">Status</th>
            <th className="py-2" />
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u) => {
            const novoStatus = u.status === "ATIVO" ? "INATIVO" : "ATIVO";
            return (
              <tr key={u.idUsuario} className="border-b">
                <td className="py-2">{u.nome}</td>
                <td className="py-2">{u.email}</td>
                <td className="py-2">{u.perfil.nome}</td>
                <td className="py-2">{u.status}</td>
                <td className="py-2 text-right">
                  <form action={alternarStatusUsuario}>
                    <input type="hidden" name="idUsuario" value={u.idUsuario} />
                    <input type="hidden" name="novoStatus" value={novoStatus} />
                    <button type="submit" className="text-sm underline">
                      {u.status === "ATIVO" ? "Desativar" : "Reativar"}
                    </button>
                  </form>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </main>
  );
}
