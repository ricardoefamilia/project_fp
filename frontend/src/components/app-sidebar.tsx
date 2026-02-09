import * as React from 'react'
import { Home, KeyRound, LifeBuoy, List, Send } from 'lucide-react'

import { NavMain } from '@/components/nav-main'
import { NavUser } from '@/components/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import LogoFPBrasil from '@/assets/images/logo-fp-br.svg'
import { NavProfile } from './nav-profile'
import { useAuthContext } from '@/contexts/AuthContext'

const data = {
  navMain: [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: Home,
    },
    {
      title: 'Acessos',
      url: '#',
      icon: KeyRound,
      items: [
        {
          title: 'Moderar Acesso',
          url: '/access/manager',
        },
        {
          title: 'Solicitar Perfil',
          url: '/access/request',
        },
      ],
    },
    {
      title: 'Cadastro',
      url: '#',
      icon: List,
      items: [
        {
          title: 'Estabelecimento',
          url: '/cadastro/estabelecimentos',
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: 'Support',
      url: '#',
      icon: LifeBuoy,
    },
    {
      title: 'Feedback',
      url: '#',
      icon: Send,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuthContext()

  // Build user object for NavUser with session data
  const userData = {
    name: user?.name ?? 'Usuário',
    email: user?.email ?? '',
    avatar: user?.image ?? '',
  }

  return (
    <Sidebar
      className="top-[var(--header-height)] !h-[calc(100svh-var(--header-height)-var(--footer-height))]"
      data-qa="app-sidebar"
      {...props}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="flex justify-center items-center">
            <img
              src={LogoFPBrasil}
              alt="Farmácia Popular Brasil"
              className="w-43 h-20"
              data-qa="sidebar-logo"
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent data-qa="sidebar-content">
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter data-qa="sidebar-footer">
        <NavProfile />
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  )
}
