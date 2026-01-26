import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Switch } from './switch';

describe('Switch', () => {
  describe('렌더링', () => {
    it('switch를 올바르게 렌더링한다', () => {
      render(<Switch />);
      expect(screen.getByRole('switch')).toBeInTheDocument();
    });

    it('data-slot 속성을 가진다', () => {
      render(<Switch />);
      expect(screen.getByRole('switch')).toHaveAttribute('data-slot', 'switch');
    });
  });

  describe('상태', () => {
    it('기본 상태는 unchecked이다', () => {
      render(<Switch />);
      expect(screen.getByRole('switch')).toHaveAttribute('data-state', 'unchecked');
    });

    it('defaultChecked로 초기 체크 상태를 설정한다', () => {
      render(<Switch defaultChecked />);
      expect(screen.getByRole('switch')).toHaveAttribute('data-state', 'checked');
    });

    it('disabled 상태를 적용한다', () => {
      render(<Switch disabled />);
      expect(screen.getByRole('switch')).toBeDisabled();
    });
  });

  describe('인터랙션', () => {
    it('클릭 시 상태가 토글된다', async () => {
      const user = userEvent.setup();
      render(<Switch />);

      const switchEl = screen.getByRole('switch');
      expect(switchEl).toHaveAttribute('data-state', 'unchecked');

      await user.click(switchEl);
      expect(switchEl).toHaveAttribute('data-state', 'checked');

      await user.click(switchEl);
      expect(switchEl).toHaveAttribute('data-state', 'unchecked');
    });

    it('onCheckedChange 핸들러를 호출한다', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<Switch onCheckedChange={handleChange} />);

      await user.click(screen.getByRole('switch'));

      expect(handleChange).toHaveBeenCalledWith(true);
    });

    it('disabled 상태에서 클릭해도 토글되지 않는다', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<Switch disabled onCheckedChange={handleChange} />);

      await user.click(screen.getByRole('switch'));

      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  describe('접근성', () => {
    it('키보드로 조작할 수 있다', async () => {
      const user = userEvent.setup();
      render(<Switch />);

      await user.tab();
      expect(screen.getByRole('switch')).toHaveFocus();

      await user.keyboard(' ');
      expect(screen.getByRole('switch')).toHaveAttribute('data-state', 'checked');
    });
  });

  describe('props', () => {
    it('커스텀 className을 병합한다', () => {
      render(<Switch className="custom-class" />);
      expect(screen.getByRole('switch')).toHaveClass('custom-class');
    });

    it('추가 HTML 속성을 전달한다', () => {
      render(<Switch data-testid="test-switch" />);
      expect(screen.getByTestId('test-switch')).toBeInTheDocument();
    });
  });
});
