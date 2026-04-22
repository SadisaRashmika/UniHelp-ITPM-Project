import { test, expect } from '@playwright/test';

const lecturerProfile = {
  id: 1,
  name: 'Dr. Chamara Perera',
  department: 'Computer Science',
  employee_id: 'LEC001',
  email: 'chamara@uni.edu',
  points: 120,
};

const meResponse = {
  user: {
    id: 1,
    idNumber: 'LEC001',
    fullName: 'Dr. Chamara Perera',
    email: 'chamara@uni.edu',
    role: 'lecturer',
    status: 'Active',
    profileImageUrl: null,
  },
};

async function mockCoreApis(page) {
  await page.route('**/api/auth/login', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ token: 'fake-jwt-token', user: meResponse.user }),
    });
  });

  await page.route('**/api/auth/me', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(meResponse),
    });
  });

  await page.route('**/api/lecturer/profile?lecturerId=LEC001', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(lecturerProfile),
    });
  });

  await page.route('**/api/lecturer/pending-counts?lecturerId=LEC001', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ submissions: 4, bonusMarks: 2 }),
    });
  });

  await page.route('**/api/lecturer/stats?lecturerId=LEC001', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ downloads: 20, uploadedResources: 6 }),
    });
  });
}

test.describe('Login-signin and lecture-resource journeys', () => {
  test('lecturer can login from AuthModal and land in home dashboard', async ({ page }) => {
    await mockCoreApis(page);
    await page.goto('/');

    await page.getByRole('banner').getByRole('button', { name: 'Login' }).click();
    await page.getByLabel('University email or ID').fill('LEC001');
    await page.getByLabel('Password').first().fill('Pass123!');
    await page.locator('form').getByRole('button', { name: 'Sign In' }).click();

    await expect(page).toHaveURL(/\/lecturer\/home$/);
    await expect(page.getByText('You are logged in as lecturer')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Welcome Lecturer, Dr. Chamara Perera' })).toBeVisible();
  });

  test('lecturer opens resource tab and sees lecture-resource dashboard', async ({ page }) => {
    await mockCoreApis(page);
    await page.goto('/');

    await page.getByRole('banner').getByRole('button', { name: 'Login' }).click();
    await page.getByLabel('University email or ID').fill('LEC001');
    await page.getByLabel('Password').first().fill('Pass123!');
    await page.locator('form').getByRole('button', { name: 'Sign In' }).click();

    await page.getByRole('banner').getByRole('button', { name: 'Resource' }).click();

    await expect(page).toHaveURL(/\/lecturer\/resource$/);
    await expect(page.getByRole('heading', { name: 'Resource Managing Page' })).toBeVisible();
    await expect(page.getByText('Lecturer Dashboard')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Resources and Quiz' })).toBeVisible();
  });
});
