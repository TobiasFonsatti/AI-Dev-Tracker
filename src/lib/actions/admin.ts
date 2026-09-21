"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { exigirAdmin } from "@/lib/usuario-atual";

export async function alternarStatusUsuario(formData: FormData) {
  await exigirAdmin();

  const idUsuario = Number(formData.get("idUsuario"));
  const novoStatus = String(formData.get("novoStatus"));

  await prisma.usuario.update({
    where: { idUsuario },
    data: { status: novoStatus },
  });

  revalidatePath("/admin/usuarios");
}

export async function associarPermissao(formData: FormData) {
  await exigirAdmin();

  const idPerfil = Number(formData.get("idPerfil"));
  const idPermissao = Number(formData.get("idPermissao"));

  await prisma.perfilPermissao.upsert({
    where: { idPerfil_idPermissao: { idPerfil, idPermissao } },
    update: {},
    create: { idPerfil, idPermissao },
  });

  revalidatePath("/admin/permissoes");
}

export async function removerPermissao(formData: FormData) {
  await exigirAdmin();

  const idPerfil = Number(formData.get("idPerfil"));
  const idPermissao = Number(formData.get("idPermissao"));

  await prisma.perfilPermissao.delete({
    where: { idPerfil_idPermissao: { idPerfil, idPermissao } },
  });

  revalidatePath("/admin/permissoes");
}

export async function criarFerramenta(formData: FormData) {
  await exigirAdmin();

  const nome = String(formData.get("nome") ?? "").trim();
  const fornecedor = String(formData.get("fornecedor") ?? "").trim();

  if (!nome) return;

  await prisma.ferramentaIa.create({
    data: { nome, fornecedor: fornecedor || null },
  });

  revalidatePath("/admin/ferramentas-ia");
}

export async function alternarStatusFerramenta(formData: FormData) {
  await exigirAdmin();

  const idFerramenta = Number(formData.get("idFerramenta"));
  const ativa = formData.get("ativa") === "true";

  await prisma.ferramentaIa.update({
    where: { idFerramenta },
    data: { ativa: !ativa },
  });

  revalidatePath("/admin/ferramentas-ia");
}
