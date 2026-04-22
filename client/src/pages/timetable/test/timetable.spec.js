import { test, expect } from '@playwright/test';

test.describe('Timetable Page', () => {
  test('should load the lecturer timetable page', async ({ page }) => {
    // Increase timeout to give the server time to respond
    await page.goto('/timetable', { waitUntil: 'networkidle' }); 
    
    // Check if we are actually on the timetable page or were redirected
    const url = page.url();
    console.log('Current URL:', url);

    const title = page.locator('h1');
    await expect(title).toContainText('Teaching Schedule', { timeout: 10000 });
  });

  test('should show loading state initially', async ({ page }) => {
    await page.goto('/timetable');
    const loadingText = page.locator('text=Loading timetable...');
    await expect(loadingText).toBeVisible();
  });
});
