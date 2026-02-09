import { ChevronRight, type LucideIcon } from 'lucide-react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar'
import { useNavigate } from 'react-router'

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  const navigate = useNavigate()
  const actualPathName = window.location.pathname

  return (
    <SidebarGroup data-qa="nav-main-group">
      <SidebarMenu>
        {items.map((item) => {
          const hasSubItems = item.items && item.items.length > 0

          return (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={item.isActive}
              className="group/collapsible"
            >
              <SidebarMenuItem
                data-qa={`nav-main-item-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {hasSubItems ? (
                  // Items with submenus: button triggers collapsible
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      className={`cursor-pointer ${actualPathName.includes(item.url) ? 'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground' : ''}`}
                      tooltip={item.title}
                      data-qa={`nav-main-button-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      <item.icon
                        className={`text-primary ${actualPathName.includes(item.url) ? 'text-primary-foreground' : ''}`}
                      />
                      <span>{item.title}</span>
                      <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90 text-primary" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                ) : (
                  // Items without submenus: button navigates
                  <SidebarMenuButton
                    className={`cursor-pointer ${actualPathName.includes(item.url) ? 'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground' : ''}`}
                    asChild
                    tooltip={item.title}
                    onClick={() => void navigate(item.url)}
                    data-qa={`nav-main-button-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <label>
                      <item.icon
                        className={`text-primary ${actualPathName.includes(item.url) ? 'text-primary-foreground' : ''}`}
                      />
                      <span>{item.title}</span>
                    </label>
                  </SidebarMenuButton>
                )}
                {hasSubItems ? (
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => (
                        <SidebarMenuSubItem
                          key={subItem.title}
                          data-qa={`nav-main-subitem-${subItem.title.toLowerCase().replace(/\s+/g, '-')}`}
                        >
                          <SidebarMenuSubButton
                            asChild
                            onClick={() => void navigate(subItem.url)}
                            data-qa={`nav-main-subbutton-${subItem.title.toLowerCase().replace(/\s+/g, '-')}`}
                          >
                            <label
                              className={`cursor-pointer ${actualPathName.includes(subItem.url) ? 'text-primary' : ''}`}
                            >
                              {subItem.title}
                            </label>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                ) : null}
              </SidebarMenuItem>
            </Collapsible>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
