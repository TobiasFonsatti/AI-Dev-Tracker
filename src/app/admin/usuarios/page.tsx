import { prisma } from "@/lib/prisma";
import { exigirAdmin } from "@/lib/usuario-atual";
import { alternarStatusUsuario, alterarPerfilUsuario } from "@/lib/actions/admin";
import { UsersIcon } from "@/components/icons";

export default async function AdminUsuariosPage() {
  await exigirAdmin();

  const usuarios = await prisma.usuario.findMany({
    include: { perfil: true },
    orderBy: { idUsuario: "asc" },
  });

  const perfis = await prisma.perfil.findMany({
    orderBy: { idPerfil: "asc" },
  });

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-4 sm:px-6 py-10">
      <div className="flex items-center gap-3 border-b border-slate-200/80 pb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
          <UsersIcon className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Gestão de Usuários</h1>
          <p className="text-xs text-slate-500">Controle de contas, perfis de acesso e bloqueio de usuários</p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200/90 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/80 border-b border-slate-200/80 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="py-3.5 px-4">Nome</th>
                <th className="py-3.5 px-4">E-mail</th>
                <th className="py-3.5 px-4">Perfil</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {usuarios.map((u) => {
                const novoStatus = u.status === "ATIVO" ? "INATIVO" : "ATIVO";
                const isAtivo = u.status === "ATIVO";
                const canEditPerfil = u.perfil.nome !== "ADMINISTRADOR";
                return (
                  <tr key={u.idUsuario} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-900">{u.nome}</td>
                    <td className="py-3.5 px-4 text-slate-600 font-mono text-xs">{u.email}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                          u.perfil.nome === "ADMINISTRADOR"
                            ? "bg-purple-100 text-purple-700"
                            : u.perfil.nome === "GESTOR"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {u.perfil.nome}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          isAtivo
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                            : "bg-slate-100 text-slate-500 border border-slate-200"
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${isAtivo ? "bg-emerald-500" : "bg-slate-400"}`} />
                        {u.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex flex-col items-end space-y-1">
                        <form action={alternarStatusUsuario}>
                          <input type="hidden" name="idUsuario" value={u.idUsuario} />
                          <input type="hidden" name="novoStatus" value={novoStatus} />
                          <button
                            type="submit"
                            className={`rounded-lg px-3 py-1 text-xs font-semibold transition-all cursor-pointer ${
                              isAtivo
                                ? "bg-red-50 text-red-700 border border-red-200 hover:bg-red-100"
                                : "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                            }`}
                          >
                            {isAtivo ? "Desativar" : "Reativar"}
                          </button>
                        </form>
                        {canEditPerfil && (
                          <form action={alterarPerfilUsuario} className="mt-1">
                            <input type="hidden" name="idUsuario" value={u.idUsuario} />
                            <select
                              name="idPerfil"
                              className="rounded border px-2 py-0.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              {perfis.map((p) => (
                                <option key={p.idPerfil} value={p.idPerfil} selected={p.idPerfil === u.perfil.idPerfil}>
                                  {p.nome}
                                </option>
                              ))}
                            </select>
                            <button
                              type="submit"
                              className="ml-2 rounded bg-blue-100 text-blue-800 px-2 py-0.5 text-xs hover:bg-blue-200"
                            >
                              Alterar
                            </button>
                          </form>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
