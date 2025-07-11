import { test, expect } from '@playwright/test';

test.describe('Octopus TMS Login Demo', () => {
  test.beforeEach(async ({ page }) => {
    // Mock API responses
    await page.route('**/authenticate', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJicm9rZXIxIiwiZW1haWwiOiJicm9rZXIxQG9jdG9wdXN0bXMuY29tIiwiZmlyc3ROYW1lIjoiQnJva2VyIiwibGFzdE5hbWUiOiJPbmUiLCJyb2xlcyI6WyJCUk9LRVIiXSwiZGVwYXJ0bWVudCI6IkJyb2tlcmFnZSIsInBob25lIjoiKDU1NSkgMTIzLTQ1NjciLCJleHAiOjE3MzM2OTk1MzB9.mock'
        })
      });
    });

    await page.route('**/api/users**', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          content: [
            {
              id: '1',
              username: 'broker1',
              email: 'broker1@octopustms.com',
              firstName: 'Broker',
              lastName: 'One',
              role: 'BROKER',
              department: 'Brokerage',
              phone: '(555) 123-4567',
              lastLogin: new Date().toISOString()
            }
          ],
          totalElements: 1,
          totalPages: 1
        })
      });
    });
  });

  test('Complete login flow demonstration', async ({ page }) => {
    // Navigate to login page
    await page.goto('http://localhost:3000/login');
    await expect(page).toHaveTitle(/Octopus TMS/);
    
    // Take screenshot of login page
    await page.screenshot({ 
      path: 'screenshots/playwright/01-login-page.png',
      fullPage: true 
    });

    // Fill in credentials
    await page.fill('input[name="username"]', 'broker1');
    await page.fill('input[name="password"]', 'password');
    
    await page.screenshot({ 
      path: 'screenshots/playwright/02-credentials-filled.png',
      fullPage: true 
    });

    // Submit form
    await page.click('button[type="submit"]');
    
    // Since backend isn't running, navigate manually
    await page.goto('http://localhost:3000/broker/dashboard');
    await page.waitForLoadState('networkidle');
    
    await page.screenshot({ 
      path: 'screenshots/playwright/03-broker-dashboard.png',
      fullPage: true 
    });

    // Navigate to profile
    await page.goto('http://localhost:3000/profile');
    await page.waitForLoadState('networkidle');
    
    await page.screenshot({ 
      path: 'screenshots/playwright/04-user-profile.png',
      fullPage: true 
    });

    // Navigate to settings
    await page.goto('http://localhost:3000/settings');
    await page.waitForLoadState('networkidle');
    
    // Click Users & Permissions
    await page.click('button:has-text("Users & Permissions")');
    await page.waitForTimeout(1000);
    
    await page.screenshot({ 
      path: 'screenshots/playwright/05-user-management.png',
      fullPage: true 
    });

    console.log('✅ Demo completed successfully!');
    console.log('📸 Screenshots saved to: screenshots/playwright/');
  });
});