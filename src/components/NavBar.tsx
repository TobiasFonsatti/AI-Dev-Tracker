import Link from "next/link";
import { getUsuarioAtual } from "@/lib/usuario-atual";
import { sair } from "@/lib/actions/auth";
import {
  SparklesIcon,
  FolderIcon,
  PlusCircleIcon,
  HistoryIcon,
  LayoutDashboardIcon,
  UsersIcon,
  ShieldCheckIcon,
  BotIcon,
  LogOutIcon,
} from "@/components/icons";

export default async function NavBar() {
  const usuario = await getUsuarioAtual();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-md transition-all">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-3">
        <div className="flex items-center gap-6 sm:gap-8">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 text-white shadow-sm shadow-indigo-500/25 transition-transform group-hover:scale-105">
              <SparklesIcon className="h-5 w-5" />
            </div>
            <div>
              <span className="font-bold tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                AI Dev Tracker
              </span>
              <span className="hidden lg:block text-[10px] uppercase font-semibold tracking-wider text-slate-400 -mt-0.5">
                Lab. Eng. Software
              </span>
            </div>
          </Link>

          {usuario && (
            <nav className="flex items-center gap-1 sm:gap-2 text-sm font-medium">
              <Link
                href="/projetos"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              >
                <FolderIcon className="w-4 h-4 text-slate-400" />
                <span className="hidden sm:inline">Projetos</span>
              </Link>
              <Link
                href="/sessoes/nova"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              >
                <PlusCircleIcon className="w-4 h-4 text-slate-400" />
                <span>Nova Sessão</span>
              </Link>
              <Link
                href="/historico"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              >
                <HistoryIcon className="w-4 h-4 text-slate-400" />
                <span className="hidden md:inline">Histórico</span>
              </Link>

              {(usuario.perfil.nome === "GESTOR" || usuario.perfil.nome === "ADMINISTRADOR") && (
                <Link
                  href="/dashboard"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-indigo-700 bg-indigo-50/80 hover:bg-indigo-100/80 font-semibold transition-colors"
                >
                  <LayoutDashboardIcon className="w-4 h-4 text-indigo-600" />
                  <span>Dashboard</span>
                </Link>
              )}

              {usuario.perfil.nome === "ADMINISTRADOR" && (
                <div className="flex items-center gap-1 pl-2 border-l border-slate-200">
                  <Link
                    href="/admin/usuarios"
                    className="flex items-center gap-1 px-2 py-1 rounded-md text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                    title="Gestão de Usuários"
                  >
                    <UsersIcon className="w-3.5 h-3.5 text-slate-400" />
                    <span className="hidden xl:inline">Usuários</span>
                  </Link>
                  <Link
                    href="/admin/permissoes"
                    className="flex items-center gap-1 px-2 py-1 rounded-md text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                    title="Controle de Permissões"
                  >
                    <ShieldCheckIcon className="w-3.5 h-3.5 text-slate-400" />
                    <span className="hidden xl:inline">Permissões</span>
                  </Link>
                  <Link
                    href="/admin/ferramentas-ia"
                    className="flex items-center gap-1 px-2 py-1 rounded-md text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                    title="Catálogo de Ferramentas de IA"
                  >
                    <BotIcon className="w-3.5 h-3.5 text-slate-400" />
                    <span className="hidden xl:inline">Ferramentas</span>
                  </Link>
                </div>
              )}
            </nav>
          )}
        </div>

        <div className="flex items-center gap-3 text-sm">
          {usuario ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col items-end text-xs">
                <span className="font-medium text-slate-800">{usuario.nome}</span>
                <span
                  className={`inline-block px-1.5 py-0.2 rounded text-[10px] font-semibold tracking-wide ${
                    usuario.perfil.nome === "ADMINISTRADOR"
                      ? "bg-purple-100 text-purple-700"
                      : usuario.perfil.nome === "GESTOR"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-emerald-100 text-emerald-700"
                  }`}
                >
                  {usuario.perfil.nome}
                </span>
              </div>
              <form action={sair}>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 transition-all shadow-xs cursor-pointer"
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
