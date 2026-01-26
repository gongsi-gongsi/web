import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from './pagination';

describe('Pagination', () => {
  // -------------------------------------------------------------------------
  // Pagination 컨테이너
  // -------------------------------------------------------------------------

  describe('Pagination', () => {
    it('navigation role을 가진다', () => {
      render(
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      );
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    it('aria-label을 가진다', () => {
      render(
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      );
      expect(screen.getByRole('navigation')).toHaveAttribute('aria-label', 'pagination');
    });

    it('data-slot 속성을 가진다', () => {
      render(
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      );
      expect(screen.getByRole('navigation')).toHaveAttribute('data-slot', 'pagination');
    });

    it('커스텀 className을 병합한다', () => {
      render(
        <Pagination className="custom-pagination">
          <PaginationContent>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      );
      expect(screen.getByRole('navigation')).toHaveClass('custom-pagination');
    });
  });

  // -------------------------------------------------------------------------
  // PaginationContent
  // -------------------------------------------------------------------------

  describe('PaginationContent', () => {
    it('리스트를 올바르게 렌더링한다', () => {
      render(
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      );
      expect(screen.getByRole('list')).toBeInTheDocument();
    });

    it('data-slot 속성을 가진다', () => {
      render(
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      );
      expect(screen.getByRole('list')).toHaveAttribute('data-slot', 'pagination-content');
    });
  });

  // -------------------------------------------------------------------------
  // PaginationItem
  // -------------------------------------------------------------------------

  describe('PaginationItem', () => {
    it('리스트 아이템을 렌더링한다', () => {
      render(
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      );
      expect(screen.getByRole('listitem')).toBeInTheDocument();
    });

    it('data-slot 속성을 가진다', () => {
      render(
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      );
      expect(screen.getByRole('listitem')).toHaveAttribute('data-slot', 'pagination-item');
    });
  });

  // -------------------------------------------------------------------------
  // PaginationLink
  // -------------------------------------------------------------------------

  describe('PaginationLink', () => {
    it('링크를 올바르게 렌더링한다', () => {
      render(
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      );
      expect(screen.getByRole('link')).toHaveTextContent('1');
    });

    it('data-slot 속성을 가진다', () => {
      render(
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      );
      expect(screen.getByRole('link')).toHaveAttribute('data-slot', 'pagination-link');
    });

    it('isActive가 true일 때 aria-current="page"를 가진다', () => {
      render(
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                2
              </PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      );
      expect(screen.getByRole('link')).toHaveAttribute('aria-current', 'page');
    });

    it('isActive가 false일 때 aria-current가 없다', () => {
      render(
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      );
      expect(screen.getByRole('link')).not.toHaveAttribute('aria-current');
    });

    it('isActive일 때 data-active="true"를 가진다', () => {
      render(
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                2
              </PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      );
      expect(screen.getByRole('link')).toHaveAttribute('data-active', 'true');
    });

    it('클릭 이벤트를 처리한다', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn((e) => e.preventDefault());

      render(
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationLink href="#" onClick={handleClick}>
                1
              </PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      );

      await user.click(screen.getByRole('link'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  // -------------------------------------------------------------------------
  // PaginationPrevious
  // -------------------------------------------------------------------------

  describe('PaginationPrevious', () => {
    it('Previous 버튼을 렌더링한다', () => {
      render(
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      );
      expect(screen.getByRole('link', { name: /previous/i })).toBeInTheDocument();
    });

    it('적절한 aria-label을 가진다', () => {
      render(
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      );
      expect(screen.getByRole('link')).toHaveAttribute('aria-label', 'Go to previous page');
    });
  });

  // -------------------------------------------------------------------------
  // PaginationNext
  // -------------------------------------------------------------------------

  describe('PaginationNext', () => {
    it('Next 버튼을 렌더링한다', () => {
      render(
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      );
      expect(screen.getByRole('link', { name: /next/i })).toBeInTheDocument();
    });

    it('적절한 aria-label을 가진다', () => {
      render(
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      );
      expect(screen.getByRole('link')).toHaveAttribute('aria-label', 'Go to next page');
    });
  });

  // -------------------------------------------------------------------------
  // PaginationEllipsis
  // -------------------------------------------------------------------------

  describe('PaginationEllipsis', () => {
    it('ellipsis를 렌더링한다', () => {
      render(
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      );
      expect(screen.getByText('More pages')).toBeInTheDocument();
    });

    it('aria-hidden 속성을 가진다', () => {
      render(
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationEllipsis data-testid="ellipsis" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      );
      expect(screen.getByTestId('ellipsis')).toHaveAttribute('aria-hidden', 'true');
    });

    it('data-slot 속성을 가진다', () => {
      render(
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationEllipsis data-testid="ellipsis" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      );
      expect(screen.getByTestId('ellipsis')).toHaveAttribute('data-slot', 'pagination-ellipsis');
    });

    it('스크린 리더용 텍스트를 포함한다', () => {
      render(
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      );
      const srText = screen.getByText('More pages');
      expect(srText).toHaveClass('sr-only');
    });
  });

  // -------------------------------------------------------------------------
  // 통합 테스트
  // -------------------------------------------------------------------------

  describe('통합', () => {
    it('전체 페이지네이션 구조를 올바르게 렌더링한다', () => {
      render(
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">10</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      );

      expect(screen.getByRole('navigation')).toBeInTheDocument();
      expect(screen.getAllByRole('link')).toHaveLength(6);
      expect(screen.getByText('2')).toHaveAttribute('aria-current', 'page');
      expect(screen.getByText('More pages')).toBeInTheDocument();
    });
  });
});
