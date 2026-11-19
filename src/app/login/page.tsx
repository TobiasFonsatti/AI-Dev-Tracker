import Link from "next/link";
import { entrar } from "@/lib/actions/auth";
import { SparklesIcon, AlertTriangleIcon, CheckCircleIcon } from "@/components/icons";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string; cadastro?: string }>;
}) {
  const { erro, cadastro } = await searchParams;

  return (
    <main className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-lg shadow-indigo-500/30 mb-4">
            <SparklesIcon className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Acessar Plataforma
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Rastreador de Uso de Inteligência Artificial no Desenvolvimento
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-7 shadow-xl shadow-slate-200/50">
          {cadastro === "ok" && (
            <div className="mb-5 flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200/80 px-4 py-3 text-sm text-emerald-800">
              <CheckCircleIcon className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Cadastro realizado com sucesso! Faça seu login abaixo.</span>
            </div>
          )}

          {erro && (
            <div className="mb-5 flex items-center gap-2 rounded-xl bg-red-50 border border-red-200/80 px-4 py-3 text-sm text-red-800">
              <AlertTriangleIcon className="w-4 h-4 text-red-600 shrink-0" />
              <span>{erro}</span>
            </div>
          )}

          <form action={entrar} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                E-mail
              </label>
              <input
                type="email"
                name="email"
                placeholder="seu.email@exemplo.com"
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:bg-white"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Senha
                </label>
              </div>
              <input
                type="password"
                name="senha"
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:bg-white"
              />
            </div>

            <button
              type="submit"
              className="mt-2 w-full rounded-xl bg-indigo-600 py-2.5 px-4 text-sm font-semibold text-white shadow-sm shadow-indigo-600/30 hover:bg-indigo-700 active:scale-[0.99] transition-all cursor-pointer"
            >
              Entrar na conta
            </button>
          </form>

          <div className="mt-6 border-t border-slate-100 pt-5 text-center text-sm text-slate-500">
            Ainda não tem conta?{" "}
            <Link href="/cadastro" className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline">
              Cadastre-se gratuitamente
            </Link>
          </div>
        </div>

        {/* Quick Demo Info Box for evaluators */}
        <div className="mt-6 rounded-xl border border-slate-200/70 bg-slate-100/70 p-4 text-xs text-slate-600">
          <p className="font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-indigo-500"></span>
            Contas de Demonstração (Senha padrão: <code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-slate-800">Demo@123456</code>)
          </p>
          <ul className="mt-2 space-y-1 text-slate-600">
            <li>• <strong>Admin:</strong> <code className="text-slate-800">demo.admin@aidevtracker.test</code></li>
            <li>• <strong>Gestor:</strong> <code className="text-slate-800">demo.gestor@aidevtracker.test</code></li>
            <li>• <strong>Desenvolvedora:</strong> <code className="text-slate-800">demo.ana@aidevtracker.test</code></li>
          </ul>
        </div>
      </div>
    </main>
  );
}
