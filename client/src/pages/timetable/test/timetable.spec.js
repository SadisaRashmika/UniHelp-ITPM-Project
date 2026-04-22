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
    // Mock the API to be slow so we can catch the loading state
    await page.route('**/api/timetable/timeslots', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, timeslots: [] }),
      });
    });

    await page.goto('/timetable');
    const loadingText = page.locator('text=Loading timetable...');
    await expect(loadingText).toBeVisible();
  });

  test('should navigate between weeks', async ({ page }) => {
    await page.goto('/timetable');

    const weekText = page.locator('text=Week 1');
    await expect(weekText).toBeVisible();

    // Click next week
    await page.locator('button').nth(1).click(); // ChevronRight is second button in header
    await expect(page.locator('text=Week 2')).toBeVisible();

    // Click previous week
    await page.locator('button').nth(0).click(); // ChevronLeft is first button in header
    await expect(page.locator('text=Week 1')).toBeVisible();
  });

  test('should display stats cards for lecturer', async ({ page }) => {
    await page.goto('/timetable');

    await expect(page.locator('text=Sessions')).toBeVisible();
    await expect(page.locator('text=Total Seats')).toBeVisible();
    await expect(page.locator('text=Hours/Week')).toBeVisible();
  });

  test('should load student timetable view', async ({ page }) => {
    // Mock the student bookings API
    await page.route('**/api/timetable/bookings/my', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, bookings: [] }),
      });
    });

    await page.goto('/student/timetable');

    const title = page.locator('h1');
    await expect(title).toContainText('My Timetable');
    await expect(page.locator('text=Booked')).toBeVisible();
  });
});