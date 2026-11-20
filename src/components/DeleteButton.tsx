"use client";

import { useState, useTransition } from "react";
import { excluirItem } from "@/lib/actions/admin";

/**
 * Botão de exclusão genérico para qualquer modelo.
 * A verificação de permissão real é feita no servidor (excluirItem).
 * No cliente apenas mostramos o botão — o servidor rejeita se não autorizado.
 */
export default function DeleteButton({
  modelo,
  id,
  criadorId,
}: {
  modelo: string;
  id: number;
  criadorId: number;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const ok = window.confirm(
      "Tem certeza que deseja excluir este registro? Esta ação não pode ser desfeita.",
    );
    if (!ok) return;
    const form = e.currentTarget;
    setError(null);
    startTransition(async () => {
      const data = new FormData(form);
      try {
        const result = await excluirItem(data);
        if (!result.success) setError(result.message);
      } catch {
        setError("Não foi possível excluir o registro. Verifique se ele ainda possui dados relacionados.");
      }
    });
  }

  // Suprime aviso de prop não usada — criadorId é passado pelo pai para fins futuros
  void criadorId;

  return (
    <form onSubmit={handleSubmit} className="inline-flex flex-col items-end gap-1">
      <input type="hidden" name="modelo" value={modelo} />
      <input type="hidden" name="id" value={String(id)} />
      <button
        type="submit"
        disabled={isPending}
        className="rounded bg-red-100 text-red-800 px-2 py-1 text-xs hover:bg-red-200 disabled:opacity-50 cursor-pointer"
      >
        {isPending ? "Excluindo…" : "Excluir"}
      </button>
      {error && <span className="max-w-56 text-right text-[11px] text-red-600 dark:text-red-400">{error}</span>}
    </form>
  );
}
