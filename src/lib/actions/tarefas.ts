"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getUsuarioAtual } from "@/lib/usuario-atual";
import { PRIORIDADES_TAREFA, STATUS_TAREFA, validarTituloTarefa } from "@/lib/validacoes";
import { lerIdPositivo } from "@/lib/indicadores";

async function garantirAcessoAoProjeto(idProjeto: number | undefined, idUsuario: number) {
  if (!idProjeto) redirect("/projetos");
  const vinculo = await prisma.usuarioProjeto.findUnique({
    where: { idUsuario_idProjeto: { idUsuario, idProjeto } },
  });
  if (!vinculo) redirect("/projetos");
}

export async function criarTarefa(formData: FormData) {
  const usuario = await getUsuarioAtual();
  if (!usuario) redirect("/login");

  const idProjeto = lerIdPositivo(formData.get("idProjeto"));
  const titulo = String(formData.get("titulo") ?? "").trim();
  const descricao = String(formData.get("descricao") ?? "").trim();
  const prioridade = String(formData.get("prioridade") ?? "MEDIA");

  await garantirAcessoAoProjeto(idProjeto, usuario!.idUsuario);

  const erro = PRIORIDADES_TAREFA.includes(prioridade)
    ? validarTituloTarefa(titulo)
    : "Selecione uma prioridade válida.";
  if (erro) {
    redirect(`/projetos/${idProjeto}?erro=${encodeURIComponent(erro)}`);
  }

  await prisma.tarefa.create({
    data: {
      idProjeto: idProjeto!,
      titulo,
      descricao: descricao || null,
      prioridade,
      usuarioTarefas: {
        create: { idUsuario: usuario!.idUsuario, papel: "RESPONSAVEL" },
      },
    },
  });

  revalidatePath(`/projetos/${idProjeto}`);
}

export async function atualizarStatusTarefa(formData: FormData) {
  const usuario = await getUsuarioAtual();
  if (!usuario) redirect("/login");

  const idTarefa = lerIdPositivo(formData.get("idTarefa"));
  const idProjeto = lerIdPositivo(formData.get("idProjeto"));
  const status = String(formData.get("status"));

  await garantirAcessoAoProjeto(idProjeto, usuario!.idUsuario);

  if (!idTarefa || !STATUS_TAREFA.includes(status)) return;

  // idProjeto no filtro impede alterar uma tarefa de outro projeto.
  await prisma.tarefa.updateMany({
    where: { idTarefa, idProjeto },
    data: { status },
  });

  revalidatePath(`/projetos/${idProjeto}`);
}
