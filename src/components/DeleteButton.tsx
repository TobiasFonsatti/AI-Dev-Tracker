"use client";

import { useTransition } from "react";
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

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const ok = window.confirm(
      "Tem certeza que deseja excluir este registro? Esta ação não pode ser desfeita.",
    );
    if (!ok) return;
    const form = e.currentTarget;
    startTransition(async () => {
      const data = new FormData(form);
      await excluirItem(data);
    });
  }

  // Suprime aviso de prop não usada — criadorId é passado pelo pai para fins futuros
  void criadorId;

  return (
    <form onSubmit={handleSubmit} className="inline">
      <input type="hidden" name="modelo" value={modelo} />
      <input type="hidden" name="id" value={String(id)} />
      <button
        type="submit"
        disabled={isPending}
        className="rounded bg-red-100 text-red-800 px-2 py-1 text-xs hover:bg-red-200 disabled:opacity-50 cursor-pointer"
      >
        {isPending ? "Excluindo…" : "Excluir"}
      </button>
    </form>
  );
}
