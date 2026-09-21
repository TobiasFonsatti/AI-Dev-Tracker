import { redirect } from "next/navigation";
import { getUsuarioAtual } from "@/lib/usuario-atual";

export default async function Home() {
  const usuario = await getUsuarioAtual();
  redirect(usuario ? "/projetos" : "/login");
}
