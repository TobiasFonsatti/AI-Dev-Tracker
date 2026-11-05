"use client";

import { useState } from "react";
import { criarSessao } from "@/lib/actions/sessoes";

interface ProjetoItem {
  idProjeto: number;
  nome: string;
}

interface TarefaItem {
  idTarefa: number;
  idProjeto: number;
  titulo: string;
}

interface FerramentaItem {
  idFerramenta: number;
  nome: string;
}

interface Props {
  projetos: ProjetoItem[];
  tarefas: TarefaItem[];
  ferramentas: FerramentaItem[];
}

export default function FormNovaSessao({ projetos, tarefas, ferramentas }: Props) {
  const [projetoSelecionado, setProjetoSelecionado] = useState<number>(
    projetos[0]?.idProjeto || 0
  );
  const [usouIa, setUsouIa] = useState(false);

  // Escalas
  const [produtividade, setProdutividade] = useState(3);
  const [dificuldade, setDificuldade] = useState(3);
  const [confianca, setConfianca] = useState(3);
  const [foco, setFoco] = useState(3);
  const [fluidez, setFluidez] = useState(3);
  const [qualidadeFeedback, setQualidadeFeedback] = useState(3);

  const tarefasFiltradas = tarefas.filter(
    (t) => t.idProjeto === Number(projetoSelecionado)
  );

  const hoje = new Date().toISOString().split("T")[0];

  return (
    <form action={criarSessao} className="flex flex-col gap-6">
      {/* Dados Gerais da Sessão (#7) */}
      <section className="flex flex-col gap-4 rounded border p-4 bg-white">
        <h2 className="text-base font-semibold border-b pb-2">1. Dados da Sessão</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex flex-col gap-1 text-sm font-medium">
            Projeto *
            <select
              name="idProjeto"
              value={projetoSelecionado}
              onChange={(e) => setProjetoSelecionado(Number(e.target.value))}
              required
              className="rounded border px-3 py-2 bg-white"
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
            <select
              name="idTarefa"
              className="rounded border px-3 py-2 bg-white"
            >
              <option value="">Nenhuma / Geral do projeto</option>
              {tarefasFiltradas.map((t) => (
                <option key={t.idTarefa} value={t.idTarefa}>
                  {t.titulo}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <label className="flex flex-col gap-1 text-sm font-medium">
            Data da Sessão *
            <input
              type="date"
              name="dataSessao"
              defaultValue={hoje}
              required
              className="rounded border px-3 py-2"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm font-medium">
            Duração (em minutos) *
            <input
              type="number"
              name="duracaoMinutos"
              min="1"
              max="1440"
              placeholder="Ex: 60"
              required
              className="rounded border px-3 py-2"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm font-medium">
            Tipo de Atividade *
            <select
              name="tipoAtividade"
              required
              defaultValue="Desenvolvimento de feature"
              className="rounded border px-3 py-2 bg-white"
            >
              <option value="Desenvolvimento de feature">Desenvolvimento de feature</option>
              <option value="Correção de bug">Correção de bug</option>
              <option value="Refatoração de código">Refatoração de código</option>
              <option value="Criação/Execução de testes">Criação/Execução de testes</option>
              <option value="Documentação e requisitos">Documentação e requisitos</option>
              <option value="Outro">Outro</option>
            </select>
          </label>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <input
            type="checkbox"
            id="usouIaCheckbox"
            name="usouIa"
            checked={usouIa}
            onChange={(e) => setUsouIa(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
          />
          <label htmlFor="usouIaCheckbox" className="text-sm font-medium cursor-pointer">
            Utilizou ferramentas de IA nesta sessão de desenvolvimento?
          </label>
        </div>

        {usouIa && (
          <div className="mt-2 rounded bg-blue-50 border border-blue-200 p-3">
            <label className="flex flex-col gap-1 text-sm font-medium text-blue-900">
              Ferramenta de IA utilizada *
              <select
                name="idFerramenta"
                required={usouIa}
                className="rounded border px-3 py-2 bg-white text-black"
              >
                <option value="">Selecione a ferramenta...</option>
                {ferramentas.map((f) => (
                  <option key={f.idFerramenta} value={f.idFerramenta}>
                    {f.nome}
                  </option>
                ))}
              </select>
            </label>
          </div>
        )}

        <label className="flex flex-col gap-1 text-sm font-medium">
          Observações da Sessão (opcional)
          <textarea
            name="observacoesSessao"
            rows={2}
            placeholder="Detalhes ou contexto da atividade realizada..."
            className="rounded border px-3 py-2"
          />
        </label>
      </section>

      {/* Avaliação de Percepção (#8) */}
      <section className="flex flex-col gap-4 rounded border p-4 bg-white">
        <h2 className="text-base font-semibold border-b pb-2">2. Avaliação de Percepção (Escala 1 a 5)</h2>
        <p className="text-xs text-gray-500">
          1 = Muito Baixo/Difícil · 3 = Médio · 5 = Muito Alto/Fácil/Confiante
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-sm font-medium">
              <span>Produtividade:</span>
              <span className="font-bold text-black">{produtividade}/5</span>
            </div>
            <input
              type="range"
              name="produtividade"
              min="1"
              max="5"
              value={produtividade}
              onChange={(e) => setProdutividade(Number(e.target.value))}
              className="w-full accent-black cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-sm font-medium">
              <span>Dificuldade:</span>
              <span className="font-bold text-black">{dificuldade}/5</span>
            </div>
            <input
              type="range"
              name="dificuldade"
              min="1"
              max="5"
              value={dificuldade}
              onChange={(e) => setDificuldade(Number(e.target.value))}
              className="w-full accent-black cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-sm font-medium">
              <span>Confiança no código:</span>
              <span className="font-bold text-black">{confianca}/5</span>
            </div>
            <input
              type="range"
              name="confianca"
              min="1"
              max="5"
              value={confianca}
              onChange={(e) => setConfianca(Number(e.target.value))}
              className="w-full accent-black cursor-pointer"
            />
          </div>
        </div>

        {/* Avaliação Estendida de IA (#9) */}
        {usouIa && (
          <div className="mt-4 pt-4 border-t flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-blue-900">
              Avaliação de Experiência com IA (#9)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-sm font-medium">
                  <span>Foco mental:</span>
                  <span className="font-bold text-blue-900">{foco}/5</span>
                </div>
                <input
                  type="range"
                  name="foco"
                  min="1"
                  max="5"
                  value={foco}
                  onChange={(e) => setFoco(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-sm font-medium">
                  <span>Fluidez no trabalho:</span>
                  <span className="font-bold text-blue-900">{fluidez}/5</span>
                </div>
                <input
                  type="range"
                  name="fluidez"
                  min="1"
                  max="5"
                  value={fluidez}
                  onChange={(e) => setFluidez(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-sm font-medium">
                  <span>Qualidade feedback IA:</span>
                  <span className="font-bold text-blue-900">{qualidadeFeedback}/5</span>
                </div>
                <input
                  type="range"
                  name="qualidadeFeedback"
                  min="1"
                  max="5"
                  value={qualidadeFeedback}
                  onChange={(e) => setQualidadeFeedback(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        <label className="flex flex-col gap-1 text-sm font-medium mt-2">
          Observações da Avaliação (opcional)
          <textarea
            name="observacoesAvaliacao"
            rows={2}
            placeholder="Como você se sentiu trabalhando com ou sem auxílio de IA..."
            className="rounded border px-3 py-2"
          />
        </label>
      </section>

      <button
        type="submit"
        className="rounded bg-black px-4 py-3 text-white font-medium hover:bg-gray-800 transition"
      >
        Salvar Sessão e Avaliação
      </button>
    </form>
  );
}

