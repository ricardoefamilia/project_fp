import { SidebarIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useSidebar } from '@/components/ui/sidebar'
import LogoGov from '@/assets/images/logo-gov.svg'

export function SiteHeader() {
  const { toggleSidebar } = useSidebar()

  return (
    <header
      className="flex sticky top-0 z-50 w-full items-center border-b bg-card"
      data-qa="site-header"
    >
      <div className="flex h-[var(--header-height)] w-full items-center gap-2 px-2 sm:px-4">
        <Button
          className="h-8 w-8 flex-shrink-0"
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          data-qa="header-toggle-sidebar-button"
        >
          <SidebarIcon className="h-4 w-4" />
        </Button>
        <Separator
          orientation="vertical"
          className="mr-2 h-4 hidden sm:block"
        />
        <img
          src={LogoGov}
          alt="Logo do Governo Federal"
          className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 flex-shrink-0"
          data-qa="header-logo-gov"
        />
      </div>
    </header>
  )
}
