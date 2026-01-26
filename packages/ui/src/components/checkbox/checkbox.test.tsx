import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Checkbox } from './checkbox';

describe('Checkbox', () => {
  describe('렌더링', () => {
    it('checkbox를 올바르게 렌더링한다', () => {
      render(<Checkbox />);
      expect(screen.getByRole('checkbox')).toBeInTheDocument();
    });

    it('data-slot 속성을 가진다', () => {
      render(<Checkbox />);
      expect(screen.getByRole('checkbox')).toHaveAttribute('data-slot', 'checkbox');
    });
  });

  describe('상태', () => {
    it('기본 상태는 unchecked이다', () => {
      render(<Checkbox />);
      expect(screen.getByRole('checkbox')).not.toBeChecked();
    });

    it('defaultChecked로 초기 체크 상태를 설정한다', () => {
      render(<Checkbox defaultChecked />);
      expect(screen.getByRole('checkbox')).toBeChecked();
    });

    it('disabled 상태를 적용한다', () => {
      render(<Checkbox disabled />);
      expect(screen.getByRole('checkbox')).toBeDisabled();
    });
  });

  describe('인터랙션', () => {
    it('클릭 시 체크 상태가 토글된다', async () => {
      const user = userEvent.setup();
      render(<Checkbox />);

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).not.toBeChecked();

      await user.click(checkbox);
      expect(checkbox).toBeChecked();

      await user.click(checkbox);
      expect(checkbox).not.toBeChecked();
    });

    it('onCheckedChange 핸들러를 호출한다', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<Checkbox onCheckedChange={handleChange} />);

      await user.click(screen.getByRole('checkbox'));

      expect(handleChange).toHaveBeenCalledWith(true);
    });

    it('disabled 상태에서 클릭해도 토글되지 않는다', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<Checkbox disabled onCheckedChange={handleChange} />);

      await user.click(screen.getByRole('checkbox'));

      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  describe('접근성', () => {
    it('키보드로 조작할 수 있다', async () => {
      const user = userEvent.setup();
      render(<Checkbox />);

      await user.tab();
      expect(screen.getByRole('checkbox')).toHaveFocus();

      await user.keyboard(' ');
      expect(screen.getByRole('checkbox')).toBeChecked();
    });
  });

  describe('props', () => {
    it('커스텀 className을 병합한다', () => {
      render(<Checkbox className="custom-class" />);
      expect(screen.getByRole('checkbox')).toHaveClass('custom-class');
    });

    it('추가 HTML 속성을 전달한다', () => {
      render(<Checkbox data-testid="test-checkbox" />);
      expect(screen.getByTestId('test-checkbox')).toBeInTheDocument();
    });
  });

  describe('sizes', () => {
    it('sm 사이즈를 적용한다', () => {
      render(<Checkbox size="sm" />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveClass('size-4');
    });

    it('md 사이즈를 적용한다 (기본값)', () => {
      render(<Checkbox />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveClass('size-5');
    });

    it('lg 사이즈를 적용한다', () => {
      render(<Checkbox size="lg" />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveClass('size-6');
    });
  });

  describe('interactive', () => {
    it('interactive가 true일 때 active:scale 클래스가 적용된다', () => {
      render(<Checkbox interactive />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveClass('active:scale-[0.85]');
    });

    it('interactive가 false일 때 scale 클래스가 없다', () => {
      render(<Checkbox interactive={false} />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).not.toHaveClass('active:scale-[0.85]');
    });

    it('기본값은 interactive=true이다', () => {
      render(<Checkbox />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveClass('active:scale-[0.85]');
    });
  });

  describe('디자인', () => {
    it('동그란 원 모양이다 (rounded-full)', () => {
      render(<Checkbox />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveClass('rounded-full');
    });
  });
});
