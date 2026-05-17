import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";

const OUT = resolve(process.cwd(), "../docs/screenshots");
mkdirSync(OUT, { recursive: true });

const TARGETS = [
  { name: "own-mobile", url: "http://localhost:3030", viewport: { width: 390, height: 844 } },
  { name: "own-desktop", url: "http://localhost:3030", viewport: { width: 1440, height: 900 } },
];

const browser = await chromium.launch();
for (const t of TARGETS) {
  const ctx = await browser.newContext({
    viewport: t.viewport,
    deviceScaleFactor: 2,
    locale: "vi-VN",
  });
  const page = await ctx.newPage();
  try {
    await page.goto(t.url, { waitUntil: "networkidle", timeout: 30_000 });
    await page.waitForTimeout(1000);
    const file = `${OUT}/${t.name}.png`;
    await page.screenshot({ path: file, fullPage: true });
    console.log(`✓ ${t.name} → ${file}`);
  } catch (err) {
    console.error(`✗ ${t.name}: ${err.message}`);
  } finally {
    await ctx.close();
  }
}
await browser.close();
