import { test, expect } from '@playwright/test';

test.describe('Timetable API', () => {
  const API_URL = 'http://localhost:5000/api';

  test('should fetch timeslots', async ({ request }) => {
    const response = await request.get(`${API_URL}/timetable/timeslots`);
    expect(response.status()).toBeDefined();
  });
});
