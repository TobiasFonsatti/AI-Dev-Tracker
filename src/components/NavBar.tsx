import Link from "next/link";
import { getUsuarioAtual } from "@/lib/usuario-atual";
import { sair } from "@/lib/actions/auth";

export default async function NavBar() {
  const usuario = await getUsuarioAtual();

  return (
    <header className="flex items-center justify-between border-b px-4 py-3 bg-white">
      <nav className="flex items-center gap-4 text-sm">
        <Link href="/" className="font-bold text-gray-900 tracking-tight">
          AI Dev Tracker
        </Link>
        {usuario && (
          <>
            <Link href="/projetos" className="text-gray-700 hover:text-black hover:underline">
              Projetos
            </Link>
            <Link href="/sessoes" className="text-gray-700 hover:text-black hover:underline">
              Sessões
            </Link>
            <Link href="/dashboard" className="text-gray-700 hover:text-black hover:underline">
              Dashboard
            </Link>
            {usuario.perfil.nome === "ADMINISTRADOR" && (
              <>
                <span className="text-gray-300">|</span>
                <Link href="/admin/usuarios" className="text-gray-700 hover:text-black hover:underline">
                  Usuários
                </Link>
                <Link href="/admin/permissoes" className="text-gray-700 hover:text-black hover:underline">
                  Permissões
                </Link>
                <Link href="/admin/ferramentas-ia" className="text-gray-700 hover:text-black hover:underline">
                  Ferramentas IA
                </Link>
              </>
            )}
          </>
        )}
      </nav>
      <div className="flex items-center gap-3 text-sm">
        {usuario ? (
          <>
            <span className="text-gray-600 hidden sm:inline">
              {usuario.nome} · <strong className="text-gray-900">{usuario.perfil.nome}</strong>
            </span>
            <form action={sair}>
              <button
                type="submit"
                className="rounded border border-gray-300 px-2.5 py-1 text-xs text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                Sair
              </button>
            </form>
          </>
        ) : (
          <Link
            href="/login"
            className="rounded bg-black px-3 py-1.5 text-xs text-white hover:bg-gray-800"
          >
            Entrar
          </Link>
        )}
      </div>
    </header>
  );
}
