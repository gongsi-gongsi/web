import { expect, fn, userEvent, within } from '@storybook/test'

import { Button } from '../button'

import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Button 컴포넌트는 사용자 인터랙션을 위한 기본 UI 요소입니다.

## 사용법

\`\`\`tsx
import { Button } from '@split/ui';

<Button variant="default" size="default">
  클릭하세요
</Button>
\`\`\`

## 특징

- **6가지 variant**: default, destructive, outline, secondary, ghost, link
- **8가지 size**: default, sm, lg, xl, icon, icon-sm, icon-lg, icon-bare
- **Interactive**: 클릭 시 축소 효과
- **asChild 지원**: Slot 패턴으로 커스텀 요소 사용 가능
- **접근성**: 키보드 네비게이션 지원
- **다크모드**: 자동 테마 지원
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
      description: '버튼의 시각적 스타일',
      table: {
        type: { summary: "'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'" },
        defaultValue: { summary: 'default' },
      },
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'xl', 'icon', 'icon-sm', 'icon-lg', 'icon-bare'],
      description: '버튼의 크기',
      table: {
        type: {
          summary: "'default' | 'sm' | 'lg' | 'xl' | 'icon' | 'icon-sm' | 'icon-lg' | 'icon-bare'",
        },
        defaultValue: { summary: 'default' },
      },
    },
    interactive: {
      control: 'boolean',
      description: '터치/클릭 시 축소 효과 활성화',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    asChild: {
      control: 'boolean',
      description: 'Slot 패턴을 사용하여 자식 요소를 버튼으로 렌더링',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    children: {
      description: '버튼 내부 콘텐츠',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
    loading: {
      control: 'boolean',
      description: '로딩 상태 (disabled + 스피너 표시)',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    disabled: {
      control: 'boolean',
      description: '비활성화 상태',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    onClick: {
      description: '클릭 이벤트 핸들러',
      table: {
        type: { summary: '() => void' },
      },
    },
  },
  args: {
    onClick: fn(),
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    variant: 'default',
    children: 'Default Button',
  },
  parameters: {
    docs: {
      description: {
        story: '주요 액션에 사용하는 기본 버튼입니다. CTA(Call to Action)에 적합합니다.',
      },
    },
  },
}

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Destructive Button',
  },
  parameters: {
    docs: {
      description: {
        story: '삭제, 제거 등 위험한 액션에 사용합니다.',
      },
    },
  },
}

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline Button',
  },
  parameters: {
    docs: {
      description: {
        story: '테두리만 있는 버튼입니다. 덜 강조되는 액션에 사용합니다.',
      },
    },
  },
}

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary Button',
  },
  parameters: {
    docs: {
      description: {
        story: '보조 액션에 사용합니다. Default 버튼과 함께 사용할 때 적합합니다.',
      },
    },
  },
}

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Ghost Button',
  },
  parameters: {
    docs: {
      description: {
        story: '배경 없이 호버 시에만 스타일이 적용되는 버튼입니다.',
      },
    },
  },
}

export const Link: Story = {
  args: {
    variant: 'link',
    children: 'Link Button',
  },
  parameters: {
    docs: {
      description: {
        story: '링크처럼 보이는 버튼입니다. 텍스트 링크 대신 사용할 수 있습니다.',
      },
    },
  },
}

export const Small: Story = {
  args: {
    size: 'sm',
    children: 'Small Button',
  },
  parameters: {
    docs: {
      description: {
        story: '작은 크기의 버튼입니다. 좁은 공간이나 인라인 액션에 적합합니다.',
      },
    },
  },
}

export const Large: Story = {
  args: {
    size: 'lg',
    children: 'Large Button',
  },
  parameters: {
    docs: {
      description: {
        story: '큰 크기의 버튼입니다. 중요한 CTA나 히어로 섹션에 적합합니다.',
      },
    },
  },
}

export const XLarge: Story = {
  args: {
    size: 'xl',
    children: 'XLarge Button',
  },
  parameters: {
    docs: {
      description: {
        story: '가장 큰 크기의 버튼입니다. 전체 너비 CTA나 모바일 하단 버튼에 적합합니다.',
      },
    },
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled Button',
  },
  parameters: {
    docs: {
      description: {
        story: '비활성화된 버튼입니다.',
      },
    },
  },
}

export const Loading: Story = {
  args: {
    loading: true,
    children: 'Loading Button',
  },
  parameters: {
    docs: {
      description: {
        story: '로딩 상태의 버튼입니다. 스피너가 표시되고 버튼이 비활성화됩니다.',
      },
    },
  },
}

export const LoadingVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button loading variant="default">
        Default
      </Button>
      <Button loading variant="destructive">
        Destructive
      </Button>
      <Button loading variant="outline">
        Outline
      </Button>
      <Button loading variant="secondary">
        Secondary
      </Button>
      <Button loading variant="ghost">
        Ghost
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '모든 variant에 로딩 상태를 적용한 예시입니다.',
      },
    },
  },
}

export const LoadingSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button loading size="sm">
        Small
      </Button>
      <Button loading size="default">
        Default
      </Button>
      <Button loading size="lg">
        Large
      </Button>
      <Button loading size="xl">
        XLarge
      </Button>
      <Button loading size="icon" variant="outline" aria-label="Loading icon" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '모든 크기에 로딩 상태를 적용한 예시입니다. 아이콘 버튼에서도 스피너가 표시됩니다.',
      },
    },
  },
}

// 인터랙션 테스트 예시
export const WithInteraction: Story = {
  args: {
    variant: 'default',
    children: '클릭하세요',
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button')

    // 버튼이 렌더링되었는지 확인
    await expect(button).toBeInTheDocument()

    // 클릭 테스트
    await userEvent.click(button)
    await expect(args.onClick).toHaveBeenCalledTimes(1)

    // 더블 클릭 테스트
    await userEvent.click(button)
    await expect(args.onClick).toHaveBeenCalledTimes(2)
  },
}

// 키보드 인터랙션 테스트
export const KeyboardInteraction: Story = {
  args: {
    variant: 'secondary',
    children: 'Enter/Space로 클릭',
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button')

    // Tab으로 포커스
    await userEvent.tab()
    await expect(button).toHaveFocus()

    // Enter 키로 클릭
    await userEvent.keyboard('{Enter}')
    await expect(args.onClick).toHaveBeenCalled()

    // Space 키로 클릭
    await userEvent.keyboard(' ')
    await expect(args.onClick).toHaveBeenCalledTimes(2)
  },
}

export const Interactive: Story = {
  args: {
    interactive: true,
    children: 'Interactive Button',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Interactive 모드가 활성화된 버튼입니다. 클릭 시 축소 애니메이션과 배경색 변화가 적용됩니다.',
      },
    },
  },
}

export const InteractiveVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button interactive variant="default">
        Default
      </Button>
      <Button interactive variant="destructive">
        Destructive
      </Button>
      <Button interactive variant="outline">
        Outline
      </Button>
      <Button interactive variant="secondary">
        Secondary
      </Button>
      <Button interactive variant="ghost">
        Ghost
      </Button>
      <Button interactive variant="link">
        Link
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '모든 variant에 interactive 효과를 적용한 예시입니다.',
      },
    },
  },
}

export const Playground: Story = {
  args: {
    interactive: false,
    variant: 'default',
    children: 'Playground Button',
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive 컨트롤을 테스트할 수 있는 플레이그라운드입니다.',
      },
    },
  },
}

// 아이콘 버튼 스토리
const SearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
)

export const Icon: Story = {
  args: {
    size: 'icon',
    variant: 'outline',
    'aria-label': 'Search',
    children: <SearchIcon />,
  },
  parameters: {
    docs: {
      description: {
        story: '아이콘만 포함하는 버튼입니다. 36px 고정 크기입니다.',
      },
    },
  },
}

export const IconSmall: Story = {
  args: {
    size: 'icon-sm',
    variant: 'outline',
    'aria-label': 'Search',
    children: <SearchIcon />,
  },
  parameters: {
    docs: {
      description: {
        story: '작은 아이콘 버튼입니다. 32px 고정 크기입니다.',
      },
    },
  },
}

export const IconLarge: Story = {
  args: {
    size: 'icon-lg',
    variant: 'outline',
    'aria-label': 'Search',
    children: <SearchIcon />,
  },
  parameters: {
    docs: {
      description: {
        story: '큰 아이콘 버튼입니다. 40px 고정 크기입니다.',
      },
    },
  },
}

export const IconBare: Story = {
  args: {
    size: 'icon-bare',
    variant: 'ghost',
    'aria-label': 'Search',
    children: <SearchIcon />,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Padding이 완전히 제거된 아이콘 버튼입니다. 아이콘 크기 그대로 사용되며, 최소한의 공간만 차지합니다. ghost variant와 함께 사용하기 적합합니다.',
      },
    },
  },
}

export const IconSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button size="icon-sm" variant="outline" aria-label="Small icon">
        <SearchIcon />
      </Button>
      <Button size="icon" variant="outline" aria-label="Default icon">
        <SearchIcon />
      </Button>
      <Button size="icon-lg" variant="outline" aria-label="Large icon">
        <SearchIcon />
      </Button>
      <Button size="icon-bare" variant="ghost" aria-label="Bare icon">
        <SearchIcon />
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '모든 아이콘 버튼 크기를 비교할 수 있습니다.',
      },
    },
  },
}
