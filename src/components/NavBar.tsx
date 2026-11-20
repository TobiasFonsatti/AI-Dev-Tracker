import Link from "next/link";
import { getUsuarioAtual } from "@/lib/usuario-atual";
import { sair } from "@/lib/actions/auth";
import ThemeToggle from "@/components/ThemeToggle";
import NavLinks from "@/components/NavLinks";
import { SparklesIcon, LogOutIcon } from "@/components/icons";

export default async function NavBar() {
  const usuario = await getUsuarioAtual();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-md transition-all dark:border-slate-800 dark:bg-slate-900/90">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-3">
        <div className="flex items-center gap-6 sm:gap-8">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 text-white shadow-sm shadow-indigo-500/25 transition-transform group-hover:scale-105">
              <SparklesIcon className="h-5 w-5" />
            </div>
            <div>
              <span className="font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                AI Dev Tracker
              </span>
              <span className="hidden lg:block text-[10px] uppercase font-semibold tracking-wider text-slate-400 dark:text-slate-500 -mt-0.5">
                Lab. Eng. Software
              </span>
            </div>
          </Link>

          {usuario && <NavLinks perfilNome={usuario.perfil.nome} />}
        </div>

        <div className="flex items-center gap-3 text-sm">
          <ThemeToggle />

          {usuario ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col items-end text-xs">
                <span className="font-medium text-slate-800 dark:text-slate-200">{usuario.nome}</span>
                <span
                  className={`inline-block px-1.5 py-0.2 rounded text-[10px] font-semibold tracking-wide ${
                    usuario.perfil.nome === "ADMINISTRADOR"
                      ? "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300"
                      : usuario.perfil.nome === "GESTOR"
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                      : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                  }`}
                >
                  {usuario.perfil.nome}
                </span>
              </div>
              <form action={sair}>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white transition-all shadow-xs cursor-pointer"
                  title="Encerrar sessão"
                >
                  <LogOutIcon className="w-3.5 h-3.5 text-slate-400" />
                  <span className="hidden sm:inline">Sair</span>
                </button>
              </form>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm shadow-indigo-600/20 hover:bg-indigo-700 transition-all"
              >
                Entrar
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
