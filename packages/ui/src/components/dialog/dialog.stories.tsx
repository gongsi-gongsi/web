import { Button } from '../button';
import { Input } from '../input';
import { Label } from '../label';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../dialog';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Dialog> = {
  title: 'Components/Dialog',
  component: Dialog,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Dialog 컴포넌트는 사용자의 주의를 끌어 중요한 정보나 작업을 표시하는 모달입니다.

## 사용법

\`\`\`tsx
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@split/ui';

<Dialog>
  <DialogTrigger>Open</DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
      <DialogDescription>Description</DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>
\`\`\`

## 특징

- **접근성**: 포커스 트랩, Escape 키 닫기
- **부드러운 애니메이션**: Fade + Zoom + Slide 효과 (300ms)
- **배경 오버레이**: 부드러운 fade-in/out
- **Radix UI 기반**: 접근성 표준 준수
        `,
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Open Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your account and remove your
            data from our servers.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button>Continue</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  parameters: {
    docs: {
      description: {
        story: '기본 다이얼로그입니다.',
      },
    },
  },
};

export const WithForm: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Edit Profile</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" defaultValue="Pedro Duarte" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input id="username" defaultValue="@peduarte" className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  parameters: {
    docs: {
      description: {
        story: '폼이 포함된 다이얼로그입니다.',
      },
    },
  },
};

export const WithoutCloseButton: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Open</Button>
      </DialogTrigger>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>No close button</DialogTitle>
          <DialogDescription>Press Escape or click outside to close.</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  ),
  parameters: {
    docs: {
      description: {
        story: '닫기 버튼이 없는 다이얼로그입니다. Escape 키나 외부 클릭으로 닫습니다.',
      },
    },
  },
};

export const AnimationDemo: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open to see animation</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Animation Demo</DialogTitle>
          <DialogDescription>
            다이얼로그가 열릴 때와 닫힐 때 부드러운 애니메이션을 확인하세요.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm">이 다이얼로그는 다음 애니메이션을 사용합니다:</p>
          <ul className="text-muted-foreground mt-2 list-inside list-disc space-y-1 text-sm">
            <li>Fade: 투명도 변화</li>
            <li>Zoom: 95% → 100% 크기 변화</li>
            <li>Slide: 위에서 2% 아래로 이동</li>
            <li>Duration: 300ms</li>
          </ul>
        </div>
        <DialogFooter>
          <Button>Close to see exit animation</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '다이얼로그의 열기/닫기 애니메이션을 확인할 수 있는 데모입니다. Fade + Zoom + Slide 효과가 300ms 동안 부드럽게 적용됩니다.',
      },
    },
  },
};
