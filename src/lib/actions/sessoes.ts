"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getUsuarioAtual } from "@/lib/usuario-atual";
import {
  validarSessao,
  validarNotasAvaliacao,
  validarDataSessao,
  calcularSituacaoAtencao,
  lerIdPositivo,
  podeAcompanharSituacao,
} from "@/lib/indicadores";

function voltarComErro(mensagem: string): never {
  redirect(`/sessoes/nova?erro=${encodeURIComponent(mensagem)}`);
}

export async function criarSessaoComAvaliacao(formData: FormData) {
  const usuario = await getUsuarioAtual();
  if (!usuario) redirect("/login");

  const idProjeto = lerIdPositivo(formData.get("idProjeto"));
  const idTarefaRaw = formData.get("idTarefa");
  const idTarefa = idTarefaRaw ? (lerIdPositivo(idTarefaRaw) ?? null) : null;
  const dataSessaoStr = String(formData.get("dataSessao") ?? "");
  const duracaoMinutos = Number(formData.get("duracaoMinutos"));
  const usouIa = formData.get("usouIa") === "true" || formData.get("usouIa") === "on";
  const idFerramentaRaw = formData.get("idFerramenta");
  const idFerramenta = idFerramentaRaw ? (lerIdPositivo(idFerramentaRaw) ?? null) : null;
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

  if (!idProjeto) voltarComErro("Selecione um projeto válido.");
  if (idTarefaRaw && !idTarefa) voltarComErro("Selecione uma tarefa válida.");

  const erroData = validarDataSessao(dataSessaoStr);
  if (erroData) voltarComErro(erroData);

  const erroSessao = validarSessao({
    duracaoMinutos,
    usouIa,
    idFerramenta,
    tipoAtividade,
  });
  if (erroSessao) voltarComErro(erroSessao);

  const erroAvaliacao = validarNotasAvaliacao({
    produtividade,
    dificuldade,
    confianca,
    foco,
    fluidez,
    qualidadeFeedback,
  });
  if (erroAvaliacao) voltarComErro(erroAvaliacao);

  const vinculo = await prisma.usuarioProjeto.findUnique({
    where: { idUsuario_idProjeto: { idUsuario: usuario!.idUsuario, idProjeto: idProjeto! } },
  });
  if (!vinculo) voltarComErro("Você só pode registrar sessões em projetos dos quais participa.");

  if (idTarefa) {
    const tarefa = await prisma.tarefa.findFirst({ where: { idTarefa, idProjeto } });
    if (!tarefa) voltarComErro("A tarefa selecionada não pertence ao projeto da sessão.");
  }

  if (usouIa) {
    const ferramenta = await prisma.ferramentaIa.findFirst({
      where: { idFerramenta: idFerramenta!, ativa: true },
    });
    if (!ferramenta) voltarComErro("Selecione uma ferramenta de IA ativa.");
  }

  const dataSessao = new Date(`${dataSessaoStr}T00:00:00.000Z`);

  const sessaoCriada = await prisma.$transaction(async (tx) => {
    const s = await tx.sessaoDesenvolvimento.create({
      data: {
        idUsuario: usuario!.idUsuario,
        idProjeto: idProjeto!,
        idTarefa,
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
    // Enquanto houver uma situação em aberto, novas sessões não geram outra:
    // o gestor vê um alerta por desenvolvedor, não um por sessão.
    const situacaoAberta = await prisma.situacaoAtencao.findFirst({
      where: { idUsuario: usuario!.idUsuario, acompanhada: false },
    });
    if (checagem.disparar && checagem.motivo && !situacaoAberta) {
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
  if (!podeAcompanharSituacao(usuario!.perfil.nome)) redirect("/historico");

  const idSituacao = lerIdPositivo(formData.get("idSituacao"));
  if (!idSituacao) redirect("/dashboard");
  const observacoes = String(formData.get("observacoes") ?? "").trim();

  await prisma.situacaoAtencao.updateMany({
    where: { idSituacao, acompanhada: false },
    data: {
      acompanhada: true,
      observacoes: observacoes || "Acompanhada pelo gestor.",
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/historico");
}
