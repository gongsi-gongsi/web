import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Input } from '../input';

describe('Input', () => {
  describe('렌더링', () => {
    it('input을 올바르게 렌더링한다', () => {
      render(<Input />);
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('data-slot 속성을 가진다', () => {
      render(<Input />);
      expect(screen.getByRole('textbox')).toHaveAttribute('data-slot', 'input');
    });
  });

  describe('type', () => {
    it('type을 지정하지 않으면 textbox role을 가진다', () => {
      render(<Input />);
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('email type을 적용한다', () => {
      render(<Input type="email" />);
      expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email');
    });

    it('password type을 적용한다', () => {
      render(<Input type="password" />);
      expect(screen.getByDisplayValue('')).toHaveAttribute('type', 'password');
    });
  });

  describe('상태', () => {
    it('disabled 상태를 적용한다', () => {
      render(<Input disabled />);
      expect(screen.getByRole('textbox')).toBeDisabled();
    });

    it('placeholder를 표시한다', () => {
      render(<Input placeholder="이메일을 입력하세요" />);
      expect(screen.getByPlaceholderText('이메일을 입력하세요')).toBeInTheDocument();
    });

    it('value를 표시한다', () => {
      render(<Input defaultValue="test@example.com" />);
      expect(screen.getByDisplayValue('test@example.com')).toBeInTheDocument();
    });
  });

  describe('인터랙션', () => {
    it('텍스트 입력이 가능하다', async () => {
      const user = userEvent.setup();
      render(<Input />);

      const input = screen.getByRole('textbox');
      await user.type(input, 'Hello');

      expect(input).toHaveValue('Hello');
    });

    it('onChange 핸들러를 호출한다', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<Input onChange={handleChange} />);

      await user.type(screen.getByRole('textbox'), 'a');

      expect(handleChange).toHaveBeenCalled();
    });

    it('onFocus 핸들러를 호출한다', async () => {
      const user = userEvent.setup();
      const handleFocus = vi.fn();
      render(<Input onFocus={handleFocus} />);

      await user.click(screen.getByRole('textbox'));

      expect(handleFocus).toHaveBeenCalled();
    });
  });

  describe('props', () => {
    it('커스텀 className을 병합한다', () => {
      render(<Input className="custom-class" />);
      expect(screen.getByRole('textbox')).toHaveClass('custom-class');
    });

    it('추가 HTML 속성을 전달한다', () => {
      render(<Input data-testid="test-input" />);
      expect(screen.getByTestId('test-input')).toBeInTheDocument();
    });
  });

  describe('접근성', () => {
    it('키보드로 포커스할 수 있다', async () => {
      const user = userEvent.setup();
      render(<Input />);

      await user.tab();

      expect(screen.getByRole('textbox')).toHaveFocus();
    });
  });
});
