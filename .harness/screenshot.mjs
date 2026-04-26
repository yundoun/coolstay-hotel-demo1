import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const BASE = "http://localhost:3100";
const OUT = ".harness/screenshots";
mkdirSync(OUT, { recursive: true });

const pages = [
  { name: "01-home", url: "/", full: true },
  { name: "01b-home-abovefold", url: "/", full: false },
  { name: "02-hotels-list", url: "/hotels", full: true },
  { name: "02b-hotels-abovefold", url: "/hotels", full: false },
  { name: "03-hotel-detail-sowol", url: "/hotels/sowol-seoul", full: true },
  { name: "04-hotel-detail-wolbit", url: "/hotels/wolbit-jeju", full: true },
  { name: "05-reservation-step1", url: "/reservation?step=1", full: true },
  { name: "06-reservation-step2", url: "/reservation?step=2", full: true },
  { name: "06b-step2-abovefold", url: "/reservation?step=2", full: false },
  { name: "07-reservation-step3", url: "/reservation?step=3", full: true },
];

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
});
const page = await context.newPage();

// Collect console errors + failed requests
const problems = [];
page.on("console", (m) => {
  if (m.type() === "error") problems.push(`CONSOLE ERROR on ${page.url()}: ${m.text()}`);
});
page.on("pageerror", (err) => problems.push(`PAGE ERROR on ${page.url()}: ${err.message}`));
page.on("requestfailed", (req) => {
  if (!req.url().includes("favicon")) {
    problems.push(`REQUEST FAILED on ${page.url()}: ${req.url()} — ${req.failure()?.errorText}`);
  }
});
page.on("response", (resp) => {
  if (resp.status() >= 400 && !resp.url().includes("favicon")) {
    problems.push(`HTTP ${resp.status()} on ${page.url()}: ${resp.url()}`);
  }
});

for (const { name, url, full } of pages) {
  console.log(`→ ${name}: ${url}`);
  await page.goto(BASE + url, { waitUntil: "networkidle", timeout: 20000 });
  await page.waitForTimeout(500);

  if (full) {
    // Scroll through full page to trigger whileInView / lazy images, then return to top
    await page.evaluate(async () => {
      await new Promise((resolve) => {
        let y = 0;
        const step = 400;
        const timer = setInterval(() => {
          window.scrollTo(0, y);
          y += step;
          if (y > document.body.scrollHeight + 600) {
            clearInterval(timer);
            window.scrollTo(0, 0);
            resolve();
          }
        }, 80);
      });
    });
    await page.waitForTimeout(600);
  }

  await page.screenshot({
    path: join(OUT, `${name}.png`),
    fullPage: full,
  });
}

await browser.close();

console.log("\n=== PROBLEMS ===");
if (problems.length === 0) {
  console.log("(none)");
} else {
  for (const p of problems) console.log(p);
}
console.log("\n=== DONE ===");
