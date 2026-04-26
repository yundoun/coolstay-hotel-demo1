import { chromium } from "playwright";
const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1440, height: 1800 } });
const page = await context.newPage();

await page.goto("http://localhost:3100/reservation?step=2&hotelId=sowol-seoul", { waitUntil: "networkidle" });
await page.waitForTimeout(1500);
// Force scroll to top (auto-scroll on mount may have dropped us at rooms)
await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
await page.waitForTimeout(500);
await page.screenshot({ path: ".harness/screenshots/zoom-step2-top.png", fullPage: false });

await browser.close();
console.log("done");
