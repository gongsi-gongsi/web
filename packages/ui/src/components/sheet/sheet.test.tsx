import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Button } from '../button';

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../sheet';

describe('Sheet', () => {
  // -------------------------------------------------------------------------
  // 렌더링
  // -------------------------------------------------------------------------

  describe('렌더링', () => {
    it('SheetTrigger를 올바르게 렌더링한다', () => {
      render(
        <Sheet>
          <SheetTrigger>Open Sheet</SheetTrigger>
          <SheetContent>Content</SheetContent>
        </Sheet>
      );

      expect(screen.getByRole('button', { name: /open sheet/i })).toBeInTheDocument();
    });

    it('open=true일 때 SheetContent를 렌더링한다', () => {
      render(
        <Sheet open>
          <SheetTrigger>Open</SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Title</SheetTitle>
              <SheetDescription>Description</SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      );

      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByText('Description')).toBeInTheDocument();
    });

    it('SheetHeader를 올바르게 렌더링한다', () => {
      render(
        <Sheet open>
          <SheetContent>
            <SheetHeader data-testid="sheet-header">Header Content</SheetHeader>
          </SheetContent>
        </Sheet>
      );

      expect(screen.getByTestId('sheet-header')).toBeInTheDocument();
      expect(screen.getByText('Header Content')).toBeInTheDocument();
    });

    it('SheetFooter를 올바르게 렌더링한다', () => {
      render(
        <Sheet open>
          <SheetContent>
            <SheetFooter data-testid="sheet-footer">Footer Content</SheetFooter>
          </SheetContent>
        </Sheet>
      );

      expect(screen.getByTestId('sheet-footer')).toBeInTheDocument();
      expect(screen.getByText('Footer Content')).toBeInTheDocument();
    });

    it('SheetTitle을 올바르게 렌더링한다', () => {
      render(
        <Sheet open>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Test Title</SheetTitle>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      );

      expect(screen.getByText('Test Title')).toBeInTheDocument();
    });

    it('SheetDescription을 올바르게 렌더링한다', () => {
      render(
        <Sheet open>
          <SheetContent>
            <SheetHeader>
              <SheetDescription>Test Description</SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      );

      expect(screen.getByText('Test Description')).toBeInTheDocument();
    });
  });

  // -------------------------------------------------------------------------
  // 인터랙션
  // -------------------------------------------------------------------------

  describe('인터랙션', () => {
    it('SheetTrigger 클릭 시 Sheet가 열린다', async () => {
      const user = userEvent.setup();

      render(
        <Sheet>
          <SheetTrigger>Open</SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Sheet Title</SheetTitle>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      );

      expect(screen.queryByText('Sheet Title')).not.toBeInTheDocument();

      await user.click(screen.getByRole('button', { name: /open/i }));

      await waitFor(() => {
        expect(screen.getByText('Sheet Title')).toBeInTheDocument();
      });
    });

    it('SheetClose 클릭 시 Sheet가 닫힌다', async () => {
      const user = userEvent.setup();

      render(
        <Sheet>
          <SheetTrigger>Open</SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Sheet Title</SheetTitle>
            </SheetHeader>
            <SheetClose data-testid="close-button">Close</SheetClose>
          </SheetContent>
        </Sheet>
      );

      // Open the sheet
      await user.click(screen.getByRole('button', { name: /open/i }));
      await waitFor(() => {
        expect(screen.getByText('Sheet Title')).toBeInTheDocument();
      });

      // Close the sheet
      await user.click(screen.getByTestId('close-button'));

      await waitFor(() => {
        expect(screen.queryByText('Sheet Title')).not.toBeInTheDocument();
      });
    });

    it('닫기 아이콘 버튼 클릭 시 Sheet가 닫힌다', async () => {
      const user = userEvent.setup();

      render(
        <Sheet>
          <SheetTrigger>Open</SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Sheet Title</SheetTitle>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      );

      // Open the sheet
      await user.click(screen.getByRole('button', { name: /open/i }));
      await waitFor(() => {
        expect(screen.getByText('Sheet Title')).toBeInTheDocument();
      });

      // Click the close icon button (sr-only text is "Close")
      const closeButton = screen.getByRole('button', { name: /close/i });
      await user.click(closeButton);

      await waitFor(() => {
        expect(screen.queryByText('Sheet Title')).not.toBeInTheDocument();
      });
    });

    it('ESC 키를 누르면 Sheet가 닫힌다', async () => {
      const user = userEvent.setup();

      render(
        <Sheet>
          <SheetTrigger>Open</SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Sheet Title</SheetTitle>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      );

      // Open the sheet
      await user.click(screen.getByRole('button', { name: /open/i }));
      await waitFor(() => {
        expect(screen.getByText('Sheet Title')).toBeInTheDocument();
      });

      // Press ESC
      await user.keyboard('{Escape}');

      await waitFor(() => {
        expect(screen.queryByText('Sheet Title')).not.toBeInTheDocument();
      });
    });
  });

  // -------------------------------------------------------------------------
  // Side variants
  // -------------------------------------------------------------------------

  describe('side variants', () => {
    it('기본 side는 right이다', () => {
      render(
        <Sheet open>
          <SheetContent data-testid="content">Content</SheetContent>
        </Sheet>
      );

      const content = screen.getByTestId('content');
      expect(content.className).toContain('right-0');
    });

    it('side="left"를 적용한다', () => {
      render(
        <Sheet open>
          <SheetContent side="left" data-testid="content">
            Content
          </SheetContent>
        </Sheet>
      );

      const content = screen.getByTestId('content');
      expect(content.className).toContain('left-0');
    });

    it('side="top"를 적용한다', () => {
      render(
        <Sheet open>
          <SheetContent side="top" data-testid="content">
            Content
          </SheetContent>
        </Sheet>
      );

      const content = screen.getByTestId('content');
      expect(content.className).toContain('top-0');
    });

    it('side="bottom"를 적용한다', () => {
      render(
        <Sheet open>
          <SheetContent side="bottom" data-testid="content">
            Content
          </SheetContent>
        </Sheet>
      );

      const content = screen.getByTestId('content');
      expect(content.className).toContain('bottom-0');
    });
  });

  // -------------------------------------------------------------------------
  // 제어 모드
  // -------------------------------------------------------------------------

  describe('제어 모드', () => {
    it('open prop으로 Sheet 상태를 제어할 수 있다', () => {
      const { rerender } = render(
        <Sheet open={false}>
          <SheetContent>
            <SheetTitle>Title</SheetTitle>
          </SheetContent>
        </Sheet>
      );

      expect(screen.queryByText('Title')).not.toBeInTheDocument();

      rerender(
        <Sheet open={true}>
          <SheetContent>
            <SheetTitle>Title</SheetTitle>
          </SheetContent>
        </Sheet>
      );

      expect(screen.getByText('Title')).toBeInTheDocument();
    });

    it('onOpenChange 콜백이 호출된다', async () => {
      const user = userEvent.setup();
      const handleOpenChange = vi.fn();

      render(
        <Sheet onOpenChange={handleOpenChange}>
          <SheetTrigger>Open</SheetTrigger>
          <SheetContent>
            <SheetTitle>Title</SheetTitle>
          </SheetContent>
        </Sheet>
      );

      await user.click(screen.getByRole('button', { name: /open/i }));

      expect(handleOpenChange).toHaveBeenCalledWith(true);
    });
  });

  // -------------------------------------------------------------------------
  // asChild
  // -------------------------------------------------------------------------

  describe('asChild', () => {
    it('SheetTrigger에 asChild를 사용할 수 있다', async () => {
      const user = userEvent.setup();

      render(
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline">Custom Button</Button>
          </SheetTrigger>
          <SheetContent>
            <SheetTitle>Title</SheetTitle>
          </SheetContent>
        </Sheet>
      );

      const button = screen.getByRole('button', { name: /custom button/i });
      expect(button.className).toContain('border');

      await user.click(button);

      await waitFor(() => {
        expect(screen.getByText('Title')).toBeInTheDocument();
      });
    });

    it('SheetClose에 asChild를 사용할 수 있다', async () => {
      const user = userEvent.setup();

      render(
        <Sheet>
          <SheetTrigger>Open</SheetTrigger>
          <SheetContent>
            <SheetTitle>Title</SheetTitle>
            <SheetClose asChild>
              <Button>Custom Close</Button>
            </SheetClose>
          </SheetContent>
        </Sheet>
      );

      await user.click(screen.getByRole('button', { name: /open/i }));

      await waitFor(() => {
        expect(screen.getByText('Title')).toBeInTheDocument();
      });

      const closeButton = screen.getByRole('button', { name: /custom close/i });
      await user.click(closeButton);

      await waitFor(() => {
        expect(screen.queryByText('Title')).not.toBeInTheDocument();
      });
    });
  });

  // -------------------------------------------------------------------------
  // Props
  // -------------------------------------------------------------------------

  describe('props', () => {
    it('SheetContent에 커스텀 className을 병합한다', () => {
      render(
        <Sheet open>
          <SheetContent className="custom-class" data-testid="content">
            Content
          </SheetContent>
        </Sheet>
      );

      expect(screen.getByTestId('content')).toHaveClass('custom-class');
    });

    it('SheetHeader에 커스텀 className을 병합한다', () => {
      render(
        <Sheet open>
          <SheetContent>
            <SheetHeader className="custom-header" data-testid="header">
              Header
            </SheetHeader>
          </SheetContent>
        </Sheet>
      );

      expect(screen.getByTestId('header')).toHaveClass('custom-header');
    });

    it('SheetFooter에 커스텀 className을 병합한다', () => {
      render(
        <Sheet open>
          <SheetContent>
            <SheetFooter className="custom-footer" data-testid="footer">
              Footer
            </SheetFooter>
          </SheetContent>
        </Sheet>
      );

      expect(screen.getByTestId('footer')).toHaveClass('custom-footer');
    });

    it('SheetTitle에 커스텀 className을 병합한다', () => {
      render(
        <Sheet open>
          <SheetContent>
            <SheetTitle className="custom-title" data-testid="title">
              Title
            </SheetTitle>
          </SheetContent>
        </Sheet>
      );

      expect(screen.getByTestId('title')).toHaveClass('custom-title');
    });

    it('SheetDescription에 커스텀 className을 병합한다', () => {
      render(
        <Sheet open>
          <SheetContent>
            <SheetDescription className="custom-desc" data-testid="desc">
              Description
            </SheetDescription>
          </SheetContent>
        </Sheet>
      );

      expect(screen.getByTestId('desc')).toHaveClass('custom-desc');
    });
  });

  // -------------------------------------------------------------------------
  // 접근성
  // -------------------------------------------------------------------------

  describe('접근성', () => {
    it('Sheet가 열리면 dialog role을 가진다', async () => {
      const user = userEvent.setup();

      render(
        <Sheet>
          <SheetTrigger>Open</SheetTrigger>
          <SheetContent>
            <SheetTitle>Title</SheetTitle>
          </SheetContent>
        </Sheet>
      );

      await user.click(screen.getByRole('button', { name: /open/i }));

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
    });

    it('닫기 버튼에 sr-only 텍스트가 있다', async () => {
      const user = userEvent.setup();

      render(
        <Sheet>
          <SheetTrigger>Open</SheetTrigger>
          <SheetContent>
            <SheetTitle>Title</SheetTitle>
          </SheetContent>
        </Sheet>
      );

      await user.click(screen.getByRole('button', { name: /open/i }));

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument();
      });
    });

    it('SheetTitle이 dialog의 aria-labelledby로 연결된다', async () => {
      const user = userEvent.setup();

      render(
        <Sheet>
          <SheetTrigger>Open</SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Accessible Title</SheetTitle>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      );

      await user.click(screen.getByRole('button', { name: /open/i }));

      await waitFor(() => {
        const dialog = screen.getByRole('dialog');
        const title = screen.getByText('Accessible Title');
        expect(dialog).toHaveAttribute('aria-labelledby', title.id);
      });
    });
  });

  // -------------------------------------------------------------------------
  // 오버레이
  // -------------------------------------------------------------------------

  describe('오버레이', () => {
    it('Sheet가 열리면 오버레이가 표시된다', async () => {
      const user = userEvent.setup();

      render(
        <Sheet>
          <SheetTrigger>Open</SheetTrigger>
          <SheetContent>
            <SheetTitle>Title</SheetTitle>
          </SheetContent>
        </Sheet>
      );

      await user.click(screen.getByRole('button', { name: /open/i }));

      await waitFor(() => {
        const overlay = document.querySelector('[data-slot="sheet-overlay"]');
        expect(overlay).toBeInTheDocument();
      });
    });
  });
});
