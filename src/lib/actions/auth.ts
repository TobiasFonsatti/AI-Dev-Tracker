"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { validarCadastro } from "@/lib/validacoes";

export async function cadastrar(formData: FormData) {
  const nome = String(formData.get("nome") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const senha = String(formData.get("senha") ?? "");

  const erroValidacao = validarCadastro(nome, email, senha);
  if (erroValidacao) {
    redirect(`/cadastro?erro=${encodeURIComponent(erroValidacao)}`);
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({ email, password: senha });

  if (error || !data.user) {
    redirect(`/cadastro?erro=${encodeURIComponent(error?.message ?? "Não foi possível cadastrar.")}`);
  }

  const perfilDesenvolvedor = await prisma.perfil.findUnique({
    where: { nome: "DESENVOLVEDOR" },
  });

  if (!perfilDesenvolvedor) {
    redirect(
      `/cadastro?erro=${encodeURIComponent(
        "Perfil padrão não encontrado — rode o seed do banco (npm run db:seed)."
      )}`
    );
  }

  await prisma.usuario.create({
    data: {
      authUserId: data.user!.id,
      nome,
      email,
      idPerfil: perfilDesenvolvedor!.idPerfil,
    },
  });

  redirect("/login?cadastro=ok");
}

export async function entrar(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const senha = String(formData.get("senha") ?? "");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password: senha });

  if (error) {
    redirect(`/login?erro=${encodeURIComponent("E-mail ou senha inválidos.")}`);
  }

  redirect("/projetos");
}

export async function sair() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
