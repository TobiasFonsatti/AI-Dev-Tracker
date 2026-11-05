"use client";

import { useState } from "react";
import { criarSessaoComAvaliacao } from "@/lib/actions/sessoes";

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

  const tarefasFiltradas = tarefas.filter(
    (t) => t.idProjeto === Number(projetoSelecionado)
  );

  return (
    <form action={criarSessaoComAvaliacao} className="flex flex-col gap-6">
      {erro && (
        <div className="rounded bg-red-50 p-3 text-sm text-red-700 border border-red-200">
          {erro}
        </div>
      )}

      <section className="flex flex-col gap-4 rounded border p-5">
        <h2 className="text-lg font-semibold">1. Detalhes da Sessão</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex flex-col gap-1 text-sm font-medium">
            Projeto *
            <select
              name="idProjeto"
              value={projetoSelecionado}
              onChange={(e) => setProjetoSelecionado(Number(e.target.value))}
              required
              className="rounded border p-2 bg-white"
            >
              {projetos.map((p) => (
                <option key={p.idProjeto} value={p.idProjeto}>
                  {p.nome}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1 text-sm font-medium">
            Tarefa (opcional)
            <select name="idTarefa" className="rounded border p-2 bg-white">
              <option value="">Sem tarefa vinculada</option>
              {tarefasFiltradas.map((t) => (
                <option key={t.idTarefa} value={t.idTarefa}>
                  {t.titulo}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex flex-col gap-1 text-sm font-medium">
            Data da Sessão *
            <input
              type="date"
              name="dataSessao"
              defaultValue={new Date().toISOString().split("T")[0]}
              required
              className="rounded border p-2"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm font-medium">
            Duração (em minutos) *
            <input
              type="number"
              name="duracaoMinutos"
              min="1"
              defaultValue="60"
              required
              className="rounded border p-2"
            />
          </label>
        </div>

        <div className="mt-2 flex items-center gap-3">
          <input
            type="checkbox"
            id="usouIa"
            name="usouIa"
            value="true"
            checked={usouIa}
            onChange={(e) => setUsouIa(e.target.checked)}
            className="h-4 w-4"
          />
          <label htmlFor="usouIa" className="text-sm font-medium">
            Utilizou ferramentas de IA nesta sessão de desenvolvimento?
          </label>
        </div>

        {usouIa && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded border">
            <label className="flex flex-col gap-1 text-sm font-medium">
              Ferramenta de IA utilizada *
              <select name="idFerramenta" required={usouIa} className="rounded border p-2 bg-white">
                <option value="">Selecione uma ferramenta...</option>
                {ferramentas.map((f) => (
                  <option key={f.idFerramenta} value={f.idFerramenta}>
                    {f.nome}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1 text-sm font-medium">
              Tipo de Atividade com IA *
              <select name="tipoAtividade" required={usouIa} className="rounded border p-2 bg-white">
                <option value="Geração de código">Geração de código</option>
                <option value="Explicação e documentação">Explicação e documentação</option>
                <option value="Refatoração">Refatoração</option>
                <option value="Geração de testes">Geração de testes</option>
                <option value="Resolução de bugs">Resolução de bugs / Debugging</option>
              </select>
            </label>
          </div>
        )}

        <label className="flex flex-col gap-1 text-sm font-medium">
          Observações da Sessão (opcional)
          <textarea
            name="observacoesSessao"
            rows={2}
            className="rounded border p-2"
            placeholder="Resumo do que foi desenvolvido..."
          />
        </label>
      </section>

      <section className="flex flex-col gap-4 rounded border p-5">
        <h2 className="text-lg font-semibold">2. Avaliação de Experiência (1 a 5)</h2>
        <p className="text-xs text-gray-500">
          1 = Muito baixa / Muito difícil · 5 = Muito alta / Muito fácil
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <label className="flex flex-col gap-1 text-sm font-medium">
            Produtividade percebida (1-5) *
            <input
              type="number"
              name="produtividade"
              min="1"
              max="5"
              defaultValue="4"
              required
              className="rounded border p-2"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm font-medium">
            Grau de dificuldade (1-5) *
            <input
              type="number"
              name="dificuldade"
              min="1"
              max="5"
              defaultValue="2"
              required
              className="rounded border p-2"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm font-medium">
            Nível de confiança no código (1-5) *
            <input
              type="number"
              name="confianca"
              min="1"
              max="5"
              defaultValue="4"
              required
              className="rounded border p-2"
            />
          </label>
        </div>

        {usouIa && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded border">
            <label className="flex flex-col gap-1 text-sm font-medium">
              Nível de Foco (1-5)
              <input
                type="number"
                name="foco"
                min="1"
                max="5"
                defaultValue="4"
                className="rounded border p-2 bg-white"
              />
            </label>

            <label className="flex flex-col gap-1 text-sm font-medium">
              Fluidez do desenvolvimento (1-5)
              <input
                type="number"
                name="fluidez"
                min="1"
                max="5"
                defaultValue="4"
                className="rounded border p-2 bg-white"
              />
            </label>

            <label className="flex flex-col gap-1 text-sm font-medium">
              Qualidade do feedback da IA (1-5)
              <input
                type="number"
                name="qualidadeFeedback"
                min="1"
                max="5"
                defaultValue="4"
                className="rounded border p-2 bg-white"
              />
            </label>
          </div>
        )}

        <label className="flex flex-col gap-1 text-sm font-medium">
          Observações da Avaliação (opcional)
          <textarea
            name="observacoesAvaliacao"
            rows={2}
            className="rounded border p-2"
            placeholder="Comentários sobre o impacto da IA ou desafios da sessão..."
          />
        </label>
      </section>

      <button
        type="submit"
        className="rounded bg-black px-6 py-3 font-medium text-white hover:bg-gray-800 self-start"
      >
        Salvar Sessão e Avaliação
      </button>
    </form>
  );
}
