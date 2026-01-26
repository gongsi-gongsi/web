import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from './dropdown-menu';

describe('DropdownMenu', () => {
  // -------------------------------------------------------------------------
  // 기본 렌더링
  // -------------------------------------------------------------------------

  describe('렌더링', () => {
    it('트리거를 올바르게 렌더링한다', () => {
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>메뉴 열기</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>항목</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
      expect(screen.getByText('메뉴 열기')).toBeInTheDocument();
    });

    it('트리거가 data-slot 속성을 가진다', () => {
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>메뉴 열기</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>항목</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
      expect(screen.getByText('메뉴 열기')).toHaveAttribute('data-slot', 'dropdown-menu-trigger');
    });

    it('초기에는 컨텐츠가 보이지 않는다', () => {
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>메뉴 열기</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>항목</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
      expect(screen.queryByText('항목')).not.toBeInTheDocument();
    });
  });

  // -------------------------------------------------------------------------
  // 인터랙션
  // -------------------------------------------------------------------------

  describe('인터랙션', () => {
    it('트리거 클릭 시 메뉴가 열린다', async () => {
      const user = userEvent.setup();

      render(
        <DropdownMenu>
          <DropdownMenuTrigger>메뉴 열기</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>항목 1</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      await user.click(screen.getByText('메뉴 열기'));

      await waitFor(() => {
        expect(screen.getByText('항목 1')).toBeInTheDocument();
      });
    });

    it('메뉴 아이템 클릭 시 onSelect가 호출된다', async () => {
      const user = userEvent.setup();
      const handleSelect = vi.fn();

      render(
        <DropdownMenu>
          <DropdownMenuTrigger>메뉴 열기</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onSelect={handleSelect}>항목 1</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      await user.click(screen.getByText('메뉴 열기'));
      await waitFor(() => {
        expect(screen.getByText('항목 1')).toBeInTheDocument();
      });

      await user.click(screen.getByText('항목 1'));
      expect(handleSelect).toHaveBeenCalledTimes(1);
    });

    it('Escape 키를 누르면 메뉴가 닫힌다', async () => {
      const user = userEvent.setup();

      render(
        <DropdownMenu>
          <DropdownMenuTrigger>메뉴 열기</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>항목 1</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      await user.click(screen.getByText('메뉴 열기'));
      await waitFor(() => {
        expect(screen.getByText('항목 1')).toBeInTheDocument();
      });

      await user.keyboard('{Escape}');
      await waitFor(() => {
        expect(screen.queryByText('항목 1')).not.toBeInTheDocument();
      });
    });
  });

  // -------------------------------------------------------------------------
  // DropdownMenuItem
  // -------------------------------------------------------------------------

  describe('DropdownMenuItem', () => {
    it('data-slot 속성을 가진다', async () => {
      const user = userEvent.setup();

      render(
        <DropdownMenu>
          <DropdownMenuTrigger>메뉴 열기</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>항목</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      await user.click(screen.getByText('메뉴 열기'));
      await waitFor(() => {
        expect(screen.getByText('항목')).toHaveAttribute('data-slot', 'dropdown-menu-item');
      });
    });

    it('disabled 상태를 지원한다', async () => {
      const user = userEvent.setup();
      const handleSelect = vi.fn();

      render(
        <DropdownMenu>
          <DropdownMenuTrigger>메뉴 열기</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem disabled onSelect={handleSelect}>
              비활성 항목
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      await user.click(screen.getByText('메뉴 열기'));
      await waitFor(() => {
        expect(screen.getByText('비활성 항목')).toBeInTheDocument();
      });

      await user.click(screen.getByText('비활성 항목'));
      expect(handleSelect).not.toHaveBeenCalled();
    });

    it('destructive variant를 지원한다', async () => {
      const user = userEvent.setup();

      render(
        <DropdownMenu>
          <DropdownMenuTrigger>메뉴 열기</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem variant="destructive">삭제</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      await user.click(screen.getByText('메뉴 열기'));
      await waitFor(() => {
        expect(screen.getByText('삭제')).toHaveAttribute('data-variant', 'destructive');
      });
    });

    it('inset 속성을 지원한다', async () => {
      const user = userEvent.setup();

      render(
        <DropdownMenu>
          <DropdownMenuTrigger>메뉴 열기</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem inset>인셋 항목</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      await user.click(screen.getByText('메뉴 열기'));
      await waitFor(() => {
        expect(screen.getByText('인셋 항목')).toHaveAttribute('data-inset', 'true');
      });
    });
  });

  // -------------------------------------------------------------------------
  // DropdownMenuLabel
  // -------------------------------------------------------------------------

  describe('DropdownMenuLabel', () => {
    it('라벨을 렌더링한다', async () => {
      const user = userEvent.setup();

      render(
        <DropdownMenu>
          <DropdownMenuTrigger>메뉴 열기</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>내 계정</DropdownMenuLabel>
            <DropdownMenuItem>프로필</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      await user.click(screen.getByText('메뉴 열기'));
      await waitFor(() => {
        expect(screen.getByText('내 계정')).toBeInTheDocument();
      });
    });

    it('data-slot 속성을 가진다', async () => {
      const user = userEvent.setup();

      render(
        <DropdownMenu>
          <DropdownMenuTrigger>메뉴 열기</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>내 계정</DropdownMenuLabel>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      await user.click(screen.getByText('메뉴 열기'));
      await waitFor(() => {
        expect(screen.getByText('내 계정')).toHaveAttribute('data-slot', 'dropdown-menu-label');
      });
    });
  });

  // -------------------------------------------------------------------------
  // DropdownMenuSeparator
  // -------------------------------------------------------------------------

  describe('DropdownMenuSeparator', () => {
    it('구분선을 렌더링한다', async () => {
      const user = userEvent.setup();

      render(
        <DropdownMenu>
          <DropdownMenuTrigger>메뉴 열기</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>항목 1</DropdownMenuItem>
            <DropdownMenuSeparator data-testid="separator" />
            <DropdownMenuItem>항목 2</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      await user.click(screen.getByText('메뉴 열기'));
      await waitFor(() => {
        expect(screen.getByTestId('separator')).toBeInTheDocument();
      });
    });

    it('data-slot 속성을 가진다', async () => {
      const user = userEvent.setup();

      render(
        <DropdownMenu>
          <DropdownMenuTrigger>메뉴 열기</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuSeparator data-testid="separator" />
          </DropdownMenuContent>
        </DropdownMenu>
      );

      await user.click(screen.getByText('메뉴 열기'));
      await waitFor(() => {
        expect(screen.getByTestId('separator')).toHaveAttribute(
          'data-slot',
          'dropdown-menu-separator'
        );
      });
    });
  });

  // -------------------------------------------------------------------------
  // DropdownMenuShortcut
  // -------------------------------------------------------------------------

  describe('DropdownMenuShortcut', () => {
    it('단축키를 렌더링한다', async () => {
      const user = userEvent.setup();

      render(
        <DropdownMenu>
          <DropdownMenuTrigger>메뉴 열기</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              프로필
              <DropdownMenuShortcut>⌘P</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      await user.click(screen.getByText('메뉴 열기'));
      await waitFor(() => {
        expect(screen.getByText('⌘P')).toBeInTheDocument();
      });
    });

    it('data-slot 속성을 가진다', async () => {
      const user = userEvent.setup();

      render(
        <DropdownMenu>
          <DropdownMenuTrigger>메뉴 열기</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              프로필
              <DropdownMenuShortcut>⌘P</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      await user.click(screen.getByText('메뉴 열기'));
      await waitFor(() => {
        expect(screen.getByText('⌘P')).toHaveAttribute('data-slot', 'dropdown-menu-shortcut');
      });
    });
  });

  // -------------------------------------------------------------------------
  // DropdownMenuGroup
  // -------------------------------------------------------------------------

  describe('DropdownMenuGroup', () => {
    it('그룹을 렌더링한다', async () => {
      const user = userEvent.setup();

      render(
        <DropdownMenu>
          <DropdownMenuTrigger>메뉴 열기</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup data-testid="group">
              <DropdownMenuItem>항목 1</DropdownMenuItem>
              <DropdownMenuItem>항목 2</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      await user.click(screen.getByText('메뉴 열기'));
      await waitFor(() => {
        expect(screen.getByTestId('group')).toBeInTheDocument();
      });
    });

    it('data-slot 속성을 가진다', async () => {
      const user = userEvent.setup();

      render(
        <DropdownMenu>
          <DropdownMenuTrigger>메뉴 열기</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup data-testid="group">
              <DropdownMenuItem>항목</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      await user.click(screen.getByText('메뉴 열기'));
      await waitFor(() => {
        expect(screen.getByTestId('group')).toHaveAttribute('data-slot', 'dropdown-menu-group');
      });
    });
  });

  // -------------------------------------------------------------------------
  // DropdownMenuCheckboxItem
  // -------------------------------------------------------------------------

  describe('DropdownMenuCheckboxItem', () => {
    it('체크박스 아이템을 렌더링한다', async () => {
      const user = userEvent.setup();

      render(
        <DropdownMenu>
          <DropdownMenuTrigger>메뉴 열기</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuCheckboxItem checked>상태바 표시</DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      await user.click(screen.getByText('메뉴 열기'));
      await waitFor(() => {
        expect(screen.getByText('상태바 표시')).toBeInTheDocument();
      });
    });

    it('data-slot 속성을 가진다', async () => {
      const user = userEvent.setup();

      render(
        <DropdownMenu>
          <DropdownMenuTrigger>메뉴 열기</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuCheckboxItem>상태바 표시</DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      await user.click(screen.getByText('메뉴 열기'));
      await waitFor(() => {
        expect(screen.getByRole('menuitemcheckbox')).toHaveAttribute(
          'data-slot',
          'dropdown-menu-checkbox-item'
        );
      });
    });

    it('체크 상태를 토글한다', async () => {
      const user = userEvent.setup();
      const handleCheckedChange = vi.fn();

      render(
        <DropdownMenu>
          <DropdownMenuTrigger>메뉴 열기</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuCheckboxItem checked={false} onCheckedChange={handleCheckedChange}>
              상태바 표시
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      await user.click(screen.getByText('메뉴 열기'));
      await waitFor(() => {
        expect(screen.getByText('상태바 표시')).toBeInTheDocument();
      });

      await user.click(screen.getByRole('menuitemcheckbox'));
      expect(handleCheckedChange).toHaveBeenCalledWith(true);
    });
  });

  // -------------------------------------------------------------------------
  // DropdownMenuRadioGroup & RadioItem
  // -------------------------------------------------------------------------

  describe('DropdownMenuRadioGroup', () => {
    it('라디오 그룹을 렌더링한다', async () => {
      const user = userEvent.setup();

      render(
        <DropdownMenu>
          <DropdownMenuTrigger>메뉴 열기</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuRadioGroup value="top" data-testid="radio-group">
              <DropdownMenuRadioItem value="top">상단</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="bottom">하단</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      await user.click(screen.getByText('메뉴 열기'));
      await waitFor(() => {
        expect(screen.getByText('상단')).toBeInTheDocument();
        expect(screen.getByText('하단')).toBeInTheDocument();
      });
    });

    it('data-slot 속성을 가진다', async () => {
      const user = userEvent.setup();

      render(
        <DropdownMenu>
          <DropdownMenuTrigger>메뉴 열기</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuRadioGroup value="top" data-testid="radio-group">
              <DropdownMenuRadioItem value="top">상단</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      await user.click(screen.getByText('메뉴 열기'));
      await waitFor(() => {
        expect(screen.getByTestId('radio-group')).toHaveAttribute(
          'data-slot',
          'dropdown-menu-radio-group'
        );
      });
    });

    it('라디오 아이템 선택 시 onValueChange가 호출된다', async () => {
      const user = userEvent.setup();
      const handleValueChange = vi.fn();

      render(
        <DropdownMenu>
          <DropdownMenuTrigger>메뉴 열기</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuRadioGroup value="top" onValueChange={handleValueChange}>
              <DropdownMenuRadioItem value="top">상단</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="bottom">하단</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      await user.click(screen.getByText('메뉴 열기'));
      await waitFor(() => {
        expect(screen.getByText('하단')).toBeInTheDocument();
      });

      await user.click(screen.getByText('하단'));
      expect(handleValueChange).toHaveBeenCalledWith('bottom');
    });
  });

  // -------------------------------------------------------------------------
  // DropdownMenuSub
  // -------------------------------------------------------------------------

  describe('DropdownMenuSub', () => {
    it('서브메뉴를 렌더링한다', async () => {
      const user = userEvent.setup();

      render(
        <DropdownMenu>
          <DropdownMenuTrigger>메뉴 열기</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>더 보기</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem>서브 항목</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      await user.click(screen.getByText('메뉴 열기'));
      await waitFor(() => {
        expect(screen.getByText('더 보기')).toBeInTheDocument();
      });
    });

    it('서브메뉴 트리거가 data-slot 속성을 가진다', async () => {
      const user = userEvent.setup();

      render(
        <DropdownMenu>
          <DropdownMenuTrigger>메뉴 열기</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>더 보기</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem>서브 항목</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      await user.click(screen.getByText('메뉴 열기'));
      await waitFor(() => {
        expect(screen.getByText('더 보기')).toHaveAttribute(
          'data-slot',
          'dropdown-menu-sub-trigger'
        );
      });
    });
  });

  // -------------------------------------------------------------------------
  // 접근성
  // -------------------------------------------------------------------------

  describe('접근성', () => {
    it('키보드로 메뉴를 열 수 있다', async () => {
      const user = userEvent.setup();

      render(
        <DropdownMenu>
          <DropdownMenuTrigger>메뉴 열기</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>항목 1</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      screen.getByText('메뉴 열기').focus();
      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(screen.getByText('항목 1')).toBeInTheDocument();
      });
    });

    it('화살표 키로 메뉴 항목을 탐색할 수 있다', async () => {
      const user = userEvent.setup();

      render(
        <DropdownMenu>
          <DropdownMenuTrigger>메뉴 열기</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>항목 1</DropdownMenuItem>
            <DropdownMenuItem>항목 2</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      await user.click(screen.getByText('메뉴 열기'));
      await waitFor(() => {
        expect(screen.getByText('항목 1')).toBeInTheDocument();
      });

      await user.keyboard('{ArrowDown}');
      await user.keyboard('{ArrowDown}');

      expect(screen.getByText('항목 2')).toHaveFocus();
    });
  });
});
