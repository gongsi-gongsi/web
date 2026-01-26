import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './card';

describe('Card', () => {
  describe('렌더링', () => {
    it('card를 올바르게 렌더링한다', () => {
      render(<Card data-testid="card">Content</Card>);
      expect(screen.getByTestId('card')).toBeInTheDocument();
    });

    it('data-slot 속성을 가진다', () => {
      render(<Card data-testid="card">Content</Card>);
      expect(screen.getByTestId('card')).toHaveAttribute('data-slot', 'card');
    });
  });

  describe('props', () => {
    it('커스텀 className을 병합한다', () => {
      render(
        <Card className="custom-class" data-testid="card">
          Content
        </Card>
      );
      expect(screen.getByTestId('card')).toHaveClass('custom-class');
    });
  });
});

describe('CardHeader', () => {
  describe('렌더링', () => {
    it('header를 올바르게 렌더링한다', () => {
      render(<CardHeader data-testid="header">Header</CardHeader>);
      expect(screen.getByTestId('header')).toBeInTheDocument();
    });

    it('data-slot 속성을 가진다', () => {
      render(<CardHeader data-testid="header">Header</CardHeader>);
      expect(screen.getByTestId('header')).toHaveAttribute('data-slot', 'card-header');
    });
  });
});

describe('CardTitle', () => {
  describe('렌더링', () => {
    it('title을 올바르게 렌더링한다', () => {
      render(<CardTitle>Title</CardTitle>);
      expect(screen.getByText('Title')).toBeInTheDocument();
    });

    it('data-slot 속성을 가진다', () => {
      render(<CardTitle>Title</CardTitle>);
      expect(screen.getByText('Title')).toHaveAttribute('data-slot', 'card-title');
    });
  });
});

describe('CardDescription', () => {
  describe('렌더링', () => {
    it('description을 올바르게 렌더링한다', () => {
      render(<CardDescription>Description</CardDescription>);
      expect(screen.getByText('Description')).toBeInTheDocument();
    });

    it('data-slot 속성을 가진다', () => {
      render(<CardDescription>Description</CardDescription>);
      expect(screen.getByText('Description')).toHaveAttribute('data-slot', 'card-description');
    });
  });
});

describe('CardContent', () => {
  describe('렌더링', () => {
    it('content를 올바르게 렌더링한다', () => {
      render(<CardContent data-testid="content">Content</CardContent>);
      expect(screen.getByTestId('content')).toBeInTheDocument();
    });

    it('data-slot 속성을 가진다', () => {
      render(<CardContent data-testid="content">Content</CardContent>);
      expect(screen.getByTestId('content')).toHaveAttribute('data-slot', 'card-content');
    });
  });
});

describe('CardFooter', () => {
  describe('렌더링', () => {
    it('footer를 올바르게 렌더링한다', () => {
      render(<CardFooter data-testid="footer">Footer</CardFooter>);
      expect(screen.getByTestId('footer')).toBeInTheDocument();
    });

    it('data-slot 속성을 가진다', () => {
      render(<CardFooter data-testid="footer">Footer</CardFooter>);
      expect(screen.getByTestId('footer')).toHaveAttribute('data-slot', 'card-footer');
    });
  });
});

describe('Card 조합', () => {
  it('모든 서브 컴포넌트를 함께 렌더링한다', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>카드 제목</CardTitle>
          <CardDescription>카드 설명입니다.</CardDescription>
        </CardHeader>
        <CardContent>카드 내용</CardContent>
        <CardFooter>카드 푸터</CardFooter>
      </Card>
    );

    expect(screen.getByText('카드 제목')).toBeInTheDocument();
    expect(screen.getByText('카드 설명입니다.')).toBeInTheDocument();
    expect(screen.getByText('카드 내용')).toBeInTheDocument();
    expect(screen.getByText('카드 푸터')).toBeInTheDocument();
  });
});
