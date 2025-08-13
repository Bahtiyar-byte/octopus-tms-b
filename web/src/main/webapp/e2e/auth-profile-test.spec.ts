import { test, expect } from '@playwright/test';

const users = [
  { username: 'brandon.hay@octopus-tms.com', password: 'password', name: 'Brandon Hay' },
  { username: 'test@test.com', password: 'password', name: 'Test User' },
  { username: 'carrier1@octopustms.com', password: 'password', name: 'John Carrier' },
  { username: 'admin@octopustms.com', password: 'password', name: 'Admin User' },
  { username: 'emily.anderson@octopus-tms.com', password: 'password', name: 'Emily Anderson' },
  { username: 'shipper1@octopustms.com', password: 'password', name: 'Sarah Shipper' }
];

test.describe('Authentication and Profile Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Clear any existing auth data
    await page.context().clearCookies();
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  });

  users.forEach(user => {
    test(`Login and Profile test for ${user.username}`, async ({ page }) => {
      
      // 1. Navigate to login page
      await page.goto('http://localhost:3000/login');
      
      // 2. Wait for login form to be visible
      await page.waitForSelector('input[name="username"]', { state: 'visible' });
      
      // 3. Fill in login credentials
      await page.fill('input[name="username"]', user.username);
      await page.fill('input[name="password"]', user.password);
      
      // 4. Submit login form
      await page.click('button[type="submit"]');
      
      // 5. Wait for navigation after login
      await page.waitForURL((url) => !url.pathname.includes('/login'), { 
        timeout: 10000,
        waitUntil: 'networkidle' 
      });
      
      // 6. Check JWT token is stored
      const token = await page.evaluate(() => {
        return localStorage.getItem('octopus_tms_token') || 
               sessionStorage.getItem('octopus_tms_token');
      });
      expect(token).toBeTruthy();
      
      // 7. Check Authorization header is set
      const authHeader = await page.evaluate(() => {
        // @ts-ignore
        return window.axios?.defaults?.headers?.common?.['Authorization'];
      });
      expect(authHeader).toContain('Bearer');
      
      // 8. Navigate to Profile page
      await page.goto('http://localhost:3000/profile');
      await page.waitForLoadState('networkidle');
      
      // 9. Check Profile page loads without errors
      const profileTitle = await page.textContent('h1');
      expect(profileTitle).toContain('User Profile');
      
      // 10. Check Profile Information card is visible
      await page.waitForSelector('text=Profile Information', { state: 'visible' });
      
      // 11. Check user data is displayed
      const profileCard = await page.locator('text=Profile Information').locator('..').locator('..');
      
      // Check email is displayed
      const emailElement = await profileCard.locator('text=Email:').locator('..').textContent();
      expect(emailElement).toContain(user.username);
      
      // Check username is displayed
      const usernameElement = await profileCard.locator('text=Username:').locator('..').textContent();
      expect(usernameElement).toContain(user.username);
      
      // Check if phone and department fields exist (they might be empty)
      const phoneElement = await profileCard.locator('text=Phone:').isVisible();
      expect(phoneElement).toBeTruthy();
      
      const departmentElement = await profileCard.locator('text=Department:').isVisible();
      expect(departmentElement).toBeTruthy();
      
      // 12. Check Statistics card is visible
      await page.waitForSelector('text=Statistics', { state: 'visible' });
      
      // 13. Test Edit Profile button
      await page.click('button:has-text("Edit Profile")');
      await page.waitForSelector('text=Edit Profile', { state: 'visible' });
      
      // Close modal
      await page.click('button:has-text("Cancel")');
      await page.waitForSelector('text=Edit Profile', { state: 'hidden' });
      
      // 14. Navigate to Settings page
      await page.goto('http://localhost:3000/settings');
      await page.waitForLoadState('networkidle');
      
      // 15. Check Settings page loads without errors
      const settingsTitle = await page.textContent('h1');
      expect(settingsTitle).toContain('Settings');
      
      // 16. Check for any API errors in console
      const consoleErrors: string[] = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });
      
      // Wait a bit to catch any delayed errors
      await page.waitForTimeout(2000);
      
      if (consoleErrors.length > 0) {
      } else {
      }
      
      // 17. Check network requests for errors
      const failedRequests: string[] = [];
      page.on('response', (response) => {
        if (response.status() >= 400) {
          failedRequests.push(`${response.status()} - ${response.url()}`);
        }
      });
      
      // Make a profile API call to test
      await page.evaluate(async () => {
        try {
          const response = await fetch('/api/profile', {
            headers: {
              'Authorization': localStorage.getItem('octopus_tms_token') || 
                             sessionStorage.getItem('octopus_tms_token') || ''
            }
          });
          return response.status;
        } catch (error) {
          return 0;
        }
      });
      
      await page.waitForTimeout(1000);
      
      if (failedRequests.length > 0) {
      } else {
      }
      
    });
  });
  
  test('API Authentication Test - Direct API calls', async ({ request }) => {
    
    for (const user of users) {
      
      // 1. Login
      const loginResponse = await request.post('http://localhost:8080/api/authenticate', {
        data: {
          username: user.username,
          password: user.password
        }
      });
      
      expect(loginResponse.ok()).toBeTruthy();
      const loginData = await loginResponse.json();
      expect(loginData.accessToken).toBeTruthy();
      
      // 2. Get Profile
      const profileResponse = await request.get('http://localhost:8080/api/profile', {
        headers: {
          'Authorization': `Bearer ${loginData.accessToken}`
        }
      });
      
      expect(profileResponse.ok()).toBeTruthy();
      const profileData = await profileResponse.json();
      expect(profileData.email).toBe(user.username);
      
      // 3. Get Stats
      const statsResponse = await request.get('http://localhost:8080/api/profile/stats', {
        headers: {
          'Authorization': `Bearer ${loginData.accessToken}`
        }
      });
      
      expect(statsResponse.ok()).toBeTruthy();
    }
  });
});

// Run with: npx playwright test e2e/auth-profile-test.spec.ts --reporter=list --headed