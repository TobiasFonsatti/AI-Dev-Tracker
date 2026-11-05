// Regra de negócio para Identificação Automática de Situações de Atenção (#10)
// Critério documentado no backlog:
// Nas últimas 5 sessões com uso de IA, confiança média < 2,5 OU dificuldade média > 3,5.

export interface SessaoHistoricoAtencao {
  confianca: number;
  dificuldade: number;
}

export interface ResultadoSituacaoAtencao {
  disparar: boolean;
  motivo?: string;
  mediaConfianca?: number;
  mediaDificuldade?: number;
}

export function calcularSituacaoAtencao(
  ultimasSessoesComIa: SessaoHistoricoAtencao[]
): ResultadoSituacaoAtencao {
  if (ultimasSessoesComIa.length < 5) {
    return { disparar: false };
  }

  // Considerar as 5 mais recentes
  const ultimas5 = ultimasSessoesComIa.slice(0, 5);
  const somaConfianca = ultimas5.reduce((acc, s) => acc + s.confianca, 0);
  const somaDificuldade = ultimas5.reduce((acc, s) => acc + s.dificuldade, 0);

  const mediaConfianca = Number((somaConfianca / 5).toFixed(2));
  const mediaDificuldade = Number((somaDificuldade / 5).toFixed(2));

  const baixaConfianca = mediaConfianca < 2.5;
  const altaDificuldade = mediaDificuldade > 3.5;

  if (baixaConfianca || altaDificuldade) {
    const motivos: string[] = [];
    if (baixaConfianca) {
      motivos.push(`confiança média baixa (${mediaConfianca.toFixed(1)} < 2.5)`);
    }
    if (altaDificuldade) {
      motivos.push(`dificuldade média alta (${mediaDificuldade.toFixed(1)} > 3.5)`);
    }

    return {
      disparar: true,
      motivo: `Últimas 5 sessões com IA apresentaram ${motivos.join(" e ")}.`,
      mediaConfianca,
      mediaDificuldade,
    };
  }

  return {
    disparar: false,
    mediaConfianca,
    mediaDificuldade,
  };
}

