import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const BASE = "http://localhost:3100";
const OUT = ".harness/screenshots";
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
});
const page = await context.newPage();

const problems = [];
page.on("pageerror", (err) => problems.push(`PAGE ERROR on ${page.url()}: ${err.message}`));

async function scrollThrough() {
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
      }, 60);
    });
  });
  await page.waitForTimeout(500);
}

async function shot(name, full = true) {
  if (full) await scrollThrough();
  await page.screenshot({ path: join(OUT, `${name}.png`), fullPage: full });
  console.log(`✓ ${name}`);
}

// ============ Full reservation flow ============
// Step 1 — dates pre-filled, just click next
await page.goto(`${BASE}/reservation?step=1&hotelId=sowol-seoul`, { waitUntil: "networkidle" });
await page.waitForTimeout(500);
await shot("flow-1-dates");

await page.getByRole("link", { name: /다음/ }).click();
await page.waitForURL(/step=2/, { timeout: 10000 });
await page.waitForTimeout(800);
await shot("flow-2-hotel-select");

// Hotel already selected via URL. Click first "선택" button for a room
await page.locator("button").filter({ hasText: /^선택$/ }).first().click();
await page.waitForTimeout(500);
await shot("flow-2b-room-selected");

// Go to step 3
await page.getByRole("link", { name: /다음/ }).click();
await page.waitForURL(/step=3/, { timeout: 10000 });
await page.waitForTimeout(500);
await shot("flow-3-guest-empty");

// Fill guest form
await page.getByPlaceholder("홍길동").fill("김꿀벌");
await page.getByPlaceholder("010-1234-5678").fill("010-1234-5678");
await page.getByPlaceholder("guest@coolstay.kr").fill("honeybee@coolstay.kr");
await page.locator("textarea").fill("늦은 체크인 예정입니다. 가능하다면 고층 객실을 선호합니다.");
await page.waitForTimeout(300);
await shot("flow-3b-guest-filled");

// Submit to step 4
await page.getByRole("button", { name: /다음/ }).click();
await page.waitForURL(/step=4/, { timeout: 10000 });
await page.waitForTimeout(500);
await shot("flow-4-review");

// Consent and confirm
await page.locator('input[type="checkbox"]').check();
await page.waitForTimeout(300);
await page.getByRole("button", { name: /예약 확정/ }).click();
await page.waitForURL(/\/reservation\/complete/, { timeout: 10000 });
await page.waitForTimeout(1000);
await shot("flow-5-complete");

await browser.close();

console.log("\n=== PROBLEMS ===");
if (problems.length === 0) console.log("(none)");
else for (const p of problems) console.log(p);
