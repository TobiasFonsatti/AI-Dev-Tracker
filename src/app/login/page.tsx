import Link from "next/link";
import { entrar } from "@/lib/actions/auth";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string; cadastro?: string }>;
}) {
  const { erro, cadastro } = await searchParams;

  return (
    <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center gap-6 px-4 py-16">
      <h1 className="text-2xl font-semibold">Entrar</h1>

      {cadastro === "ok" && (
        <p className="rounded bg-green-50 px-3 py-2 text-sm text-green-800">
          Cadastro realizado. Faça login abaixo.
        </p>
      )}
      {erro && (
        <p className="rounded bg-red-50 px-3 py-2 text-sm text-red-800">{erro}</p>
      )}

      <form action={entrar} className="flex flex-col gap-4">
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
          Senha
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
          Entrar
        </button>
      </form>

      <p className="text-sm text-gray-600">
        Ainda não tem conta?{" "}
        <Link href="/cadastro" className="underline">
          Cadastre-se
        </Link>
      </p>
    </main>
  );
}
