import { Button } from '@ds/ui';
import { Card, CardHeader, CardTitle, CardContent } from '@ds/ui';

export default function Home() {
  return (
    <main className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-foreground mb-8">
          DailyStock
        </h1>
        <Card>
          <CardHeader>
            <CardTitle>환영합니다</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              AI 기반 주식 뉴스 분석 서비스입니다.
            </p>
            <Button variant="secondary">
              시작하기
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
