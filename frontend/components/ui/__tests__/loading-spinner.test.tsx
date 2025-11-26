import React from 'react';
import { render, screen } from '@testing-library/react';
import { LoadingSpinner } from '../loading-spinner';

describe('LoadingSpinner', () => {
  it('renders without crashing', () => {
    render(<LoadingSpinner />);
    const spinner = screen.getByRole('status');
    expect(spinner).toBeInTheDocument();
  });

  it('displays a label when provided', () => {
    const testLabel = 'Loading...';
    render(<LoadingSpinner label={testLabel} />);
    expect(screen.getByText(testLabel)).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const testClassName = 'test-class';
    render(<LoadingSpinner className={testClassName} />);
    const spinner = screen.getByRole('status');
    expect(spinner.parentElement).toHaveClass(testClassName);
  });

  it('renders with different sizes', () => {
    const { container } = render(
      <>
        <LoadingSpinner size="sm" />
        <LoadingSpinner size="default" />
        <LoadingSpinner size="lg" />
        <LoadingSpinner size="xl" />
      </>
    );
    
    const spinners = container.querySelectorAll('svg');
    expect(spinners).toHaveLength(4);
  });
});
