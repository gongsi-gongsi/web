import { Input } from '../input';

import { Label } from './label';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Label> = {
  title: 'Components/Label',
  component: Label,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Label 컴포넌트는 폼 요소에 접근성 있는 라벨을 제공합니다.

## 사용법

\`\`\`tsx
import { Label, Input } from '@split/ui';

<Label htmlFor="email">이메일</Label>
<Input id="email" type="email" />
\`\`\`

## 특징

- **접근성**: htmlFor를 통한 폼 요소 연결
- **비활성화 상태**: peer-disabled 스타일 지원
- **Radix UI 기반**: 접근성 표준 준수
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    htmlFor: {
      control: 'text',
      description: '연결할 폼 요소의 id',
      table: {
        type: { summary: 'string' },
      },
    },
    children: {
      description: '라벨 텍스트',
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
    children: 'Label',
  },
  parameters: {
    docs: {
      description: {
        story: '기본 라벨입니다.',
      },
    },
  },
};

export const WithInput: Story = {
  render: () => (
    <div className="grid w-full max-w-sm gap-1.5">
      <Label htmlFor="email">Email</Label>
      <Input type="email" id="email" placeholder="email@example.com" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Input과 함께 사용하는 예시입니다. htmlFor로 연결됩니다.',
      },
    },
  },
};

export const Required: Story = {
  render: () => (
    <div className="grid w-full max-w-sm gap-1.5">
      <Label htmlFor="name">
        Name <span className="text-destructive">*</span>
      </Label>
      <Input type="text" id="name" placeholder="Your name" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '필수 입력 필드를 나타내는 라벨입니다.',
      },
    },
  },
};

export const Disabled: Story = {
  render: () => (
    <div className="grid w-full max-w-sm gap-1.5">
      <Label htmlFor="disabled" className="opacity-50">
        Disabled Label
      </Label>
      <Input type="text" id="disabled" placeholder="Disabled" disabled />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '비활성화된 입력 필드의 라벨입니다.',
      },
    },
  },
};
