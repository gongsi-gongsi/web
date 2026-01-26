import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Skeleton } from '../skeleton';

describe('Skeleton', () => {
  describe('렌더링', () => {
    it('skeleton을 올바르게 렌더링한다', () => {
      render(<Skeleton data-testid="skeleton" />);
      expect(screen.getByTestId('skeleton')).toBeInTheDocument();
    });

    it('data-slot 속성을 가진다', () => {
      render(<Skeleton data-testid="skeleton" />);
      expect(screen.getByTestId('skeleton')).toHaveAttribute('data-slot', 'skeleton');
    });

    it('animate-pulse 클래스를 가진다', () => {
      render(<Skeleton data-testid="skeleton" />);
      expect(screen.getByTestId('skeleton')).toHaveClass('animate-pulse');
    });
  });

  describe('props', () => {
    it('커스텀 className을 병합한다', () => {
      render(<Skeleton className="h-12 w-12" data-testid="skeleton" />);
      const skeleton = screen.getByTestId('skeleton');
      expect(skeleton).toHaveClass('h-12');
      expect(skeleton).toHaveClass('w-12');
    });

    it('추가 HTML 속성을 전달한다', () => {
      render(<Skeleton data-testid="test-skeleton" aria-label="Loading" />);
      expect(screen.getByTestId('test-skeleton')).toHaveAttribute('aria-label', 'Loading');
    });
  });
});
