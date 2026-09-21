import Link from "next/link";
import { getUsuarioAtual } from "@/lib/usuario-atual";
import { sair } from "@/lib/actions/auth";

export default async function NavBar() {
  const usuario = await getUsuarioAtual();

  return (
    <header className="flex items-center justify-between border-b px-4 py-3">
      <nav className="flex items-center gap-4 text-sm">
        <Link href="/" className="font-semibold">
          Rastreador de IA
        </Link>
        {usuario && (
          <>
            <Link href="/projetos" className="hover:underline">
              Projetos
            </Link>
            {usuario.perfil.nome === "ADMINISTRADOR" && (
              <>
                <Link href="/admin/usuarios" className="hover:underline">
                  Usuários
                </Link>
                <Link href="/admin/permissoes" className="hover:underline">
                  Permissões
                </Link>
                <Link href="/admin/ferramentas-ia" className="hover:underline">
                  Ferramentas de IA
                </Link>
              </>
            )}
          </>
        )}
      </nav>
      <div className="flex items-center gap-3 text-sm">
        {usuario ? (
          <>
            <span className="text-gray-600">
              {usuario.nome} · {usuario.perfil.nome}
            </span>
            <form action={sair}>
              <button type="submit" className="underline">
                Sair
              </button>
            </form>
          </>
        ) : (
          <Link href="/login" className="underline">
            Entrar
          </Link>
        )}
      </div>
    </header>
  );
}
