'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Server,
  Database,
  FileText,
  Search,
  MessageCircleQuestion,
  MessagesSquare,
  HardDrive,
  Brain,
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'

const mainNavItems = [
  {
    title: 'Overview',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    title: 'Instances',
    href: '/instances',
    icon: Server,
  },
  {
    title: 'Knowledge Bases',
    href: '/knowledge-bases',
    icon: Database,
  },
  {
    title: 'Resources',
    href: '/resources',
    icon: FileText,
  },
]

const queryNavItems = [
  {
    title: 'Search',
    href: '/search',
    icon: Search,
  },
  {
    title: 'Ask',
    href: '/ask',
    icon: MessageCircleQuestion,
  },
  {
    title: 'Chat Workspace',
    href: '/chat',
    icon: MessagesSquare,
  },
]

const systemNavItems = [
  {
    title: 'Collections & System',
    href: '/system',
    icon: HardDrive,
  },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar className="border-r border-border">
      <SidebarHeader className="border-b border-border px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
            <Brain className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold tracking-tight">DocuMind</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs text-muted-foreground">
            Main
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={
                      pathname === item.href ||
                      (item.href !== '/' && pathname.startsWith(item.href))
                    }
                    size="sm"
                  >
                    <Link
                      href={item.href}
                      className={cn(
                        'flex items-center gap-2 transition-colors',
                        pathname === item.href && 'text-primary'
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs text-muted-foreground">
            Query
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {queryNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname.startsWith(item.href)}
                    size="sm"
                  >
                    <Link
                      href={item.href}
                      className={cn(
                        'flex items-center gap-2 transition-colors',
                        pathname.startsWith(item.href) && 'text-primary'
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs text-muted-foreground">
            System
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {systemNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname.startsWith(item.href)}
                    size="sm"
                  >
                    <Link
                      href={item.href}
                      className={cn(
                        'flex items-center gap-2 transition-colors',
                        pathname.startsWith(item.href) && 'text-primary'
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-border p-4">
        <p className="text-xs text-muted-foreground">
          DocuMind v1.0
        </p>
      </SidebarFooter>
    </Sidebar>
  )
}
