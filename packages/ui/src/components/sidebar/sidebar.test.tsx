import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from './sidebar';

// Mock matchMedia for mobile detection
const createMatchMedia = (matches: boolean) => {
  return vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
};

describe('Sidebar', () => {
  beforeEach(() => {
    // Default to desktop view
    window.matchMedia = createMatchMedia(false);
    // Mock document.cookie
    Object.defineProperty(document, 'cookie', {
      writable: true,
      value: '',
    });
  });

  // -------------------------------------------------------------------------
  // Rendering
  // -------------------------------------------------------------------------

  describe('렌더링', () => {
    it('SidebarProvider와 함께 올바르게 렌더링한다', () => {
      render(
        <SidebarProvider>
          <Sidebar data-testid="sidebar">
            <SidebarContent>
              <div>Sidebar Content</div>
            </SidebarContent>
          </Sidebar>
        </SidebarProvider>
      );

      expect(screen.getByTestId('sidebar')).toBeInTheDocument();
      expect(screen.getByText('Sidebar Content')).toBeInTheDocument();
    });

    it('SidebarHeader를 올바르게 렌더링한다', () => {
      render(
        <SidebarProvider>
          <Sidebar>
            <SidebarHeader data-testid="sidebar-header">Header</SidebarHeader>
          </Sidebar>
        </SidebarProvider>
      );

      expect(screen.getByTestId('sidebar-header')).toBeInTheDocument();
      expect(screen.getByText('Header')).toBeInTheDocument();
    });

    it('SidebarFooter를 올바르게 렌더링한다', () => {
      render(
        <SidebarProvider>
          <Sidebar>
            <SidebarContent />
            <SidebarFooter data-testid="sidebar-footer">Footer</SidebarFooter>
          </Sidebar>
        </SidebarProvider>
      );

      expect(screen.getByTestId('sidebar-footer')).toBeInTheDocument();
      expect(screen.getByText('Footer')).toBeInTheDocument();
    });

    it('SidebarInset을 올바르게 렌더링한다', () => {
      render(
        <SidebarProvider>
          <Sidebar>
            <SidebarContent />
          </Sidebar>
          <SidebarInset data-testid="sidebar-inset">
            <main>Main Content</main>
          </SidebarInset>
        </SidebarProvider>
      );

      expect(screen.getByTestId('sidebar-inset')).toBeInTheDocument();
      expect(screen.getByText('Main Content')).toBeInTheDocument();
    });
  });

  // -------------------------------------------------------------------------
  // Menu Components
  // -------------------------------------------------------------------------

  describe('메뉴 컴포넌트', () => {
    it('SidebarMenu와 SidebarMenuItem을 올바르게 렌더링한다', () => {
      render(
        <SidebarProvider>
          <Sidebar>
            <SidebarContent>
              <SidebarMenu data-testid="sidebar-menu">
                <SidebarMenuItem data-testid="menu-item-1">
                  <SidebarMenuButton>Item 1</SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem data-testid="menu-item-2">
                  <SidebarMenuButton>Item 2</SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarContent>
          </Sidebar>
        </SidebarProvider>
      );

      expect(screen.getByTestId('sidebar-menu')).toBeInTheDocument();
      expect(screen.getByTestId('menu-item-1')).toBeInTheDocument();
      expect(screen.getByTestId('menu-item-2')).toBeInTheDocument();
      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
    });

    it('SidebarMenuButton의 isActive 상태를 올바르게 적용한다', () => {
      render(
        <SidebarProvider>
          <Sidebar>
            <SidebarContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive data-testid="active-button">
                    Active Item
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarContent>
          </Sidebar>
        </SidebarProvider>
      );

      const button = screen.getByTestId('active-button');
      expect(button).toHaveAttribute('data-active', 'true');
    });

    it('SidebarMenuBadge를 올바르게 렌더링한다', () => {
      render(
        <SidebarProvider>
          <Sidebar>
            <SidebarContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton>Item</SidebarMenuButton>
                  <SidebarMenuBadge data-testid="badge">5</SidebarMenuBadge>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarContent>
          </Sidebar>
        </SidebarProvider>
      );

      expect(screen.getByTestId('badge')).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();
    });

    it('SidebarMenuSkeleton을 올바르게 렌더링한다', () => {
      render(
        <SidebarProvider>
          <Sidebar>
            <SidebarContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuSkeleton showIcon data-testid="skeleton" />
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarContent>
          </Sidebar>
        </SidebarProvider>
      );

      expect(screen.getByTestId('skeleton')).toBeInTheDocument();
    });
  });

  // -------------------------------------------------------------------------
  // SubMenu
  // -------------------------------------------------------------------------

  describe('서브 메뉴', () => {
    it('SidebarMenuSub을 올바르게 렌더링한다', () => {
      render(
        <SidebarProvider>
          <Sidebar>
            <SidebarContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton>Parent</SidebarMenuButton>
                  <SidebarMenuSub data-testid="submenu">
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton>Sub Item 1</SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton>Sub Item 2</SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarContent>
          </Sidebar>
        </SidebarProvider>
      );

      expect(screen.getByTestId('submenu')).toBeInTheDocument();
      expect(screen.getByText('Sub Item 1')).toBeInTheDocument();
      expect(screen.getByText('Sub Item 2')).toBeInTheDocument();
    });

    it('SidebarMenuSubButton의 isActive 상태를 올바르게 적용한다', () => {
      render(
        <SidebarProvider>
          <Sidebar>
            <SidebarContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton>Parent</SidebarMenuButton>
                  <SidebarMenuSub>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton isActive data-testid="active-sub">
                        Active Sub
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarContent>
          </Sidebar>
        </SidebarProvider>
      );

      const button = screen.getByTestId('active-sub');
      expect(button).toHaveAttribute('data-active', 'true');
    });
  });

  // -------------------------------------------------------------------------
  // Group
  // -------------------------------------------------------------------------

  describe('그룹', () => {
    it('SidebarGroup과 SidebarGroupLabel을 올바르게 렌더링한다', () => {
      render(
        <SidebarProvider>
          <Sidebar>
            <SidebarContent>
              <SidebarGroup data-testid="group">
                <SidebarGroupLabel data-testid="group-label">Group Label</SidebarGroupLabel>
                <SidebarGroupContent>Content</SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
        </SidebarProvider>
      );

      expect(screen.getByTestId('group')).toBeInTheDocument();
      expect(screen.getByTestId('group-label')).toBeInTheDocument();
      expect(screen.getByText('Group Label')).toBeInTheDocument();
    });

    it('SidebarSeparator를 올바르게 렌더링한다', () => {
      render(
        <SidebarProvider>
          <Sidebar>
            <SidebarContent>
              <SidebarGroup>Content 1</SidebarGroup>
              <SidebarSeparator data-testid="separator" />
              <SidebarGroup>Content 2</SidebarGroup>
            </SidebarContent>
          </Sidebar>
        </SidebarProvider>
      );

      expect(screen.getByTestId('separator')).toBeInTheDocument();
    });
  });

  // -------------------------------------------------------------------------
  // Variants
  // -------------------------------------------------------------------------

  describe('variants', () => {
    it('기본 variant는 sidebar이다', () => {
      render(
        <SidebarProvider>
          <Sidebar>
            <SidebarContent />
          </Sidebar>
        </SidebarProvider>
      );

      // data-variant는 wrapper div (data-slot="sidebar")에 있음
      const sidebar = document.querySelector('[data-slot="sidebar"]');
      expect(sidebar).toHaveAttribute('data-variant', 'sidebar');
    });

    it('floating variant를 적용한다', () => {
      render(
        <SidebarProvider>
          <Sidebar variant="floating">
            <SidebarContent />
          </Sidebar>
        </SidebarProvider>
      );

      const sidebar = document.querySelector('[data-slot="sidebar"]');
      expect(sidebar).toHaveAttribute('data-variant', 'floating');
    });

    it('inset variant를 적용한다', () => {
      render(
        <SidebarProvider>
          <Sidebar variant="inset">
            <SidebarContent />
          </Sidebar>
        </SidebarProvider>
      );

      const sidebar = document.querySelector('[data-slot="sidebar"]');
      expect(sidebar).toHaveAttribute('data-variant', 'inset');
    });
  });

  // -------------------------------------------------------------------------
  // Side
  // -------------------------------------------------------------------------

  describe('side', () => {
    it('기본 side는 left이다', () => {
      render(
        <SidebarProvider>
          <Sidebar>
            <SidebarContent />
          </Sidebar>
        </SidebarProvider>
      );

      const sidebar = document.querySelector('[data-slot="sidebar"]');
      expect(sidebar).toHaveAttribute('data-side', 'left');
    });

    it('right side를 적용한다', () => {
      render(
        <SidebarProvider>
          <Sidebar side="right">
            <SidebarContent />
          </Sidebar>
        </SidebarProvider>
      );

      const sidebar = document.querySelector('[data-slot="sidebar"]');
      expect(sidebar).toHaveAttribute('data-side', 'right');
    });
  });

  // -------------------------------------------------------------------------
  // Collapsible
  // -------------------------------------------------------------------------

  describe('collapsible', () => {
    it('collapsible="none"일 때 축소되지 않는 사이드바를 렌더링한다', () => {
      render(
        <SidebarProvider>
          <Sidebar collapsible="none" data-testid="sidebar">
            <SidebarContent>Non-collapsible Content</SidebarContent>
          </Sidebar>
        </SidebarProvider>
      );

      const sidebar = screen.getByTestId('sidebar');
      expect(sidebar).toBeInTheDocument();
      expect(screen.getByText('Non-collapsible Content')).toBeInTheDocument();
    });
  });

  // -------------------------------------------------------------------------
  // Toggle Behavior
  // -------------------------------------------------------------------------

  describe('토글 동작', () => {
    it('SidebarTrigger 클릭 시 사이드바를 토글한다', async () => {
      const user = userEvent.setup();

      render(
        <SidebarProvider defaultOpen={true}>
          <Sidebar>
            <SidebarContent />
          </Sidebar>
          <SidebarInset>
            <SidebarTrigger data-testid="trigger" />
          </SidebarInset>
        </SidebarProvider>
      );

      const sidebar = document.querySelector('[data-slot="sidebar"]');
      const trigger = screen.getByTestId('trigger');

      // Initially expanded
      expect(sidebar).toHaveAttribute('data-state', 'expanded');

      // Click to collapse
      await user.click(trigger);

      await waitFor(() => {
        expect(sidebar).toHaveAttribute('data-state', 'collapsed');
      });

      // Click to expand
      await user.click(trigger);

      await waitFor(() => {
        expect(sidebar).toHaveAttribute('data-state', 'expanded');
      });
    });

    it('defaultOpen prop을 올바르게 적용한다', () => {
      render(
        <SidebarProvider defaultOpen={false}>
          <Sidebar>
            <SidebarContent />
          </Sidebar>
        </SidebarProvider>
      );

      const sidebar = document.querySelector('[data-slot="sidebar"]');
      expect(sidebar).toHaveAttribute('data-state', 'collapsed');
    });
  });

  // -------------------------------------------------------------------------
  // Controlled Mode
  // -------------------------------------------------------------------------

  describe('제어 모드', () => {
    it('open prop으로 사이드바 상태를 제어할 수 있다', () => {
      const { rerender } = render(
        <SidebarProvider open={true}>
          <Sidebar>
            <SidebarContent />
          </Sidebar>
        </SidebarProvider>
      );

      expect(document.querySelector('[data-slot="sidebar"]')).toHaveAttribute(
        'data-state',
        'expanded'
      );

      rerender(
        <SidebarProvider open={false}>
          <Sidebar>
            <SidebarContent />
          </Sidebar>
        </SidebarProvider>
      );

      expect(document.querySelector('[data-slot="sidebar"]')).toHaveAttribute(
        'data-state',
        'collapsed'
      );
    });

    it('onOpenChange 콜백이 호출된다', async () => {
      const user = userEvent.setup();
      const handleOpenChange = vi.fn();

      render(
        <SidebarProvider open={true} onOpenChange={handleOpenChange}>
          <Sidebar>
            <SidebarContent />
          </Sidebar>
          <SidebarInset>
            <SidebarTrigger data-testid="trigger" />
          </SidebarInset>
        </SidebarProvider>
      );

      await user.click(screen.getByTestId('trigger'));

      expect(handleOpenChange).toHaveBeenCalledWith(false);
    });
  });

  // -------------------------------------------------------------------------
  // useSidebar Hook
  // -------------------------------------------------------------------------

  describe('useSidebar 훅', () => {
    it('SidebarProvider 없이 useSidebar를 사용하면 에러를 던진다', () => {
      const TestComponent = () => {
        useSidebar();
        return null;
      };

      // Suppress console.error for this test
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => render(<TestComponent />)).toThrow(
        'useSidebar must be used within a SidebarProvider.'
      );

      consoleSpy.mockRestore();
    });
  });

  // -------------------------------------------------------------------------
  // Props
  // -------------------------------------------------------------------------

  describe('props', () => {
    it('커스텀 className을 병합한다', () => {
      render(
        <SidebarProvider>
          <Sidebar className="custom-class">
            <SidebarContent />
          </Sidebar>
        </SidebarProvider>
      );

      // className은 sidebar-container div에 적용됨
      const sidebarContainer = document.querySelector('[data-slot="sidebar-container"]');
      expect(sidebarContainer).toHaveClass('custom-class');
    });

    it('추가 HTML 속성을 전달한다', () => {
      render(
        <SidebarProvider>
          <Sidebar data-testid="sidebar" aria-label="Main navigation">
            <SidebarContent />
          </Sidebar>
        </SidebarProvider>
      );

      // data-testid와 aria-label은 sidebar-container div에 적용됨
      const sidebarContainer = document.querySelector('[data-slot="sidebar-container"]');
      expect(sidebarContainer).toHaveAttribute('data-testid', 'sidebar');
      expect(sidebarContainer).toHaveAttribute('aria-label', 'Main navigation');
    });
  });

  // -------------------------------------------------------------------------
  // Button Variants and Sizes
  // -------------------------------------------------------------------------

  describe('SidebarMenuButton variants와 sizes', () => {
    it('default variant를 적용한다', () => {
      render(
        <SidebarProvider>
          <Sidebar>
            <SidebarContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton variant="default" data-testid="button">
                    Default
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarContent>
          </Sidebar>
        </SidebarProvider>
      );

      expect(screen.getByTestId('button')).toBeInTheDocument();
    });

    it('outline variant를 적용한다', () => {
      render(
        <SidebarProvider>
          <Sidebar>
            <SidebarContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton variant="outline" data-testid="button">
                    Outline
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarContent>
          </Sidebar>
        </SidebarProvider>
      );

      const button = screen.getByTestId('button');
      expect(button.className).toContain('bg-background');
    });

    it('sm size를 적용한다', () => {
      render(
        <SidebarProvider>
          <Sidebar>
            <SidebarContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton size="sm" data-testid="button">
                    Small
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarContent>
          </Sidebar>
        </SidebarProvider>
      );

      const button = screen.getByTestId('button');
      expect(button).toHaveAttribute('data-size', 'sm');
    });

    it('lg size를 적용한다', () => {
      render(
        <SidebarProvider>
          <Sidebar>
            <SidebarContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton size="lg" data-testid="button">
                    Large
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarContent>
          </Sidebar>
        </SidebarProvider>
      );

      const button = screen.getByTestId('button');
      expect(button).toHaveAttribute('data-size', 'lg');
    });
  });

  // -------------------------------------------------------------------------
  // Accessibility
  // -------------------------------------------------------------------------

  describe('접근성', () => {
    it('SidebarTrigger가 sr-only 텍스트를 가진다', () => {
      render(
        <SidebarProvider>
          <Sidebar>
            <SidebarContent />
          </Sidebar>
          <SidebarInset>
            <SidebarTrigger data-testid="trigger" />
          </SidebarInset>
        </SidebarProvider>
      );

      const trigger = screen.getByTestId('trigger');
      expect(trigger).toContainHTML('Toggle Sidebar');
    });
  });
});
