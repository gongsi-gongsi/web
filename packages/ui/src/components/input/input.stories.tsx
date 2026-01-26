import { Input } from '../input';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Input 컴포넌트는 사용자로부터 텍스트 입력을 받는 기본 폼 요소입니다.

## 사용법

\`\`\`tsx
import { Input } from '@split/ui';

<Input type="email" placeholder="이메일을 입력하세요" />
\`\`\`

## 특징

- **다양한 타입 지원**: text, email, password, number 등
- **파일 입력 지원**: file 타입 스타일링 포함
- **접근성**: focus, disabled, invalid 상태 지원
- **다크모드**: 자동 테마 지원
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel', 'url'],
      description: '입력 필드 타입',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'text' },
      },
    },
    placeholder: {
      control: 'text',
      description: '플레이스홀더 텍스트',
      table: {
        type: { summary: 'string' },
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
    placeholder: 'Enter text...',
  },
  parameters: {
    docs: {
      description: {
        story: '기본 텍스트 입력 필드입니다.',
      },
    },
  },
};

export const Email: Story = {
  args: {
    type: 'email',
    placeholder: 'email@example.com',
  },
  parameters: {
    docs: {
      description: {
        story: '이메일 입력 필드입니다. 이메일 형식 검증이 적용됩니다.',
      },
    },
  },
};

export const Password: Story = {
  args: {
    type: 'password',
    placeholder: 'Enter password',
  },
  parameters: {
    docs: {
      description: {
        story: '비밀번호 입력 필드입니다. 입력값이 마스킹됩니다.',
      },
    },
  },
};

export const Disabled: Story = {
  args: {
    placeholder: 'Disabled input',
    disabled: true,
  },
  parameters: {
    docs: {
      description: {
        story: '비활성화된 입력 필드입니다.',
      },
    },
  },
};

export const WithValue: Story = {
  args: {
    defaultValue: 'Hello World',
  },
  parameters: {
    docs: {
      description: {
        story: '기본값이 설정된 입력 필드입니다.',
      },
    },
  },
};

export const File: Story = {
  args: {
    type: 'file',
  },
  parameters: {
    docs: {
      description: {
        story: '파일 선택 입력 필드입니다.',
      },
    },
  },
};
