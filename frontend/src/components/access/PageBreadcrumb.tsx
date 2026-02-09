import { Link } from 'react-router'
import { ChevronLeft } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

interface PageBreadcrumbProps {
  backLink: string
  parentLabel: string
  currentLabel: string
}

export function PageBreadcrumb({
  backLink,
  parentLabel,
  currentLabel,
}: PageBreadcrumbProps) {
  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="icon-sm" asChild>
        <Link to={backLink}>
          <ChevronLeft className="h-4 w-4" />
        </Link>
      </Button>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to={backLink}>{parentLabel}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{currentLabel}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  )
}
