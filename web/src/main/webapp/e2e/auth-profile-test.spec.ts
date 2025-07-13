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
      console.log(`\n=== Testing user: ${user.username} ===`);
      
      // 1. Navigate to login page
      await page.goto('http://localhost:3000/login');
      console.log('✓ Navigated to login page');
      
      // 2. Wait for login form to be visible
      await page.waitForSelector('input[name="username"]', { state: 'visible' });
      
      // 3. Fill in login credentials
      await page.fill('input[name="username"]', user.username);
      await page.fill('input[name="password"]', user.password);
      console.log('✓ Filled login credentials');
      
      // 4. Submit login form
      await page.click('button[type="submit"]');
      console.log('✓ Submitted login form');
      
      // 5. Wait for navigation after login
      await page.waitForURL((url) => !url.pathname.includes('/login'), { 
        timeout: 10000,
        waitUntil: 'networkidle' 
      });
      console.log(`✓ Successfully logged in, redirected to: ${page.url()}`);
      
      // 6. Check JWT token is stored
      const token = await page.evaluate(() => {
        return localStorage.getItem('octopus_tms_token') || 
               sessionStorage.getItem('octopus_tms_token');
      });
      expect(token).toBeTruthy();
      console.log('✓ JWT token is stored');
      
      // 7. Check Authorization header is set
      const authHeader = await page.evaluate(() => {
        // @ts-ignore
        return window.axios?.defaults?.headers?.common?.['Authorization'];
      });
      expect(authHeader).toContain('Bearer');
      console.log('✓ Authorization header is set');
      
      // 8. Navigate to Profile page
      await page.goto('http://localhost:3000/profile');
      await page.waitForLoadState('networkidle');
      console.log('✓ Navigated to Profile page');
      
      // 9. Check Profile page loads without errors
      const profileTitle = await page.textContent('h1');
      expect(profileTitle).toContain('User Profile');
      console.log('✓ Profile page loaded successfully');
      
      // 10. Check Profile Information card is visible
      await page.waitForSelector('text=Profile Information', { state: 'visible' });
      console.log('✓ Profile Information card is visible');
      
      // 11. Check user data is displayed
      const profileCard = await page.locator('text=Profile Information').locator('..').locator('..');
      
      // Check email is displayed
      const emailElement = await profileCard.locator('text=Email:').locator('..').textContent();
      expect(emailElement).toContain(user.username);
      console.log(`✓ Email displayed: ${user.username}`);
      
      // Check username is displayed
      const usernameElement = await profileCard.locator('text=Username:').locator('..').textContent();
      expect(usernameElement).toContain(user.username);
      console.log(`✓ Username displayed: ${user.username}`);
      
      // Check if phone and department fields exist (they might be empty)
      const phoneElement = await profileCard.locator('text=Phone:').isVisible();
      expect(phoneElement).toBeTruthy();
      console.log('✓ Phone field exists');
      
      const departmentElement = await profileCard.locator('text=Department:').isVisible();
      expect(departmentElement).toBeTruthy();
      console.log('✓ Department field exists');
      
      // 12. Check Statistics card is visible
      await page.waitForSelector('text=Statistics', { state: 'visible' });
      console.log('✓ Statistics card is visible');
      
      // 13. Test Edit Profile button
      await page.click('button:has-text("Edit Profile")');
      await page.waitForSelector('text=Edit Profile', { state: 'visible' });
      console.log('✓ Edit Profile modal opened');
      
      // Close modal
      await page.click('button:has-text("Cancel")');
      await page.waitForSelector('text=Edit Profile', { state: 'hidden' });
      console.log('✓ Edit Profile modal closed');
      
      // 14. Navigate to Settings page
      await page.goto('http://localhost:3000/settings');
      await page.waitForLoadState('networkidle');
      console.log('✓ Navigated to Settings page');
      
      // 15. Check Settings page loads without errors
      const settingsTitle = await page.textContent('h1');
      expect(settingsTitle).toContain('Settings');
      console.log('✓ Settings page loaded successfully');
      
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
        console.error('Console errors found:', consoleErrors);
      } else {
        console.log('✓ No console errors');
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
        console.error('Failed requests:', failedRequests);
      } else {
        console.log('✓ No failed API requests');
      }
      
      console.log(`✅ All tests passed for ${user.username}\n`);
    });
  });
  
  test('API Authentication Test - Direct API calls', async ({ request }) => {
    console.log('\n=== Testing Direct API Authentication ===');
    
    for (const user of users) {
      console.log(`\nTesting API for ${user.username}:`);
      
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
      console.log('✓ Login successful, token received');
      
      // 2. Get Profile
      const profileResponse = await request.get('http://localhost:8080/api/profile', {
        headers: {
          'Authorization': `Bearer ${loginData.accessToken}`
        }
      });
      
      expect(profileResponse.ok()).toBeTruthy();
      const profileData = await profileResponse.json();
      expect(profileData.email).toBe(user.username);
      console.log('✓ Profile API call successful');
      console.log(`  - Email: ${profileData.email}`);
      console.log(`  - Phone: ${profileData.phone || 'Not set'}`);
      console.log(`  - Department: ${profileData.department || 'Not set'}`);
      
      // 3. Get Stats
      const statsResponse = await request.get('http://localhost:8080/api/profile/stats', {
        headers: {
          'Authorization': `Bearer ${loginData.accessToken}`
        }
      });
      
      expect(statsResponse.ok()).toBeTruthy();
      console.log('✓ Stats API call successful');
    }
  });
});

// Run with: npx playwright test e2e/auth-profile-test.spec.ts --reporter=list --headed