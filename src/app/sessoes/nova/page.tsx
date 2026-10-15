import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getUsuarioAtual } from "@/lib/usuario-atual";
import FormularioNovaSessao from "./formulario";

interface Props {
  searchParams: Promise<{ erro?: string }>;
}

export default async function NovaSessaoPage({ searchParams }: Props) {
  const usuario = await getUsuarioAtual();
  if (!usuario) redirect("/login");

  const params = await searchParams;

  // Carregar projetos onde o usuário participa
  const projetos = await prisma.projeto.findMany({
    where: {
      usuarioProjetos: {
        some: { idUsuario: usuario.idUsuario },
      },
    },
    select: { idProjeto: true, nome: true },
    orderBy: { nome: "asc" },
  });

  const tarefas = await prisma.tarefa.findMany({
    where: {
      idProjeto: { in: projetos.map((p) => p.idProjeto) },
    },
    select: { idTarefa: true, titulo: true, idProjeto: true },
    orderBy: { titulo: "asc" },
  });

  const ferramentas = await prisma.ferramentaIa.findMany({
    where: { ativa: true },
    select: { idFerramenta: true, nome: true },
    orderBy: { nome: "asc" },
  });

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Registrar Sessão de Desenvolvimento</h1>
        <p className="text-sm text-gray-600 mt-1">
          Documente seu período de trabalho, o uso de IA e registre sua avaliação de experiência.
        </p>
      </div>

      <FormularioNovaSessao
        projetos={projetos}
        tarefas={tarefas}
        ferramentas={ferramentas}
        erro={params.erro}
      />
    </main>
  );
}
