"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getUsuarioAtual } from "@/lib/usuario-atual";
import { validarSessao, validarEscalaAvaliacao } from "@/lib/validacoes";
import { calcularSituacaoAtencao } from "@/lib/situacao-atencao";

export async function criarSessao(formData: FormData) {
  const usuario = await getUsuarioAtual();
  if (!usuario) redirect("/login");

  const idProjeto = Number(formData.get("idProjeto"));
  const idTarefaStr = formData.get("idTarefa");
  const idTarefa = idTarefaStr && Number(idTarefaStr) > 0 ? Number(idTarefaStr) : null;
  const dataSessaoStr = String(formData.get("dataSessao") ?? "");
  const duracaoMinutos = Number(formData.get("duracaoMinutos"));
  const usouIa = formData.get("usouIa") === "on" || formData.get("usouIa") === "true";
  const tipoAtividade = String(formData.get("tipoAtividade") ?? "").trim();
  const idFerramentaStr = formData.get("idFerramenta");
  const idFerramenta = idFerramentaStr && Number(idFerramentaStr) > 0 ? Number(idFerramentaStr) : null;
  const observacoesSessao = String(formData.get("observacoesSessao") ?? "").trim() || null;

  // Avaliação obrigatória
  const produtividade = Number(formData.get("produtividade"));
  const dificuldade = Number(formData.get("dificuldade"));
  const confianca = Number(formData.get("confianca"));

  // Avaliação estendida (IA)
  const foco = usouIa ? Number(formData.get("foco") ?? 3) : 3;
  const fluidez = usouIa ? Number(formData.get("fluidez") ?? 3) : 3;
  const qualidadeFeedback = usouIa ? Number(formData.get("qualidadeFeedback") ?? 3) : 3;
  const observacoesAvaliacao = String(formData.get("observacoesAvaliacao") ?? "").trim() || null;

  // Validação de projeto
  if (!idProjeto || idProjeto <= 0) {
    redirect("/sessoes/nova?erro=" + encodeURIComponent("Selecione um projeto válido."));
  }

  const vinculoProjeto = await prisma.usuarioProjeto.findUnique({
    where: { idUsuario_idProjeto: { idUsuario: usuario.idUsuario, idProjeto } },
  });
  if (!vinculoProjeto && usuario.perfil.nome !== "ADMINISTRADOR") {
    redirect("/sessoes/nova?erro=" + encodeURIComponent("Você não tem acesso a este projeto."));
  }

  // Validações de sessão
  const erroSessao = validarSessao({
    duracaoMinutos,
    usouIa,
    tipoAtividade,
    idFerramenta,
  });
  if (erroSessao) {
    redirect("/sessoes/nova?erro=" + encodeURIComponent(erroSessao));
  }

  // Validação de escalas (1 a 5)
  const erroProd = validarEscalaAvaliacao(produtividade, "produtividade");
  if (erroProd) redirect("/sessoes/nova?erro=" + encodeURIComponent(erroProd));

  const erroDif = validarEscalaAvaliacao(dificuldade, "dificuldade");
  if (erroDif) redirect("/sessoes/nova?erro=" + encodeURIComponent(erroDif));

  const erroConf = validarEscalaAvaliacao(confianca, "confiança");
  if (erroConf) redirect("/sessoes/nova?erro=" + encodeURIComponent(erroConf));

  if (usouIa) {
    const erroFoco = validarEscalaAvaliacao(foco, "foco");
    if (erroFoco) redirect("/sessoes/nova?erro=" + encodeURIComponent(erroFoco));

    const erroFluidez = validarEscalaAvaliacao(fluidez, "fluidez");
    if (erroFluidez) redirect("/sessoes/nova?erro=" + encodeURIComponent(erroFluidez));

    const erroQualidade = validarEscalaAvaliacao(qualidadeFeedback, "qualidade do feedback");
    if (erroQualidade) redirect("/sessoes/nova?erro=" + encodeURIComponent(erroQualidade));
  }

  const dataSessao = dataSessaoStr ? new Date(dataSessaoStr) : new Date();

  // Transação atômica no banco de dados
  await prisma.$transaction(async (tx) => {
    // 1. Criar sessão
    const sessaoCriada = await tx.sessaoDesenvolvimento.create({
      data: {
        idUsuario: usuario.idUsuario,
        idProjeto,
        idTarefa,
        dataSessao,
        duracaoMinutos,
        usouIa,
        tipoAtividade,
        observacoes: observacoesSessao,
      },
    });

    // 2. Se usou IA, vincular ferramenta
    if (usouIa && idFerramenta) {
      await tx.sessaoFerramenta.create({
        data: {
          idSessao: sessaoCriada.idSessao,
          idFerramenta,
        },
      });
    }

    // 3. Criar avaliação da sessão
    await tx.avaliacaoSessao.create({
      data: {
        idSessao: sessaoCriada.idSessao,
        produtividade,
        dificuldade,
        confianca,
        foco,
        fluidez,
        qualidadeFeedback,
        observacoes: observacoesAvaliacao,
      },
    });

    // 4. Regra de situação de atenção (#10):
    // Se usou IA, verifica o histórico das últimas 5 sessões com IA do usuário
    if (usouIa) {
      const sessoesRecentes = await tx.sessaoDesenvolvimento.findMany({
        where: {
          idUsuario: usuario.idUsuario,
          usouIa: true,
          avaliacao: { isNot: null },
        },
        orderBy: [{ dataSessao: "desc" }, { idSessao: "desc" }],
        take: 5,
        include: { avaliacao: true },
      });

      if (sessoesRecentes.length >= 5) {
        const historico = sessoesRecentes.map((s) => ({
          confianca: s.avaliacao!.confianca,
          dificuldade: s.avaliacao!.dificuldade,
        }));

        const analise = calcularSituacaoAtencao(historico);
        if (analise.disparar && analise.motivo) {
          await tx.situacaoAtencao.create({
            data: {
              idSessao: sessaoCriada.idSessao,
              idUsuario: usuario.idUsuario,
              dataIdentificacao: new Date(),
              motivo: analise.motivo,
              acompanhada: false,
            },
          });
        }
      }
    }
  });

  revalidatePath("/sessoes");
  revalidatePath("/dashboard");
  redirect("/sessoes?sucesso=1");
}

export async function marcarSituacaoAcompanhada(formData: FormData) {
  const usuario = await getUsuarioAtual();
  if (!usuario) redirect("/login");

  // Apenas GESTOR ou ADMINISTRADOR
  if (usuario.perfil.nome !== "GESTOR" && usuario.perfil.nome !== "ADMINISTRADOR") {
    redirect("/dashboard?erro=" + encodeURIComponent("Permissão negada."));
  }

  const idSituacao = Number(formData.get("idSituacao"));
  const observacoes = String(formData.get("observacoes") ?? "").trim() || null;

  await prisma.situacaoAtencao.update({
    where: { idSituacao },
    data: {
      acompanhada: true,
      observacoes: observacoes ? observacoes : `Acompanhada por ${usuario.nome}`,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/sessoes");
}

