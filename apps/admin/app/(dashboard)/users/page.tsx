import { UserListWidget } from '@/widgets/user-list'

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">유저 관리</h1>
      <UserListWidget />
    </div>
  )
}
