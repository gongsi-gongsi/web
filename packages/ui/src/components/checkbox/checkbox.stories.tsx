import { Label } from '../label';

import { Checkbox } from './checkbox';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Checkbox> = {
  title: 'Components/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Checkbox 컴포넌트는 사용자가 여러 옵션 중에서 선택할 수 있는 폼 요소입니다.

## 사용법

\`\`\`tsx
import { Checkbox, Label } from '@split/ui';

<div className="flex items-center space-x-2">
  <Checkbox id="terms" />
  <Label htmlFor="terms">Accept terms</Label>
</div>
\`\`\`

## 특징

- **원형 디자인**: Toss Mini 스타일의 동그란 체크박스
- **3가지 size**: sm, md, lg
- **Interactive 효과**: 클릭 시 축소 애니메이션
- **접근성**: 키보드 조작, 스크린리더 지원
- **Radix UI 기반**: 접근성 표준 준수
- **다크모드**: 자동 테마 지원
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: '체크박스 크기',
      table: {
        type: { summary: "'sm' | 'md' | 'lg'" },
        defaultValue: { summary: 'md' },
      },
    },
    interactive: {
      control: 'boolean',
      description: '터치/클릭 시 축소 효과 활성화',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    checked: {
      control: 'boolean',
      description: '체크 상태',
      table: {
        type: { summary: 'boolean' },
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
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    checked: false,
    disabled: false,
  },
  render: (args) => <Checkbox {...args} />,
  parameters: {
    docs: {
      description: {
        story: '기본 체크박스입니다.',
      },
    },
  },
};

export const Checked: Story = {
  args: {
    defaultChecked: true,
    disabled: false,
  },
  render: (args) => <Checkbox {...args} />,
  parameters: {
    docs: {
      description: {
        story: '체크된 상태의 체크박스입니다.',
      },
    },
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
  render: (args) => (
    <div className="flex gap-4">
      <Checkbox {...args} />
      <Checkbox {...args} defaultChecked />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '비활성화된 체크박스입니다.',
      },
    },
  },
};

export const WithLabel: Story = {
  args: {
    disabled: false,
  },
  render: (args) => (
    <div className="flex items-center space-x-2">
      <Checkbox {...args} id="terms" />
      <Label htmlFor="terms">Accept terms and conditions</Label>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '라벨과 함께 사용하는 체크박스입니다.',
      },
    },
  },
};

export const FormExample: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Checkbox id="marketing" />
        <Label htmlFor="marketing">Receive marketing emails</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="newsletter" defaultChecked />
        <Label htmlFor="newsletter">Subscribe to newsletter</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="notifications" />
        <Label htmlFor="notifications">Enable notifications</Label>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '폼에서 여러 체크박스를 사용하는 예시입니다.',
      },
    },
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <div className="flex flex-col items-center gap-2">
        <Checkbox size="sm" defaultChecked />
        <Label className="text-muted-foreground text-xs">Small</Label>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Checkbox size="md" defaultChecked />
        <Label className="text-muted-foreground text-xs">Medium</Label>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Checkbox size="lg" defaultChecked />
        <Label className="text-muted-foreground text-xs">Large</Label>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '다양한 크기의 체크박스입니다. sm(16px), md(20px), lg(24px)',
      },
    },
  },
};

export const Interactive: Story = {
  args: {
    interactive: true,
  },
  render: (args) => (
    <div className="flex items-center space-x-2">
      <Checkbox {...args} id="interactive" />
      <Label htmlFor="interactive">클릭하면 축소 효과를 볼 수 있습니다</Label>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Interactive 모드가 활성화된 체크박스입니다. 클릭 시 scale(0.85)로 축소되는 애니메이션이 적용됩니다.',
      },
    },
  },
};

export const NonInteractive: Story = {
  args: {
    interactive: false,
  },
  render: (args) => (
    <div className="flex items-center space-x-2">
      <Checkbox {...args} id="non-interactive" />
      <Label htmlFor="non-interactive">Interactive 효과가 없습니다</Label>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Interactive 효과가 비활성화된 체크박스입니다.',
      },
    },
  },
};

export const SizesWithLabels: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Checkbox id="small" size="sm" />
        <Label htmlFor="small">Small checkbox with label</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="medium" size="md" defaultChecked />
        <Label htmlFor="medium">Medium checkbox with label</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="large" size="lg" />
        <Label htmlFor="large">Large checkbox with label</Label>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '라벨과 함께 사용하는 다양한 크기의 체크박스입니다.',
      },
    },
  },
};

export const Playground: Story = {
  args: {
    size: 'md',
    interactive: true,
    disabled: false,
  },
  render: (args) => (
    <div className="flex items-center space-x-2">
      <Checkbox {...args} id="playground" />
      <Label htmlFor="playground">Playground Checkbox</Label>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Size와 Interactive 컨트롤을 테스트할 수 있는 플레이그라운드입니다.',
      },
    },
  },
};
