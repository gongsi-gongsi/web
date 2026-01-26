import { Button } from '../button';
import { Input } from '../input';
import { Label } from '../label';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './card';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Card 컴포넌트는 관련 콘텐츠를 그룹화하는 컨테이너입니다.

## 사용법

\`\`\`tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@split/ui';

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Content</CardContent>
  <CardFooter>Footer</CardFooter>
</Card>
\`\`\`

## 특징

- **유연한 구조**: Header, Content, Footer 조합
- **그리드 레이아웃**: Action 버튼 자동 배치
- **다크모드**: 자동 테마 지원
- **Interactive**: 클릭 가능한 카드로 변환
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    interactive: {
      control: 'boolean',
      description: '터치/클릭 시 축소 및 밝아지는 효과 활성화',
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
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card Content</p>
      </CardContent>
      <CardFooter>
        <p>Card Footer</p>
      </CardFooter>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: '기본 카드입니다.',
      },
    },
  },
};

export const WithForm: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Create project</CardTitle>
        <CardDescription>Deploy your new project in one-click.</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Name of your project" />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button>Deploy</Button>
      </CardFooter>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: '폼이 포함된 카드입니다.',
      },
    },
  },
};

export const Simple: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm">You have 3 unread messages.</p>
      </CardContent>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: '간단한 카드입니다.',
      },
    },
  },
};

export const WithAction: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Team Members</CardTitle>
        <CardDescription>Invite your team members to collaborate.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="bg-muted size-10 rounded-full" />
            <div>
              <p className="text-sm font-medium">Sofia Davis</p>
              <p className="text-muted-foreground text-sm">m@example.com</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-muted size-10 rounded-full" />
            <div>
              <p className="text-sm font-medium">Jackson Lee</p>
              <p className="text-muted-foreground text-sm">p@example.com</p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Invite Member</Button>
      </CardFooter>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: '액션 버튼이 있는 카드입니다.',
      },
    },
  },
};

export const Interactive: Story = {
  args: {
    interactive: true,
  },
  render: (args) => (
    <Card {...args} className="w-[350px]">
      <CardHeader>
        <CardTitle>Interactive Card</CardTitle>
        <CardDescription>Click me to see the effect!</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm">This card has interactive hover and click effects.</p>
        <p className="text-muted-foreground mt-2 text-sm">
          Try clicking or tapping to see the scale animation and brightness change.
        </p>
      </CardContent>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Interactive 모드가 활성화된 카드입니다. 클릭 시 축소 애니메이션과 밝기 변화가 적용됩니다.',
      },
    },
  },
};

export const Playground: Story = {
  args: {
    interactive: false,
  },
  render: (args) => (
    <Card {...args} className="w-[350px]">
      <CardHeader>
        <CardTitle>Playground</CardTitle>
        <CardDescription>Try toggling the interactive control!</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm">Use the interactive control to test the effect.</p>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          Action Button
        </Button>
      </CardFooter>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Interactive 컨트롤을 테스트할 수 있는 플레이그라운드입니다.',
      },
    },
  },
};
