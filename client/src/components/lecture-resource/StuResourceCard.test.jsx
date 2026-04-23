import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import StuResourceCard from './StuResourceCard';

describe('StuResourceCard - Individual Lecture Card', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockLecture = {
    id: 1,
    title: 'Data Structures and Algorithms',
    subject: 'Computer Science',
    topic: 'DSA',
    year: 2,
    semester: 4,
    tags: ['Computer Science', 'DSA', '2', '4'], // Add tags as expected
    files: [{ name: 'dsa-notes.pdf', url: 'http://localhost:5000/file1' }],
    youtubeUrl: 'https://youtube.com/watch?v=dsa123',
    quiz: {
      title: 'DSA Quiz',
      questions: [
        { question: 'What is a tree?', options: ['A', 'B'], answer: 0 },
      ],
    },
    studentNotes: [
      { id: 1, title: 'Note 1', author: 'Student A' },
      { id: 2, title: 'Note 2', author: 'Student B' },
    ],
  };

  it('should render lecture card with title', () => {
    render(
      <StuResourceCard 
        lecture={mockLecture}
        onUpload={() => {}}
        onQuiz={() => {}}
        noteLikes={{}}
        likedSet={new Set()}
        onLike={() => {}}
        onExploreStudentNotes={() => {}}
      />
    );

    expect(screen.getByText('Data Structures and Algorithms')).toBeInTheDocument();
  });

  it('should display subject tag', () => {
    render(
      <StuResourceCard 
        lecture={mockLecture}
        onUpload={() => {}}
        onQuiz={() => {}}
        noteLikes={{}}
        likedSet={new Set()}
        onLike={() => {}}
        onExploreStudentNotes={() => {}}
      />
    );

    expect(screen.getByText('Computer Science')).toBeInTheDocument();
  });

  it('should display tags when available', () => {
    render(
      <StuResourceCard 
        lecture={mockLecture}
        onUpload={() => {}}
        onQuiz={() => {}}
        noteLikes={{}}
        likedSet={new Set()}
        onLike={() => {}}
        onExploreStudentNotes={() => {}}
      />
    );

    expect(screen.getByText('DSA')).toBeInTheDocument();
  });

  it('should render upload button', () => {
    render(
      <StuResourceCard 
        lecture={mockLecture}
        onUpload={() => {}}
        onQuiz={() => {}}
        noteLikes={{}}
        likedSet={new Set()}
        onLike={() => {}}
        onExploreStudentNotes={() => {}}
      />
    );

    const uploadButton = screen.getByRole('button', { name: /upload/i });
    expect(uploadButton).toBeInTheDocument();
  });

  it('should call onUpload when upload button clicked', async () => {
    const user = userEvent.setup();
    const onUpload = vi.fn();

    render(
      <StuResourceCard 
        lecture={mockLecture}
        onUpload={onUpload}
        onQuiz={() => {}}
        noteLikes={{}}
        likedSet={new Set()}
        onLike={() => {}}
        onExploreStudentNotes={() => {}}
      />
    );

    const uploadButton = screen.getByRole('button', { name: /upload/i });
    await user.click(uploadButton);

    expect(onUpload).toHaveBeenCalled();
  });
});
