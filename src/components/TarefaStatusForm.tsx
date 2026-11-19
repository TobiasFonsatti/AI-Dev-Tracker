"use client";

import { atualizarStatusTarefa } from "@/lib/actions/tarefas";

const STATUS = [
  { valor: "PENDENTE", rotulo: "Pendente", classe: "bg-amber-50 text-amber-700 border-amber-200" },
  { valor: "EM_ANDAMENTO", rotulo: "Em Andamento", classe: "bg-blue-50 text-blue-700 border-blue-200" },
  { valor: "CONCLUIDA", rotulo: "Concluída", classe: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  { valor: "CANCELADA", rotulo: "Cancelada", classe: "bg-slate-100 text-slate-600 border-slate-200" },
];

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
    <form action={atualizarStatusTarefa} className="flex items-center gap-1.5">
      <input type="hidden" name="idTarefa" value={idTarefa} />
      <input type="hidden" name="idProjeto" value={idProjeto} />
      <select
        name="status"
        defaultValue={statusAtual}
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
        className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 shadow-2xs hover:border-slate-300 focus:border-indigo-500 cursor-pointer transition-colors"
      >
        {STATUS.map((s) => (
          <option key={s.valor} value={s.valor}>
            {s.rotulo}
          </option>
        ))}
      </select>
    </form>
  );
}
