import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { useNavigate } from 'react-router'

export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 px-4"
      data-qa="not-found-page"
    >
      <Card className="w-full max-w-md" data-qa="not-found-card">
        <CardHeader className="p-6 sm:p-8">
          <h1
            className="text-center text-5xl sm:text-6xl font-semibold leading-none tracking-tight"
            data-qa="not-found-title"
          >
            404
          </h1>
        </CardHeader>
        <CardContent className="text-center p-6 sm:p-8 pt-0">
          <p
            className="mb-6 text-base sm:text-lg text-slate-600 dark:text-slate-400"
            data-qa="not-found-message"
          >
            Oops! The page you&apos;re looking for doesn&apos;t exist.
          </p>
          <Button
            onClick={() => {
              void navigate('/')
            }}
            className="w-full"
            data-qa="not-found-go-home-button"
          >
            Go Home
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
