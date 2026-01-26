import {
  Calendar,
  ChevronUp,
  Home,
  Inbox,
  MoreHorizontal,
  Search,
  Settings,
  User2,
} from 'lucide-react';

import { Button } from '../button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../dropdown-menu';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from './sidebar';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Sidebar> = {
  title: 'Components/Sidebar',
  component: Sidebar,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
Sidebar 컴포넌트는 애플리케이션의 네비게이션을 위한 사이드바 UI 요소입니다.

## 사용법

\`\`\`tsx
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from '@split/ui';

<SidebarProvider>
  <Sidebar>
    <SidebarContent>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton>Dashboard</SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarContent>
  </Sidebar>
</SidebarProvider>
\`\`\`

## 특징

- **3가지 variant**: sidebar (기본), floating, inset
- **3가지 collapsible 모드**: offcanvas, icon, none
- **반응형**: 데스크톱과 모바일에서 다른 동작
- **키보드 단축키**: Cmd/Ctrl + B로 토글
- **테마 지원**: 라이트/다크 모드 자동 지원
        `,
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="h-[600px] w-full">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Menu items.
const items = [
  {
    title: 'Home',
    url: '#',
    icon: Home,
  },
  {
    title: 'Inbox',
    url: '#',
    icon: Inbox,
    badge: '5',
  },
  {
    title: 'Calendar',
    url: '#',
    icon: Calendar,
  },
  {
    title: 'Search',
    url: '#',
    icon: Search,
  },
  {
    title: 'Settings',
    url: '#',
    icon: Settings,
  },
];

export const Default: Story = {
  render: () => (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  S
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">Split</span>
                  <span className="text-xs">Dashboard</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Application</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton>
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                    {item.badge && <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <User2 />
                <span>Profile</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="border-sidebar-border flex h-16 items-center gap-4 border-b px-4">
          <SidebarTrigger />
          <h1 className="text-lg font-semibold">Dashboard</h1>
        </header>
        <main className="flex-1 p-4">
          <p className="text-muted-foreground">
            메인 콘텐츠 영역입니다. Cmd/Ctrl + B로 사이드바를 토글할 수 있습니다.
          </p>
        </main>
      </SidebarInset>
    </SidebarProvider>
  ),
  parameters: {
    docs: {
      description: {
        story: '기본 Sidebar 예시입니다. 헤더, 콘텐츠, 푸터로 구성됩니다.',
      },
    },
  },
};

export const CollapsibleIcon: Story = {
  render: () => (
    <SidebarProvider defaultOpen={false}>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" tooltip="Split Dashboard">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  S
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">Split</span>
                  <span className="text-xs">Dashboard</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Application</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton tooltip={item.title}>
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <header className="border-sidebar-border flex h-16 items-center gap-4 border-b px-4">
          <SidebarTrigger />
          <h1 className="text-lg font-semibold">Dashboard</h1>
        </header>
        <main className="flex-1 p-4">
          <p className="text-muted-foreground">
            아이콘 모드로 축소되는 사이드바입니다. 사이드바 가장자리를 클릭하거나 Cmd/Ctrl + B로
            확장할 수 있습니다.
          </p>
        </main>
      </SidebarInset>
    </SidebarProvider>
  ),
  parameters: {
    docs: {
      description: {
        story: '아이콘만 표시되는 축소 모드 (collapsible="icon")입니다. 축소 시 툴팁이 표시됩니다.',
      },
    },
  },
};

export const Floating: Story = {
  render: () => (
    <SidebarProvider>
      <Sidebar variant="floating">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  S
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">Split</span>
                  <span className="text-xs">Dashboard</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Application</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton>
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <header className="border-sidebar-border flex h-16 items-center gap-4 border-b px-4">
          <SidebarTrigger />
          <h1 className="text-lg font-semibold">Dashboard</h1>
        </header>
        <main className="flex-1 p-4">
          <p className="text-muted-foreground">
            플로팅 스타일의 사이드바입니다. 둥근 모서리와 그림자가 적용됩니다.
          </p>
        </main>
      </SidebarInset>
    </SidebarProvider>
  ),
  parameters: {
    docs: {
      description: {
        story: '플로팅 스타일 (variant="floating")입니다. 둥근 모서리와 그림자가 적용됩니다.',
      },
    },
  },
};

export const Inset: Story = {
  render: () => (
    <SidebarProvider>
      <Sidebar variant="inset">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  S
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">Split</span>
                  <span className="text-xs">Dashboard</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Application</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton>
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <header className="border-sidebar-border flex h-16 items-center gap-4 border-b px-4">
          <SidebarTrigger />
          <h1 className="text-lg font-semibold">Dashboard</h1>
        </header>
        <main className="flex-1 p-4">
          <p className="text-muted-foreground">
            인셋 스타일의 사이드바입니다. 메인 콘텐츠가 카드처럼 보입니다.
          </p>
        </main>
      </SidebarInset>
    </SidebarProvider>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '인셋 스타일 (variant="inset")입니다. 메인 콘텐츠가 카드처럼 둥근 모서리를 가집니다.',
      },
    },
  },
};

export const RightSide: Story = {
  render: () => (
    <SidebarProvider>
      <SidebarInset>
        <header className="border-sidebar-border flex h-16 items-center justify-between gap-4 border-b px-4">
          <h1 className="text-lg font-semibold">Dashboard</h1>
          <SidebarTrigger />
        </header>
        <main className="flex-1 p-4">
          <p className="text-muted-foreground">
            오른쪽에 위치한 사이드바입니다. 보조 패널이나 설정에 적합합니다.
          </p>
        </main>
      </SidebarInset>
      <Sidebar side="right">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg">
                <Settings className="size-4" />
                <span className="font-semibold">Settings</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Preferences</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <User2 />
                    <span>Account</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <Settings />
                    <span>General</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  ),
  parameters: {
    docs: {
      description: {
        story: '오른쪽에 위치한 사이드바 (side="right")입니다.',
      },
    },
  },
};

export const WithSubMenu: Story = {
  render: () => (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  S
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">Split</span>
                  <span className="text-xs">Dashboard</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive>
                    <Home />
                    <span>Dashboard</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <Inbox />
                    <span>Projects</span>
                  </SidebarMenuButton>
                  <SidebarMenuSub>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton isActive>
                        <span>Project Alpha</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton>
                        <span>Project Beta</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton>
                        <span>Project Gamma</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <Calendar />
                    <span>Calendar</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="border-sidebar-border flex h-16 items-center gap-4 border-b px-4">
          <SidebarTrigger />
          <h1 className="text-lg font-semibold">Dashboard</h1>
        </header>
        <main className="flex-1 p-4">
          <p className="text-muted-foreground">서브 메뉴가 있는 사이드바입니다.</p>
        </main>
      </SidebarInset>
    </SidebarProvider>
  ),
  parameters: {
    docs: {
      description: {
        story: '서브 메뉴(SidebarMenuSub)가 있는 사이드바 예시입니다.',
      },
    },
  },
};

export const WithMenuAction: Story = {
  render: () => (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  S
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">Split</span>
                  <span className="text-xs">Dashboard</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>
              Projects
              <SidebarGroupAction>
                <Button variant="ghost" size="icon" className="size-5">
                  +
                </Button>
              </SidebarGroupAction>
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {['Project Alpha', 'Project Beta', 'Project Gamma'].map((project) => (
                  <SidebarMenuItem key={project}>
                    <SidebarMenuButton>
                      <Inbox />
                      <span>{project}</span>
                    </SidebarMenuButton>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <SidebarMenuAction showOnHover>
                          <MoreHorizontal />
                        </SidebarMenuAction>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" side="right">
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Share</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="border-sidebar-border flex h-16 items-center gap-4 border-b px-4">
          <SidebarTrigger />
          <h1 className="text-lg font-semibold">Dashboard</h1>
        </header>
        <main className="flex-1 p-4">
          <p className="text-muted-foreground">
            메뉴 아이템에 액션 버튼이 있는 사이드바입니다. 호버 시 액션 버튼이 표시됩니다.
          </p>
        </main>
      </SidebarInset>
    </SidebarProvider>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '메뉴 액션(SidebarMenuAction)이 있는 사이드바입니다. 호버 시 드롭다운 메뉴가 표시됩니다.',
      },
    },
  },
};

export const WithUserDropdown: Story = {
  render: () => (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  S
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">Split</span>
                  <span className="text-xs">Dashboard</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Application</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton>
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton>
                    <User2 />
                    <span>John Doe</span>
                    <ChevronUp className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="top" className="w-(--radix-popper-anchor-width)">
                  <DropdownMenuItem>
                    <span>Account</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="border-sidebar-border flex h-16 items-center gap-4 border-b px-4">
          <SidebarTrigger />
          <h1 className="text-lg font-semibold">Dashboard</h1>
        </header>
        <main className="flex-1 p-4">
          <p className="text-muted-foreground">푸터에 사용자 드롭다운이 있는 사이드바입니다.</p>
        </main>
      </SidebarInset>
    </SidebarProvider>
  ),
  parameters: {
    docs: {
      description: {
        story: '푸터에 사용자 드롭다운 메뉴가 있는 사이드바입니다.',
      },
    },
  },
};

export const WithSeparator: Story = {
  render: () => (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  S
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">Split</span>
                  <span className="text-xs">Dashboard</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarSeparator />
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Main</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <Home />
                    <span>Home</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <Inbox />
                    <span>Inbox</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarSeparator />
          <SidebarGroup>
            <SidebarGroupLabel>Other</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <Calendar />
                    <span>Calendar</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <Settings />
                    <span>Settings</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="border-sidebar-border flex h-16 items-center gap-4 border-b px-4">
          <SidebarTrigger />
          <h1 className="text-lg font-semibold">Dashboard</h1>
        </header>
        <main className="flex-1 p-4">
          <p className="text-muted-foreground">구분선(Separator)이 있는 사이드바입니다.</p>
        </main>
      </SidebarInset>
    </SidebarProvider>
  ),
  parameters: {
    docs: {
      description: {
        story: 'SidebarSeparator를 사용하여 그룹을 구분하는 예시입니다.',
      },
    },
  },
};

export const Skeleton: Story = {
  render: () => (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuSkeleton showIcon />
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Loading...</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {[1, 2, 3, 4, 5].map((i) => (
                  <SidebarMenuItem key={i}>
                    <SidebarMenuSkeleton showIcon />
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuSkeleton showIcon />
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="border-sidebar-border flex h-16 items-center gap-4 border-b px-4">
          <SidebarTrigger />
          <h1 className="text-lg font-semibold">Dashboard</h1>
        </header>
        <main className="flex-1 p-4">
          <p className="text-muted-foreground">로딩 상태를 표시하는 스켈레톤 사이드바입니다.</p>
        </main>
      </SidebarInset>
    </SidebarProvider>
  ),
  parameters: {
    docs: {
      description: {
        story: 'SidebarMenuSkeleton을 사용한 로딩 상태 예시입니다.',
      },
    },
  },
};

export const Controlled: Story = {
  render: function ControlledStory() {
    const [open, setOpen] = React.useState(true);

    return (
      <SidebarProvider open={open} onOpenChange={setOpen}>
        <Sidebar>
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton size="lg">
                  <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                    S
                  </div>
                  <div className="flex flex-col gap-0.5 leading-none">
                    <span className="font-semibold">Split</span>
                    <span className="text-xs">Dashboard</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Application</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton>
                        <item.icon />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
          <header className="border-sidebar-border flex h-16 items-center gap-4 border-b px-4">
            <SidebarTrigger />
            <h1 className="text-lg font-semibold">Dashboard</h1>
          </header>
          <main className="flex-1 p-4">
            <div className="space-y-4">
              <p className="text-muted-foreground">
                외부에서 상태를 제어하는 사이드바입니다. 현재 상태: {open ? '열림' : '닫힘'}
              </p>
              <Button onClick={() => setOpen(!open)}>
                Toggle Sidebar ({open ? '닫기' : '열기'})
              </Button>
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    );
  },
  parameters: {
    docs: {
      description: {
        story: '외부 상태로 제어되는 (controlled) 사이드바 예시입니다.',
      },
    },
  },
};

// Required for using React hooks in stories
const React = await import('react');
