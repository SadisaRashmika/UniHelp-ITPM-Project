const { test, expect } = require('@playwright/test');

test.describe('VIMO Lecture Management & Analytics', () => {
    const lectureVimoPath = '/vimo/lecture';

    test('Should access student sentiment analytics', async ({ page }) => {
        await page.goto(lectureVimoPath);
        
        // Navigate to My Reviews
        await page.getByText('My Reviews').click();
        
        await expect(page.getByText('Student Sentiment Analytics')).toBeVisible();
        await expect(page.getByRole('button', { name: /Export Analytics/i })).toBeVisible();
    });

    test('Should access user management and filter accounts', async ({ page }) => {
        await page.goto(lectureVimoPath);
        
        // Navigate to User Management
        await page.getByText('User Management').click();
        
        // Check for search and tabs
        await expect(page.getByPlaceholder(/Search for entities/i)).toBeVisible();
        await expect(page.getByRole('button', { name: 'Lecturers' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Students' })).toBeVisible();
    });
});
