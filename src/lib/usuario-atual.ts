import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function getUsuarioAtual() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  return prisma.usuario.findUnique({
    where: { authUserId: user.id },
    include: { perfil: true },
  });
}

export async function exigirAdmin() {
  const usuario = await getUsuarioAtual();
  if (!usuario) redirect("/login");
  if (usuario.perfil.nome !== "ADMINISTRADOR") redirect("/projetos");
  return usuario;
}
