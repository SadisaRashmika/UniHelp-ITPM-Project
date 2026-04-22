import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import LecProfile from './LecProfile';

vi.mock('axios');

describe('LecProfile', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('loads and renders lecturer profile and stats data', async () => {
    axios.get
      .mockResolvedValueOnce({
        data: {
          name: 'Dr. Chamara Perera',
          department: 'Computer Science',
          employee_id: 'LEC001',
          email: 'chamara@uni.edu',
          points: 120,
        },
      })
      .mockResolvedValueOnce({
        data: {
          downloads: 20,
          uploadedResources: 6,
        },
      });

    render(
      <LecProfile
        lecturerId="LEC001"
        pendingCount={4}
        onNavigate={vi.fn()}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Dr. Chamara Perera')).toBeInTheDocument();
    });

    expect(screen.getByText('Resource Managing Page')).toBeInTheDocument();
    expect(screen.getAllByText('Computer Science').length).toBeGreaterThan(0);
    expect(screen.getByText('LEC001')).toBeInTheDocument();
    expect(screen.getByText('LKR 600.00')).toBeInTheDocument();
    expect(screen.getByText('6')).toBeInTheDocument();
    expect(screen.getByText('120')).toBeInTheDocument();
  });

  it('navigates to review and upload tabs from quick actions', async () => {
    const onNavigate = vi.fn();
    const user = userEvent.setup();

    axios.get
      .mockResolvedValueOnce({
        data: {
          name: 'Dr. Chamara Perera',
          department: 'Computer Science',
          employee_id: 'LEC001',
          email: 'chamara@uni.edu',
          points: 120,
        },
      })
      .mockResolvedValueOnce({
        data: {
          downloads: 20,
          uploadedResources: 6,
        },
      });

    render(
      <LecProfile
        lecturerId="LEC001"
        pendingCount={4}
        onNavigate={onNavigate}
      />
    );

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Check Student Uploads/i })).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /Check Student Uploads/i }));
    await user.click(screen.getByRole('button', { name: /Resource managing page/i }));

    expect(onNavigate).toHaveBeenNthCalledWith(1, 'review');
    expect(onNavigate).toHaveBeenNthCalledWith(2, 'upload');
  });
});
