import { LoginForm } from '@/features/admin-auth'

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-sm space-y-6 rounded-xl border border-border bg-card p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">공시공시 Admin</h1>
          <p className="mt-1 text-sm text-muted-foreground">관리자 로그인</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
