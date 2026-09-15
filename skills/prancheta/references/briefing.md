# Briefing — descobrir antes de desenhar

Wireframe é uma pergunta em forma de desenho. Se você desenha sem saber quem
usa, o que a pessoa está tentando resolver e o que pode dar errado, o PNG sai
bonito e não decide nada. Esta referência é o roteiro para tirar o briefing do
estado "faz uma tela de cadastro" para algo desenhável.

## 1 · Semáforo do briefing

Classifique o pedido antes de qualquer outra coisa. A classificação define
quantas perguntas você faz.

| Sinal | O que já está no pedido | O que fazer |
|---|---|---|
| **Verde** | Fluxo, telas, papéis, dados e regras principais | Confirme 1–2 pontos e vá para a validação |
| **Amarelo** | Domínio e objetivo claros, faltam telas/estados/dados | 3–5 perguntas, cada uma com sua recomendação embutida |
| **Vermelho** | Só um substantivo ("um dashboard", "tela de login") | 4–6 perguntas, começando por objetivo e persona |

Em amarelo e vermelho, **nunca faça só a pergunta**. Pergunte junto com a
sugestão — "Vou assumir X; te serve?" é mais rápido de responder do que
"o que você quer?", e o usuário corrige com menos esforço do que inventa.

## 2 · As seis dimensões

Pergunte na ordem. Pare quando o desenho já estiver determinado — perguntar
demais é tão ruim quanto perguntar de menos.

### 2.1 Objetivo e sucesso
Qual tarefa a pessoa completa aqui, e como ela sabe que deu certo?
Sem isso não há ação primária, e sem ação primária a tela não tem hierarquia.

> "Entendi como 'o organizador publica um torneio e passa a receber inscrições'
> — o sucesso é o link público ficar disponível. Confere?"

### 2.2 Persona e contexto de uso
Quem usa, com que frequência, em que dispositivo, sob que pressão.
Usuário diário tolera densidade; usuário eventual precisa de orientação.
Uso em pé no celular muda o alvo de toque e a posição da ação primária.

> "Imagino dois papéis: organizador (uso semanal, desktop) e participante
> (uso pontual, celular). O mobile é prioridade para o participante?"

### 2.3 Fluxo e telas
Liste as telas como passos de uma tarefa, não como itens de menu.
Toda tela de gestão tem um ponto de entrada (a lista) antes do detalhe.

> "Mapeei 5 telas: lista → criar (3 passos) → detalhe → confirmação de
> exclusão. Falta alguma bifurcação, tipo editar depois de publicado?"

### 2.4 Dados na tela
Quais campos aparecem, quais são obrigatórios, quais são calculados, o que
é longo, o que é numérico. Wireframe com "Lorem ipsum" não revela nada:
**use dados plausíveis do domínio real**, inclusive um caso feio (nome longo,
valor negativo, lista com 1 item).

> "Na tabela vou mostrar nome, status, nº de inscritos e data. Falta preço
> ou responsável?"

### 2.5 Estados
Toda tela que carrega dados tem quatro: **vazio, carregando, com dados, erro**.
Além disso: permissão negada, offline, resultado de busca vazio, limite atingido.
Decida quais viram tela separada e quais ficam anotados.

> "Vou desenhar a lista com dados e o estado vazio como tela separada.
> Carregando e erro eu deixo anotado. Quer os quatro em PNG?"

### 2.6 Componentes em dúvida
É aqui que o retrabalho nasce. Quando um dado pode ser exposto de mais de uma
forma, pergunte com a recomendação e o motivo — uma frase de trade-off basta.

> "Para escolher a data eu usaria campo com máscara + calendário opcional, em
> vez de só calendário: digitar é mais rápido para quem já sabe a data.
> Ok assim?"
>
> "Os filtros: barra sempre visível (bom para até 4 filtros) ou painel lateral
> retrátil (melhor se forem muitos)? Pelo que vi, 3 filtros — fico na barra."

## 3 · Dúvidas de componente que valem perguntar

Estes são os pontos em que a escolha errada custa caro depois:

- **Lista**: tabela (comparar valores) vs. cartões (escanear visual) vs. lista simples
- **Navegação**: abas (poucas seções, troca frequente) vs. menu lateral (muitas seções)
- **Formulário longo**: página única com seções vs. passos (stepper) vs. salvar rascunho
- **Criar/editar**: página inteira (muitos campos) vs. modal (até ~5 campos) vs. drawer
- **Escolha**: radio (2–5 opções visíveis) vs. select (6+) vs. busca com autocomplete (20+)
- **Ação destrutiva**: confirmação modal vs. desfazer no toast — desfazer é melhor quando reverter é barato
- **Busca**: instantânea vs. com botão — instantânea exige resposta rápida
- **Quantidade**: paginação (o usuário precisa saber "quantos") vs. rolagem infinita
- **Feedback**: toast (transitório) vs. alerta na página (persistente) vs. inline no campo

## 4 · Fechamento do briefing

Antes de gerar, você precisa conseguir preencher esta tabela. Se alguma célula
estiver vazia, falta uma pergunta.

| # | Tela | Papel | Estado retratado | Ação primária | Decisão que ela resolve |
|---|------|-------|------------------|---------------|-------------------------|

Mostre a tabela ao usuário junto com o `validation.html`. É o contrato do
que será gerado.
