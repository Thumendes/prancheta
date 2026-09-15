# Componentes — referência do `prancheta.css`

Todas as classes têm prefixo `pr-`. O CSS não tem JavaScript: sobreposições
(modal, menu, drawer) são desenhadas inline, porque o print precisa mostrar o
estado, não simulá-lo.

**Índice:** [Moldura](#moldura) · [Navegação](#navegação) · [Conteúdo](#conteúdo) ·
[Tabela e lista](#tabela-e-lista) · [Formulário](#formulário) · [Ações](#ações-e-sinalização) ·
[Estados](#estados) · [Sobreposições](#sobreposições) · [Fluxo](#fluxo) ·
[Acessibilidade](#acessibilidade-visível) · [Mobile](#mobile) · [Utilitários](#utilitários)

---

## Moldura

```html
<div class="pr-screen">
  <div class="pr-caption">
    <b>01 · Lista de torneios</b>
    <span>/torneios</span>
    <em class="pr-caption-meta">Organizador · com dados</em>
  </div>
  <header class="pr-appbar">…</header>
  <div class="pr-body">
    <nav class="pr-sidebar">…</nav>
    <main class="pr-main">…</main>
  </div>
</div>
```

- `pr-screen` — raiz de toda tela. Uma tela por arquivo `.html`.
- `pr-caption` — tarja preta que rotula o artefato. `<body class="bare">` esconde.
- `pr-body` — linha com sidebar + main; vira coluna no mobile.
- `pr-main` — `.flush` remove o padding quando o conteúdo é uma tabela de borda a borda.

## Navegação

| Classe | Uso |
|---|---|
| `pr-appbar` + `pr-logo` + `pr-appbar-nav` + `pr-appbar-end` | barra superior, 60px |
| `pr-sidebar` + `pr-sidebar-group` + `pr-nav-item` | menu lateral 248px → barra inferior no mobile |
| `pr-breadcrumb` (`<ol><li>`) | trilha; só quando há hierarquia real |
| `pr-tabs` + `pr-tab` | seções de um mesmo objeto |

Item ativo: `aria-current="page"` (nav) / `aria-selected="true"` (aba). O CSS
lê o atributo — não use classe `.active`, o atributo é o que o leitor de tela
anuncia.

No mobile a sidebar vira barra inferior e **só os 6 primeiros itens aparecem**.
Ordene por frequência de uso, não por hierarquia de organograma.

## Conteúdo

```html
<div class="pr-pagehead">
  <div class="pr-pagehead-text">
    <h1>Torneios</h1>
    <p>Gerencie inscrições e chaveamento.</p>
  </div>
  <div class="pr-pagehead-actions"><button class="pr-btn primary">Criar torneio</button></div>
</div>
```

- `pr-card` + `pr-card-head` — bloco com borda e título.
- `pr-grid` + `.cols-2` `.cols-3` `.cols-4` `.sidebar-right` — grade; tudo vira 1 coluna no mobile.
- `pr-stat` (`<dl><dt><dd>`) + `pr-delta` — métrica.
- `pr-thumb` (`.square`) — placeholder de imagem com proporção fixa.

## Tabela e lista

```html
<table class="pr-table">
  <caption>32 torneios</caption>
  <thead><tr><th aria-sort="ascending">Nome</th><th>Status</th><th class="num">Inscritos</th><th></th></tr></thead>
  <tbody>
    <tr>
      <td data-label="Nome">Copa de Verão</td>
      <td data-label="Status"><span class="pr-badge ok">Aberto</span></td>
      <td data-label="Inscritos" class="num">32</td>
      <td><div class="pr-rowactions"><button class="pr-btn sm">Abrir</button></div></td>
    </tr>
  </tbody>
</table>
```

**`data-label` em todo `<td>` é obrigatório.** No mobile a tabela vira cartões
empilhados e o `data-label` é o único rótulo que sobra — sem ele o PNG mobile
sai com números soltos.

- `.num` — alinha à direita com numerais tabulares.
- `pr-toolbar` + `pr-toolbar-end` — busca e filtros acima da tabela.
- `pr-pagination` + `pr-pages` — rodapé de paginação.
- `pr-list` + `pr-list-item` + `pr-list-item-text` — alternativa a tabela quando
  cada item tem título + subtítulo em vez de colunas comparáveis.

## Formulário

```html
<form class="pr-form">
  <div class="pr-field">
    <label for="nome">Nome do torneio <span class="pr-req">(obrigatório)</span></label>
    <input class="pr-input" id="nome" aria-describedby="nome-h" value="Copa de Verão 2026">
    <small class="pr-help" id="nome-h">Aparece na busca pública.</small>
  </div>

  <div class="pr-fieldrow">
    <div class="pr-field">
      <label for="ini">Início</label>
      <input class="pr-input" id="ini" value="10/03/2026">
    </div>
    <div class="pr-field">
      <label for="fim">Fim</label>
      <input class="pr-input" id="fim" aria-invalid="true" aria-describedby="fim-e" value="01/03/2026">
      <small class="pr-error" id="fim-e">A data de fim é anterior ao início.</small>
    </div>
  </div>

  <div class="pr-formactions">
    <button class="pr-btn ghost">Salvar rascunho</button>
    <span class="pr-spacer"></span>
    <button class="pr-btn">Cancelar</button>
    <button class="pr-btn primary">Publicar</button>
  </div>
</form>
```

Regras que o CSS não impõe mas o wireframe precisa honrar:

- **Rótulo sempre visível acima do campo.** Placeholder como rótulo desaparece
  ao digitar e some para o leitor de tela.
- `aria-describedby` liga ajuda e erro ao campo; sem isso o erro não é anunciado.
- `aria-invalid="true"` desenha a borda grossa — estado de erro não depende de cor.
- Marque o **obrigatório**, não o opcional, quando a maioria for obrigatória (e vice-versa).

Outros: `pr-select`, `pr-textarea`, `pr-inputgroup` (campo + botão colado),
`pr-choice` / `pr-choicegroup` (radio, checkbox, com `<small>` de descrição),
`pr-switch` com `data-on="true"`, `pr-chip` com `aria-pressed`.

## Ações e sinalização

`pr-btn` + modificadores: `primary` · `ghost` · `danger` · `sm` · `icon` · `block` · `[disabled]`.

**Uma `primary` por tela.** Se houver duas, a hierarquia da tarefa não está resolvida
— é sinal de que a tela faz duas coisas e talvez deva ser duas telas.

`pr-badge` + `ok` `warn` `err` `wait` — cada variante injeta um glifo antes do
rótulo (✔ ▲ ✕ ◷), então o estado sobrevive em cinza e para daltônicos.
`.solid` e `.outline` ajustam o peso visual.

`pr-avatar` (`.lg`), `pr-chip`, `pr-progress > i[style=width:%]`.

## Estados

Toda tela que carrega dados precisa dos quatro. Desenhe pelo menos o **vazio**
como tela separada; ele é o primeiro contato de todo usuário novo.

```html
<div class="pr-empty">
  <div class="pr-empty-art"></div>
  <h3>Nenhum torneio ainda</h3>
  <p>Crie o primeiro para abrir inscrições.</p>
  <button class="pr-btn primary">Criar torneio</button>
</div>
```

- `pr-skeletonstack` > `pr-skeleton` (`.line-sm` `.line-md` `.block`) — carregando.
- `pr-alert` + `warn` `err` `ok` — mensagem persistente na página.
- `pr-toast` — confirmação transitória; o lugar do "Desfazer".

Estado vazio bom tem três partes: **o que está faltando**, **por quê**, e **a
ação que resolve**. "Nenhum resultado" sozinho é um beco sem saída.

## Sobreposições

Envolva a região em `pr-overlay` (cria o contexto de posicionamento) e coloque
`pr-scrim` + o componente dentro.

```html
<div class="pr-overlay">
  … a tela de fundo …
  <div class="pr-scrim"></div>
  <div class="pr-modal">
    <div class="pr-modal-head"><h2>Excluir torneio?</h2><button class="pr-btn ghost icon sm">✕</button></div>
    <div class="pr-modal-body">…</div>
    <div class="pr-modal-foot"><button class="pr-btn">Cancelar</button><button class="pr-btn danger">Excluir</button></div>
  </div>
</div>
```

`pr-drawer` (painel lateral 400px) e `pr-menu` (dropdown, precisa de `style="top/left"`)
seguem a mesma ideia. No mobile o modal vira folha ancorada embaixo.

Em modal de exclusão, diga **o que se perde**, não "esta ação é irreversível".

## Fluxo

```html
<div class="pr-stepper">
  <span class="pr-step" data-n="1" data-done="true"><span>Dados</span></span>
  <i class="pr-steprule"></i>
  <span class="pr-step" data-n="2" aria-current="step"><span>Formato</span></span>
</div>
```

## Acessibilidade visível

O que fica desenhado no wireframe (porque é decisão de design, não de implementação):

- `pr-focus` — força o anel de foco em um elemento, para mostrar como ele é.
- `pr-skiplink` — "Pular para o conteúdo"; o `pr-main` correspondente leva `id`.
- `pr-srlabel` — texto em mono descrevendo o que o leitor de tela anuncia.
- `pr-note` (`<span class="pr-note">1</span>`) + `pr-notelist` — anotações
  numeradas. Só aparecem com `<body class="notes">` ou `--notes` no shoot.

## Mobile

O **mesmo arquivo** vira o PNG de 390px — não escreva dois HTMLs. O breakpoint
é 560px e o CSS já resolve: sidebar → barra inferior, tabela → cartões, grade →
1 coluna, modal → folha, ações do formulário → empilhadas e grudadas embaixo.

Você controla o resto com:
- `pr-mobile-only` / `pr-desktop-only`
- `pr-fab` — ação flutuante; só existe abaixo de 560px

Confira sempre o PNG mobile antes de entregar: é onde aparecem os problemas
que o desktop esconde.

## Utilitários

`pr-row` `pr-col` `pr-between` `pr-wrap` `pr-muted` `pr-micro` `pr-hr` `pr-actions`
