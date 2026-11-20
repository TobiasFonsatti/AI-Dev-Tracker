"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { exigirAdmin, getUsuarioAtual } from "@/lib/usuario-atual";
import { logAcao } from "@/lib/actions/log";

const STATUS_USUARIO_VALIDOS = ["ATIVO", "INATIVO"];

export async function alternarStatusUsuario(formData: FormData) {
  await exigirAdmin();

  const idUsuario = Number(formData.get("idUsuario"));
  const novoStatus = String(formData.get("novoStatus"));
  if (!STATUS_USUARIO_VALIDOS.includes(novoStatus)) return;

  await prisma.usuario.update({
    where: { idUsuario },
    data: { status: novoStatus },
  });

  await logAcao({
    acao: "ALTERAR_STATUS",
    tabela: "Usuario",
    registroId: String(idUsuario),
    novoValor: { status: novoStatus },
  });

  revalidatePath("/admin/usuarios");
}

export async function alterarPerfilUsuario(formData: FormData) {
  await exigirAdmin();

  const idUsuario = Number(formData.get("idUsuario"));
  const idPerfil = Number(formData.get("idPerfil"));
  if (!idUsuario || !idPerfil) return;

  const target = await prisma.usuario.findUnique({
    where: { idUsuario },
    include: { perfil: true },
  });
  if (!target) return;

  if (target.perfil.nome === "ADMINISTRADOR") return;

  const newPerfil = await prisma.perfil.findUnique({ where: { idPerfil } });
  if (!newPerfil) return;
  if (newPerfil.nome === "ADMINISTRADOR") return;

  await prisma.usuario.update({
    where: { idUsuario },
    data: { idPerfil },
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

export async function excluirItem(formData: FormData) {
  const usuario = await getUsuarioAtual();
  if (!usuario) throw new Error("Não autenticado");

  const modelo = String(formData.get("modelo") ?? "");
  const id = Number(formData.get("id"));
  if (!modelo || !Number.isInteger(id) || id <= 0) {
    return { success: false as const, message: "Registro inválido." };
  }

  const isAdmin = usuario.perfil?.nome === "ADMINISTRADOR";

  if (modelo === "usuario") {
    if (!isAdmin) throw new Error("Sem permissão");
    const sessoes = await prisma.sessaoDesenvolvimento.findMany({
      where: { idUsuario: id },
      select: { idSessao: true },
    });
    const sessaoIds = sessoes.map((sessao: { idSessao: number }) => sessao.idSessao);

    await prisma.$transaction([
      prisma.sessaoFerramenta.deleteMany({ where: { idSessao: { in: sessaoIds } } }),
      prisma.avaliacaoSessao.deleteMany({ where: { idSessao: { in: sessaoIds } } }),
      prisma.situacaoAtencao.deleteMany({
        where: { OR: [{ idUsuario: id }, { idSessao: { in: sessaoIds } }] },
      }),
      prisma.sessaoDesenvolvimento.deleteMany({ where: { idSessao: { in: sessaoIds } } }),
      prisma.usuarioTarefa.deleteMany({ where: { idUsuario: id } }),
      prisma.usuarioProjeto.deleteMany({ where: { idUsuario: id } }),
      prisma.usuario.delete({ where: { idUsuario: id } }),
    ]);
    revalidatePath("/admin/usuarios");
    return { success: true as const };
  }

  if (modelo === "projeto") {
    const projeto = await prisma.projeto.findUnique({
      where: { idProjeto: id },
      include: { usuarioProjetos: { where: { idUsuario: usuario.idUsuario } } },
    });
    if (!projeto) {
      return { success: false as const, message: "Projeto não encontrado." };
    }
    const isMember = projeto.usuarioProjetos.length > 0;
    if (!isAdmin && !isMember) throw new Error("Sem permissão");
    const sessoes = await prisma.sessaoDesenvolvimento.findMany({
      where: { idProjeto: id },
      select: { idSessao: true },
    });
    const tarefas = await prisma.tarefa.findMany({
      where: { idProjeto: id },
      select: { idTarefa: true },
    });
    const sessaoIds = sessoes.map((sessao: { idSessao: number }) => sessao.idSessao);
    const tarefaIds = tarefas.map((tarefa: { idTarefa: number }) => tarefa.idTarefa);

    await prisma.$transaction([
      prisma.sessaoFerramenta.deleteMany({ where: { idSessao: { in: sessaoIds } } }),
      prisma.avaliacaoSessao.deleteMany({ where: { idSessao: { in: sessaoIds } } }),
      prisma.situacaoAtencao.deleteMany({ where: { idSessao: { in: sessaoIds } } }),
      prisma.sessaoDesenvolvimento.deleteMany({ where: { idSessao: { in: sessaoIds } } }),
      prisma.usuarioTarefa.deleteMany({ where: { idTarefa: { in: tarefaIds } } }),
      prisma.tarefa.deleteMany({ where: { idTarefa: { in: tarefaIds } } }),
      prisma.usuarioProjeto.deleteMany({ where: { idProjeto: id } }),
      prisma.projeto.delete({ where: { idProjeto: id } }),
    ]);
    revalidatePath("/projetos");
    return { success: true as const };
  }

  if (modelo === "sessao") {
    const sessao = await prisma.sessaoDesenvolvimento.findUnique({
      where: { idSessao: id },
    });
    if (!sessao) {
      return { success: false as const, message: "Sessão não encontrada." };
    }
    if (!isAdmin && sessao.idUsuario !== usuario.idUsuario)
      throw new Error("Sem permissão");
    await prisma.$transaction([
      prisma.sessaoFerramenta.deleteMany({ where: { idSessao: id } }),
      prisma.avaliacaoSessao.deleteMany({ where: { idSessao: id } }),
      prisma.situacaoAtencao.deleteMany({ where: { idSessao: id } }),
      prisma.sessaoDesenvolvimento.delete({ where: { idSessao: id } }),
    ]);
    revalidatePath("/sessoes");
    return { success: true as const };
  }

  if (modelo === "tarefa") {
    // Tarefa não possui idUsuario diretamente — verificamos via UsuarioTarefa
    const vinculo = await prisma.usuarioTarefa.findFirst({
      where: { idTarefa: id, idUsuario: usuario.idUsuario },
    });
    if (!isAdmin && !vinculo) throw new Error("Sem permissão");
    const sessoes = await prisma.sessaoDesenvolvimento.findMany({
      where: { idTarefa: id },
      select: { idSessao: true },
    });
    const sessaoIds = sessoes.map((sessao: { idSessao: number }) => sessao.idSessao);

    await prisma.$transaction([
      prisma.sessaoFerramenta.deleteMany({ where: { idSessao: { in: sessaoIds } } }),
      prisma.avaliacaoSessao.deleteMany({ where: { idSessao: { in: sessaoIds } } }),
      prisma.situacaoAtencao.deleteMany({ where: { idSessao: { in: sessaoIds } } }),
      prisma.sessaoDesenvolvimento.deleteMany({ where: { idSessao: { in: sessaoIds } } }),
      prisma.usuarioTarefa.deleteMany({ where: { idTarefa: id } }),
      prisma.tarefa.delete({ where: { idTarefa: id } }),
    ]);
    revalidatePath("/tarefas");
    return { success: true as const };
  }

  return { success: false as const, message: "Tipo de registro inválido." };
}
