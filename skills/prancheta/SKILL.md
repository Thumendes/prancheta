---
name: prancheta
description: Gera wireframes mid-fi como arquivos HTML e exporta cada tela em PNG (desktop 1440 e mobile 390) via Puppeteer headless rodando em Bun, depois de uma sessão de validação com o usuário. Use SEMPRE que alguém pedir wireframe, wireframes, mockup, esboço de tela, protótipo de baixa/média fidelidade, "desenha a tela de X", "como ficaria a interface de Y", "quero ver o layout antes de codar", ou documentação de processo que precise de imagens de telas — mesmo que não digam a palavra "wireframe".
---

# prancheta

Wireframe é uma pergunta em forma de desenho: ele existe para que uma decisão
de produto seja tomada antes de alguém escrever CSS de verdade. Esta skill
transforma um pedido vago em telas HTML mid-fi e depois em PNGs, passando por
uma validação explícita — porque gerar doze telas em cima de um briefing errado
é o desperdício mais caro do processo.

Conduza como designer de IHC: trate usabilidade, estados e acessibilidade como
parte do desenho, não como polimento posterior.

Nas referências abaixo, `$SKILL` é a pasta onde esta skill está instalada
(ex.: `~/.claude/skills/prancheta`).

---

## Fluxo

```
0 · bun ok?  →  1 · briefing  →  2 · mesa  →  3 · validação  →
4 · telas  →  5 · revisão  →  6 · captura  →  7 · entrega
```

Não pule a etapa 3. É ela que paga por todas as outras.

---

## 0 · Conferir o Bun

Antes de qualquer coisa:

```bash
command -v bun >/dev/null && bun --version || echo "SEM_BUN"
```

**Se faltar**, não instale por conta própria — instalar runtime no shell é
decisão do dono da máquina. Peça a instalação com o comando oficial do sistema
dele, e explique que ele pode rodar direto do prompt colando `! ` na frente:

| Sistema | Comando (bun.sh) |
|---|---|
| macOS / Linux / WSL | `curl -fsSL https://bun.sh/install \| bash` |
| macOS com Homebrew | `brew install oven-sh/bun/bun` |
| Windows (PowerShell) | `powershell -c "irm bun.sh/install.ps1\|iex"` |

Depois de instalar, pode ser preciso abrir um terminal novo ou rodar
`source ~/.zshrc`. Confirme com `bun --version` antes de seguir.

**Dependências da captura** (uma vez por máquina — baixa o Chromium, ~90s):

```bash
[ -d "$SKILL/scripts/node_modules" ] || (cd "$SKILL/scripts" && bun install)
```

Se o Chromium não vier junto, `cd "$SKILL/scripts" && bunx puppeteer browsers install chrome`.

---

## 1 · Briefing

Leia **`references/briefing.md`**. Ele traz o semáforo (verde/amarelo/vermelho),
as seis dimensões a cobrir e o banco de perguntas.

O princípio que governa esta etapa: **toda pergunta vai acompanhada da sua
recomendação**. "Vou assumir tabela em vez de cartões, porque os valores são
comparáveis entre si — te serve?" custa ao usuário um "sim"; "como você quer
listar?" custa uma decisão de design que ele te contratou para tomar.

Cubra objetivo, persona, fluxo, dados, estados e as dúvidas de componente.
Pare quando conseguir preencher o mapa de telas:

| # | Tela | Papel | Estado retratado | Ação primária | Decisão que resolve |
|---|------|-------|------------------|---------------|---------------------|

Use uma rodada de perguntas, não três. Agrupe tudo o que precisa em uma
mensagem só, com as suas sugestões já embutidas.

---

## 2 · Montar a mesa

```bash
SLUG=<slug-do-projeto>
WORK=".prancheta/$SLUG"          # rascunho, descartável
OUT="wireframes/$SLUG"           # entrega
mkdir -p "$WORK" "$OUT"
cp "$SKILL/assets/prancheta.css" "$WORK/"
```

O `.prancheta/` fica no diretório de trabalho atual, não em `/tmp`: o usuário
precisa conseguir abrir os HTMLs no navegador e recarregar enquanto opina.
Sugira adicionar `.prancheta/` ao `.gitignore` — o que se versiona é o PNG.

Se o projeto já tiver um `wireframes/` ou uma pasta de documentação (`docs/images/`,
por exemplo), use a que existe em vez de criar outra.

---

## 3 · Sessão de validação

Copie `assets/validation.template.html` para `$WORK/validation.html` e preencha.
Ele tem três partes:

1. **Tela-piloto** — a tela mais representativa do fluxo, completa, usando a
   estrutura de `assets/template.html`. Escolha a que tem mais componentes:
   se o vocabulário funciona nela, funciona nas outras.
2. **Kit de componentes** — já vem pronto no template. Ajuste os rótulos para o
   domínio real (os exemplos falam de torneios; troque). É o vocabulário que
   será reusado em todas as telas.
3. **Mapa das telas** — a tabela do briefing.

Cada parte termina em um bloco `val-ask` com as perguntas específicas. Preencha
com dúvidas objetivas e a sua recomendação, não com "o que achou?".

Abra e apresente:

```bash
open "$WORK/validation.html"        # macOS  ·  Linux: xdg-open  ·  Windows: start
```

Na mensagem ao usuário, liste as decisões que você tomou sozinho e quer
confirmar — densidade, ação primária, nomenclatura do domínio, componentes em
dúvida. **Espere a resposta.** Ajuste o piloto e o kit quantas vezes precisar;
só passe para a etapa 4 com um "pode seguir".

Enquanto o usuário olha, não fique parado: rascunhe as telas seguintes na sua
cabeça, e prepare a lista do que muda se ele responder diferente.

---

## 4 · Gerar as telas

Leia **`references/componentes.md`** antes de escrever markup — ele tem a API
completa das classes `pr-` e os erros que custam caro (`data-label` nos `<td>`,
rótulo visível, `aria-current`).

Regras de arquivo:

- **Uma tela por arquivo**, nomeado `NN-slug.html` na ordem do fluxo
  (`01-lista-torneios.html`, `02-criar-torneio.html`).
- Base: `assets/template.html`. Um `pr-screen` por arquivo.
- `<link rel="stylesheet" href="prancheta.css">` — caminho relativo, o CSS está
  na mesma pasta.
- **Nenhum recurso externo.** Sem CDN, sem Google Fonts, sem `<img>` remota: a
  captura roda em `file://` e o que não carregar vira espaço em branco no PNG.
- Preencha o `pr-caption` com número, nome, rota, papel e estado retratado.

Regras de conteúdo:

- **Dados plausíveis do domínio real.** "Copa de Verão 2026 · 32 inscritos"
  ensina algo; "Item 1 · Lorem ipsum" não ensina nada. Inclua um caso feio:
  nome que quebra linha, lista de um item, valor zero.
- **Uma ação primária por tela.** Duas significam que a tela faz duas coisas.
- **Estados**: a tela de lista principal ganha um par com o estado vazio.
  Carregando e erro podem ficar anotados na `pr-notelist` em vez de virarem
  PNG, se o usuário não pediu.
- **Consistência**: mesmo componente para o mesmo problema, mesmo vocabulário
  em todas as telas, barra e menu idênticos com o item certo marcado.

O mesmo arquivo vira desktop e mobile — o CSS já resolve o breakpoint de 560px.
Não escreva dois HTMLs para a mesma tela.

---

## 5 · Revisar

Leia **`references/revisao.md`** e passe cada tela pela lista: tarefa, conteúdo,
estados, acessibilidade, mobile, consistência, técnico. Corrija no HTML.

Capturar antes de revisar só produz um PNG errado mais rápido.

---

## 6 · Capturar

```bash
cd "$SKILL/scripts"
bun run shoot.ts "<caminho-abs-do-WORK>" --out "<caminho-abs-do-OUT>"
```

Padrão: `desktop` (1440×900) e `mobile` (390×844), página inteira, `@2x`.
Sai `01-lista-torneios-desktop.png` e `01-lista-torneios-mobile.png`.

| Flag | Efeito |
|---|---|
| `--viewports desktop,mobile,tablet,wide` | quais tamanhos (`tablet` 768, `wide` 1920) |
| `--scale 1` | PNG menor, sem retina |
| `--notes` | liga as anotações numeradas |
| `--bare` | tira a tarja de título — para embutir o PNG em outro documento |
| `--no-full` | captura só a dobra, não a página inteira |
| `--all` | inclui o `validation.html` (por padrão é pulado) |

O script avisa se o `prancheta.css` não carregou em alguma tela. Trate o aviso:
um PNG sem estilo é retrabalho garantido.

**Olhe os PNGs gerados**, principalmente os de 390px. É onde aparecem os
problemas que o desktop esconde — tabela sem rótulo, ação fora do alcance,
barra inferior lotada.

---

## 7 · Entregar

Liste o que foi gerado, agrupado por tela, e diga onde está. Vale fechar com:

- o que ficou **fora do escopo** e por quê (estados não desenhados, telas de
  segunda ordem);
- as **decisões em aberto** que o wireframe expôs e que alguém precisa tomar;
- a oferta de rodar de novo com ajustes — o HTML fica em `$WORK`, então
  reimprimir custa segundos.

Se o projeto tem documentação de processo, ofereça referenciar os PNGs lá.

---

## Repetindo depois

Os `.html` ficam em `.prancheta/<slug>/`. Para ajustar uma tela: edite o HTML,
rode o `shoot` de novo apontando só para aquele arquivo. Não é preciso refazer
o briefing nem a validação.

```bash
bun run shoot.ts "<WORK>/03-detalhe.html" --out "<OUT>"
```
