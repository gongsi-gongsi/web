import { Separator } from '../separator';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Separator> = {
  title: 'Components/Separator',
  component: Separator,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Separator 컴포넌트는 콘텐츠를 시각적으로 구분하는 구분선입니다.

## 사용법

\`\`\`tsx
import { Separator } from '@split/ui';

<Separator />
<Separator orientation="vertical" />
\`\`\`

## 특징

- **방향 지원**: horizontal, vertical
- **접근성**: decorative 속성으로 스크린리더 처리
- **Radix UI 기반**: 접근성 표준 준수
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'radio',
      options: ['horizontal', 'vertical'],
      description: '구분선 방향',
      table: {
        type: { summary: "'horizontal' | 'vertical'" },
        defaultValue: { summary: 'horizontal' },
      },
    },
    decorative: {
      control: 'boolean',
      description: '장식용 여부 (스크린리더 무시)',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  render: () => (
    <div className="w-64">
      <div className="space-y-1">
        <h4 className="text-sm leading-none font-medium">Radix Primitives</h4>
        <p className="text-muted-foreground text-sm">An open-source UI component library.</p>
      </div>
      <Separator className="my-4" />
      <div className="flex h-5 items-center space-x-4 text-sm">
        <div>Blog</div>
        <Separator orientation="vertical" />
        <div>Docs</div>
        <Separator orientation="vertical" />
        <div>Source</div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '수평 구분선입니다. 콘텐츠 섹션을 나눌 때 사용합니다.',
      },
    },
  },
};

export const Vertical: Story = {
  render: () => (
    <div className="flex h-5 items-center space-x-4 text-sm">
      <div>Blog</div>
      <Separator orientation="vertical" />
      <div>Docs</div>
      <Separator orientation="vertical" />
      <div>Source</div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '수직 구분선입니다. 인라인 요소들을 구분할 때 사용합니다.',
      },
    },
  },
};
