import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AuthModal from './AuthModal';
import {
  login,
  requestActivationOtp,
  requestForgotPasswordOtp,
} from '../../services/authService';

vi.mock('../../services/authService', () => ({
  login: vi.fn(),
  requestActivationOtp: vi.fn(),
  requestForgotPasswordOtp: vi.fn(),
  verifyActivationOtp: vi.fn(),
  verifyForgotPasswordOtp: vi.fn(),
}));

describe('AuthModal', () => {
  const onClose = vi.fn();
  const onAuthenticated = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('logs in successfully with identifier and password', async () => {
    const user = userEvent.setup();
    login.mockResolvedValue({ token: 'abc123', user: { role: 'lecturer' } });

    render(
      <AuthModal
        isOpen
        onClose={onClose}
        onAuthenticated={onAuthenticated}
      />
    );

    await user.type(screen.getByLabelText(/University email or ID/i), 'LEC001');
    await user.type(screen.getByLabelText(/^Password/i), 'Pass123!');
    await user.click(screen.getByRole('button', { name: /Sign In/i }));

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith({ identifier: 'LEC001', password: 'Pass123!' });
      expect(onAuthenticated).toHaveBeenCalledTimes(1);
    });
  });

  it('moves to activation step 2 after OTP request', async () => {
    const user = userEvent.setup();
    requestActivationOtp.mockResolvedValue({ success: true });

    render(
      <AuthModal
        isOpen
        onClose={onClose}
        onAuthenticated={onAuthenticated}
      />
    );

    await user.click(screen.getByRole('button', { name: /Need activation\?/i }));

    await user.type(screen.getByLabelText(/Student ID/i), 'STU001');
    await user.type(screen.getByLabelText(/University email/i), 'student@university.edu');
    await user.click(screen.getByRole('button', { name: /Send OTP/i }));

    await waitFor(() => {
      expect(requestActivationOtp).toHaveBeenCalledWith({
        idNumber: 'STU001',
        email: 'student@university.edu',
      });
    });

    expect(screen.getByText(/OTP sent to your email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/OTP Code/i)).toBeInTheDocument();
  });

  it('moves to forgot-password step 2 after reset code request', async () => {
    const user = userEvent.setup();
    requestForgotPasswordOtp.mockResolvedValue({ success: true });

    render(
      <AuthModal
        isOpen
        onClose={onClose}
        onAuthenticated={onAuthenticated}
      />
    );

    await user.click(screen.getByRole('button', { name: /Forgot password\?/i }));
    await user.type(screen.getByLabelText(/University email/i), 'student@university.edu');
    await user.click(screen.getByRole('button', { name: /Send Reset Code/i }));

    await waitFor(() => {
      expect(requestForgotPasswordOtp).toHaveBeenCalledWith({ email: 'student@university.edu' });
    });

    expect(screen.getByText(/reset code was sent/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/OTP Code/i)).toBeInTheDocument();
  });
});
