import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from './table';

describe('Table', () => {
  // -------------------------------------------------------------------------
  // Table 컨테이너
  // -------------------------------------------------------------------------

  describe('Table', () => {
    it('테이블을 올바르게 렌더링한다', () => {
      render(
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>내용</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );
      expect(screen.getByRole('table')).toBeInTheDocument();
    });

    it('커스텀 className을 병합한다', () => {
      render(
        <Table className="custom-class">
          <TableBody>
            <TableRow>
              <TableCell>내용</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );
      expect(screen.getByRole('table')).toHaveClass('custom-class');
    });

    it('data-slot 속성을 가진다', () => {
      render(
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>내용</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );
      expect(screen.getByRole('table')).toHaveAttribute('data-slot', 'table');
    });

    it('스크롤 가능한 컨테이너로 감싸진다', () => {
      render(
        <Table data-testid="table">
          <TableBody>
            <TableRow>
              <TableCell>내용</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );
      const container = screen.getByTestId('table').parentElement;
      expect(container).toHaveAttribute('data-slot', 'table-container');
    });
  });

  // -------------------------------------------------------------------------
  // TableHeader
  // -------------------------------------------------------------------------

  describe('TableHeader', () => {
    it('thead를 올바르게 렌더링한다', () => {
      render(
        <Table>
          <TableHeader data-testid="header">
            <TableRow>
              <TableHead>제목</TableHead>
            </TableRow>
          </TableHeader>
        </Table>
      );
      expect(screen.getByTestId('header').tagName).toBe('THEAD');
    });

    it('data-slot 속성을 가진다', () => {
      render(
        <Table>
          <TableHeader data-testid="header">
            <TableRow>
              <TableHead>제목</TableHead>
            </TableRow>
          </TableHeader>
        </Table>
      );
      expect(screen.getByTestId('header')).toHaveAttribute('data-slot', 'table-header');
    });

    it('커스텀 className을 병합한다', () => {
      render(
        <Table>
          <TableHeader data-testid="header" className="custom-header">
            <TableRow>
              <TableHead>제목</TableHead>
            </TableRow>
          </TableHeader>
        </Table>
      );
      expect(screen.getByTestId('header')).toHaveClass('custom-header');
    });
  });

  // -------------------------------------------------------------------------
  // TableBody
  // -------------------------------------------------------------------------

  describe('TableBody', () => {
    it('tbody를 올바르게 렌더링한다', () => {
      render(
        <Table>
          <TableBody data-testid="body">
            <TableRow>
              <TableCell>내용</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );
      expect(screen.getByTestId('body').tagName).toBe('TBODY');
    });

    it('data-slot 속성을 가진다', () => {
      render(
        <Table>
          <TableBody data-testid="body">
            <TableRow>
              <TableCell>내용</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );
      expect(screen.getByTestId('body')).toHaveAttribute('data-slot', 'table-body');
    });
  });

  // -------------------------------------------------------------------------
  // TableFooter
  // -------------------------------------------------------------------------

  describe('TableFooter', () => {
    it('tfoot를 올바르게 렌더링한다', () => {
      render(
        <Table>
          <TableFooter data-testid="footer">
            <TableRow>
              <TableCell>합계</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      );
      expect(screen.getByTestId('footer').tagName).toBe('TFOOT');
    });

    it('data-slot 속성을 가진다', () => {
      render(
        <Table>
          <TableFooter data-testid="footer">
            <TableRow>
              <TableCell>합계</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      );
      expect(screen.getByTestId('footer')).toHaveAttribute('data-slot', 'table-footer');
    });
  });

  // -------------------------------------------------------------------------
  // TableRow
  // -------------------------------------------------------------------------

  describe('TableRow', () => {
    it('tr을 올바르게 렌더링한다', () => {
      render(
        <Table>
          <TableBody>
            <TableRow data-testid="row">
              <TableCell>내용</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );
      expect(screen.getByTestId('row').tagName).toBe('TR');
    });

    it('data-slot 속성을 가진다', () => {
      render(
        <Table>
          <TableBody>
            <TableRow data-testid="row">
              <TableCell>내용</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );
      expect(screen.getByTestId('row')).toHaveAttribute('data-slot', 'table-row');
    });
  });

  // -------------------------------------------------------------------------
  // TableHead
  // -------------------------------------------------------------------------

  describe('TableHead', () => {
    it('th를 올바르게 렌더링한다', () => {
      render(
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>제목</TableHead>
            </TableRow>
          </TableHeader>
        </Table>
      );
      expect(screen.getByRole('columnheader')).toHaveTextContent('제목');
    });

    it('data-slot 속성을 가진다', () => {
      render(
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>제목</TableHead>
            </TableRow>
          </TableHeader>
        </Table>
      );
      expect(screen.getByRole('columnheader')).toHaveAttribute('data-slot', 'table-head');
    });
  });

  // -------------------------------------------------------------------------
  // TableCell
  // -------------------------------------------------------------------------

  describe('TableCell', () => {
    it('td를 올바르게 렌더링한다', () => {
      render(
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>셀 내용</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );
      expect(screen.getByRole('cell')).toHaveTextContent('셀 내용');
    });

    it('data-slot 속성을 가진다', () => {
      render(
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>내용</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );
      expect(screen.getByRole('cell')).toHaveAttribute('data-slot', 'table-cell');
    });

    it('colSpan 속성을 지원한다', () => {
      render(
        <Table>
          <TableBody>
            <TableRow>
              <TableCell colSpan={3}>병합된 셀</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );
      expect(screen.getByRole('cell')).toHaveAttribute('colspan', '3');
    });
  });

  // -------------------------------------------------------------------------
  // TableCaption
  // -------------------------------------------------------------------------

  describe('TableCaption', () => {
    it('caption을 올바르게 렌더링한다', () => {
      render(
        <Table>
          <TableCaption>테이블 설명</TableCaption>
          <TableBody>
            <TableRow>
              <TableCell>내용</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );
      expect(screen.getByText('테이블 설명').tagName).toBe('CAPTION');
    });

    it('data-slot 속성을 가진다', () => {
      render(
        <Table>
          <TableCaption>테이블 설명</TableCaption>
          <TableBody>
            <TableRow>
              <TableCell>내용</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );
      expect(screen.getByText('테이블 설명')).toHaveAttribute('data-slot', 'table-caption');
    });
  });

  // -------------------------------------------------------------------------
  // 통합 테스트
  // -------------------------------------------------------------------------

  describe('통합', () => {
    it('전체 테이블 구조를 올바르게 렌더링한다', () => {
      render(
        <Table>
          <TableCaption>인보이스 목록</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>번호</TableHead>
              <TableHead>상태</TableHead>
              <TableHead>금액</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>INV001</TableCell>
              <TableCell>완료</TableCell>
              <TableCell>$100.00</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>INV002</TableCell>
              <TableCell>대기</TableCell>
              <TableCell>$200.00</TableCell>
            </TableRow>
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={2}>합계</TableCell>
              <TableCell>$300.00</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      );

      expect(screen.getByRole('table')).toBeInTheDocument();
      expect(screen.getByText('인보이스 목록')).toBeInTheDocument();
      expect(screen.getAllByRole('columnheader')).toHaveLength(3);
      expect(screen.getAllByRole('row')).toHaveLength(4);
      expect(screen.getByText('INV001')).toBeInTheDocument();
      expect(screen.getByText('$300.00')).toBeInTheDocument();
    });
  });
});
