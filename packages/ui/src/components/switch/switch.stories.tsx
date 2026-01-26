import { Label } from '../label';

import { Switch } from './switch';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Switch> = {
  title: 'Components/Switch',
  component: Switch,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Switch 컴포넌트는 on/off 두 가지 상태를 전환하는 토글 스위치입니다.

## 사용법

\`\`\`tsx
import { Switch, Label } from '@split/ui';

<div className="flex items-center space-x-2">
  <Switch id="airplane-mode" />
  <Label htmlFor="airplane-mode">Airplane Mode</Label>
</div>
\`\`\`

## 특징

- **접근성**: 키보드 조작, 스크린리더 지원
- **Radix UI 기반**: 접근성 표준 준수
- **다크모드**: 자동 테마 지원
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    checked: {
      control: 'boolean',
      description: '스위치 상태',
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
  render: (args) => <Switch {...args} />,
  parameters: {
    docs: {
      description: {
        story: '기본 스위치입니다.',
      },
    },
  },
};

export const Checked: Story = {
  args: {
    defaultChecked: true,
    disabled: false,
  },
  render: (args) => <Switch {...args} />,
  parameters: {
    docs: {
      description: {
        story: '켜진 상태의 스위치입니다.',
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
      <Switch {...args} />
      <Switch {...args} defaultChecked />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '비활성화된 스위치입니다.',
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
      <Switch {...args} id="airplane-mode" />
      <Label htmlFor="airplane-mode">Airplane Mode</Label>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '라벨과 함께 사용하는 스위치입니다.',
      },
    },
  },
};

export const SettingsExample: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="notifications">Enable notifications</Label>
        <Switch id="notifications" defaultChecked />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="marketing">Marketing emails</Label>
        <Switch id="marketing" />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="security">Two-factor auth</Label>
        <Switch id="security" defaultChecked />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '설정 화면에서 스위치를 사용하는 예시입니다.',
      },
    },
  },
};
