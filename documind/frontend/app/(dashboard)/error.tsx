'use client'

import { useEffect } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Dashboard route error:', error)
  }, [error])

  return (
    <div className="mx-auto flex min-h-[60vh] w-full max-w-3xl items-center justify-center px-6 py-10">
      <div className="w-full rounded-xl border border-white/6 bg-[#111] p-6">
        <div className="mb-3 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-300/80" />
          <h2 className="text-sm font-semibold text-white">
            Something went wrong in this route
          </h2>
        </div>
        <p className="text-xs text-muted-foreground/60">
          The page failed to render. Retry the route without changing your
          current app context.
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            onClick={() => reset()}
            className="h-8 gap-1.5 rounded-lg border border-white/6 bg-white/4 px-3 text-xs text-white hover:bg-white/8"
          >
            <RefreshCw className="h-3.5 w-3.5" strokeWidth={1.5} />
            Try again
          </Button>
        </div>
      </div>
    </div>
  )
}
