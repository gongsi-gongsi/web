import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Button } from '../button';

describe('Button', () => {
  describe('렌더링', () => {
    it('children을 올바르게 렌더링한다', () => {
      render(<Button>Click me</Button>);
      expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
    });
  });

  describe('인터랙션', () => {
    it('클릭 시 onClick 핸들러를 호출한다', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(<Button onClick={handleClick}>Click me</Button>);
      await user.click(screen.getByRole('button'));

      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('variants', () => {
    it('기본 variant는 primary 스타일을 적용한다', () => {
      render(<Button>Primary</Button>);
      const button = screen.getByRole('button');
      expect(button.className).toContain('bg-primary');
    });

    it('secondary variant 스타일을 적용한다', () => {
      render(<Button variant="secondary">Secondary</Button>);
      const button = screen.getByRole('button');
      expect(button.className).toContain('bg-secondary');
    });

    it('outline variant 스타일을 적용한다', () => {
      render(<Button variant="outline">Outline</Button>);
      const button = screen.getByRole('button');
      expect(button.className).toContain('border');
    });
  });

  describe('sizes', () => {
    it('sm 사이즈 스타일을 적용한다', () => {
      render(<Button size="sm">Small</Button>);
      expect(screen.getByRole('button').className).toContain('px-3');
    });

    it('lg 사이즈 스타일을 적용한다', () => {
      render(<Button size="lg">Large</Button>);
      expect(screen.getByRole('button').className).toContain('px-6');
    });

    it('icon-bare 사이즈는 padding을 제거한다', () => {
      render(
        <Button size="icon-bare" aria-label="icon button">
          <svg />
        </Button>
      );
      expect(screen.getByRole('button').className).toContain('p-0');
    });
  });

  describe('props', () => {
    it('커스텀 className을 병합한다', () => {
      render(<Button className="custom-class">Custom</Button>);
      expect(screen.getByRole('button').className).toContain('custom-class');
    });

    it('disabled prop이 true일 때 버튼을 비활성화한다', () => {
      render(<Button disabled>Disabled</Button>);
      expect(screen.getByRole('button')).toBeDisabled();
    });
  });
});
