# Revisão — passe isto antes de capturar

Rodar Puppeteer em um wireframe errado só produz um PNG errado mais rápido.
Leia cada tela gerada contra esta lista. Corrija no HTML, não no PNG.

## 1 · Tarefa

- [ ] A tela tem **uma** ação primária, e ela é a mais visível do conteúdo.
- [ ] Dá para dizer, olhando o PNG, qual tarefa a pessoa está no meio de fazer.
- [ ] Existe caminho de saída: cancelar, voltar, ou fechar. Nenhuma tela é um beco.
- [ ] O título da página responde "onde estou" sem depender do menu.

## 2 · Conteúdo

- [ ] Dados são **plausíveis do domínio**, não "Lorem ipsum" nem "Item 1".
- [ ] Há pelo menos um caso feio: nome longo, valor zero, lista de um item só.
- [ ] Números têm unidade ou rótulo. "128" sozinho não informa nada.
- [ ] Texto de botão é verbo + objeto ("Criar torneio"), não "OK" ou "Enviar".
- [ ] Nada em inglês se o produto é em português — inclusive rótulo de status.

## 3 · Estados

- [ ] A tela de lista principal tem um par retratando o estado **vazio**.
- [ ] Carregando e erro estão desenhados ou anotados na `pr-notelist`.
- [ ] Erro de formulário mostra **o que fazer**, não só "campo inválido".
- [ ] Ação destrutiva diz o que se perde e oferece cancelar ou desfazer.

## 4 · Acessibilidade

- [ ] Todo campo tem `<label for>` visível. Nenhum placeholder fazendo de rótulo.
- [ ] Ajuda e erro ligados por `aria-describedby`; erro também com `aria-invalid`.
- [ ] Estado nunca depende só de cor — `pr-badge` com variante (`ok`/`warn`/`err`/`wait`).
- [ ] Item ativo marcado com `aria-current`, não com classe visual.
- [ ] Botão que só tem ícone tem `aria-label`.
- [ ] Ordem do HTML = ordem de leitura e de tabulação.
- [ ] Um `<h1>` por tela; hierarquia de `<h2>`/`<h3>` sem pular nível.
- [ ] Há `pr-skiplink` quando a tela tem navegação longa antes do conteúdo.

## 5 · Mobile (olhe o PNG de 390, sempre)

- [ ] Todo `<td>` tem `data-label` — senão os cartões saem sem rótulo.
- [ ] A barra inferior tem no máximo 5–6 destinos, ordenados por frequência.
- [ ] A ação primária está alcançável com o polegar (rodapé fixo ou `pr-fab`).
- [ ] Nada fica cortado na horizontal.
- [ ] Alvos de toque com pelo menos 44px.

## 6 · Consistência entre telas

- [ ] Mesmo componente para o mesmo problema em todas as telas.
- [ ] Mesmo vocabulário: se é "torneio" na lista, não vira "campeonato" no detalhe.
- [ ] Barra superior e menu idênticos, com o item certo marcado em cada tela.
- [ ] A numeração do `pr-caption` bate com o mapa de telas do `validation.html`.

## 7 · Técnico

- [ ] `prancheta.css` está na mesma pasta dos `.html` (o `shoot` avisa se não).
- [ ] Nenhum recurso externo: sem CDN, sem fonte remota, sem `<img src="http…">`.
      A captura roda com `file://` e offline — link externo vira espaço em branco.
- [ ] Um `pr-screen` por arquivo.
- [ ] Nome do arquivo em `NN-slug.html`, na ordem do fluxo.
