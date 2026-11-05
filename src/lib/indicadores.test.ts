import { describe, expect, it } from "vitest";
import {
  validarSessao,
  validarNotasAvaliacao,
  calcularSituacaoAtencao,
  consolidarIndicadores,
  validarDataSessao,
  lerIdPositivo,
  lerPeriodo,
  podeAcompanharSituacao,
} from "./indicadores";

describe("validarSessao (CT08 e CT09)", () => {
  it("rejeita duração menor ou igual a zero", () => {
    expect(validarSessao({ duracaoMinutos: 0, usouIa: false })).toContain("duração");
    expect(validarSessao({ duracaoMinutos: -15, usouIa: false })).toContain("duração");
  });

  it("exige ferramenta de IA quando usouIa = true (CT08)", () => {
    expect(
      validarSessao({ duracaoMinutos: 45, usouIa: true, idFerramenta: null, tipoAtividade: "Coding" })
    ).toContain("ferramenta");
  });

  it("exige tipo de atividade quando usouIa = true", () => {
    expect(
      validarSessao({ duracaoMinutos: 45, usouIa: true, idFerramenta: 1, tipoAtividade: "" })
    ).toContain("tipo de atividade");
  });

  it("aceita sessão válida sem IA", () => {
    expect(validarSessao({ duracaoMinutos: 60, usouIa: false })).toBeNull();
  });

  it("aceita sessão válida com IA", () => {
    expect(
      validarSessao({
        duracaoMinutos: 60,
        usouIa: true,
        idFerramenta: 1,
        tipoAtividade: "Geração de código",
      })
    ).toBeNull();
  });
});

describe("validarNotasAvaliacao (CT10)", () => {
  it("rejeita nota menor que 1 ou maior que 5", () => {
    expect(
      validarNotasAvaliacao({ produtividade: 0, dificuldade: 3, confianca: 4 })
    ).toContain("entre 1 e 5");
    expect(
      validarNotasAvaliacao({ produtividade: 6, dificuldade: 3, confianca: 4 })
    ).toContain("entre 1 e 5");
  });

  it("aceita notas válidas no range 1 a 5", () => {
    expect(
      validarNotasAvaliacao({ produtividade: 4, dificuldade: 2, confianca: 5, foco: 5 })
    ).toBeNull();
  });
});

describe("calcularSituacaoAtencao (CT12 e CT13 - História #10)", () => {
  it("não dispara com menos de 5 sessões avaliadas com IA", () => {
    const sessoes = [
      { idSessao: 1, usouIa: true, avaliacao: { confianca: 1, dificuldade: 5, produtividade: 1 } },
      { idSessao: 2, usouIa: true, avaliacao: { confianca: 1, dificuldade: 5, produtividade: 1 } },
    ];
    const res = calcularSituacaoAtencao(sessoes);
    expect(res.disparar).toBe(false);
  });

  it("dispara se confiança média < 2.5 nas últimas 5 sessões (CT12)", () => {
    const sessoes = Array.from({ length: 5 }, (_, i) => ({
      idSessao: i + 1,
      usouIa: true,
      avaliacao: { confianca: 2, dificuldade: 3, produtividade: 3 },
    }));
    const res = calcularSituacaoAtencao(sessoes);
    expect(res.disparar).toBe(true);
    expect(res.confiancaMedia).toBe(2);
  });

  it("dispara se dificuldade média > 3.5 nas últimas 5 sessões", () => {
    const sessoes = Array.from({ length: 5 }, (_, i) => ({
      idSessao: i + 1,
      usouIa: true,
      avaliacao: { confianca: 4, dificuldade: 4, produtividade: 4 },
    }));
    const res = calcularSituacaoAtencao(sessoes);
    expect(res.disparar).toBe(true);
    expect(res.dificuldadeMedia).toBe(4);
  });

  it("não dispara quando índices estão saudáveis (CT13)", () => {
    const sessoes = Array.from({ length: 5 }, (_, i) => ({
      idSessao: i + 1,
      usouIa: true,
      avaliacao: { confianca: 4, dificuldade: 2, produtividade: 5 },
    }));
    const res = calcularSituacaoAtencao(sessoes);
    expect(res.disparar).toBe(false);
  });
});

describe("consolidarIndicadores (História #12 / #13)", () => {
  it("calcula médias e percentuais corretamente", () => {
    const sessoes = [
      {
        usouIa: true,
        avaliacao: { produtividade: 4, confianca: 4, dificuldade: 2 },
        sessaoFerramentas: [{ ferramenta: { nome: "ChatGPT" } }],
      },
      {
        usouIa: false,
        avaliacao: { produtividade: 2, confianca: 2, dificuldade: 4 },
      },
    ];
    const ind = consolidarIndicadores(sessoes);
    expect(ind.totalSessoes).toBe(2);
    expect(ind.totalComIa).toBe(1);
    expect(ind.percentualIa).toBe(50);
    expect(ind.produtividadeMedia).toBe(3);
    expect(ind.ferramentasMaisUsadas[0]?.nome).toBe("ChatGPT");
  });
});

describe("validações reforçadas na Sprint 4 (#16)", () => {
  it("rejeita duração fracionada ou que não é número", () => {
    expect(validarSessao({ duracaoMinutos: 1.5, usouIa: false })).toContain("duração");
    expect(validarSessao({ duracaoMinutos: Number.NaN, usouIa: false })).toContain("duração");
  });

  it("rejeita tipo de atividade maior que a coluna do banco", () => {
    expect(
      validarSessao({ duracaoMinutos: 30, usouIa: false, tipoAtividade: "x".repeat(61) })
    ).toContain("60 caracteres");
  });

  it("rejeita nota que não é número inteiro", () => {
    const base = { dificuldade: 3, confianca: 3 };
    expect(validarNotasAvaliacao({ ...base, produtividade: Number.NaN })).toContain("produtividade");
    expect(validarNotasAvaliacao({ ...base, produtividade: 2.5 })).toContain("produtividade");
  });

  it("aceita data passada e rejeita data inválida, vazia ou futura", () => {
    const hoje = new Date("2026-11-05T12:00:00.000Z");
    expect(validarDataSessao("2026-11-05", hoje)).toBeNull();
    expect(validarDataSessao("", hoje)).toContain("válida");
    expect(validarDataSessao("2026-02-31", hoje)).toContain("válida");
    expect(validarDataSessao("2026-11-06", hoje)).toContain("futuro");
  });
});

describe("lerIdPositivo", () => {
  it("aceita somente inteiros positivos", () => {
    expect(lerIdPositivo("12")).toBe(12);
    expect(lerIdPositivo("abc")).toBeUndefined();
    expect(lerIdPositivo("-1")).toBeUndefined();
    expect(lerIdPositivo("1.5")).toBeUndefined();
    expect(lerIdPositivo(null)).toBeUndefined();
  });
});

describe("lerPeriodo (CT15)", () => {
  it("monta o intervalo com início e fim", () => {
    const periodo = lerPeriodo("2026-10-01", "2026-10-31");
    expect(periodo.where?.gte?.toISOString()).toBe("2026-10-01T00:00:00.000Z");
    expect(periodo.where?.lte?.toISOString()).toBe("2026-10-31T00:00:00.000Z");
    expect(periodo.erro).toBeUndefined();
  });

  it("aceita período aberto em uma das pontas", () => {
    expect(lerPeriodo("2026-10-01").where).toEqual({ gte: new Date("2026-10-01T00:00:00.000Z") });
    expect(lerPeriodo(undefined, "2026-10-31").where).toEqual({
      lte: new Date("2026-10-31T00:00:00.000Z"),
    });
  });

  it("não filtra quando as datas são inválidas ou ausentes", () => {
    expect(lerPeriodo("ontem", "2026-13-40")).toEqual({});
    expect(lerPeriodo()).toEqual({});
  });

  it("devolve erro quando o início é depois do fim", () => {
    const periodo = lerPeriodo("2026-10-31", "2026-10-01");
    expect(periodo.erro).toContain("posterior");
    expect(periodo.where).toBeUndefined();
  });
});

describe("podeAcompanharSituacao (CT16)", () => {
  it("libera somente gestor e administrador", () => {
    expect(podeAcompanharSituacao("GESTOR")).toBe(true);
    expect(podeAcompanharSituacao("ADMINISTRADOR")).toBe(true);
    expect(podeAcompanharSituacao("DESENVOLVEDOR")).toBe(false);
  });
});
