/**
 * XETAPAY Full DOM Test Suite
 * Tests every page & function on the live deployed site
 */
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE_URL = 'https://xetapay.pages.dev';
const WORKER_URL = 'https://xeta-pay-dashboard.sv9.workers.dev';
const SCREENSHOTS_DIR = path.join(__dirname, 'test-results');
if (!fs.existsSync(SCREENSHOTS_DIR)) fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });

const results = [];
const consoleErrors = [];

function log(icon, label, msg) {
    const line = `${icon} [${label}] ${msg}`;
    console.log(line);
    return line;
}
function pass(label, msg) { return results.push({ status: '✅ PASS', label, msg }); }
function warn(label, msg) { return results.push({ status: '⚠️  WARN', label, msg }); }
function fail(label, msg) { return results.push({ status: '❌ FAIL', label, msg }); }

async function screenshot(page, name) {
    const file = path.join(SCREENSHOTS_DIR, `${name}.png`);
    await page.screenshot({ path: file, fullPage: true });
    console.log(`  📸 Screenshot: ${file}`);
    return file;
}

async function waitAndClick(page, selector, label) {
    try {
        await page.waitForSelector(selector, { timeout: 5000 });
        await page.click(selector);
        return true;
    } catch {
        warn(label, `Selector not found: ${selector}`);
        return false;
    }
}

async function getText(page, selector) {
    try {
        return await page.$eval(selector, el => el.textContent.trim());
    } catch { return null; }
}

// ─── WORKER API TESTS ──────────────────────────────────────────────────────────
async function testWorkerAPIs() {
    console.log('\n══════════════════════════════════════════');
    console.log('  SECTION 1: WORKER API ENDPOINT TESTS');
    console.log('══════════════════════════════════════════');

    const endpoints = [
        { method: 'GET', path: '/status', label: 'Worker Health/Status' },
        { method: 'GET', path: '/api/analytics/revenue-stream', label: 'Revenue Stream API' },
        { method: 'GET', path: '/api/routing/preview', label: 'Routing Preview API' },
        { method: 'GET', path: '/api/settlements?limit=5', label: 'Settlements API' },
        { method: 'GET', path: '/api/ticket-orders?limit=5', label: 'Ticket Orders API' },
        { method: 'GET', path: '/api/internal/grafana-metrics', label: 'Grafana Metrics API' },
        { method: 'GET', path: '/api/tax/calc?country=Thailand&amount=1000', label: 'Tax Calculator API' },
        { method: 'GET', path: '/api/auth/verify', label: 'Auth Verify (no token → 401)' },
    ];

    for (const ep of endpoints) {
        try {
            const res = await fetch(`${WORKER_URL}${ep.path}`, { method: ep.method });
            const body = await res.text();
            let parsed;
            try { parsed = JSON.parse(body); } catch { parsed = body.substring(0, 100); }

            if (res.ok || res.status === 401) {
                log('✅', ep.label, `HTTP ${res.status} → ${JSON.stringify(parsed).substring(0, 120)}`);
                pass(ep.label, `HTTP ${res.status}`);
            } else {
                log('❌', ep.label, `HTTP ${res.status} → ${JSON.stringify(parsed).substring(0, 120)}`);
                fail(ep.label, `HTTP ${res.status}`);
            }
        } catch (e) {
            log('❌', ep.label, `Fetch error: ${e.message}`);
            fail(ep.label, e.message);
        }
    }
}

// ─── FRONTEND PAGE TESTS ───────────────────────────────────────────────────────
async function testFrontend() {
    console.log('\n══════════════════════════════════════════');
    console.log('  SECTION 2: FRONTEND / DOM TESTS');
    console.log('══════════════════════════════════════════');

    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1400,900'],
        defaultViewport: { width: 1400, height: 900 }
    });

    const page = await browser.newPage();

    // Capture console errors
    page.on('console', msg => {
        if (msg.type() === 'error') {
            consoleErrors.push(msg.text());
        }
    });
    page.on('pageerror', err => consoleErrors.push(`PAGE ERROR: ${err.message}`));

    try {
        // ── TEST: Login page loads ──
        console.log('\n--- Login Page ---');
        await page.goto(BASE_URL, { waitUntil: 'networkidle2', timeout: 30000 });
        await new Promise(r => setTimeout(r, 2000));
        await screenshot(page, '01_initial_load');

        const url1 = page.url();
        if (url1.includes('/login')) {
            pass('Login Redirect', `Correctly redirected to ${url1}`);
        } else {
            warn('Login Redirect', `URL is ${url1} — may already be authenticated`);
        }

        // Check for login page elements
        const hasGoogleBtn = await page.$('button') !== null;
        const pageText = await page.evaluate(() => document.body.innerText);

        if (pageText.includes('XETA') || pageText.includes('xeta') || pageText.includes('Sign')) {
            pass('Login Page Content', 'Login page has XETAPAY branding / Sign in text');
        } else {
            warn('Login Page Content', 'Could not find expected branding text');
        }

        if (hasGoogleBtn) {
            pass('Login Buttons', 'Buttons found on login page');
        }

        await screenshot(page, '02_login_page');

        // ── TEST: Inject auth token to bypass login ──
        console.log('\n--- Injecting Auth Session ---');
        await page.evaluate(() => {
            const mockUser = {
                id: 'MERCH-TEST001',
                name: 'Test Merchant',
                email: 'admin@xetapay.com',
                role: 'Provider Admin',
                tenant_id: 'TENANT-001'
            };
            const mockToken = 'xeta_oauth_test_local_bypass';
            localStorage.setItem('xeta_user', JSON.stringify(mockUser));
            localStorage.setItem('xeta_token', mockToken);
            sessionStorage.setItem('xeta_auth', 'true');
        });

        // Navigate to dashboard
        await page.goto(BASE_URL + '/', { waitUntil: 'networkidle2', timeout: 30000 });
        await new Promise(r => setTimeout(r, 3000));
        await screenshot(page, '03_dashboard_after_auth');
        const url2 = page.url();
        log('📍', 'Post-Auth URL', url2);

        const bodyText2 = await page.evaluate(() => document.body.innerText);
        if (bodyText2.length > 200) {
            pass('Dashboard Load', 'Dashboard page has content');
        } else {
            warn('Dashboard Load', 'Dashboard may be empty or loading slowly');
        }

        // ── TEST: Navigation pages ──
        const navPages = [
            { id: 'home',        label: 'Home/Dashboard',   check: ['Revenue', 'Transaction', 'payment', 'THB'] },
            { id: 'payments',    label: 'Payments Page',     check: ['Payment', 'Order', 'Status', 'Amount'] },
            { id: 'quotation',   label: 'Quotation Page',    check: ['Quote', 'Payment Link', 'Generate', 'Email'] },
            { id: 'payouts',     label: 'Payouts Page',      check: ['Payout', 'Settlement', 'Bank'] },
            { id: 'compliance',  label: 'Compliance Page',   check: ['Compliance', 'KYC', 'AML', 'Report'] },
            { id: 'plugins',     label: 'Plugins Page',      check: ['Plugin', 'Shopify', 'WooCommerce', 'Integration'] },
            { id: 'developer',   label: 'Developer Page',    check: ['API', 'Key', 'Endpoint', 'Documentation'] },
            { id: 'reports',     label: 'Reports Page',      check: ['Report', 'Export', 'Analytics', 'Chart'] },
            { id: 'settings',    label: 'Settings Page',     check: ['Setting', 'Account', 'Profile', 'Config'] },
        ];

        for (const nav of navPages) {
            console.log(`\n--- ${nav.label} ---`);
            try {
                // Try clicking sidebar link
                const clicked = await page.evaluate((navId) => {
                    // Try data-id, href, or innerText matching
                    const links = Array.from(document.querySelectorAll('a, button, [role="button"]'));
                    for (const el of links) {
                        const text = el.innerText?.toLowerCase() || '';
                        const href = el.href || '';
                        const id = el.dataset?.id || el.id || '';
                        if (id === navId || href.includes(navId) || text.includes(navId.replace(/_/g,' '))) {
                            el.click();
                            return true;
                        }
                    }
                    return false;
                }, nav.id);

                if (!clicked) {
                    // Try direct URL navigation
                    await page.goto(`${BASE_URL}/${nav.id}`, { waitUntil: 'networkidle2', timeout: 15000 });
                }

                await new Promise(r => setTimeout(r, 2500));
                await screenshot(page, `04_${nav.id}_page`);

                const pageContent = await page.evaluate(() => document.body.innerText.toLowerCase());
                const found = nav.check.some(kw => pageContent.includes(kw.toLowerCase()));

                if (found) {
                    pass(nav.label, `Page loaded with expected content`);
                    log('✅', nav.label, 'Content found');
                } else {
                    warn(nav.label, `Page loaded but keywords not found: ${nav.check.join(', ')}`);
                    log('⚠️', nav.label, `Keywords missing: ${nav.check.join(', ')}`);
                }

                // Go back to base for next iteration
                await page.goto(BASE_URL + '/', { waitUntil: 'domcontentloaded', timeout: 15000 });
                await new Promise(r => setTimeout(r, 1500));

            } catch (e) {
                fail(nav.label, `Error: ${e.message}`);
                log('❌', nav.label, e.message);
            }
        }

        // ── TEST: AI Chat Widget ──
        console.log('\n--- AI Chat Widget ---');
        await page.goto(BASE_URL + '/', { waitUntil: 'networkidle2', timeout: 30000 });
        await new Promise(r => setTimeout(r, 2000));
        const aiButton = await page.evaluate(() => {
            const els = Array.from(document.querySelectorAll('button, [role="button"]'));
            const ai = els.find(el => {
                const t = el.innerText?.toLowerCase() || '';
                const cls = el.className?.toLowerCase() || '';
                return t.includes('ai') || t.includes('chat') || t.includes('agent') || cls.includes('ai') || cls.includes('chat');
            });
            if (ai) { ai.click(); return true; }
            return false;
        });

        await new Promise(r => setTimeout(r, 1500));
        await screenshot(page, '05_ai_chat');
        if (aiButton) {
            pass('AI Chat Widget', 'AI chat button found and clicked');
        } else {
            warn('AI Chat Widget', 'Could not find AI chat button — may be on specific page');
        }

        // ── TEST: Mobile Responsiveness ──
        console.log('\n--- Mobile Responsiveness (375px) ---');
        await page.setViewport({ width: 375, height: 812 });
        await page.goto(BASE_URL + '/', { waitUntil: 'networkidle2', timeout: 15000 });
        await new Promise(r => setTimeout(r, 2000));
        await screenshot(page, '06_mobile_375px');

        const hasMobileMenu = await page.evaluate(() => {
            const els = Array.from(document.querySelectorAll('button'));
            return els.some(el => {
                const label = el.getAttribute('aria-label') || el.title || el.className;
                return label.toLowerCase().includes('menu') || label.toLowerCase().includes('nav') || label.toLowerCase().includes('sidebar');
            });
        });
        if (hasMobileMenu) {
            pass('Mobile Responsiveness', 'Mobile menu/hamburger detected at 375px');
        } else {
            warn('Mobile Responsiveness', 'No explicit mobile menu found — may use sidebar collapse');
        }

        // ── TEST: Payments page search/filter ──
        console.log('\n--- Payments Search & Filter ---');
        await page.setViewport({ width: 1400, height: 900 });
        await page.goto(`${BASE_URL}/payments`, { waitUntil: 'networkidle2', timeout: 15000 });
        await new Promise(r => setTimeout(r, 2000));

        const searchInput = await page.$('input[type="search"], input[placeholder*="Search"], input[placeholder*="search"]');
        if (searchInput) {
            await searchInput.type('Somchai');
            await new Promise(r => setTimeout(r, 1000));
            await screenshot(page, '07_payments_search');
            pass('Payments Search', 'Search input found and typed into');
        } else {
            warn('Payments Search', 'No search input found on payments page');
            await screenshot(page, '07_payments_no_search');
        }

        // ── TEST: Quotation form ──
        console.log('\n--- Quotation Form ---');
        await page.goto(`${BASE_URL}/quotation`, { waitUntil: 'networkidle2', timeout: 15000 });
        await new Promise(r => setTimeout(r, 2000));
        await screenshot(page, '08_quotation_form');

        const emailInput = await page.$('input[type="email"], input[placeholder*="email"], input[placeholder*="Email"]');
        const amountInput = await page.$('input[type="number"], input[placeholder*="amount"], input[placeholder*="Amount"]');
        if (emailInput) {
            await emailInput.type('test@example.com');
            pass('Quotation Email', 'Email field found and filled');
        } else {
            warn('Quotation Email', 'Email field not found on quotation page');
        }
        if (amountInput) {
            await amountInput.type('1000');
            pass('Quotation Amount', 'Amount field found and filled');
        } else {
            warn('Quotation Amount', 'Amount field not found on quotation page');
        }

        await screenshot(page, '09_quotation_filled');

    } catch (e) {
        fail('Browser Test Suite', `Fatal error: ${e.message}`);
        console.error('FATAL:', e);
    } finally {
        await browser.close();
    }
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
async function main() {
    console.log('\n🚀 XETAPAY FULL DOM TEST SUITE');
    console.log(`   Target: ${BASE_URL}`);
    console.log(`   Worker: ${WORKER_URL}`);
    console.log(`   Screenshots → ${SCREENSHOTS_DIR}`);
    console.log('═'.repeat(50));

    await testWorkerAPIs();
    await testFrontend();

    // ── FINAL REPORT ──
    console.log('\n\n' + '═'.repeat(50));
    console.log('  FINAL TEST REPORT');
    console.log('═'.repeat(50));

    const passes = results.filter(r => r.status.includes('PASS'));
    const warns  = results.filter(r => r.status.includes('WARN'));
    const fails  = results.filter(r => r.status.includes('FAIL'));

    console.log(`\n  Total: ${results.length} tests`);
    console.log(`  ✅ PASS: ${passes.length}`);
    console.log(`  ⚠️  WARN: ${warns.length}`);
    console.log(`  ❌ FAIL: ${fails.length}`);

    console.log('\n── Details ───────────────────────────────────\n');
    for (const r of results) {
        console.log(`${r.status}  ${r.label}`);
        console.log(`           → ${r.msg}`);
    }

    if (consoleErrors.length > 0) {
        console.log('\n── Browser Console Errors ────────────────────');
        consoleErrors.slice(0, 20).forEach(e => console.log(`  🔴 ${e}`));
    } else {
        console.log('\n  🟢 No browser console errors detected');
    }

    console.log('\n── Screenshots saved to ──────────────────────');
    fs.readdirSync(SCREENSHOTS_DIR)
        .filter(f => f.endsWith('.png'))
        .forEach(f => console.log(`  📸 test-results/${f}`));

    console.log('\n' + '═'.repeat(50));

    // Write JSON report
    const report = { timestamp: new Date().toISOString(), base_url: BASE_URL, summary: { total: results.length, pass: passes.length, warn: warns.length, fail: fails.length }, results, consoleErrors };
    fs.writeFileSync(path.join(SCREENSHOTS_DIR, 'report.json'), JSON.stringify(report, null, 2));
    console.log(`\n  📄 JSON report saved to: test-results/report.json\n`);
}

main().catch(e => { console.error('FATAL:', e); process.exit(1); });
