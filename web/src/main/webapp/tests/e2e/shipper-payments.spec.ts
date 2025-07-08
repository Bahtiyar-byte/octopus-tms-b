import { test, expect } from '@playwright/test';

test.describe('Shipper Payments Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to login page
    await page.goto('/login');
    
    // Login as shipper
    await page.fill('input[type="text"]', 'shipper');
    await page.fill('input[type="password"]', 'password');
    await page.click('button[type="submit"]');
    
    // Wait for navigation
    await expect(page).toHaveURL('/shipper/dashboard');
    
    // Navigate to payments page via the Resources dropdown
    await page.click('button:has-text("Resources")');
    await page.click('a[href="/shipper/payments"]');
    
    // Wait for payments page to load
    await expect(page).toHaveURL('/shipper/payments');
  });

  test('should display the payments page with correct elements', async ({ page }) => {
    // Check page title
    await expect(page.locator('h1')).toHaveText('Payments');
    
    // Check summary cards
    await expect(page.locator('.dashboard-card')).toHaveCount(4);
    await expect(page.locator('text=Total Outstanding')).toBeVisible();
    await expect(page.locator('text=Overdue')).toBeVisible();
    await expect(page.locator('text=Total Paid (MTD)')).toBeVisible();
    await expect(page.locator('text=Next Payment Due')).toBeVisible();
    
    // Check tabs
    await expect(page.locator('button:has-text("Invoices")')).toBeVisible();
    await expect(page.locator('button:has-text("Payment History")')).toBeVisible();
  });

  test('should display invoices in the table', async ({ page }) => {
    // Check if DataTable is rendered
    await expect(page.locator('.data-table')).toBeVisible();
    
    // Check table headers
    await expect(page.locator('th:has-text("Invoice #")')).toBeVisible();
    await expect(page.locator('th:has-text("Broker")')).toBeVisible();
    await expect(page.locator('th:has-text("Amount")')).toBeVisible();
    await expect(page.locator('th:has-text("Due Date")')).toBeVisible();
    await expect(page.locator('th:has-text("Status")')).toBeVisible();
    await expect(page.locator('th:has-text("Actions")')).toBeVisible();
  });

  test('should select invoices and show pay button', async ({ page }) => {
    // Click on a checkbox
    await page.locator('input[type="checkbox"]:not(:disabled)').first().click();
    
    // Check if "Pay Selected" button appears
    await expect(page.locator('button:has-text("Pay Selected")')).toBeVisible();
    
    // Check if selected invoice summary appears
    await expect(page.locator('text=/invoice.*selected/')).toBeVisible();
  });

  test('should open payment modal when pay button is clicked', async ({ page }) => {
    // Select an invoice
    await page.locator('input[type="checkbox"]:not(:disabled)').first().click();
    
    // Click pay button
    await page.click('button:has-text("Pay Selected")');
    
    // Check if modal opens
    await expect(page.locator('.modal-header:has-text("Process Payment")')).toBeVisible();
    
    // Check payment method options
    await expect(page.locator('button:has-text("ACH Transfer")')).toBeVisible();
    await expect(page.locator('button:has-text("Wire Transfer")')).toBeVisible();
    await expect(page.locator('button:has-text("Check")')).toBeVisible();
    await expect(page.locator('button:has-text("Credit Card")')).toBeVisible();
  });

  test('should switch to payment history tab', async ({ page }) => {
    // Click payment history tab
    await page.click('button:has-text("Payment History")');
    
    // Check if payment history table is displayed
    await expect(page.locator('th:has-text("Reference #")')).toBeVisible();
    await expect(page.locator('th:has-text("Invoice #")')).toBeVisible();
    await expect(page.locator('th:has-text("Amount")')).toBeVisible();
    await expect(page.locator('th:has-text("Payment Date")')).toBeVisible();
    await expect(page.locator('th:has-text("Method")')).toBeVisible();
  });

  test('should view invoice details', async ({ page }) => {
    // Click on view button
    await page.locator('button[title="View Invoice"]').first().click();
    
    // Check if invoice modal opens
    await expect(page.locator('.modal-header:has-text("Invoice Details")')).toBeVisible();
    await expect(page.locator('text=Invoice Header')).toBeVisible();
    await expect(page.locator('text=Broker Information')).toBeVisible();
    await expect(page.locator('text=Associated Loads')).toBeVisible();
  });

  test('should handle payment form validation', async ({ page }) => {
    // Select an invoice
    await page.locator('input[type="checkbox"]:not(:disabled)').first().click();
    
    // Click pay button
    await page.click('button:has-text("Pay Selected")');
    
    // Clear payment amount
    await page.fill('input[type="number"]', '');
    
    // Try to submit
    await page.click('button:has-text("Process Payment")');
    
    // Should see error notification
    await expect(page.locator('text=Please enter a valid payment amount')).toBeVisible();
  });

  test('should display correct payment method forms', async ({ page }) => {
    // Select an invoice and open payment modal
    await page.locator('input[type="checkbox"]:not(:disabled)').first().click();
    await page.click('button:has-text("Pay Selected")');
    
    // Test ACH form
    await page.click('button:has-text("ACH Transfer")');
    await expect(page.locator('select:has-text("Business Checking")')).toBeVisible();
    
    // Test Wire form
    await page.click('button:has-text("Wire Transfer")');
    await expect(page.locator('text=Wire Transfer Instructions')).toBeVisible();
    
    // Test Credit Card form
    await page.click('button:has-text("Credit Card")');
    await expect(page.locator('input[placeholder="1234 5678 9012 3456"]')).toBeVisible();
    await expect(page.locator('input[placeholder="MM/YY"]')).toBeVisible();
    await expect(page.locator('input[placeholder="123"]')).toBeVisible();
  });
});