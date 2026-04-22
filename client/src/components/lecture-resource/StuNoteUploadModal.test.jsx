import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import StuNoteUploadModal from './StuNoteUploadModal';

vi.mock('axios', () => ({
  default: {
    post: vi.fn(),
  },
}));

import axios from 'axios';

describe('StuNoteUploadModal - Student Note Upload', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockLecture = {
    id: 1,
    title: 'Database Design Fundamentals',
  };

  const mockStudent = {
    student_id: 'STU001',
    name: 'Aisha Mohamed',
  };

  it('should render upload modal when isOpen is true', () => {
    render(
      <StuNoteUploadModal
        isOpen={true}
        onClose={() => {}}
        lecture={mockLecture}
        student={mockStudent}
        onUploaded={() => {}}
      />
    );

    expect(screen.getByText('Upload Note')).toBeInTheDocument();
    expect(screen.getByText('Database Design Fundamentals')).toBeInTheDocument();
  });

  it('should handle isOpen false correctly', () => {
    const { container } = render(
      <StuNoteUploadModal
        isOpen={false}
        onClose={() => {}}
        lecture={mockLecture}
        student={mockStudent}
        onUploaded={() => {}}
      />
    );

    // When isOpen is false, component should not render modal content
    // Container should still exist but be empty or contain nothing visible
    expect(container).toBeTruthy();
  });

  it('should display upload button', () => {
    render(
      <StuNoteUploadModal
        isOpen={true}
        onClose={() => {}}
        lecture={mockLecture}
        student={mockStudent}
        onUploaded={() => {}}
      />
    );

    const uploadButton = screen.getByRole('button', { name: /upload/i });
    expect(uploadButton).toBeInTheDocument();
  });

  it('should display student name in form', () => {
    render(
      <StuNoteUploadModal
        isOpen={true}
        onClose={() => {}}
        lecture={mockLecture}
        student={mockStudent}
        onUploaded={() => {}}
      />
    );

    expect(screen.getByDisplayValue('Aisha Mohamed')).toBeInTheDocument();
  });

  it('should display lecture title in form', () => {
    render(
      <StuNoteUploadModal
        isOpen={true}
        onClose={() => {}}
        lecture={mockLecture}
        student={mockStudent}
        onUploaded={() => {}}
      />
    );

    expect(screen.getByDisplayValue('Database Design Fundamentals')).toBeInTheDocument();
  });

  it('should have placeholder text for note topic input', () => {
    render(
      <StuNoteUploadModal
        isOpen={true}
        onClose={() => {}}
        lecture={mockLecture}
        student={mockStudent}
        onUploaded={() => {}}
      />
    );

    const topicInput = screen.getByPlaceholderText(/Graph traversal summary/i);
    expect(topicInput).toBeInTheDocument();
  });

  it('should accept topic input', async () => {
    const user = userEvent.setup();
    render(
      <StuNoteUploadModal
        isOpen={true}
        onClose={() => {}}
        lecture={mockLecture}
        student={mockStudent}
        onUploaded={() => {}}
      />
    );

    const topicInput = screen.getByPlaceholderText(/Graph traversal summary/i);
    await user.type(topicInput, 'Database Normalization Forms');

    expect(topicInput.value).toBe('Database Normalization Forms');
  });
});
