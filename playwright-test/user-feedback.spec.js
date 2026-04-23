const { test, expect } = require('@playwright/test');

test.describe('User Feedback & Ticketing Module Tests', () => {
    // Note: Adjust the paths based on your React Router setup for these components.
    const feedbackPath = '/student-feedback'; // Replace with actual path
    const ticketingPath = '/student-tickets'; // Replace with actual path

    test('1. Feedback Module: Should open Add Review form', async ({ page }) => {
        await page.goto(feedbackPath);
        
        // Wait for the archive list to be visible
        await expect(page.getByText('New Feedback')).toBeVisible({ timeout: 10000 });

        // Click "Add Review" button to open the form
        await page.getByRole('button', { name: /Add Review/i }).click();

        // Verify the form is opened by checking for the form title and submit button
        await expect(page.getByText('New Feedback')).toBeVisible();
        await expect(page.getByRole('button', { name: /Initialize Transmission/i })).toBeVisible();
    });

    test('2. Feedback Module: Should successfully submit a new feedback', async ({ page }) => {
        await page.goto(feedbackPath);
        
        // Open the form
        await page.getByRole('button', { name: /Add Review/i }).click();

        // 1. Select Staff Identity (Lecturer)
        await page.locator('select').first().selectOption({ index: 1 });

        // 2. Select or enter Knowledge Module (Subject)
        const subjectInput = page.getByPlaceholder('e.g. System Control');
        if (await subjectInput.isVisible()) {
            await subjectInput.fill('Advanced Algorithms');
        } else {
             await page.locator('select').nth(1).selectOption({ index: 1 });
        }

        // 3. Set Merit Quantification (Rating) - clicking the 5th star
        await page.locator('button').filter({ has: page.locator('svg.lucide-star') }).nth(4).click();

        // 4. Enter Analytical Remarks (Comment)
        await page.getByPlaceholder('Execute deep-dive analysis...').fill('Exceptional module delivery and clear concepts.');

        // Submit the form
        await page.getByRole('button', { name: /Initialize Transmission/i }).click();

        // Verify success message appears
        await expect(page.getByText('Injection Successful.')).toBeVisible();
    });

    test('3. Ticketing Module: Should navigate to tickets view and handle empty/populated state', async ({ page }) => {
        await page.goto(ticketingPath);
        
        // Wait for main container to load
        await expect(page.getByText('Support Lifecycle')).toBeVisible({ timeout: 10000 });
        
        // Check if there are no tickets or existing tickets
        const noInquiries = page.getByText('No Active Inquiries');
        const openInquiryBtn = page.getByRole('button', { name: /Open Inquiry/i });
        
        if (await noInquiries.isVisible()) {
            await expect(noInquiries).toBeVisible();
        } else {
            await expect(openInquiryBtn).toBeVisible();
        }
    });

    test('4. Ticketing Module: Should correctly open new inquiry form', async ({ page }) => {
        await page.goto(ticketingPath);
        
        // Click either "Submit First Ticket" or "Open Inquiry" depending on state
        const firstTicketBtn = page.getByRole('button', { name: /Submit First Ticket/i });
        const openBtn = page.getByRole('button', { name: /Open Inquiry/i });
        
        if (await firstTicketBtn.isVisible()) {
            await firstTicketBtn.click();
        } else {
            await openBtn.click();
        }

        // Verify the form view is rendered
        await expect(page.getByText('Initiate Support Protocol')).toBeVisible();
        await expect(page.getByRole('button', { name: /Transmit Inquiry/i })).toBeVisible();
    });

    test('5. Ticketing Module: Should successfully submit a new technical support ticket', async ({ page }) => {
        await page.goto(ticketingPath);
        
        // Open the creation form
        const firstTicketBtn = page.getByRole('button', { name: /Submit First Ticket/i });
        if (await firstTicketBtn.isVisible()) {
            await firstTicketBtn.click();
        } else {
            await page.getByRole('button', { name: /Open Inquiry/i }).click();
        }

        // Fill in Subject
        await page.getByPlaceholder('Brief subject of inquiry').fill('Cannot access student portal');
        
        // Select Category
        await page.getByRole('combobox').first().selectOption('System Access (Login)');
        
        // Fill Contact Number
        await page.getByPlaceholder('07XXXXXXXX').fill('0712345678');
        
        // Select Lecturer
        await page.locator('select').nth(1).selectOption({ index: 1 });

        // Fill Description
        await page.getByPlaceholder('Describe your technical or academic issue in detail...').fill('I am encountering an error 500 when attempting to authenticate on the student portal.');

        // Transmit Inquiry
        await page.getByRole('button', { name: /Transmit Inquiry/i }).click();

        // Verify the success message
        await expect(page.getByText('Inquiry submitted successfully!')).toBeVisible();
    });
});
