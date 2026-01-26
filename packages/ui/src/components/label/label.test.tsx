import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { Label } from './label';

describe('Label', () => {
  describe('렌더링', () => {
    it('label을 올바르게 렌더링한다', () => {
      render(<Label>이메일</Label>);
      expect(screen.getByText('이메일')).toBeInTheDocument();
    });

    it('data-slot 속성을 가진다', () => {
      render(<Label>이메일</Label>);
      expect(screen.getByText('이메일')).toHaveAttribute('data-slot', 'label');
    });
  });

  describe('htmlFor', () => {
    it('htmlFor 속성을 통해 input과 연결된다', () => {
      render(
        <>
          <Label htmlFor="email">이메일</Label>
          <input id="email" type="email" />
        </>
      );

      const label = screen.getByText('이메일');
      expect(label).toHaveAttribute('for', 'email');
    });

    it('label 클릭 시 연결된 input에 포커스된다', async () => {
      const user = userEvent.setup();
      render(
        <>
          <Label htmlFor="email">이메일</Label>
          <input id="email" type="email" data-testid="email-input" />
        </>
      );

      await user.click(screen.getByText('이메일'));
      expect(screen.getByTestId('email-input')).toHaveFocus();
    });
  });

  describe('props', () => {
    it('커스텀 className을 병합한다', () => {
      render(<Label className="custom-class">라벨</Label>);
      expect(screen.getByText('라벨')).toHaveClass('custom-class');
    });

    it('추가 HTML 속성을 전달한다', () => {
      render(<Label data-testid="test-label">라벨</Label>);
      expect(screen.getByTestId('test-label')).toBeInTheDocument();
    });
  });
});
