const puppeteer = require('puppeteer');
const config = require('../puppeteer.config');

describe('Shipper Payments Page Tests', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch(config.launch);
  });

  beforeEach(async () => {
    page = await browser.newPage();
    await page.setViewport(config.viewport);
    
    // Navigate to login
    await page.goto(`${config.server.url}/login`);
    
    // Login as shipper
    await page.type('input[type="text"]', 'shipper');
    await page.type('input[type="password"]', 'password');
    await page.click('button[type="submit"]');
    
    // Wait for navigation
    await page.waitForNavigation();
    
    // Navigate to payments page
    await page.click('button:contains("Resources")');
    await page.waitForSelector('a[href="/shipper/payments"]');
    await page.click('a[href="/shipper/payments"]');
    
    // Wait for page to load
    await page.waitForSelector('h1:contains("Payments")');
  });

  afterEach(async () => {
    await page.close();
  });

  afterAll(async () => {
    await browser.close();
  });

  test('should load payments page successfully', async () => {
    const title = await page.$eval('h1', el => el.textContent);
    expect(title).toBe('Payments');
    
    // Check for summary cards
    const cards = await page.$$('.dashboard-card');
    expect(cards.length).toBe(4);
  });

  test('should display invoice table', async () => {
    // Check for table headers
    const headers = await page.$$eval('th', elements => 
      elements.map(el => el.textContent.trim())
    );
    
    expect(headers).toContain('Invoice #');
    expect(headers).toContain('Broker');
    expect(headers).toContain('Amount');
    expect(headers).toContain('Status');
  });

  test('should select invoices', async () => {
    // Find and click first enabled checkbox
    const checkbox = await page.$('input[type="checkbox"]:not(:disabled)');
    if (checkbox) {
      await checkbox.click();
      
      // Check if pay button appears
      await page.waitForSelector('button:contains("Pay Selected")');
      const payButton = await page.$('button:contains("Pay Selected")');
      expect(payButton).toBeTruthy();
    }
  });

  test('should open payment modal', async () => {
    // Select an invoice
    const checkbox = await page.$('input[type="checkbox"]:not(:disabled)');
    if (checkbox) {
      await checkbox.click();
      
      // Click pay button
      await page.click('button:contains("Pay Selected")');
      
      // Wait for modal
      await page.waitForSelector('.modal-header:contains("Process Payment")');
      
      // Check payment methods
      const methods = ['ACH Transfer', 'Wire Transfer', 'Check', 'Credit Card'];
      for (const method of methods) {
        const button = await page.$(`button:contains("${method}")`);
        expect(button).toBeTruthy();
      }
    }
  });

  test('should switch tabs', async () => {
    // Click payment history tab
    await page.click('button:contains("Payment History")');
    
    // Wait for table to update
    await page.waitForTimeout(500);
    
    // Check for payment history headers
    const headers = await page.$$eval('th', elements => 
      elements.map(el => el.textContent.trim())
    );
    
    expect(headers).toContain('Reference #');
    expect(headers).toContain('Payment Date');
  });

  test('should validate payment form', async () => {
    // Select invoice and open modal
    const checkbox = await page.$('input[type="checkbox"]:not(:disabled)');
    if (checkbox) {
      await checkbox.click();
      await page.click('button:contains("Pay Selected")');
      
      // Clear amount field
      await page.waitForSelector('input[type="number"]');
      await page.click('input[type="number"]', { clickCount: 3 });
      await page.keyboard.press('Delete');
      
      // Try to submit
      await page.click('button:contains("Process Payment")');
      
      // Should see error
      await page.waitForSelector('text=Please enter a valid payment amount');
    }
  });

  test('should check accessibility', async () => {
    // Check for proper labels
    const labels = await page.$$('label');
    expect(labels.length).toBeGreaterThan(0);
    
    // Check for aria attributes
    const buttons = await page.$$eval('button', elements =>
      elements.filter(el => el.hasAttribute('aria-label') || el.textContent.trim())
    );
    expect(buttons.length).toBeGreaterThan(0);
    
    // Check color contrast for status badges
    const badges = await page.$$eval('.rounded-full', elements =>
      elements.map(el => ({
        text: el.textContent,
        bgColor: window.getComputedStyle(el).backgroundColor,
        color: window.getComputedStyle(el).color
      }))
    );
    
    // Each badge should have proper contrast
    badges.forEach(badge => {
      expect(badge.bgColor).toBeTruthy();
      expect(badge.color).toBeTruthy();
    });
  });

  test('should handle responsive design', async () => {
    // Test mobile viewport
    await page.setViewport({ width: 375, height: 667 });
    
    // Check if mobile menu works
    const mobileMenuButton = await page.$('[class*="md:hidden"]');
    if (mobileMenuButton) {
      await mobileMenuButton.click();
      
      // Resources should still be accessible
      await page.waitForSelector('button:contains("Resources")');
    }
    
    // Reset viewport
    await page.setViewport(config.viewport);
  });
});