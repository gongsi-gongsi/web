import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Badge } from './badge';

describe('Badge', () => {
  describe('렌더링', () => {
    it('children을 올바르게 렌더링한다', () => {
      render(<Badge>테스트 배지</Badge>);
      expect(screen.getByText('테스트 배지')).toBeInTheDocument();
    });

    it('data-slot 속성을 가진다', () => {
      render(<Badge>배지</Badge>);
      expect(screen.getByText('배지')).toHaveAttribute('data-slot', 'badge');
    });
  });

  describe('variants', () => {
    it('기본 variant는 default이다', () => {
      render(<Badge>Default</Badge>);
      expect(screen.getByText('Default')).toHaveClass('bg-primary');
    });

    it('secondary variant를 적용한다', () => {
      render(<Badge variant="secondary">Secondary</Badge>);
      expect(screen.getByText('Secondary')).toHaveClass('bg-secondary');
    });

    it('destructive variant를 적용한다', () => {
      render(<Badge variant="destructive">Destructive</Badge>);
      expect(screen.getByText('Destructive')).toHaveClass('bg-destructive');
    });

    it('warning variant를 적용한다', () => {
      render(<Badge variant="warning">Warning</Badge>);
      expect(screen.getByText('Warning')).toHaveClass('bg-warning');
    });

    it('outline variant를 적용한다', () => {
      render(<Badge variant="outline">Outline</Badge>);
      expect(screen.getByText('Outline')).toHaveClass('text-foreground');
    });
  });

  describe('asChild', () => {
    it('asChild가 true일 때 자식 요소를 사용한다', () => {
      render(
        <Badge asChild>
          <a href="/test">링크 배지</a>
        </Badge>
      );
      const link = screen.getByRole('link');
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/test');
    });
  });

  describe('props', () => {
    it('커스텀 className을 병합한다', () => {
      render(<Badge className="custom-class">배지</Badge>);
      expect(screen.getByText('배지')).toHaveClass('custom-class');
    });

    it('추가 HTML 속성을 전달한다', () => {
      render(<Badge data-testid="test-badge">배지</Badge>);
      expect(screen.getByTestId('test-badge')).toBeInTheDocument();
    });
  });
});
