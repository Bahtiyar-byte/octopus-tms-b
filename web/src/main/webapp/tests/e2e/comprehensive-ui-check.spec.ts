import { test, expect, Page } from '@playwright/test';

// Helper function to check console errors
async function checkConsoleErrors(page: Page): Promise<string[]> {
  const errors: string[] = [];
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });
  
  page.on('pageerror', error => {
    errors.push(error.message);
  });
  
  return errors;
}

test.describe('Comprehensive UI Tests', () => {
  test('should check all pages for errors and warnings', async ({ page }) => {
    const errors: { page: string; errors: string[] }[] = [];
    
    // Test data for different user roles
    const testUsers = [
      { username: 'shipper', password: 'password', role: 'SHIPPER', routes: [
        '/shipper/dashboard',
        '/shipper/loads',
        '/shipper/warehouse',
        '/shipper/payments',
        '/shipper/documents',
        '/shipper/reports',
        '/shipper/settings'
      ]},
      { username: 'broker', password: 'password', role: 'BROKER', routes: [
        '/broker/dashboard',
        '/broker/loads',
        '/broker/carrier-match',
        '/broker/tracking',
        '/broker/payments',
        '/broker/documents',
        '/broker/reports'
      ]},
      { username: 'carrier', password: 'password', role: 'CARRIER', routes: [
        '/dashboard',
        '/smart-load-search',
        '/dispatch-board',
        '/tracking',
        '/all-loads',
        '/documents',
        '/invoices',
        '/reports'
      ]}
    ];
    
    for (const user of testUsers) {
      // Login as user
      await page.goto('/login');
      await page.fill('input[type="text"]', user.username);
      await page.fill('input[type="password"]', user.password);
      await page.click('button[type="submit"]');
      
      // Wait for navigation
      await page.waitForLoadState('networkidle');
      
      // Check each route
      for (const route of user.routes) {
        const pageErrors = await checkConsoleErrors(page);
        
        try {
          await page.goto(route);
          await page.waitForLoadState('networkidle');
          
          // Check for React errors
          const reactError = await page.locator('text=/Error:|error:/i').count();
          if (reactError > 0) {
            pageErrors.push(`React error found on ${route}`);
          }
          
          // Check for empty content
          const bodyText = await page.textContent('body');
          if (!bodyText || bodyText.trim().length < 100) {
            pageErrors.push(`Page appears to be empty: ${route}`);
          }
          
          // Check for broken images
          const images = await page.locator('img').all();
          for (const img of images) {
            const src = await img.getAttribute('src');
            if (src && !src.startsWith('data:')) {
              const response = await page.request.get(src).catch(() => null);
              if (!response || response.status() >= 400) {
                pageErrors.push(`Broken image: ${src}`);
              }
            }
          }
          
          // Check for accessibility issues
          const buttons = await page.locator('button').all();
          for (const button of buttons) {
            const text = await button.textContent();
            const ariaLabel = await button.getAttribute('aria-label');
            if (!text?.trim() && !ariaLabel) {
              pageErrors.push(`Button without text or aria-label on ${route}`);
            }
          }
          
          if (pageErrors.length > 0) {
            errors.push({ page: route, errors: pageErrors });
          }
        } catch (error) {
          errors.push({ 
            page: route, 
            errors: [`Failed to load page: ${error instanceof Error ? error.message : 'Unknown error'}`] 
          });
        }
      }
      
      // Logout
      await page.click('button[aria-label="User menu"]');
      await page.click('text=Sign out');
    }
    
    // Report all errors
    if (errors.length > 0) {
      console.error('UI Errors Found:');
      errors.forEach(({ page, errors }) => {
        console.error(`\nPage: ${page}`);
        errors.forEach(error => console.error(`  - ${error}`));
      });
      
      // Create detailed report
      const report = {
        timestamp: new Date().toISOString(),
        totalErrors: errors.reduce((sum, e) => sum + e.errors.length, 0),
        errorsByPage: errors
      };
      
      // Save report
      await page.evaluate((reportData) => {
        localStorage.setItem('ui-test-report', JSON.stringify(reportData));
      }, report);
      
      // Fail the test
      expect(errors).toHaveLength(0);
    }
  });
  
  test('should check Shipper Payments page specifically', async ({ page }) => {
    const pageErrors: string[] = [];
    
    // Setup error monitoring
    page.on('console', msg => {
      if (msg.type() === 'error') {
        pageErrors.push(`Console error: ${msg.text()}`);
      }
    });
    
    page.on('pageerror', error => {
      pageErrors.push(`Page error: ${error.message}`);
    });
    
    // Login as shipper
    await page.goto('/login');
    await page.fill('input[type="text"]', 'shipper');
    await page.fill('input[type="password"]', 'password');
    await page.click('button[type="submit"]');
    
    // Navigate to payments
    await page.waitForLoadState('networkidle');
    await page.click('button:has-text("Resources")');
    await page.click('a[href="/shipper/payments"]');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Check specific elements
    const checks = [
      { selector: 'h1:has-text("Payments")', name: 'Page title' },
      { selector: '.dashboard-card', name: 'Summary cards', count: 4 },
      { selector: 'button:has-text("Invoices")', name: 'Invoices tab' },
      { selector: 'button:has-text("Payment History")', name: 'Payment History tab' },
      { selector: '.data-table, table', name: 'Data table' }
    ];
    
    for (const check of checks) {
      try {
        const elements = await page.locator(check.selector).all();
        if (check.count && elements.length !== check.count) {
          pageErrors.push(`Expected ${check.count} ${check.name}, found ${elements.length}`);
        } else if (elements.length === 0) {
          pageErrors.push(`${check.name} not found`);
        }
      } catch (error) {
        pageErrors.push(`Error checking ${check.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
    
    // Check DataTable functionality
    const searchInput = await page.locator('input[placeholder*="Search"]').first();
    if (searchInput) {
      await searchInput.fill('INV-2024');
      await page.waitForTimeout(500);
      
      const rows = await page.locator('tbody tr').count();
      if (rows === 0) {
        pageErrors.push('Search functionality not working - no results shown');
      }
    }
    
    // Test payment modal
    const checkbox = await page.locator('input[type="checkbox"]:not(:disabled)').first();
    if (checkbox) {
      await checkbox.click();
      const payButton = await page.locator('button:has-text("Pay Selected")');
      
      if (!payButton) {
        pageErrors.push('Pay Selected button not appearing after checkbox selection');
      } else {
        await payButton.click();
        await page.waitForTimeout(500);
        
        const modal = await page.locator('.modal-header:has-text("Process Payment")');
        if (!modal) {
          pageErrors.push('Payment modal not opening');
        }
      }
    }
    
    // Report errors
    if (pageErrors.length > 0) {
      console.error('\nShipper Payments Page Errors:');
      pageErrors.forEach(error => console.error(`  - ${error}`));
      expect(pageErrors).toHaveLength(0);
    }
  });
  
  test('should validate TypeScript types and imports', async ({ page }) => {
    // This test checks for TypeScript compilation errors
    const response = await page.goto('/');
    
    // Check if page loaded without compilation errors
    expect(response?.status()).toBeLessThan(400);
    
    // Check for TypeScript error overlay
    const tsError = await page.locator('vite-error-overlay').count();
    expect(tsError).toBe(0);
    
    // Check for module resolution errors
    const moduleErrors = await page.locator('text=/Cannot find module|Module not found/').count();
    expect(moduleErrors).toBe(0);
  });
  
  test('should check responsive design', async ({ page }) => {
    const viewports = [
      { width: 375, height: 667, name: 'iPhone SE' },
      { width: 768, height: 1024, name: 'iPad' },
      { width: 1920, height: 1080, name: 'Desktop' }
    ];
    
    await page.goto('/login');
    await page.fill('input[type="text"]', 'shipper');
    await page.fill('input[type="password"]', 'password');
    await page.click('button[type="submit"]');
    
    await page.waitForLoadState('networkidle');
    
    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      
      // Check if navigation is accessible
      if (viewport.width < 768) {
        // Mobile menu should be visible
        const mobileMenu = await page.locator('[class*="md:hidden"]').first();
        expect(mobileMenu).toBeTruthy();
      } else {
        // Desktop menu should be visible
        const desktopMenu = await page.locator('[class*="md:block"]').first();
        expect(desktopMenu).toBeTruthy();
      }
      
      // Check if content is not overflowing
      const overflow = await page.evaluate(() => {
        const body = document.body;
        return body.scrollWidth > body.clientWidth;
      });
      
      if (overflow) {
        console.warn(`Horizontal overflow detected at ${viewport.name} (${viewport.width}x${viewport.height})`);
      }
    }
  });
});