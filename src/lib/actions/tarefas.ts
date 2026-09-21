"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getUsuarioAtual } from "@/lib/usuario-atual";
import { validarTituloTarefa } from "@/lib/validacoes";

async function garantirAcessoAoProjeto(idProjeto: number, idUsuario: number) {
  const vinculo = await prisma.usuarioProjeto.findUnique({
    where: { idUsuario_idProjeto: { idUsuario, idProjeto } },
  });
  if (!vinculo) redirect("/projetos");
}

export async function criarTarefa(formData: FormData) {
  const usuario = await getUsuarioAtual();
  if (!usuario) redirect("/login");

  const idProjeto = Number(formData.get("idProjeto"));
  const titulo = String(formData.get("titulo") ?? "").trim();
  const descricao = String(formData.get("descricao") ?? "").trim();
  const prioridade = String(formData.get("prioridade") ?? "MEDIA");

  await garantirAcessoAoProjeto(idProjeto, usuario!.idUsuario);

  const erro = validarTituloTarefa(titulo);
  if (erro) {
    redirect(`/projetos/${idProjeto}?erro=${encodeURIComponent(erro)}`);
  }

  await prisma.tarefa.create({
    data: {
      idProjeto,
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

  const idTarefa = Number(formData.get("idTarefa"));
  const idProjeto = Number(formData.get("idProjeto"));
  const status = String(formData.get("status"));

  await garantirAcessoAoProjeto(idProjeto, usuario!.idUsuario);

  await prisma.tarefa.update({
    where: { idTarefa },
    data: { status },
  });

  revalidatePath(`/projetos/${idProjeto}`);
}
