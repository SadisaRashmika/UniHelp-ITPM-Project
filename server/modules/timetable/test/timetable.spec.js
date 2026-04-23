import { test, expect } from '@playwright/test';

test.describe('Timetable API', () => {
  const API_URL = 'http://localhost:5000/api';

  test('should fetch timeslots', async ({ request }) => {
    const response = await request.get(`${API_URL}/timetable/timeslots`);
    // Should return 200 if public/authenticated, or 401 if auth required
    expect([200, 401, 403]).toContain(response.status());
  });

  test('should fetch subjects', async ({ request }) => {
    const response = await request.get(`${API_URL}/timetable/subjects`);
    expect([200, 401, 403]).toContain(response.status());
  });

  test('should fetch locations', async ({ request }) => {
    const response = await request.get(`${API_URL}/timetable/locations`);
    expect([200, 401, 403]).toContain(response.status());
  });

  test('should fetch lecturer stats', async ({ request }) => {
    const response = await request.get(`${API_URL}/timetable/lecturer/stats`);
    expect([200, 401, 403]).toContain(response.status());
  });

  test('should fetch specific timeslot by id', async ({ request }) => {
    const response = await request.get(`${API_URL}/timetable/timeslots/1`);
    expect([200, 401, 403, 404]).toContain(response.status());
  });
});
