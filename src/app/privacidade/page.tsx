import Link from "next/link";
import { ShieldCheckIcon, ArrowRightIcon } from "@/components/icons";

export const metadata = { title: "Aviso de Privacidade — AI-Dev-Tracker" };

export default function PrivacidadePage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-4 py-12 text-sm leading-relaxed text-slate-700">
      <div className="flex items-center gap-3 border-b border-slate-200/80 pb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
          <ShieldCheckIcon className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Aviso de Privacidade</h1>
          <p className="text-xs text-slate-500">Conformidade com a Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018)</p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-6">
        <p className="text-slate-600 text-sm">
          O <strong>AI-Dev-Tracker</strong> é uma aplicação acadêmica desenvolvida no âmbito do Laboratório de Engenharia de Software (ADS, Fatec Ribeirão Preto). Este documento estabelece como os dados dos desenvolvedores e gestores são coletados, tratados e protegidos.
        </p>

        <section className="space-y-2">
          <h2 className="text-base font-semibold text-slate-900">1. Dados coletados</h2>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
            <li>
              <strong>Identificação e Acesso:</strong> Nome completo, endereço de e-mail corporativo/acadêmico e perfil de permissão. As senhas são criptografadas e mantidas de forma segura pelo provedor de autenticação (Supabase Auth).
            </li>
            <li>
              <strong>Atividades de Desenvolvimento:</strong> Projetos, tarefas vinculadas, data de execução, duração em minutos e ferramentas de IA selecionadas.
            </li>
            <li>
              <strong>Experiência e Percepção:</strong> Notas qualitativas (escala de 1 a 5) referentes a produtividade, dificuldade, confiança técnica, foco, fluidez e qualidade do feedback recebido de assistentes de IA.
            </li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold text-slate-900">2. Finalidade do tratamento</h2>
          <p className="text-slate-600">
            Os dados coletados destinam-se exclusivamente a gerar indicadores agregados de produtividade para as equipes, permitir o acompanhamento histórico do próprio desenvolvedor e subsidiar gestores/professores no suporte preventivo via detecção de situações de atenção. Nenhum dado é comercializado ou compartilhado com terceiros para fins publicitários.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold text-slate-900">3. Acesso e visibilidade</h2>
          <p className="text-slate-600">
            Cada desenvolvedor possui acesso irrestrito ao seu próprio histórico pessoal. Gestores e Administradores visualizam métricas consolidadas e alertas de suporte acadêmico/profissional, preservando a finalidade estritamente formativa da ferramenta.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold text-slate-900">4. Direitos do titular</h2>
          <p className="text-slate-600">
            Em consonância com a LGPD, o titular dos dados pode solicitar a qualquer momento a visualização, correção cadastral ou exclusão definitiva de seus registros através da administração da plataforma.
          </p>
        </section>
      </div>

      <div>
        <Link
          href="/cadastro"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          <ArrowRightIcon className="w-3.5 h-3.5 rotate-180" />
          <span>Voltar para tela de cadastro</span>
        </Link>
      </div>
    </main>
  );
}
