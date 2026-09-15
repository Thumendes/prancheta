# prancheta

Skill para Claude Code que gera **wireframes mid-fi** como HTML e exporta cada
tela em **PNG** (desktop 1440 e mobile 390) com Puppeteer headless rodando em
[Bun](https://bun.sh).

O nome vem da mesa de desenho técnico: o lugar onde a estrutura é resolvida
antes de alguém se preocupar com acabamento.

## O que ela faz

Em vez de cuspir doze telas em cima de um pedido vago, a skill conduz um fluxo
curto de designer de IHC:

1. **Briefing** — classifica o pedido (verde/amarelo/vermelho) e faz as
   perguntas que faltam, sempre com a recomendação já embutida.
2. **Validação** — gera um `validation.html` com a tela-piloto, o kit de
   componentes e o mapa das telas. Você aprova o vocabulário **uma vez**.
3. **Geração** — um `.html` por tela, dados plausíveis do domínio, estados
   vazio/carregando/erro, acessibilidade desenhada.
4. **Revisão** — checklist de tarefa, conteúdo, estados, a11y e mobile.
5. **Captura** — Puppeteer headless, dois PNGs por tela, `@2x`.

O mesmo arquivo HTML vira o PNG de desktop e o de mobile — o CSS resolve o
breakpoint em 560px (menu lateral vira barra inferior, tabela vira cartões).

## Instalação

```bash
npx skills add Thumendes/prancheta
```

Ou copie `skills/prancheta/` para `~/.claude/skills/`.

## Pré-requisitos

**Bun** ([bun.sh](https://bun.sh)):

```bash
curl -fsSL https://bun.sh/install | bash        # macOS / Linux / WSL
powershell -c "irm bun.sh/install.ps1|iex"      # Windows
```

**Chromium** (uma vez por máquina, ~90s):

```bash
cd ~/.claude/skills/prancheta/scripts && bun install
```

## Uso

Peça em linguagem natural:

> "Faz os wireframes do fluxo de inscrição em torneio"

A skill cuida do resto. Os HTMLs ficam em `.prancheta/<projeto>/` (rascunho,
regerável) e os PNGs em `wireframes/<projeto>/`.

Para reimprimir uma tela depois de editar o HTML:

```bash
cd ~/.claude/skills/prancheta/scripts
bun run shoot.ts ../../.prancheta/meu-app/03-detalhe.html --out wireframes/meu-app
```

| Flag | Efeito |
|---|---|
| `--viewports desktop,mobile,tablet,wide` | tamanhos a capturar |
| `--scale 1` | sem retina |
| `--notes` | liga as anotações numeradas |
| `--bare` | remove a tarja de título |
| `--no-full` | captura só a dobra |
| `--all` | inclui o `validation.html` |

## Estrutura

```
skills/prancheta/
├── SKILL.md                        fluxo em 7 etapas
├── references/
│   ├── briefing.md                 o que perguntar antes de desenhar
│   ├── componentes.md              API das classes pr-
│   └── revisao.md                  checklist antes da captura
├── assets/
│   ├── prancheta.css               sistema mid-fi (tokens, ~50 componentes, mobile)
│   ├── template.html               esqueleto de uma tela
│   └── validation.template.html    piloto + kit + mapa
└── scripts/
    ├── shoot.ts                    captura Puppeteer
    └── package.json
```

## Licença

MIT
