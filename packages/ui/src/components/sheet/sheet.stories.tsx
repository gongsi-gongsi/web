import { useState } from 'react';

import { fn } from '@storybook/test';

import { Button } from '../button';
import { Input } from '../input';
import { Label } from '../label';

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../sheet';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Sheet> = {
  title: 'Components/Sheet',
  component: Sheet,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Sheet 컴포넌트는 화면 가장자리에서 슬라이드되어 나타나는 패널입니다.

## 사용법

\`\`\`tsx
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@split/ui';

<Sheet>
  <SheetTrigger>Open</SheetTrigger>
  <SheetContent>
    <SheetHeader>
      <SheetTitle>Sheet Title</SheetTitle>
      <SheetDescription>Sheet description</SheetDescription>
    </SheetHeader>
  </SheetContent>
</Sheet>
\`\`\`

## 특징

- **4가지 방향**: top, right, bottom, left
- **애니메이션**: 부드러운 슬라이드 인/아웃 애니메이션
- **오버레이**: 반투명 배경 오버레이
- **접근성**: 키보드 네비게이션 및 포커스 관리
- **다크모드**: 자동 테마 지원
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    open: {
      control: 'boolean',
      description: 'Sheet의 열림/닫힘 상태',
      table: {
        type: { summary: 'boolean' },
      },
    },
    onOpenChange: {
      description: '열림/닫힘 상태 변경 콜백',
      table: {
        type: { summary: '(open: boolean) => void' },
      },
    },
  },
  args: {
    onOpenChange: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open Sheet</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit Profile</SheetTitle>
          <SheetDescription>프로필을 수정하세요. 완료되면 저장 버튼을 클릭하세요.</SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              이름
            </Label>
            <Input id="name" defaultValue="홍길동" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              사용자명
            </Label>
            <Input id="username" defaultValue="@hong" className="col-span-3" />
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit">저장</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
  parameters: {
    docs: {
      description: {
        story: '기본 Sheet 예시입니다. 오른쪽에서 슬라이드되어 나타납니다.',
      },
    },
  },
};

export const Left: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">왼쪽 Sheet</Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>네비게이션</SheetTitle>
          <SheetDescription>메뉴를 선택하세요.</SheetDescription>
        </SheetHeader>
        <div className="grid gap-2 py-4">
          <Button variant="ghost" className="justify-start">
            홈
          </Button>
          <Button variant="ghost" className="justify-start">
            프로필
          </Button>
          <Button variant="ghost" className="justify-start">
            설정
          </Button>
          <Button variant="ghost" className="justify-start">
            로그아웃
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  ),
  parameters: {
    docs: {
      description: {
        story: '왼쪽에서 슬라이드되어 나타나는 Sheet입니다. 모바일 네비게이션에 적합합니다.',
      },
    },
  },
};

export const Top: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">상단 Sheet</Button>
      </SheetTrigger>
      <SheetContent side="top">
        <SheetHeader>
          <SheetTitle>알림</SheetTitle>
          <SheetDescription>새로운 알림이 있습니다.</SheetDescription>
        </SheetHeader>
        <div className="py-4">
          <p className="text-muted-foreground text-sm">
            새로운 메시지가 도착했습니다. 확인해보세요.
          </p>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">닫기</Button>
          </SheetClose>
          <Button>확인</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
  parameters: {
    docs: {
      description: {
        story: '상단에서 슬라이드되어 나타나는 Sheet입니다. 알림이나 배너에 적합합니다.',
      },
    },
  },
};

export const Bottom: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">하단 Sheet</Button>
      </SheetTrigger>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>공유하기</SheetTitle>
          <SheetDescription>이 콘텐츠를 공유하세요.</SheetDescription>
        </SheetHeader>
        <div className="grid grid-cols-4 gap-4 py-4">
          <Button variant="outline" className="flex h-auto flex-col gap-2 py-4">
            <span className="text-2xl">📧</span>
            <span className="text-xs">이메일</span>
          </Button>
          <Button variant="outline" className="flex h-auto flex-col gap-2 py-4">
            <span className="text-2xl">💬</span>
            <span className="text-xs">메시지</span>
          </Button>
          <Button variant="outline" className="flex h-auto flex-col gap-2 py-4">
            <span className="text-2xl">🔗</span>
            <span className="text-xs">링크 복사</span>
          </Button>
          <Button variant="outline" className="flex h-auto flex-col gap-2 py-4">
            <span className="text-2xl">⋯</span>
            <span className="text-xs">더보기</span>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '하단에서 슬라이드되어 나타나는 Sheet입니다. 모바일 액션 시트나 공유 메뉴에 적합합니다.',
      },
    },
  },
};

export const WithForm: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button>새 항목 추가</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>새 항목 추가</SheetTitle>
          <SheetDescription>새로운 항목의 정보를 입력하세요.</SheetDescription>
        </SheetHeader>
        <form className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">제목</Label>
            <Input id="title" placeholder="항목 제목을 입력하세요" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">설명</Label>
            <Input id="description" placeholder="항목 설명을 입력하세요" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="category">카테고리</Label>
            <Input id="category" placeholder="카테고리를 입력하세요" />
          </div>
        </form>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">취소</Button>
          </SheetClose>
          <Button type="submit">저장</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
  parameters: {
    docs: {
      description: {
        story: '폼이 포함된 Sheet입니다. 새로운 항목을 추가할 때 사용합니다.',
      },
    },
  },
};

export const Controlled: Story = {
  render: function ControlledStory() {
    const [open, setOpen] = useState(false);

    return (
      <div className="flex flex-col items-center gap-4">
        <p className="text-muted-foreground text-sm">현재 상태: {open ? '열림' : '닫힘'}</p>
        <div className="flex gap-2">
          <Button onClick={() => setOpen(true)}>Sheet 열기</Button>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Sheet 닫기
          </Button>
        </div>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>제어된 Sheet</SheetTitle>
              <SheetDescription>이 Sheet는 외부 상태로 제어됩니다.</SheetDescription>
            </SheetHeader>
            <div className="py-4">
              <p className="text-muted-foreground text-sm">
                버튼이나 오버레이 클릭, ESC 키로 닫을 수 있습니다.
              </p>
            </div>
            <SheetFooter>
              <Button onClick={() => setOpen(false)}>닫기</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: '외부 상태로 제어되는 (controlled) Sheet 예시입니다.',
      },
    },
  },
};

export const WithCustomWidth: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">넓은 Sheet</Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px] sm:max-w-none">
        <SheetHeader>
          <SheetTitle>상세 정보</SheetTitle>
          <SheetDescription>더 넓은 콘텐츠를 표시할 때 사용합니다.</SheetDescription>
        </SheetHeader>
        <div className="py-4">
          <div className="rounded-md border p-4">
            <p className="text-muted-foreground text-sm">
              이 Sheet는 커스텀 너비가 적용되어 있습니다. className을 통해 너비를 조절할 수
              있습니다.
            </p>
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">닫기</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '커스텀 너비가 적용된 Sheet입니다. className으로 스타일을 커스터마이징할 수 있습니다.',
      },
    },
  },
};

export const WithScrollableContent: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">스크롤 가능한 Sheet</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>이용약관</SheetTitle>
          <SheetDescription>서비스 이용약관을 확인하세요.</SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-auto py-4">
          <div className="text-muted-foreground space-y-4 text-sm">
            {Array.from({ length: 10 }, (_, i) => (
              <p key={i}>
                제{i + 1}조 (목적) 이 약관은 회사가 제공하는 서비스의 이용과 관련하여 회사와 이용자
                간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다. 본 약관에서 정하지 않은
                사항은 관련 법령 및 회사가 정한 서비스의 세부 이용지침 등의 규정에 따릅니다.
              </p>
            ))}
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">거부</Button>
          </SheetClose>
          <SheetClose asChild>
            <Button>동의</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
  parameters: {
    docs: {
      description: {
        story: '스크롤 가능한 콘텐츠가 있는 Sheet입니다. 긴 내용을 표시할 때 사용합니다.',
      },
    },
  },
};

export const WithoutCloseButton: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">닫기 버튼 없는 Sheet</Button>
      </SheetTrigger>
      <SheetContent className="[&>button]:hidden">
        <SheetHeader>
          <SheetTitle>중요 알림</SheetTitle>
          <SheetDescription>이 작업은 되돌릴 수 없습니다.</SheetDescription>
        </SheetHeader>
        <div className="py-4">
          <p className="text-muted-foreground text-sm">
            정말로 이 항목을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
          </p>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">취소</Button>
          </SheetClose>
          <SheetClose asChild>
            <Button variant="destructive">삭제</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '닫기 버튼을 숨긴 Sheet입니다. 확인 다이얼로그처럼 명시적인 선택이 필요할 때 사용합니다.',
      },
    },
  },
};
