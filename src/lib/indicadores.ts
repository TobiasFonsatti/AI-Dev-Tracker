export interface SessaoParaAvaliacao {
  idSessao: number;
  usouIa: boolean;
  avaliacao?: {
    confianca: number;
    dificuldade: number;
    produtividade: number;
  } | null;
}

export function validarSessao(dados: {
  duracaoMinutos: number;
  usouIa: boolean;
  idFerramenta?: number | null;
  tipoAtividade?: string | null;
}): string | null {
  if (!Number.isInteger(dados.duracaoMinutos) || dados.duracaoMinutos <= 0) {
    return "A duração deve ser um número inteiro positivo de minutos.";
  }
  if (dados.tipoAtividade && dados.tipoAtividade.length > 60) {
    return "O tipo de atividade deve ter no máximo 60 caracteres.";
  }
  if (dados.usouIa) {
    if (!dados.idFerramenta) {
      return "Selecione uma ferramenta de IA utilizada na sessão.";
    }
    if (!dados.tipoAtividade || !dados.tipoAtividade.trim()) {
      return "Informe o tipo de atividade realizada com a IA.";
    }
  }
  return null;
}

export function validarNotasAvaliacao(notas: {
  produtividade: number;
  dificuldade: number;
  confianca: number;
  foco?: number;
  fluidez?: number;
  qualidadeFeedback?: number;
}): string | null {
  const campos = Object.entries(notas);
  for (const [campo, valor] of campos) {
    if (valor !== undefined && (!Number.isInteger(valor) || valor < 1 || valor > 5)) {
      return `O valor de ${campo} deve estar entre 1 e 5.`;
    }
  }
  return null;
}

const DATA_ISO = /^\d{4}-\d{2}-\d{2}$/;

function dataIsoParaUtc(valor: string): Date | null {
  if (!DATA_ISO.test(valor)) return null;
  const data = new Date(`${valor}T00:00:00.000Z`);
  if (Number.isNaN(data.getTime())) return null;
  // Rejeita datas que o JS "corrige" sozinho, como 2026-02-31.
  return data.toISOString().startsWith(valor) ? data : null;
}

export function validarDataSessao(valor: string, hoje: Date = new Date()): string | null {
  const data = dataIsoParaUtc(valor);
  if (!data) return "Informe uma data válida para a sessão.";
  if (data.getTime() > hoje.getTime()) return "A data da sessão não pode estar no futuro.";
  return null;
}

// Parâmetros de URL chegam como texto livre: qualquer coisa que não seja um id
// positivo é tratada como "sem filtro", em vez de virar erro na consulta.
export function lerIdPositivo(valor: unknown): number | undefined {
  const id = Number(valor);
  return Number.isInteger(id) && id > 0 ? id : undefined;
}

export interface PeriodoFiltro {
  inicio?: string;
  fim?: string;
  where?: { gte?: Date; lte?: Date };
  erro?: string;
}

export function lerPeriodo(inicio?: string, fim?: string): PeriodoFiltro {
  const dataInicio = inicio ? dataIsoParaUtc(inicio) : null;
  const dataFim = fim ? dataIsoParaUtc(fim) : null;

  if (dataInicio && dataFim && dataInicio.getTime() > dataFim.getTime()) {
    return { inicio, fim, erro: "A data inicial não pode ser posterior à data final." };
  }
  if (!dataInicio && !dataFim) return {};

  return {
    inicio: dataInicio ? inicio : undefined,
    fim: dataFim ? fim : undefined,
    where: {
      ...(dataInicio ? { gte: dataInicio } : {}),
      ...(dataFim ? { lte: dataFim } : {}),
    },
  };
}

export function podeAcompanharSituacao(perfil: string): boolean {
  return perfil === "GESTOR" || perfil === "ADMINISTRADOR";
}

export function calcularSituacaoAtencao(ultimasSessoesComIa: SessaoParaAvaliacao[]): {
  disparar: boolean;
  motivo?: string;
  confiancaMedia?: number;
  dificuldadeMedia?: number;
} {
  const sessoesAvaliadas = ultimasSessoesComIa
    .filter((s) => s.usouIa && s.avaliacao)
    .slice(0, 5);

  if (sessoesAvaliadas.length < 5) {
    return { disparar: false };
  }

  const somaConfianca = sessoesAvaliadas.reduce(
    (acc, s) => acc + (s.avaliacao?.confianca ?? 0),
    0
  );
  const somaDificuldade = sessoesAvaliadas.reduce(
    (acc, s) => acc + (s.avaliacao?.dificuldade ?? 0),
    0
  );

  const confiancaMedia = somaConfianca / sessoesAvaliadas.length;
  const dificuldadeMedia = somaDificuldade / sessoesAvaliadas.length;

  if (confiancaMedia < 2.5 && dificuldadeMedia > 3.5) {
    return {
      disparar: true,
      motivo: "Baixa confiança média (< 2.5) e alta dificuldade média (> 3.5) com uso de IA nas últimas 5 sessões.",
      confiancaMedia,
      dificuldadeMedia,
    };
  }

  if (confiancaMedia < 2.5) {
    return {
      disparar: true,
      motivo: "Baixa confiança média (< 2.5) com uso frequente de IA nas últimas 5 sessões.",
      confiancaMedia,
      dificuldadeMedia,
    };
  }

  if (dificuldadeMedia > 3.5) {
    return {
      disparar: true,
      motivo: "Alta dificuldade percebida média (> 3.5) com uso de IA nas últimas 5 sessões.",
      confiancaMedia,
      dificuldadeMedia,
    };
  }

  return { disparar: false, confiancaMedia, dificuldadeMedia };
}

export interface IndicadoresConsolidados {
  totalSessoes: number;
  totalComIa: number;
  percentualIa: number;
  produtividadeMedia: number;
  confiancaMedia: number;
  dificuldadeMedia: number;
  ferramentasMaisUsadas: { nome: string; quantidade: number }[];
}

export function consolidarIndicadores(
  sessoes: Array<{
    usouIa: boolean;
    avaliacao?: { produtividade: number; confianca: number; dificuldade: number } | null;
    sessaoFerramentas?: Array<{ ferramenta: { nome: string } }>;
  }>
): IndicadoresConsolidados {
  const totalSessoes = sessoes.length;
  if (totalSessoes === 0) {
    return {
      totalSessoes: 0,
      totalComIa: 0,
      percentualIa: 0,
      produtividadeMedia: 0,
      confiancaMedia: 0,
      dificuldadeMedia: 0,
      ferramentasMaisUsadas: [],
    };
  }

  const sessoesComIa = sessoes.filter((s) => s.usouIa);
  const totalComIa = sessoesComIa.length;
  const percentualIa = Math.round((totalComIa / totalSessoes) * 100);

  const avaliadas = sessoes.filter((s) => s.avaliacao != null);
  const qtdAvaliadas = avaliadas.length || 1;

  const somaProd = avaliadas.reduce((acc, s) => acc + (s.avaliacao?.produtividade ?? 0), 0);
  const somaConf = avaliadas.reduce((acc, s) => acc + (s.avaliacao?.confianca ?? 0), 0);
  const somaDif = avaliadas.reduce((acc, s) => acc + (s.avaliacao?.dificuldade ?? 0), 0);

  const ferramentaCount = new Map<string, number>();
  for (const s of sessoes) {
    if (s.sessaoFerramentas) {
      for (const sf of s.sessaoFerramentas) {
        const nome = sf.ferramenta?.nome ?? "Desconhecida";
        ferramentaCount.set(nome, (ferramentaCount.get(nome) ?? 0) + 1);
      }
    }
  }

  const ferramentasMaisUsadas = Array.from(ferramentaCount.entries())
    .map(([nome, quantidade]) => ({ nome, quantidade }))
    .sort((a, b) => b.quantidade - a.quantidade);

  return {
    totalSessoes,
    totalComIa,
    percentualIa,
    produtividadeMedia: Number((somaProd / qtdAvaliadas).toFixed(1)),
    confiancaMedia: Number((somaConf / qtdAvaliadas).toFixed(1)),
    dificuldadeMedia: Number((somaDif / qtdAvaliadas).toFixed(1)),
    ferramentasMaisUsadas,
  };
}
