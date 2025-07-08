/**
 * Simple Playwright Demo - Working with TMS Login
 */

import { test, expect } from '@playwright/test';

test.describe('Puppeteer vs Playwright Demo', () => {
  test('Playwright: Login with visual feedback', async ({ page }) => {
    console.log('🎭 Starting Playwright Test...');
    
    // Navigate to login page
    await page.goto('http://localhost:3000/login');
    console.log('✓ Navigated to login page');

    // Take screenshot of login page
    await page.screenshot({ 
      path: 'tests/e2e/1-playwright-login-page.png'
    });

    // Fill in login form
    await page.fill('input[name="username"]', 'dispatcher');
    await page.fill('input[name="password"]', 'password123');
    console.log('✓ Filled login credentials');

    // Check remember me
    await page.check('input[name="rememberMe"]');

    // Take screenshot before login
    await page.screenshot({ 
      path: 'tests/e2e/2-playwright-before-submit.png'
    });

    // Click login button
    await page.click('button[type="submit"]');
    console.log('✓ Clicked login button');

    // Wait for navigation
    await page.waitForURL('**/dashboard**', { timeout: 10000 });
    console.log('✓ Successfully logged in and redirected to dashboard');

    // Take screenshot of dashboard
    await page.screenshot({ 
      path: 'tests/e2e/3-playwright-dashboard.png',
      fullPage: true
    });

    // Verify dashboard elements
    const pageTitle = await page.title();
    console.log(`✓ Page title: ${pageTitle}`);

    console.log('✅ Playwright test completed successfully!');
  });

  test('Playwright: Advanced features demo', async ({ page, context }) => {
    console.log('🎭 Demonstrating Playwright\'s advanced features...');

    // 1. Network interception
    await page.route('**/api/**', route => {
      console.log(`  🔍 Intercepted API call: ${route.request().url()}`);
      route.continue();
    });

    // 2. Multiple browser contexts (isolated sessions)
    const newContext = await context.browser()!.newContext();
    const newPage = await newContext.newPage();
    
    await Promise.all([
      page.goto('http://localhost:3000/login'),
      newPage.goto('http://localhost:3000/login')
    ]);
    
    console.log('✓ Created multiple isolated browser contexts');

    // 3. Auto-waiting demonstration
    await page.fill('input[name="username"]', 'admin');
    // Playwright automatically waits for the element to be:
    // - attached to DOM
    // - visible
    // - stable
    // - enabled
    // - editable
    
    // 4. Multiple selectors
    await page.click('button:has-text("Sign In"), button[type="submit"]');
    console.log('✓ Used Playwright\'s flexible selector engine');

    // 5. Mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.screenshot({ 
      path: 'tests/e2e/4-playwright-mobile-view.png'
    });
    console.log('✓ Tested mobile viewport');

    // 6. Trace recording (for debugging)
    await context.tracing.start({ screenshots: true, snapshots: true });
    await page.goto('http://localhost:3000');
    await context.tracing.stop({ path: 'tests/e2e/trace.zip' });
    console.log('✓ Created trace file for debugging');

    await newContext.close();
    console.log('✅ Advanced features demo completed!');
  });
});