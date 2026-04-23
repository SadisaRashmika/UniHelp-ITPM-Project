const { test, expect } = require('@playwright/test');

test.describe('VIMO Student Feedback Management', () => {
    const studentVimoPath = '/vimo/student';

    test('Should open and validate the Add Review form', async ({ page }) => {
        await page.goto(studentVimoPath);
        
        // Navigate to Feedback section
        await page.getByText('Feedback Manage').click();
        
        // Open Add Review form
        await page.getByRole('button', { name: /Add Review/i }).click();
        
        // Verify form elements
        await expect(page.getByText('New Feedback')).toBeVisible();
        await expect(page.locator('select').first()).toBeVisible(); // Lecturer selection
        await expect(page.getByPlaceholder('e.g. System Control')).toBeVisible(); // Subject input
        await expect(page.getByPlaceholder('Execute deep-dive analysis...')).toBeVisible(); // Comment
        
        // Check for action buttons
        await expect(page.getByRole('button', { name: /Initialize Transmission/i })).toBeVisible();
        await expect(page.getByRole('button', { name: /Decouple/i })).toBeVisible();
    });
});
