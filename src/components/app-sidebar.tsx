'use client'

import { GitBranchIcon } from '@/components/icons/git-branch-icon'
import { GitDiffIcon } from '@/components/icons/git-diff-icon'
import { GitPullIcon } from '@/components/icons/git-pull-icon'
import { HomeIcon } from '@/components/icons/home-icon'
import { GitHubIcon } from '@/components/icons/social/github-icon'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { usePathname } from 'next/navigation'

const items = [
  {
    title: 'Home',
    url: '/dashboard',
    icon: HomeIcon,
  },
  {
    title: 'Repositories',
    url: '/dashboard/repositories',
    icon: GitBranchIcon,
  },
  {
    title: 'Pull Requests',
    url: '#',
    icon: GitPullIcon,
  },
  {
    title: 'Reviews',
    url: '#',
    icon: GitDiffIcon,
  },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border p-1">
        <div className="flex h-12 items-center rounded-md px-2 transition-colors hover:bg-sidebar-accent">
          <GitHubIcon className="size-4" />
          <span className="ml-2 text-sm font-bold group-data-[collapsible=icon]:hidden">AIPR</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <a href={item.url}>
                      <item.icon />
                      <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
