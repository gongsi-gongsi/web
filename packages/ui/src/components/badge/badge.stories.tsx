import { Badge } from './badge';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Badge> = {
  title: 'Components/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Badge 컴포넌트는 상태, 카테고리, 라벨 등을 표시하는 작은 UI 요소입니다.

## 사용법

\`\`\`tsx
import { Badge } from '@split/ui';

<Badge variant="default">
  New
</Badge>
\`\`\`

## 특징

- **4가지 variant**: default, secondary, destructive, outline
- **asChild 지원**: 링크나 버튼으로 렌더링 가능
- **아이콘 지원**: SVG 아이콘 자동 크기 조절
- **다크모드**: 자동 테마 지원
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'destructive', 'outline'],
      description: '배지의 시각적 스타일',
      table: {
        type: { summary: "'default' | 'secondary' | 'destructive' | 'outline'" },
        defaultValue: { summary: 'default' },
      },
    },
    asChild: {
      control: 'boolean',
      description: '자식 요소를 렌더링 컨테이너로 사용',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    children: {
      description: '배지 내부 콘텐츠',
      table: {
        type: { summary: 'ReactNode' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Badge',
    variant: 'default',
  },
  parameters: {
    docs: {
      description: {
        story: '기본 배지입니다. 주요 상태나 라벨을 표시할 때 사용합니다.',
      },
    },
  },
};

export const Secondary: Story = {
  args: {
    children: 'Secondary',
    variant: 'secondary',
  },
  parameters: {
    docs: {
      description: {
        story: '보조 배지입니다. 덜 강조되는 상태나 카테고리에 사용합니다.',
      },
    },
  },
};

export const Destructive: Story = {
  args: {
    children: 'Destructive',
    variant: 'destructive',
  },
  parameters: {
    docs: {
      description: {
        story: '경고나 삭제 등 위험한 상태를 표시할 때 사용합니다.',
      },
    },
  },
};

export const Outline: Story = {
  args: {
    children: 'Outline',
    variant: 'outline',
  },
  parameters: {
    docs: {
      description: {
        story: '테두리만 있는 배지입니다. 덜 눈에 띄는 라벨에 사용합니다.',
      },
    },
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex gap-2">
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '모든 variant를 한눈에 비교할 수 있습니다.',
      },
    },
  },
};

export const AsLink: Story = {
  render: () => (
    <Badge asChild>
      <a href="#">Link Badge</a>
    </Badge>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '`asChild` prop을 사용하면 배지를 링크로 렌더링할 수 있습니다. hover 시 스타일이 적용됩니다.',
      },
    },
  },
};
