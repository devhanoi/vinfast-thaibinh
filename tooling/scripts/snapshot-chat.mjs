// Chụp riêng góc dưới phải để xem floating chat (mở + đóng)
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const OUT = resolve(ROOT, "docs/screenshots");
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();

// Desktop 1440x900
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();
await page.goto("http://localhost:3030", { waitUntil: "networkidle" });
await page.waitForTimeout(500);

// Closed state — clip bottom-right corner
await page.screenshot({
  path: `${OUT}/chat-closed-desktop.png`,
  clip: { x: 1100, y: 600, width: 340, height: 300 },
});

// Wait for auto-open trigger (8s) — but force open by clicking the FAB to be deterministic
await page.click('button[aria-label="Mở menu liên hệ nhanh"]', { timeout: 12000 }).catch(async () => {
  // auto-opened already
  await page.waitForTimeout(2000);
});
await page.waitForTimeout(700);

await page.screenshot({
  path: `${OUT}/chat-open-desktop.png`,
  clip: { x: 1050, y: 540, width: 390, height: 360 },
});

console.log("✓ chat-closed-desktop.png");
console.log("✓ chat-open-desktop.png");

// Mobile
const mctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
const mpage = await mctx.newPage();
await mpage.goto("http://localhost:3030", { waitUntil: "networkidle" });
await mpage.waitForTimeout(500);
await mpage.screenshot({
  path: `${OUT}/chat-closed-mobile.png`,
  clip: { x: 240, y: 600, width: 150, height: 244 },
});

// Open
await mpage.click('button[aria-label="Mở menu liên hệ nhanh"]').catch(() => {});
await mpage.waitForTimeout(700);
await mpage.screenshot({
  path: `${OUT}/chat-open-mobile.png`,
  clip: { x: 130, y: 500, width: 260, height: 344 },
});

console.log("✓ chat-closed-mobile.png");
console.log("✓ chat-open-mobile.png");

await browser.close();
