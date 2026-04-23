const { test, expect } = require('@playwright/test');

test.describe('VIMO Student Dashboard', () => {
    const studentVimoPath = '/vimo/student';

    test('Should display student metrics and milestone trajectory', async ({ page }) => {
        await page.goto(studentVimoPath);
        
        // Check for key metrics
        await expect(page.getByText('Experience Points')).toBeVisible();
        await expect(page.getByText('Academic Level')).toBeVisible();
        await expect(page.getByText('Global Rank')).toBeVisible();
        
        // Check for Milestone Trajectory
        await expect(page.getByText('Milestone Trajectory')).toBeVisible();
        await expect(page.locator('.w-full.bg-white\\/10')).toBeVisible(); // Progress bar container
    });

    test('Should navigate through student sidebar', async ({ page }) => {
        await page.goto(studentVimoPath);
        
        // Verify sidebar items
        await expect(page.getByText('My Overview')).toBeVisible();
        await expect(page.getByText('Feedback Manage')).toBeVisible();
        await expect(page.getByText('Inquiry Support')).toBeVisible();
    });
});
