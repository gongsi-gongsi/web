import { AlertCircleIcon, InfoIcon, TerminalIcon } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from './alert';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Alert> = {
  title: 'Components/Alert',
  component: Alert,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Alert 컴포넌트는 사용자에게 중요한 메시지를 전달하는 알림 UI입니다.

## 사용법

\`\`\`tsx
import { Alert, AlertTitle, AlertDescription } from '@split/ui';
import { InfoIcon } from 'lucide-react';

<Alert>
  <InfoIcon />
  <AlertTitle>알림</AlertTitle>
  <AlertDescription>알림 내용입니다.</AlertDescription>
</Alert>
\`\`\`

## 특징

- **2가지 variant**: default, destructive
- **아이콘 지원**: 자동 그리드 레이아웃
- **접근성**: role="alert" 기본 적용
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive'],
      description: '알림의 시각적 스타일',
      table: {
        type: { summary: "'default' | 'destructive'" },
        defaultValue: { summary: 'default' },
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: 'default',
  },
  render: (args) => (
    <Alert {...args} className="w-[400px]">
      <TerminalIcon />
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>You can add components to your app using the cli.</AlertDescription>
    </Alert>
  ),
  parameters: {
    docs: {
      description: {
        story: '기본 알림입니다. 일반적인 정보 전달에 사용합니다.',
      },
    },
  },
};

export const Destructive: Story = {
  args: {
    variant: 'destructive',
  },
  render: (args) => (
    <Alert {...args} className="w-[400px]">
      <AlertCircleIcon />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>Your session has expired. Please log in again.</AlertDescription>
    </Alert>
  ),
  parameters: {
    docs: {
      description: {
        story: '오류나 경고를 표시할 때 사용하는 destructive 알림입니다.',
      },
    },
  },
};

export const Info: Story = {
  args: {
    variant: 'default',
  },
  render: (args) => (
    <Alert {...args} className="w-[400px]">
      <InfoIcon />
      <AlertTitle>Information</AlertTitle>
      <AlertDescription>
        This feature is currently in beta. We&apos;d love to hear your feedback!
      </AlertDescription>
    </Alert>
  ),
  parameters: {
    docs: {
      description: {
        story: '정보성 알림입니다.',
      },
    },
  },
};

export const WithoutIcon: Story = {
  args: {
    variant: 'default',
  },
  render: (args) => (
    <Alert {...args} className="w-[400px]">
      <AlertTitle>Note</AlertTitle>
      <AlertDescription>This is a simple alert without an icon.</AlertDescription>
    </Alert>
  ),
  parameters: {
    docs: {
      description: {
        story: '아이콘 없이 사용하는 알림입니다.',
      },
    },
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Alert className="w-[400px]">
        <InfoIcon />
        <AlertTitle>Default Alert</AlertTitle>
        <AlertDescription>This is a default alert message.</AlertDescription>
      </Alert>
      <Alert variant="destructive" className="w-[400px]">
        <AlertCircleIcon />
        <AlertTitle>Destructive Alert</AlertTitle>
        <AlertDescription>This is a destructive alert message.</AlertDescription>
      </Alert>
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
