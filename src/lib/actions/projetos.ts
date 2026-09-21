"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getUsuarioAtual } from "@/lib/usuario-atual";
import { validarNomeProjeto } from "@/lib/validacoes";

export async function criarProjeto(formData: FormData) {
  const usuario = await getUsuarioAtual();
  if (!usuario) redirect("/login");

  const nome = String(formData.get("nome") ?? "").trim();
  const descricao = String(formData.get("descricao") ?? "").trim();

  const erro = validarNomeProjeto(nome);
  if (erro) {
    redirect(`/projetos?erro=${encodeURIComponent(erro)}`);
  }

  await prisma.projeto.create({
    data: {
      nome,
      descricao: descricao || null,
      dataCriacao: new Date(),
      usuarioProjetos: {
        create: {
          idUsuario: usuario!.idUsuario,
          papelNoProjeto: "DONO",
        },
      },
    },
  });

  revalidatePath("/projetos");
}
