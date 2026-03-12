import { chromium } from 'playwright';
import fs from 'fs';

async function run() {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();
    
    console.log("Navigating...");
    await page.goto("https://thai-payment-gateway-modern.surge.sh", { waitUntil: "networkidle" });
    
    console.log("Taking screenshot...");
    await page.screenshot({ path: "surge-screenshot.png", fullPage: true });
    
    console.log("Extracting texts and links...");
    const texts = await page.evaluate(() => document.body.innerText);
    fs.writeFileSync("surge-texts.txt", texts);
    
    await browser.close();
    console.log("Done");
}

run().catch(console.error);
