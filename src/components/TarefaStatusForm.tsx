"use client";

import { atualizarStatusTarefa } from "@/lib/actions/tarefas";

const STATUS = ["PENDENTE", "EM_ANDAMENTO", "CONCLUIDA", "CANCELADA"];

export default function TarefaStatusForm({
  idTarefa,
  idProjeto,
  statusAtual,
}: {
  idTarefa: number;
  idProjeto: number;
  statusAtual: string;
}) {
  return (
    <form action={atualizarStatusTarefa} className="flex items-center gap-2">
      <input type="hidden" name="idTarefa" value={idTarefa} />
      <input type="hidden" name="idProjeto" value={idProjeto} />
      <select
        name="status"
        defaultValue={statusAtual}
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
        className="rounded border px-2 py-1 text-sm"
      >
        {STATUS.map((s) => (
          <option key={s} value={s}>
            {s.replace("_", " ")}
          </option>
        ))}
      </select>
    </form>
  );
}
