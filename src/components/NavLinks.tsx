"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FolderIcon,
  PlusCircleIcon,
  HistoryIcon,
  LayoutDashboardIcon,
  UsersIcon,
  ShieldCheckIcon,
  BotIcon,
} from "@/components/icons";

export default function NavLinks({ perfilNome }: { perfilNome: string }) {
  const pathname = usePathname();

  const isProjetosActive = pathname === "/projetos" || pathname.startsWith("/projetos/");
  const isNovaSessaoActive = pathname === "/sessoes/nova";
  const isHistoricoActive = pathname === "/historico" || pathname === "/sessoes";
  const isDashboardActive = pathname === "/dashboard";
  const isUsuariosActive = pathname === "/admin/usuarios";
  const isPermissoesActive = pathname === "/admin/permissoes";
  const isFerramentasActive = pathname === "/admin/ferramentas-ia";

  const getLinkClasses = (active: boolean) =>
    active
      ? "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-indigo-700 bg-indigo-50/90 dark:bg-indigo-950/70 dark:text-indigo-300 font-semibold shadow-2xs transition-all"
      : "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 font-medium transition-colors";

  const getIconClasses = (active: boolean) =>
    active
      ? "w-4 h-4 text-indigo-600 dark:text-indigo-400"
      : "w-4 h-4 text-slate-400 dark:text-slate-500";

  const getAdminLinkClasses = (active: boolean) =>
    active
      ? "flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold text-indigo-700 bg-indigo-50/90 dark:bg-indigo-950/70 dark:text-indigo-300 transition-all"
      : "flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors";

  const getAdminIconClasses = (active: boolean) =>
    active
      ? "w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400"
      : "w-3.5 h-3.5 text-slate-400 dark:text-slate-500";

  return (
    <nav className="flex items-center gap-1 sm:gap-2 text-sm">
      <Link href="/projetos" className={getLinkClasses(isProjetosActive)}>
        <FolderIcon className={getIconClasses(isProjetosActive)} />
        <span className="hidden sm:inline">Projetos</span>
      </Link>

      <Link href="/sessoes/nova" className={getLinkClasses(isNovaSessaoActive)}>
        <PlusCircleIcon className={getIconClasses(isNovaSessaoActive)} />
        <span>Nova Sessão</span>
      </Link>

      <Link href="/historico" className={getLinkClasses(isHistoricoActive)}>
        <HistoryIcon className={getIconClasses(isHistoricoActive)} />
        <span className="hidden md:inline">Histórico</span>
      </Link>

      {(perfilNome === "GESTOR" || perfilNome === "ADMINISTRADOR") && (
        <Link href="/dashboard" className={getLinkClasses(isDashboardActive)}>
          <LayoutDashboardIcon className={getIconClasses(isDashboardActive)} />
          <span>Dashboard</span>
        </Link>
      )}

      {perfilNome === "ADMINISTRADOR" && (
        <div className="flex items-center gap-1 pl-2 border-l border-slate-200 dark:border-slate-800">
          <Link
            href="/admin/usuarios"
            className={getAdminLinkClasses(isUsuariosActive)}
            title="Gestão de Usuários"
          >
            <UsersIcon className={getAdminIconClasses(isUsuariosActive)} />
            <span className="hidden xl:inline">Usuários</span>
          </Link>
          <Link
            href="/admin/permissoes"
            className={getAdminLinkClasses(isPermissoesActive)}
            title="Controle de Permissões"
          >
            <ShieldCheckIcon className={getAdminIconClasses(isPermissoesActive)} />
            <span className="hidden xl:inline">Permissões</span>
          </Link>
          <Link
            href="/admin/ferramentas-ia"
            className={getAdminLinkClasses(isFerramentasActive)}
            title="Catálogo de Ferramentas de IA"
          >
            <BotIcon className={getAdminIconClasses(isFerramentasActive)} />
            <span className="hidden xl:inline">Ferramentas</span>
          </Link>
        </div>
      )}
    </nav>
  );
}

