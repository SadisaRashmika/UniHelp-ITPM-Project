import {
  login,
  requestActivationOtp,
  requestForgotPasswordOtp,
} from './authService';

describe('authService', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('login sends POST request to auth endpoint', async () => {
    const fetchMock = vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ token: 'abc123', user: { role: 'student' } }),
    });

    const result = await login({ identifier: 'STU001', password: 'pass1234' });

    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:5000/api/auth/login',
      expect.objectContaining({
        method: 'POST',
      })
    );
    expect(result).toEqual({ token: 'abc123', user: { role: 'student' } });
  });

  it('requestActivationOtp throws API message when request fails', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: false,
      json: async () => ({ message: 'Activation not allowed' }),
    });

    await expect(
      requestActivationOtp({ idNumber: 'STU001', email: 'student@uni.edu' })
    ).rejects.toThrow('Activation not allowed');
  });

  it('requestForgotPasswordOtp succeeds with valid payload', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });

    const result = await requestForgotPasswordOtp({ email: 'student@uni.edu' });

    expect(result).toEqual({ success: true });
  });
});
