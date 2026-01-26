import { toast } from 'sonner';

import { Button } from '../button';

import { Toaster } from './sonner';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Toaster> = {
  title: 'Components/Sonner',
  component: Toaster,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Sonner(Toaster) 컴포넌트는 토스트 알림을 표시합니다.

## 사용법

\`\`\`tsx
import { Toaster } from '@split/ui';
import { toast } from 'sonner';

// App 레벨에서 Toaster 추가
<Toaster />

// 어디서든 toast 함수 호출
toast('Event has been created');
toast.success('Success!');
toast.error('Error occurred');
\`\`\`
        `,
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <>
        <Story />
        <Toaster />
      </>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Button variant="outline" onClick={() => toast('Event has been created')}>
      Show Toast
    </Button>
  ),
  parameters: {
    docs: {
      description: {
        story: '기본 토스트 알림입니다.',
      },
    },
  },
};

export const Success: Story = {
  render: () => (
    <Button variant="outline" onClick={() => toast.success('Event has been created successfully')}>
      Show Success
    </Button>
  ),
  parameters: {
    docs: {
      description: {
        story: '성공 토스트 알림입니다.',
      },
    },
  },
};

export const Error: Story = {
  render: () => (
    <Button variant="outline" onClick={() => toast.error('Something went wrong')}>
      Show Error
    </Button>
  ),
  parameters: {
    docs: {
      description: {
        story: '에러 토스트 알림입니다.',
      },
    },
  },
};

export const Warning: Story = {
  render: () => (
    <Button variant="outline" onClick={() => toast.warning('Please check your input')}>
      Show Warning
    </Button>
  ),
  parameters: {
    docs: {
      description: {
        story: '경고 토스트 알림입니다.',
      },
    },
  },
};

export const Info: Story = {
  render: () => (
    <Button variant="outline" onClick={() => toast.info('New update available')}>
      Show Info
    </Button>
  ),
  parameters: {
    docs: {
      description: {
        story: '정보 토스트 알림입니다.',
      },
    },
  },
};

export const WithDescription: Story = {
  render: () => (
    <Button
      variant="outline"
      onClick={() =>
        toast('Event has been created', {
          description: 'Sunday, December 03, 2023 at 9:00 AM',
        })
      }
    >
      With Description
    </Button>
  ),
  parameters: {
    docs: {
      description: {
        story: '설명이 포함된 토스트 알림입니다.',
      },
    },
  },
};

export const WithAction: Story = {
  render: () => (
    <Button
      variant="outline"
      onClick={() =>
        toast('Event has been created', {
          description: 'Sunday, December 03, 2023 at 9:00 AM',
          action: {
            label: 'Undo',
            onClick: () => console.log('Undo'),
          },
        })
      }
    >
      With Action
    </Button>
  ),
  parameters: {
    docs: {
      description: {
        story: '액션 버튼이 있는 토스트 알림입니다.',
      },
    },
  },
};

export const Loading: Story = {
  render: () => (
    <Button
      variant="outline"
      onClick={() => {
        const toastId = toast.loading('Loading...');
        setTimeout(() => {
          toast.success('Completed!', { id: toastId });
        }, 2000);
      }}
    >
      Show Loading
    </Button>
  ),
  parameters: {
    docs: {
      description: {
        story: '로딩 상태를 표시하고 완료 후 성공으로 변경하는 토스트입니다.',
      },
    },
  },
};

export const PromiseToast: Story = {
  render: () => (
    <Button
      variant="outline"
      onClick={() => {
        const promise = new window.Promise<void>((resolve) => setTimeout(resolve, 2000));
        toast.promise(promise, {
          loading: 'Loading...',
          success: 'Data loaded successfully',
          error: 'Error loading data',
        });
      }}
    >
      Show Promise
    </Button>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Promise 상태에 따라 자동으로 변경되는 토스트입니다.',
      },
    },
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" onClick={() => toast('Default toast')}>
        Default
      </Button>
      <Button variant="outline" onClick={() => toast.success('Success toast')}>
        Success
      </Button>
      <Button variant="outline" onClick={() => toast.error('Error toast')}>
        Error
      </Button>
      <Button variant="outline" onClick={() => toast.warning('Warning toast')}>
        Warning
      </Button>
      <Button variant="outline" onClick={() => toast.info('Info toast')}>
        Info
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '모든 토스트 타입을 한눈에 확인할 수 있습니다.',
      },
    },
  },
};
