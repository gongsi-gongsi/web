import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Alert, AlertDescription, AlertTitle } from './alert';

describe('Alert', () => {
  describe('렌더링', () => {
    it('alert를 올바르게 렌더링한다', () => {
      render(<Alert>Alert content</Alert>);
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('data-slot 속성을 가진다', () => {
      render(<Alert>Alert</Alert>);
      expect(screen.getByRole('alert')).toHaveAttribute('data-slot', 'alert');
    });
  });

  describe('variants', () => {
    it('기본 variant는 default이다', () => {
      render(<Alert>Default Alert</Alert>);
      expect(screen.getByRole('alert')).toHaveClass('bg-card');
    });

    it('destructive variant를 적용한다', () => {
      render(<Alert variant="destructive">Destructive Alert</Alert>);
      expect(screen.getByRole('alert')).toHaveClass('text-destructive');
    });
  });

  describe('props', () => {
    it('커스텀 className을 병합한다', () => {
      render(<Alert className="custom-class">Alert</Alert>);
      expect(screen.getByRole('alert')).toHaveClass('custom-class');
    });

    it('추가 HTML 속성을 전달한다', () => {
      render(<Alert data-testid="test-alert">Alert</Alert>);
      expect(screen.getByTestId('test-alert')).toBeInTheDocument();
    });
  });
});

describe('AlertTitle', () => {
  describe('렌더링', () => {
    it('title을 올바르게 렌더링한다', () => {
      render(<AlertTitle>제목</AlertTitle>);
      expect(screen.getByText('제목')).toBeInTheDocument();
    });

    it('data-slot 속성을 가진다', () => {
      render(<AlertTitle>제목</AlertTitle>);
      expect(screen.getByText('제목')).toHaveAttribute('data-slot', 'alert-title');
    });
  });

  describe('props', () => {
    it('커스텀 className을 병합한다', () => {
      render(<AlertTitle className="custom-class">제목</AlertTitle>);
      expect(screen.getByText('제목')).toHaveClass('custom-class');
    });
  });
});

describe('AlertDescription', () => {
  describe('렌더링', () => {
    it('description을 올바르게 렌더링한다', () => {
      render(<AlertDescription>설명</AlertDescription>);
      expect(screen.getByText('설명')).toBeInTheDocument();
    });

    it('data-slot 속성을 가진다', () => {
      render(<AlertDescription>설명</AlertDescription>);
      expect(screen.getByText('설명')).toHaveAttribute('data-slot', 'alert-description');
    });
  });

  describe('props', () => {
    it('커스텀 className을 병합한다', () => {
      render(<AlertDescription className="custom-class">설명</AlertDescription>);
      expect(screen.getByText('설명')).toHaveClass('custom-class');
    });
  });
});

describe('Alert 조합', () => {
  it('AlertTitle과 AlertDescription을 함께 렌더링한다', () => {
    render(
      <Alert>
        <AlertTitle>알림 제목</AlertTitle>
        <AlertDescription>알림 내용입니다.</AlertDescription>
      </Alert>
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('알림 제목')).toBeInTheDocument();
    expect(screen.getByText('알림 내용입니다.')).toBeInTheDocument();
  });
});
