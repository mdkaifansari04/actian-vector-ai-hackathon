import { PageHeader } from '@/components/page-header'
import {
  ChatLayoutSkeleton,
  TwoPanelSkeleton,
} from '@/components/skeletons/layout-skeletons'

export default function DashboardLoading() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-6">
      <PageHeader
        title="Loading dashboard"
        description="Preparing data and layout"
      />
      <div className="space-y-6">
        <TwoPanelSkeleton />
        <ChatLayoutSkeleton />
      </div>
    </div>
  )
}
