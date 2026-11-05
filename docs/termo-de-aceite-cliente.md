# Termo de Aceite do Cliente — Rastreador de Uso de IA no Desenvolvimento

**Cliente/PO:** Tobias Gomide Fonsatti (RA 2840482421046), Product Owner (Trilha A1)  
**Equipe:** Artur Feiteiro Ruiz (RA 2840482421032) — Tobias Gomide Fonsatti (RA 2840482421046)  
**Data:** 05/11/2026  

## 1. Escopo avaliado (comparado ao Termo de Aceite do Projeto — E2)

| Funcionalidade aceita na E2 | Entregue? | Observação do cliente |
|---|---|---|
| Autenticação e perfis com controle de permissões | Sim | Supabase Auth integrado com tabela `perfil` e permissões por tela |
| Cadastro de projetos e tarefas | Sim | Vinculação consistente e verificação de permissão de acesso |
| Gestão de usuários e do catálogo de ferramentas de IA | Sim | Telas administrativas `/admin/usuarios` e `/admin/ferramentas-ia` |
| Registro de sessão de desenvolvimento | Sim | Formulário dinâmico em `/sessoes/nova` com toggle condicional |
| Avaliação da experiência por sessão | Sim | Escala 1 a 5 para produtividade, dificuldade, confiança e dimensões estendidas de IA |
| Identificação automática de situações de atenção | Sim | Cálculo automático a partir das sessões recentes com IA |
| Histórico pessoal de sessões e indicadores | Sim | Visualização em `/historico` com filtros de projeto e período |
| Dashboard com filtros por projeto, desenvolvedor e período | Sim | Visão agregada em `/dashboard` restrita a gestores e administradores |
| Visualização e acompanhamento de situações de atenção | Sim | Painel de alertas com registro de observações e encerramento |
| Validações consistentes em interface e banco | Sim | 11 constraints CHECK aplicadas no PostgreSQL e validações em Server Actions |
| Deploy público por URL e README completo | Sim | Container Docker configurado e documentação detalhada no README |

## 2. Ressalvas / pendências

- O deploy final com domínio próprio e certificado HTTPS está pronto via Docker e em fase de apontamento externo para a apresentação final (E10 e Feira).
- Testes unitários cobrem 47 cenários de negócio; a suíte de testes de integração ponta a ponta pode ser expandida conforme evolução da esteira CI.

## 3. Parecer

- [ ] Aceito sem ressalvas
- [x] Aceito com ressalvas (listadas acima, não bloqueantes)
- [ ] Não aceito — motivo: [...]

## 4. Assinatura

- **Cliente/PO:** Tobias Gomide Fonsatti
