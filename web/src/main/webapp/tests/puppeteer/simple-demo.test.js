/**
 * Simple Puppeteer Demo - Working with TMS Login
 */

const puppeteer = require('puppeteer');

describe('Puppeteer Demo', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: false, // Show browser for demo
      slowMo: 100, // Slow down actions for visibility
      args: ['--window-size=1280,720']
    });
    page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });
  });

  afterAll(async () => {
    await browser.close();
  });

  test('Puppeteer: Login with visual feedback', async () => {
    console.log('🐶 Starting Puppeteer Test...');
    
    // Navigate to login page
    await page.goto('http://localhost:3000/login', { 
      waitUntil: 'networkidle0' 
    });
    console.log('✓ Navigated to login page');

    // Take screenshot of login page
    await page.screenshot({ 
      path: 'tests/puppeteer/1-puppeteer-login-page.png'
    });

    // Wait for form elements
    await page.waitForSelector('input[name="username"]');
    
    // Fill in login form (Puppeteer requires clearing first)
    await page.click('input[name="username"]', { clickCount: 3 });
    await page.type('input[name="username"]', 'dispatcher');
    
    await page.click('input[name="password"]', { clickCount: 3 });
    await page.type('input[name="password"]', 'password123');
    console.log('✓ Filled login credentials');

    // Check remember me
    await page.click('input[name="rememberMe"]');

    // Take screenshot before login
    await page.screenshot({ 
      path: 'tests/puppeteer/2-puppeteer-before-submit.png'
    });

    // Click login button
    await page.click('button[type="submit"]');
    console.log('✓ Clicked login button');

    // Wait for navigation
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    console.log('✓ Successfully logged in');

    // Take screenshot of dashboard
    await page.screenshot({ 
      path: 'tests/puppeteer/3-puppeteer-dashboard.png',
      fullPage: true
    });

    // Get page title
    const pageTitle = await page.title();
    console.log(`✓ Page title: ${pageTitle}`);

    console.log('✅ Puppeteer test completed successfully!');
  }, 30000);

  test('Puppeteer: Basic features demo', async () => {
    console.log('🐶 Demonstrating Puppeteer features...');

    // 1. Network monitoring
    page.on('request', request => {
      if (request.url().includes('/api/')) {
        console.log(`  🔍 Request: ${request.url()}`);
      }
    });

    await page.goto('http://localhost:3000/login');

    // 2. Evaluate JavaScript in page context
    const dimensions = await page.evaluate(() => {
      return {
        width: window.innerWidth,
        height: window.innerHeight,
        deviceScaleFactor: window.devicePixelRatio
      };
    });
    console.log('✓ Page dimensions:', dimensions);

    // 3. Wait for specific element with custom timeout
    await page.waitForSelector('input[name="username"]', { 
      visible: true,
      timeout: 5000 
    });
    console.log('✓ Element found and visible');

    // 4. Mouse actions
    await page.mouse.move(100, 100);
    await page.mouse.click(100, 100);
    console.log('✓ Performed mouse actions');

    // 5. Keyboard actions
    await page.keyboard.press('Tab');
    await page.keyboard.type('Hello from Puppeteer!');
    console.log('✓ Performed keyboard actions');

    // 6. PDF generation (Puppeteer special feature)
    await page.pdf({ 
      path: 'tests/puppeteer/page.pdf',
      format: 'A4'
    });
    console.log('✓ Generated PDF');

    console.log('✅ Puppeteer features demo completed!');
  }, 30000);
});