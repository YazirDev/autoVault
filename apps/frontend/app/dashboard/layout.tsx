import { TopBar } from '@/components/layout/TopBar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div
      className="flex flex-col h-screen overflow-hidden"
      style={{ backgroundColor: 'var(--surface)' }}
    >
      <TopBar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}