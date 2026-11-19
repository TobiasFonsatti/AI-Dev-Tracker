import Link from "next/link";
import { cadastrar } from "@/lib/actions/auth";
import { SparklesIcon, AlertTriangleIcon } from "@/components/icons";

export default async function CadastroPage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  const { erro } = await searchParams;

  return (
    <main className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-lg shadow-indigo-500/30 mb-4">
            <SparklesIcon className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Criar Nova Conta
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Junte-se à plataforma de monitoramento de produtividade com IA
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-7 shadow-xl shadow-slate-200/50">
          {erro && (
            <div className="mb-5 flex items-center gap-2 rounded-xl bg-red-50 border border-red-200/80 px-4 py-3 text-sm text-red-800">
              <AlertTriangleIcon className="w-4 h-4 text-red-600 shrink-0" />
              <span>{erro}</span>
            </div>
          )}

          <form action={cadastrar} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Nome completo
              </label>
              <input
                type="text"
                name="nome"
                placeholder="Ex.: Artur Silva"
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:bg-white"
              />
            </div>

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
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Senha (mín. 6 caracteres)
              </label>
              <input
                type="password"
                name="senha"
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:bg-white"
              />
            </div>

            <div className="rounded-xl border border-slate-200/60 bg-slate-50/60 p-3">
              <label className="flex items-start gap-2.5 text-xs text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  name="aceitePrivacidade"
                  required
                  className="mt-0.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span>
                  Li e estou de acordo com o{" "}
                  <Link href="/privacidade" target="_blank" className="font-semibold text-indigo-600 hover:underline">
                    aviso de privacidade e termos da LGPD
                  </Link>
                  .
                </span>
              </label>
            </div>

            <button
              type="submit"
              className="mt-2 w-full rounded-xl bg-indigo-600 py-2.5 px-4 text-sm font-semibold text-white shadow-sm shadow-indigo-600/30 hover:bg-indigo-700 active:scale-[0.99] transition-all cursor-pointer"
            >
              Concluir cadastro
            </button>
          </form>

          <div className="mt-6 border-t border-slate-100 pt-5 text-center text-sm text-slate-500">
            Já possui uma conta?{" "}
            <Link href="/login" className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline">
              Fazer login
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
