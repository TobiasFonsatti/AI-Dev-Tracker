import Link from "next/link";

export const metadata = { title: "Aviso de Privacidade — AI-Dev-Tracker" };

export default function PrivacidadePage() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-4 py-10 text-sm leading-relaxed">
      <h1 className="text-2xl font-semibold">Aviso de Privacidade</h1>

      <p>
        O AI-Dev-Tracker é um projeto acadêmico do Laboratório de Engenharia de Software (ADS,
        Fatec Ribeirão Preto). Este aviso explica, conforme a LGPD (Lei nº 13.709/2018), quais
        dados são tratados e por quê.
      </p>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold">Dados coletados</h2>
        <ul className="list-disc pl-5">
          <li>
            Conta: nome, e-mail e perfil de acesso. A senha fica com o serviço de autenticação e
            não é guardada pela aplicação.
          </li>
          <li>
            Trabalho: projetos, tarefas e sessões de desenvolvimento, com data, duração e
            ferramentas de IA usadas.
          </li>
          <li>
            Percepção: notas de produtividade, dificuldade, confiança, foco, fluidez e feedback,
            além de observações.
          </li>
        </ul>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold">Finalidade</h2>
        <p>
          Os dados servem para mostrar seu histórico, gerar indicadores da equipe e identificar
          situações de atenção, para que você receba apoio. Eles não são vendidos nem usados para
          publicidade.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold">Quem tem acesso</h2>
        <p>
          Cada desenvolvedor vê os próprios dados. Gestores e administradores veem os indicadores
          da equipe e as situações de atenção. Os dados ficam em um provedor de banco de dados e
          autenticação contratado para operar a plataforma.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold">Seus direitos</h2>
        <p>
          Você pode pedir acesso, correção ou exclusão dos seus dados ao administrador da
          plataforma. O único cookie usado é o de sessão, necessário para manter você conectado.
        </p>
      </section>

      <Link href="/cadastro" className="underline">
        Voltar ao cadastro
      </Link>
    </main>
  );
}
