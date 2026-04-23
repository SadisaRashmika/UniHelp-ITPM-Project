const { test, expect } = require('@playwright/test');

test.describe('VIMO Student Inquiry Support', () => {
    const studentVimoPath = '/vimo/student';

    test('Should access inquiry support and check ticket status', async ({ page }) => {
        await page.goto(studentVimoPath);
        
        // Navigate to Inquiry Support section
        await page.getByText('Inquiry Support').click();
        
        // Verify section header
        await expect(page.getByText('Support Lifecycle')).toBeVisible();
        
        // Check if "Open Inquiry" button is present
        await expect(page.getByRole('button', { name: /Open Inquiry/i })).toBeVisible();
    });

    test('Should view active inquiries list', async ({ page }) => {
        await page.goto(studentVimoPath);
        await page.getByText('Inquiry Support').click();
        
        // Check for common elements in the inquiry list
        await expect(page.getByText('Recent Perspective Logs')).toBeVisible();
    });
});
