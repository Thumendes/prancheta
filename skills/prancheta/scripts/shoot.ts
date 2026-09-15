#!/usr/bin/env bun
/**
 * prancheta · shoot
 *
 * Abre cada wireframe .html em um Chromium headless e salva o PNG por
 * viewport. Um único browser serve todas as capturas — abrir um por arquivo
 * custa ~1s cada e não traz nada em troca.
 *
 *   bun run shoot.ts <entrada...> --out <pasta> [opções]
 *
 *   <entrada>            arquivo .html ou pasta com .html
 *   --out <pasta>        onde salvar os PNGs                     (obrigatório)
 *   --viewports a,b      desktop | mobile | tablet | wide        (padrão: desktop,mobile)
 *   --scale <n>          deviceScaleFactor                       (padrão: 2)
 *   --all                inclui validation.html (por padrão é pulado)
 *   --no-full            captura só a dobra, não a página inteira
 *   --notes              liga as anotações numeradas (body.notes)
 *   --bare               tira a tarja de título (body.bare)
 */

import { mkdir, readdir, stat } from "node:fs/promises";
import { basename, extname, isAbsolute, join, resolve } from "node:path";
import puppeteer, { type Browser } from "puppeteer";

type Preset = { w: number; h: number; mobile: boolean };

const VIEWPORTS: Record<string, Preset> = {
  desktop: { w: 1440, h: 900, mobile: false },
  wide: { w: 1920, h: 1080, mobile: false },
  tablet: { w: 768, h: 1024, mobile: true },
  mobile: { w: 390, h: 844, mobile: true },
};

function parseArgs(argv: string[]) {
  const inputs: string[] = [];
  const flags: Record<string, string | boolean> = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]!;
    if (!a.startsWith("--")) { inputs.push(a); continue; }
    const key = a.slice(2);
    const next = argv[i + 1];
    if (next && !next.startsWith("--")) { flags[key] = next; i++; }
    else flags[key] = true;
  }
  return { inputs, flags };
}

const { inputs, flags } = parseArgs(Bun.argv.slice(2));

const outDir = typeof flags.out === "string" ? flags.out : null;
if (!inputs.length || !outDir) {
  console.error("uso: bun run shoot.ts <arquivo|pasta>... --out <pasta> [--viewports desktop,mobile] [--scale 2] [--all] [--notes] [--bare]");
  process.exit(1);
}

const names = String(flags.viewports ?? "desktop,mobile").split(",").map((s) => s.trim()).filter(Boolean);
const unknown = names.filter((n) => !VIEWPORTS[n]);
if (unknown.length) {
  console.error(`viewport desconhecido: ${unknown.join(", ")} — use ${Object.keys(VIEWPORTS).join(" | ")}`);
  process.exit(1);
}

const scale = Number(flags.scale ?? 2) || 2;
const fullPage = flags["no-full"] !== true;
const includeValidation = flags.all === true;

const abs = (p: string) => (isAbsolute(p) ? p : resolve(process.cwd(), p));

async function collect(entry: string): Promise<string[]> {
  const p = abs(entry);
  const s = await stat(p).catch(() => null);
  if (!s) { console.error(`não encontrei: ${entry}`); process.exit(1); }
  if (s.isFile()) return extname(p) === ".html" ? [p] : [];
  const found = (await readdir(p))
    .filter((f) => extname(f) === ".html")
    .sort()
    .map((f) => join(p, f));
  return found;
}

const files = (await Promise.all(inputs.map(collect)))
  .flat()
  .filter((f) => includeValidation || basename(f) !== "validation.html");

if (!files.length) {
  console.error("nenhum .html para capturar (validation.html é pulado; use --all para incluir).");
  process.exit(1);
}

const out = abs(outDir);
await mkdir(out, { recursive: true });

let browser: Browser | undefined;
try {
  browser = await puppeteer.launch({
    headless: true,
    args: ["--force-color-profile=srgb", "--font-render-hinting=none", "--hide-scrollbars"],
  });
} catch (err) {
  console.error("não consegui abrir o Chromium.");
  console.error("rode `bunx puppeteer browsers install chrome` nesta pasta e tente de novo.\n");
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
}

const results: { file: string; ok: boolean; detail: string }[] = [];
const started = Date.now();

for (const file of files) {
  const name = basename(file, ".html");

  for (const vpName of names) {
    const vp = VIEWPORTS[vpName]!;
    const target = join(out, `${name}-${vpName}.png`);
    const page = await browser.newPage();
    try {
      await page.setViewport({
        width: vp.w,
        height: vp.h,
        deviceScaleFactor: scale,
        isMobile: vp.mobile,
        hasTouch: vp.mobile,
      });
      await page.goto(`file://${file}`, { waitUntil: "networkidle0", timeout: 30_000 });

      if (flags.notes || flags.bare) {
        await page.evaluate((opts: { notes: boolean; bare: boolean }) => {
          if (opts.notes) document.body.classList.add("notes");
          if (opts.bare) document.body.classList.add("bare");
        }, { notes: flags.notes === true, bare: flags.bare === true });
      }

      // Em captura de página inteira, `position: fixed` renderiza na altura da
      // dobra e atravessa o meio do PNG. Ancorar no fim de .pr-screen é a
      // leitura honesta: no dispositivo a barra fica no rodapé da tela.
      if (fullPage) {
        await page.addStyleTag({
          content: `@media (max-width: 560px) {
            .pr-sidebar, .pr-fab { position: absolute !important; }
          }`,
        });
      }

      // fontes prontas antes do print: senão o PNG sai com a fonte de fallback
      await page.evaluate(() => (document as any).fonts?.ready);

      const errors = await page.evaluate(() => {
        const missing = [...document.querySelectorAll("link[rel=stylesheet]")]
          .filter((l) => !(l as HTMLLinkElement).sheet)
          .map((l) => (l as HTMLLinkElement).getAttribute("href"));
        return missing;
      });
      if (errors.length) {
        console.warn(`  ⚠ ${name}: CSS não carregou (${errors.join(", ")}) — o prancheta.css está na mesma pasta do .html?`);
      }

      await page.screenshot({ path: target as `${string}.png`, fullPage, type: "png" });
      results.push({ file: `${name}-${vpName}.png`, ok: true, detail: `${vp.w}×${vp.h} @${scale}x` });
      console.log(`  ✔ ${name}-${vpName}.png  (${vp.w}×${vp.h} @${scale}x)`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      results.push({ file: `${name}-${vpName}.png`, ok: false, detail: msg });
      console.error(`  ✕ ${name}-${vpName}.png  ${msg}`);
    } finally {
      await page.close();
    }
  }
}

await browser.close();

const ok = results.filter((r) => r.ok).length;
const failed = results.length - ok;
console.log(`\n${ok} PNG${ok === 1 ? "" : "s"} em ${out}  ·  ${((Date.now() - started) / 1000).toFixed(1)}s${failed ? `  ·  ${failed} falha(s)` : ""}`);
process.exit(failed ? 1 : 0);
