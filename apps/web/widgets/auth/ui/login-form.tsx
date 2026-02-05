'use client'

import { useSearchParams } from 'next/navigation'

import { LoaderCircle } from 'lucide-react'

import { useSignIn } from '@/features/auth'

function KakaoIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 3C6.477 3 2 6.463 2 10.691c0 2.72 1.8 5.108 4.516 6.467-.197.734-1.265 4.696-1.3 4.985 0 0-.026.217.115.3.14.083.306.039.306.039.404-.057 4.682-3.069 5.424-3.594.301.042.61.064.924.064 5.523 0 10-3.463 10-7.738C22 6.463 17.523 3 12 3" />
    </svg>
  )
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  )
}

export function LoginForm() {
  const { signIn, isLoading } = useSignIn()
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const redirectTo = searchParams.get('redirectTo') ?? undefined

  return (
    <div className="flex w-full max-w-sm flex-col items-center space-y-8">
      {/* 제목 */}
      <div className="flex flex-col items-center space-y-2 text-center">
        <h1 className="text-2xl font-bold">공시공시 로그인</h1>
        <p className="text-muted-foreground text-sm">소셜 계정으로 간편하게 로그인하세요</p>
      </div>

      {/* 에러 메시지 */}
      {error === 'auth_failed' && (
        <div className="bg-destructive/10 text-destructive w-full rounded-md px-4 py-3 text-center text-sm">
          로그인에 실패했습니다. 다시 시도해 주세요.
        </div>
      )}

      {/* 소셜 로그인 버튼 */}
      <div className="flex w-full flex-col space-y-3">
        <button
          type="button"
          disabled={isLoading}
          onClick={() => signIn('kakao', redirectTo)}
          className="inline-flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-[#FEE500] text-sm font-medium text-[#191919] transition-all duration-200 ease-out hover:bg-[#FEE500]/85 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
        >
          {isLoading ? (
            <LoaderCircle className="size-4 animate-spin" />
          ) : (
            <KakaoIcon className="size-4" />
          )}
          카카오로 시작하기
        </button>

        <button
          type="button"
          disabled={isLoading}
          onClick={() => signIn('google', redirectTo)}
          className="border-input inline-flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-md border bg-white text-sm font-medium text-[#191919] shadow-xs transition-all duration-200 ease-out hover:bg-gray-50 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
        >
          {isLoading ? (
            <LoaderCircle className="size-4 animate-spin" />
          ) : (
            <GoogleIcon className="size-4" />
          )}
          Google로 시작하기
        </button>
      </div>

      {/* 안내 텍스트 */}
      <p className="text-muted-foreground text-center text-xs leading-relaxed">
        로그인 시 <span className="underline">이용약관</span> 및{' '}
        <span className="underline">개인정보 처리방침</span>에 동의하는 것으로 간주합니다.
      </p>
    </div>
  )
}
