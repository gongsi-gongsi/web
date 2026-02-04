export type AuthProvider = 'kakao' | 'google'

export interface CurrentUser {
  id: string
  email: string
  name: string | null
  avatarUrl: string | null
  provider: AuthProvider
}
