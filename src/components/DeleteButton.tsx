"use client";

import { useTransition } from "react";

/**
 * Generic delete button for any Prisma model that has an `id` primary key and a `criadorId` field.
 * It renders a submit button that calls the `excluirItem` server action.
 * The button is only shown to the creator of the record or to an ADMINISTRADOR.
 */
export default function DeleteButton({
  modelo,
  id,
  criadorId,
}: {
  modelo: string; // e.g. "projeto", "usuario"
  id: number;
  criadorId: number;
}) {
  const [isPending, startTransition] = useTransition();

  // client‑side check – hide the button if the user cannot delete
  const current = useCurrentUser?.(); // optional hook; if missing we simply show the button and let the server enforce it
  const canDelete =
    current?.perfil?.nome === "ADMINISTRADOR" || current?.idUsuario === criadorId;
  if (!canDelete) return null;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const ok = window.confirm(
      "Tem certeza que deseja excluir este registro? Esta ação não pode ser desfeita.",
    );
    if (!ok) return;
    startTransition(() => {
      // The form submission will happen automatically when the button is clicked
      // because we use a regular <form> element below.
    });
  };

  return (
    <form action={excluirItem} onSubmit={handleClick} className="inline">
      <input type="hidden" name="modelo" value={modelo} />
      <input type="hidden" name="id" value={String(id)} />
      <button
        type="submit"
        disabled={isPending}
        className="rounded bg-red-100 text-red-800 px-2 py-1 text-xs hover:bg-red-200"
      >
        {isPending ? "Excluindo…" : "Excluir"}
      </button>
    </form>
  );
}

// Placeholder for a hook that returns the current logged‑in user.
// If your codebase already provides such a hook, replace this stub with the real import.
function useCurrentUser() {
  // This stub always returns undefined – the server will still enforce permissions.
  return undefined;
}

// The server action lives in src/lib/actions/admin.ts – we import it dynamically to avoid SSR issues.
import { excluirItem } from "@/lib/actions/admin";

