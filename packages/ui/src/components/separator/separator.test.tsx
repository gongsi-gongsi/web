import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Separator } from '../separator';

describe('Separator', () => {
  describe('렌더링', () => {
    it('separator를 올바르게 렌더링한다', () => {
      render(<Separator data-testid="separator" />);
      expect(screen.getByTestId('separator')).toBeInTheDocument();
    });

    it('data-slot 속성을 가진다', () => {
      render(<Separator data-testid="separator" />);
      expect(screen.getByTestId('separator')).toHaveAttribute('data-slot', 'separator');
    });
  });

  describe('orientation', () => {
    it('기본 orientation은 horizontal이다', () => {
      render(<Separator data-testid="separator" />);
      expect(screen.getByTestId('separator')).toHaveAttribute('data-orientation', 'horizontal');
    });

    it('vertical orientation을 적용한다', () => {
      render(<Separator orientation="vertical" data-testid="separator" />);
      expect(screen.getByTestId('separator')).toHaveAttribute('data-orientation', 'vertical');
    });
  });

  describe('decorative', () => {
    it('기본적으로 decorative=true이다', () => {
      render(<Separator data-testid="separator" />);
      expect(screen.getByTestId('separator')).toHaveAttribute('role', 'none');
    });

    it('decorative=false일 때 separator role을 가진다', () => {
      render(<Separator decorative={false} />);
      expect(screen.getByRole('separator')).toBeInTheDocument();
    });
  });

  describe('props', () => {
    it('커스텀 className을 병합한다', () => {
      render(<Separator className="custom-class" data-testid="separator" />);
      expect(screen.getByTestId('separator')).toHaveClass('custom-class');
    });

    it('추가 HTML 속성을 전달한다', () => {
      render(<Separator data-testid="test-separator" />);
      expect(screen.getByTestId('test-separator')).toBeInTheDocument();
    });
  });
});
