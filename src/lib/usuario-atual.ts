import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function getUsuarioAtual() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const usuario = await prisma.usuario.findUnique({
    where: { authUserId: user.id },
    include: { perfil: true },
  });

  // Conta desativada com sessão ainda aberta: a rota encerra a sessão, porque
  // um Server Component não pode alterar os cookies de autenticação.
  if (usuario && usuario.status !== "ATIVO") redirect("/conta-inativa");

  return usuario;
}

export async function exigirAdmin() {
  const usuario = await getUsuarioAtual();
  if (!usuario) redirect("/login");
  if (usuario.perfil.nome !== "ADMINISTRADOR") redirect("/projetos");
  return usuario;
}
