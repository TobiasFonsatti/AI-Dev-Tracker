"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getUsuarioAtual } from "@/lib/usuario-atual";
import {
  validarSessao,
  validarNotasAvaliacao,
  calcularSituacaoAtencao,
} from "@/lib/indicadores";

export async function criarSessaoComAvaliacao(formData: FormData) {
  const usuario = await getUsuarioAtual();
  if (!usuario) redirect("/login");

  const idProjeto = Number(formData.get("idProjeto"));
  const idTarefaRaw = formData.get("idTarefa");
  const idTarefa = idTarefaRaw ? Number(idTarefaRaw) : null;
  const dataSessaoStr = String(formData.get("dataSessao") ?? "");
  const duracaoMinutos = Number(formData.get("duracaoMinutos"));
  const usouIa = formData.get("usouIa") === "true" || formData.get("usouIa") === "on";
  const idFerramentaRaw = formData.get("idFerramenta");
  const idFerramenta = idFerramentaRaw ? Number(idFerramentaRaw) : null;
  const tipoAtividade = String(formData.get("tipoAtividade") ?? "").trim();
  const observacoesSessao = String(formData.get("observacoesSessao") ?? "").trim();

  const produtividade = Number(formData.get("produtividade") ?? 3);
  const dificuldade = Number(formData.get("dificuldade") ?? 3);
  const confianca = Number(formData.get("confianca") ?? 3);
  const foco = formData.get("foco") ? Number(formData.get("foco")) : 3;
  const fluidez = formData.get("fluidez") ? Number(formData.get("fluidez")) : 3;
  const qualidadeFeedback = formData.get("qualidadeFeedback")
    ? Number(formData.get("qualidadeFeedback"))
    : 3;
  const observacoesAvaliacao = String(formData.get("observacoesAvaliacao") ?? "").trim();

  const erroSessao = validarSessao({
    duracaoMinutos,
    usouIa,
    idFerramenta,
    tipoAtividade,
  });
  if (erroSessao) {
    redirect(`/sessoes/nova?erro=${encodeURIComponent(erroSessao)}`);
  }

  const erroAvaliacao = validarNotasAvaliacao({
    produtividade,
    dificuldade,
    confianca,
    foco,
    fluidez,
    qualidadeFeedback,
  });
  if (erroAvaliacao) {
    redirect(`/sessoes/nova?erro=${encodeURIComponent(erroAvaliacao)}`);
  }

  const dataSessao = dataSessaoStr ? new Date(dataSessaoStr) : new Date();

  const sessaoCriada = await prisma.$transaction(async (tx) => {
    const s = await tx.sessaoDesenvolvimento.create({
      data: {
        idUsuario: usuario!.idUsuario,
        idProjeto,
        idTarefa: idTarefa || null,
        dataSessao,
        duracaoMinutos,
        usouIa,
        tipoAtividade: usouIa ? tipoAtividade : "Desenvolvimento manual",
        observacoes: observacoesSessao || null,
        sessaoFerramentas:
          usouIa && idFerramenta
            ? { create: { idFerramenta } }
            : undefined,
        avaliacao: {
          create: {
            produtividade,
            dificuldade,
            confianca,
            foco: usouIa ? foco : 3,
            fluidez: usouIa ? fluidez : 3,
            qualidadeFeedback: usouIa ? qualidadeFeedback : 3,
            observacoes: observacoesAvaliacao || null,
          },
        },
      },
    });

    return s;
  });

  if (usouIa) {
    const ultimasSessoes = await prisma.sessaoDesenvolvimento.findMany({
      where: {
        idUsuario: usuario!.idUsuario,
        usouIa: true,
      },
      include: { avaliacao: true },
      orderBy: { dataSessao: "desc" },
      take: 5,
    });

    const checagem = calcularSituacaoAtencao(ultimasSessoes);
    if (checagem.disparar && checagem.motivo) {
      await prisma.situacaoAtencao.create({
        data: {
          idSessao: sessaoCriada.idSessao,
          idUsuario: usuario!.idUsuario,
          motivo: checagem.motivo,
          dataIdentificacao: new Date(),
          acompanhada: false,
        },
      });
    }
  }

  revalidatePath("/sessoes");
  revalidatePath("/historico");
  revalidatePath("/dashboard");
  redirect("/historico");
}

export async function marcarSituacaoAcompanhada(formData: FormData) {
  const usuario = await getUsuarioAtual();
  if (!usuario) redirect("/login");

  const idSituacao = Number(formData.get("idSituacao"));
  const observacoes = String(formData.get("observacoes") ?? "").trim();

  await prisma.situacaoAtencao.update({
    where: { idSituacao },
    data: {
      acompanhada: true,
      observacoes: observacoes || "Acompanhada pelo gestor.",
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/atencao");
}
