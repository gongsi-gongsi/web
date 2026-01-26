import { Skeleton } from '../skeleton';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Skeleton> = {
  title: 'Components/Skeleton',
  component: Skeleton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Skeleton 컴포넌트는 콘텐츠 로딩 중 플레이스홀더를 표시합니다.

## 사용법

\`\`\`tsx
import { Skeleton } from '@split/ui';

<Skeleton className="h-4 w-[250px]" />
\`\`\`

## 특징

- **애니메이션**: pulse 효과로 로딩 상태 표현
- **유연한 크기**: className으로 크기 조절
- **다양한 형태**: 텍스트, 원형, 카드 등
        `,
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    className: 'h-4 w-[250px]',
  },
  parameters: {
    docs: {
      description: {
        story: '기본 스켈레톤입니다. 텍스트 로딩에 적합합니다.',
      },
    },
  },
};

export const Circle: Story = {
  args: {
    className: 'h-12 w-12 rounded-full',
  },
  parameters: {
    docs: {
      description: {
        story: '원형 스켈레톤입니다. 아바타 로딩에 적합합니다.',
      },
    },
  },
};

export const Card: Story = {
  render: () => (
    <div className="flex items-center space-x-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '카드 형태의 스켈레톤입니다. 프로필 카드 로딩에 적합합니다.',
      },
    },
  },
};

export const TextBlock: Story = {
  render: () => (
    <div className="w-[300px] space-y-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '텍스트 블록 스켈레톤입니다. 문단 로딩에 적합합니다.',
      },
    },
  },
};

export const ProfileCard: Story = {
  render: () => (
    <div className="w-[350px] rounded-lg border p-4">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-16 w-16 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-[150px]" />
          <Skeleton className="h-4 w-[100px]" />
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '프로필 카드 전체 스켈레톤입니다.',
      },
    },
  },
};
