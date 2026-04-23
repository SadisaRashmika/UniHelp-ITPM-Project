const { test, expect } = require('@playwright/test');

test.describe('VIMO Lecture Command Center', () => {
    const lectureVimoPath = '/vimo/lecture';

    test('Should display lecture portal metrics', async ({ page }) => {
        await page.goto(lectureVimoPath);
        
        // Check for dashboard stats
        await expect(page.getByText('Total Students')).toBeVisible();
        await expect(page.getByText('Average Merit')).toBeVisible();
        await expect(page.getByText('Active Modules')).toBeVisible();
        
        // Verify Command Center header
        await expect(page.getByText('Academic Command Center')).toBeVisible();
    });

    test('Should navigate through lecture sidebar categories', async ({ page }) => {
        await page.goto(lectureVimoPath);
        
        // Verify sidebar headers
        await expect(page.getByText('Analytical Hub')).toBeVisible();
        await expect(page.getByText('System Administration')).toBeVisible();
    });
});
