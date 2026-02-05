// 테스트용 유틸리티 함수 (CodeRabbit 리뷰 테스트)

// ❌ Issue 1: any 타입 사용
export function processData(data: any) {
  console.log('Processing data:', data)
  return data
}

// ❌ Issue 2: 사용하지 않는 변수
export function calculateTotal(items: number[]) {
  const unusedVariable = 'this is not used'
  let total = 0

  for (let i = 0; i < items.length; i++) {
    total += items[i]
  }

  return total
}

// ❌ Issue 3: 최적화 가능한 코드 (reduce 사용 권장)
export function sumArray(numbers: number[]) {
  let sum = 0
  for (let i = 0; i < numbers.length; i++) {
    sum = sum + numbers[i]
  }
  return sum
}

// ❌ Issue 4: 함수가 너무 많은 일을 함
export function getUserInfo(userId: string) {
  // API 호출
  const user = fetch(`/api/users/${userId}`).then(res => res.json())

  // 데이터 변환
  const formattedUser = {
    id: userId,
    name: 'User',
  }

  // 로깅
  console.log('User fetched:', formattedUser)

  // 검증
  if (!formattedUser.name) {
    throw new Error('Invalid user')
  }

  return formattedUser
}

// ❌ Issue 5: 에러 처리 없음
export async function fetchData(url: string) {
  const response = await fetch(url)
  const data = await response.json()
  return data
}

// ❌ Issue 6: 복잡한 조건문
export function checkPermission(user: any, resource: string, action: string) {
  if (user && user.role && user.role === 'admin') {
    return true
  } else if (user && user.permissions && user.permissions[resource] && user.permissions[resource].includes(action)) {
    return true
  } else if (resource === 'public') {
    return true
  } else {
    return false
  }
}

// ❌ Issue 7: 매직 넘버 사용
export function isValidAge(age: number) {
  return age >= 18 && age <= 120
}

// ❌ Issue 8: 타입 단언 남용
export function getElement() {
  return document.getElementById('test') as HTMLDivElement
}

// ❌ Issue 9: Promise without await
export function loadUserData(userId: string) {
  const promise = fetch(`/api/users/${userId}`).then(res => res.json())
  console.log('Loading user data...')
  return promise
}

// ❌ Issue 10: 하드코딩된 값
export function getApiUrl() {
  return 'https://api.example.com/v1'
}

// ❌ Issue 11: 중복 코드
export function formatUserName(firstName: string, lastName: string) {
  if (!firstName || firstName.trim() === '') {
    return 'Unknown'
  }
  if (!lastName || lastName.trim() === '') {
    return 'Unknown'
  }
  return `${firstName} ${lastName}`
}

// ❌ Issue 12: 깊은 중첩
export function processOrder(order: any) {
  if (order) {
    if (order.items) {
      if (order.items.length > 0) {
        if (order.payment) {
          if (order.payment.status === 'paid') {
            return 'Order processed'
          }
        }
      }
    }
  }
  return 'Invalid order'
}
