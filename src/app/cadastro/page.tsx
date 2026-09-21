import Link from "next/link";
import { cadastrar } from "@/lib/actions/auth";

export default async function CadastroPage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  const { erro } = await searchParams;

  return (
    <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center gap-6 px-4 py-16">
      <h1 className="text-2xl font-semibold">Criar conta</h1>

      {erro && (
        <p className="rounded bg-red-50 px-3 py-2 text-sm text-red-800">{erro}</p>
      )}

      <form action={cadastrar} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm">
          Nome completo
          <input
            type="text"
            name="nome"
            required
            className="rounded border px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          E-mail
          <input
            type="email"
            name="email"
            required
            className="rounded border px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Senha (mín. 6 caracteres)
          <input
            type="password"
            name="senha"
            required
            minLength={6}
            className="rounded border px-3 py-2"
          />
        </label>
        <button
          type="submit"
          className="rounded bg-black px-3 py-2 text-white hover:bg-gray-800"
        >
          Cadastrar
        </button>
      </form>

      <p className="text-sm text-gray-600">
        Já tem conta?{" "}
        <Link href="/login" className="underline">
          Entrar
        </Link>
      </p>
    </main>
  );
}
