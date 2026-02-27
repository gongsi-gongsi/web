import { redirect } from 'next/navigation'
import { getAdminUser } from '@/shared/lib/admin-auth'
import { createClient } from '@/shared/lib/supabase/server'
import { AdminSidebar } from '@/widgets/admin-sidebar'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const admin = await getAdminUser()

  if (!admin) {
    // Supabase 세션은 있지만 admin이 아닌 경우 → 로그아웃 후 /login으로
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/login')
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto bg-background p-8">{children}</main>
    </div>
  )
}
