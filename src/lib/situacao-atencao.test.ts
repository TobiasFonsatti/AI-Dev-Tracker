import { describe, expect, it } from "vitest";
import { calcularSituacaoAtencao } from "./situacao-atencao";

describe("calcularSituacaoAtencao (#10)", () => {
  it("não dispara quando o desenvolvedor tem menos de 5 sessões com IA", () => {
    const sessoes = [
      { confianca: 1, dificuldade: 5 },
      { confianca: 1, dificuldade: 5 },
      { confianca: 1, dificuldade: 5 },
      { confianca: 1, dificuldade: 5 },
    ];
    const resultado = calcularSituacaoAtencao(sessoes);
    expect(resultado.disparar).toBe(false);
  });

  // CT12 (docs/plano-de-testes.md e sprint-2-evidencias-teste.md)
  it("CT12: dispara quando a confiança média nas últimas 5 sessões com IA é menor que 2.5", () => {
    const sessoes = [
      { confianca: 2, dificuldade: 3 },
      { confianca: 2, dificuldade: 3 },
      { confianca: 1, dificuldade: 3 },
      { confianca: 2, dificuldade: 3 },
      { confianca: 2, dificuldade: 3 },
    ];
    const resultado = calcularSituacaoAtencao(sessoes);
    expect(resultado.disparar).toBe(true);
    expect(resultado.mediaConfianca).toBeLessThan(2.5);
    expect(resultado.motivo).toContain("confiança média baixa");
  });

  it("dispara quando a dificuldade média nas últimas 5 sessões com IA é maior que 3.5", () => {
    const sessoes = [
      { confianca: 4, dificuldade: 4 },
      { confianca: 4, dificuldade: 4 },
      { confianca: 4, dificuldade: 4 },
      { confianca: 4, dificuldade: 4 },
      { confianca: 4, dificuldade: 4 },
    ];
    const resultado = calcularSituacaoAtencao(sessoes);
    expect(resultado.disparar).toBe(true);
    expect(resultado.mediaDificuldade).toBeGreaterThan(3.5);
    expect(resultado.motivo).toContain("dificuldade média alta");
  });

  it("dispara com ambos os critérios simultâneos (confiança baixa e dificuldade alta)", () => {
    const sessoes = [
      { confianca: 1, dificuldade: 5 },
      { confianca: 2, dificuldade: 4 },
      { confianca: 1, dificuldade: 5 },
      { confianca: 2, dificuldade: 4 },
      { confianca: 1, dificuldade: 5 },
    ];
    const resultado = calcularSituacaoAtencao(sessoes);
    expect(resultado.disparar).toBe(true);
    expect(resultado.motivo).toContain("confiança média baixa");
    expect(resultado.motivo).toContain("dificuldade média alta");
  });

  // CT13 (docs/plano-de-testes.md e sprint-2-evidencias-teste.md)
  it("CT13: critério de disparo não atingido quando indicadores estão saudáveis", () => {
    const sessoes = [
      { confianca: 4, dificuldade: 2 },
      { confianca: 5, dificuldade: 2 },
      { confianca: 4, dificuldade: 3 },
      { confianca: 3, dificuldade: 2 },
      { confianca: 4, dificuldade: 2 },
    ];
    const resultado = calcularSituacaoAtencao(sessoes);
    expect(resultado.disparar).toBe(false);
  });
});

