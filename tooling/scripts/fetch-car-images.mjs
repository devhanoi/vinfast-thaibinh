import { chromium } from "playwright";
import { mkdirSync, writeFileSync, rmSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const OUT = resolve(ROOT, "public/images/cars");
if (existsSync(OUT)) rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

// Try multiple known competitor sites (WordPress dealer pages tend to host real product photos)
const SOURCES = [
  { kind: "home", url: "https://vinfast-thaibinh.com/" },
  { kind: "home", url: "https://vinfastthaibinh.com/" },
  { kind: "home", url: "https://vinfastautothaibinh.com/" },
];

// Match a car slug from filename/alt text
const CARS = ["vf-3", "vf3", "vf-5", "vf5", "vf-6", "vf6", "vf-7", "vf7", "vf-8", "vf8", "vf-9", "vf9"];
function carSlugFrom(s) {
  const low = s.toLowerCase();
  for (const c of CARS) {
    if (low.includes(c) || low.includes(c.replace("-", " "))) {
      return c.replace(/^vf(\d)$/, "vf-$1");
    }
  }
  return null;
}

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  userAgent:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36",
  locale: "vi-VN",
});

const collected = new Map(); // car slug -> [{src, w, h}]

for (const { url } of SOURCES) {
  const page = await ctx.newPage();
  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60_000 });
    for (let y = 0; y <= 8000; y += 600) {
      await page.evaluate((v) => window.scrollTo(0, v), y);
      await page.waitForTimeout(350);
    }
    await page.waitForTimeout(800);

    const found = await page.$$eval("img", (imgs) =>
      imgs
        .map((img) => ({
          src: img.currentSrc || img.src || "",
          w: img.naturalWidth || 0,
          h: img.naturalHeight || 0,
          alt: img.alt || "",
          title: img.title || "",
        }))
        .filter((c) => c.src && /^https?:\/\//i.test(c.src))
        .filter((c) => /\.(jpe?g|png|webp)(\?|$)/i.test(c.src))
        .filter((c) => !/logo|icon|sprite|favicon|hotline|loading|placeholder/i.test(c.src))
        .filter((c) => c.w >= 300 && c.h >= 200)
    );

    console.log(`[${url}] found ${found.length} candidate images`);
    for (const img of found) {
      const slug = carSlugFrom(`${img.src} ${img.alt} ${img.title}`);
      if (!slug) continue;
      if (!collected.has(slug)) collected.set(slug, []);
      collected.get(slug).push(img);
    }
  } catch (err) {
    console.error(`[${url}] ${err.message}`);
  } finally {
    await page.close();
  }
}

await browser.close();

// Download top 1-2 per slug (largest)
const manifest = {};
for (const [slug, imgs] of collected) {
  const top = imgs
    .filter((v, i, arr) => arr.findIndex((x) => x.src === v.src) === i)
    .sort((a, b) => b.w * b.h - a.w * a.h)
    .slice(0, 2);

  manifest[slug] = [];
  for (let i = 0; i < top.length; i++) {
    const img = top[i];
    try {
      const res = await fetch(img.src, { headers: { Referer: "https://google.com/" } });
      if (!res.ok) {
        console.log(`  ✗ ${slug}-${i + 1}: ${res.status} ${img.src}`);
        continue;
      }
      const ext = (new URL(img.src).pathname.match(/\.(jpe?g|png|webp)$/i) || [".jpg"])[0].toLowerCase();
      const file = `${OUT}/${slug}-${i + 1}${ext}`;
      const buf = Buffer.from(await res.arrayBuffer());
      writeFileSync(file, buf);
      manifest[slug].push({
        path: `/images/cars/${slug}-${i + 1}${ext}`,
        width: img.w,
        height: img.h,
        sizeKb: Math.round(buf.byteLength / 1024),
        src: img.src,
      });
      console.log(`  ✓ ${slug}-${i + 1}${ext}  ${img.w}×${img.h}  ${Math.round(buf.byteLength / 1024)}KB`);
    } catch (err) {
      console.log(`  ✗ ${slug}-${i + 1}: ${err.message}`);
    }
  }
}

writeFileSync(
  resolve(ROOT, "tooling/scripts/car-images.manifest.json"),
  JSON.stringify(manifest, null, 2)
);
console.log("\n=== Summary ===");
for (const [slug, items] of Object.entries(manifest)) {
  console.log(`  ${slug}: ${items.length} image(s)`);
}
