"use client";

import { useState } from "react";
import { criarSessaoComAvaliacao } from "@/lib/actions/sessoes";
import { SparklesIcon, BotIcon, AlertTriangleIcon } from "@/components/icons";

interface ProjetoItem {
  idProjeto: number;
  nome: string;
}

interface TarefaItem {
  idTarefa: number;
  titulo: string;
  idProjeto: number;
}

interface FerramentaItem {
  idFerramenta: number;
  nome: string;
}

function RatingInput({
  label,
  name,
  value,
  onChange,
  descriptions,
}: {
  label: string;
  name: string;
  value: number;
  onChange: (val: number) => void;
  descriptions?: Record<number, string>;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-slate-200/80 bg-slate-50/50 p-4 transition-all">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
          {label} *
        </label>
        <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
          {value} / 5
        </span>
      </div>

      <input type="hidden" name={name} value={value} />

      <div className="grid grid-cols-5 gap-1.5">
        {[1, 2, 3, 4, 5].map((n) => {
          const isSelected = value === n;
          return (
            <button
              type="button"
              key={n}
              onClick={() => onChange(n)}
              className={`rounded-lg py-2 text-xs font-bold transition-all cursor-pointer ${
                isSelected
                  ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/30 scale-[1.02]"
                  : "bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-100/70"
              }`}
            >
              {n}
            </button>
          );
        })}
      </div>

      {descriptions && descriptions[value] && (
        <p className="text-[11px] text-slate-500 italic mt-0.5">
          {descriptions[value]}
        </p>
      )}
    </div>
  );
}

export default function FormularioNovaSessao({
  projetos,
  tarefas,
  ferramentas,
  erro,
}: {
  projetos: ProjetoItem[];
  tarefas: TarefaItem[];
  ferramentas: FerramentaItem[];
  erro?: string;
}) {
  const [projetoSelecionado, setProjetoSelecionado] = useState<number>(
    projetos[0]?.idProjeto || 0
  );
  const [usouIa, setUsouIa] = useState(false);

  // Ratings
  const [produtividade, setProdutividade] = useState(4);
  const [dificuldade, setDificuldade] = useState(2);
  const [confianca, setConfianca] = useState(4);
  const [foco, setFoco] = useState(4);
  const [fluidez, setFluidez] = useState(4);
  const [qualidadeFeedback, setQualidadeFeedback] = useState(4);

  const tarefasFiltradas = tarefas.filter(
    (t) => t.idProjeto === Number(projetoSelecionado)
  );

  return (
    <form action={criarSessaoComAvaliacao} className="flex flex-col gap-6">
      {erro && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-200/80 px-4 py-3 text-sm text-red-800">
          <AlertTriangleIcon className="w-4 h-4 text-red-600 shrink-0" />
          <span>{erro}</span>
        </div>
      )}

      {/* Section 1: Contexto de Trabalho */}
      <section className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-700">
            1
          </span>
          <h2 className="text-base font-bold text-slate-900">Contexto da Sessão</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              Projeto *
            </label>
            <select
              name="idProjeto"
              value={projetoSelecionado}
              onChange={(e) => setProjetoSelecionado(Number(e.target.value))}
              required
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-900 focus:bg-white cursor-pointer"
            >
              {projetos.map((p) => (
                <option key={p.idProjeto} value={p.idProjeto}>
                  {p.nome}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              Tarefa Vinculada (opcional)
            </label>
            <select
              name="idTarefa"
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-900 focus:bg-white cursor-pointer"
            >
              <option value="">Sem tarefa específica vinculada</option>
              {tarefasFiltradas.map((t) => (
                <option key={t.idTarefa} value={t.idTarefa}>
                  {t.titulo}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              Data de Realização *
            </label>
            <input
              type="date"
              name="dataSessao"
              defaultValue={new Date().toISOString().split("T")[0]}
              required
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-900 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              Duração Estimada (minutos) *
            </label>
            <input
              type="number"
              name="duracaoMinutos"
              min="1"
              defaultValue="60"
              required
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-900 focus:bg-white font-mono"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
            Descrição / Observações da Sessão (opcional)
          </label>
          <textarea
            name="observacoesSessao"
            rows={2}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-900 focus:bg-white resize-none"
            placeholder="Ex.: Implementação de autenticação JWT e testes de integração..."
          />
        </div>
      </section>

      {/* Section 2: Uso de IA */}
      <section className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-700">
              2
            </span>
            <h2 className="text-base font-bold text-slate-900">Uso de Inteligência Artificial</h2>
          </div>
          <span className="text-xs text-slate-400">História #7</span>
        </div>

        <div className="rounded-xl border border-indigo-100 bg-gradient-to-r from-indigo-50/60 to-violet-50/60 p-4">
          <label className="flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-2xs text-indigo-600">
                <SparklesIcon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">Utilizou ferramentas de IA nesta sessão?</p>
                <p className="text-xs text-slate-500">Ex.: GitHub Copilot, ChatGPT, Claude, Cursor, v0, etc.</p>
              </div>
            </div>

            <div className="relative inline-flex items-center">
              <input
                type="checkbox"
                id="usouIa"
                name="usouIa"
                value="true"
                checked={usouIa}
                onChange={(e) => setUsouIa(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </div>
          </label>
        </div>

        {usouIa && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-xl border border-indigo-100 bg-indigo-50/30 p-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Ferramenta de IA Utilizada *
              </label>
              <select
                name="idFerramenta"
                required={usouIa}
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:bg-white cursor-pointer"
              >
                <option value="">Selecione uma ferramenta ativa...</option>
                {ferramentas.map((f) => (
                  <option key={f.idFerramenta} value={f.idFerramenta}>
                    {f.nome}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Tipo Principal de Atividade *
              </label>
              <select
                name="tipoAtividade"
                required={usouIa}
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:bg-white cursor-pointer"
              >
                <option value="Geração de código">Geração de código</option>
                <option value="Explicação e documentação">Explicação e documentação</option>
                <option value="Refatoração">Refatoração de código</option>
                <option value="Geração de testes">Geração de testes unitários</option>
                <option value="Resolução de bugs">Resolução de bugs / Debugging</option>
              </select>
            </div>
          </div>
        )}
      </section>

      {/* Section 3: Avaliação de Experiência */}
      <section className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-700">
              3
            </span>
            <h2 className="text-base font-bold text-slate-900">Avaliação da Experiência (DevEx)</h2>
          </div>
          <span className="text-xs text-slate-400">Escala de 1 a 5</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <RatingInput
            label="Produtividade"
            name="produtividade"
            value={produtividade}
            onChange={setProdutividade}
            descriptions={{
              1: "Rendimento muito baixo",
              2: "Abaixo da média",
              3: "Produtividade esperada",
              4: "Bom rendimento",
              5: "Altíssimo rendimento",
            }}
          />

          <RatingInput
            label="Dificuldade da Tarefa"
            name="dificuldade"
            value={dificuldade}
            onChange={setDificuldade}
            descriptions={{
              1: "Muito simples",
              2: "Trabalho fácil",
              3: "Dificuldade moderada",
              4: "Complexo e desafiador",
              5: "Extremamente difícil",
            }}
          />

          <RatingInput
            label="Confiança no Código"
            name="confianca"
            value={confianca}
            onChange={setConfianca}
            descriptions={{
              1: "Nenhuma confiança",
              2: "Pouca segurança",
              3: "Confiança moderada",
              4: "Boa confiança",
              5: "Plena segurança e robustez",
            }}
          />
        </div>

        {usouIa && (
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <BotIcon className="w-4 h-4 text-indigo-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-700">
                Dimensões Estendidas do Uso de IA
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <RatingInput
                label="Foco Mantido"
                name="foco"
                value={foco}
                onChange={setFoco}
                descriptions={{
                  1: "Muitas distrações / trocas",
                  3: "Foco médio",
                  5: "Foco total ininterrupto",
                }}
              />

              <RatingInput
                label="Fluidez (Flow)"
                name="fluidez"
                value={fluidez}
                onChange={setFluidez}
                descriptions={{
                  1: "Processo truncado / bloqueado",
                  3: "Fluidez padrão",
                  5: "Estado de flow contínuo",
                }}
              />

              <RatingInput
                label="Feedback da IA"
                name="qualidadeFeedback"
                value={qualidadeFeedback}
                onChange={setQualidadeFeedback}
                descriptions={{
                  1: "Respostas ruins / alucinações",
                  3: "Feedback aceitável",
                  5: "Respostas precisas e úteis",
                }}
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
            Observações da Avaliação (opcional)
          </label>
          <textarea
            name="observacoesAvaliacao"
            rows={2}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-900 focus:bg-white resize-none"
            placeholder="Comentários sobre como a IA auxiliou ou onde houve maior atrito técnico..."
          />
        </div>
      </section>

      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="submit"
          className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm shadow-indigo-600/30 hover:bg-indigo-700 active:scale-[0.99] transition-all cursor-pointer"
        >
          Salvar Sessão e Avaliação
        </button>
      </div>
    </form>
  );
}
