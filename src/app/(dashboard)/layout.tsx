import { AppSidebar } from '@/components/app-sidebar'
import { GitHubIcon } from '@/components/icons/social/github-icon'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { UserMenu } from '@/components/user-menu'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="min-h-screen flex-1">
        <div className="border-b">
          <div className="flex h-14 items-center justify-between px-4">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="-ml-1" />
              <a href="https://github.com/aipr-agent" target="_blank" rel="noopener noreferrer">
                <GitHubIcon className="h-5 w-5" />
              </a>
            </div>
            <UserMenu />
          </div>
        </div>
        <div className="p-4">{children}</div>
      </main>
    </SidebarProvider>
  )
}
