import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

interface AccessLoadingStateProps {
  pageTitle?: boolean
  userInfo?: boolean
  table?: boolean
  tableRows?: number
}

export function AccessLoadingState({
  pageTitle = true,
  userInfo = true,
  table = true,
  tableRows = 5,
}: AccessLoadingStateProps) {
  return (
    <div className="flex h-full w-full flex-col p-6">
      {pageTitle && <Skeleton className="h-8 w-64 mb-6" />}

      {userInfo && (
        <Card className="mb-6">
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-6 w-32" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-6 w-48" />
            </div>
          </CardContent>
        </Card>
      )}

      {table && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              {Array.from({ length: tableRows }).map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-12 w-24" />
                  <Skeleton className="h-12 w-16" />
                  <Skeleton className="h-12 flex-1" />
                  <Skeleton className="h-12 w-32" />
                  <Skeleton className="h-12 w-20" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
