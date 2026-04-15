'use client'

import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { Check, ExternalLink, Database, Copy } from 'lucide-react'
import { toast } from 'sonner'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { useAppContext } from '@/lib/context'
import api from '@/lib/api'
import { formatDateTime } from '@/lib/format'
import type { Instance } from '@/lib/types'

interface InstanceDetailSheetProps {
  instance: Instance | null
  onClose: () => void
}

export function InstanceDetailSheet({
  instance,
  onClose,
}: InstanceDetailSheetProps) {
  const { activeInstanceId, setActiveInstance } = useAppContext()

  const { data: knowledgeBases, isLoading: loadingKbs } = useQuery({
    queryKey: ['knowledge-bases', instance?.id],
    queryFn: () => api.getKnowledgeBases(instance?.id),
    enabled: !!instance,
  })

  const namespaces = knowledgeBases
    ? [...new Set(knowledgeBases.map((kb) => kb.namespace_id))]
    : []

  const copyId = () => {
    if (instance) {
      navigator.clipboard.writeText(instance.id)
      toast.success('Instance ID copied to clipboard')
    }
  }

  return (
    <Sheet open={!!instance} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="overflow-y-auto sm:max-w-lg">
        {instance && (
          <>
            <SheetHeader>
              <div className="flex items-start justify-between">
                <div>
                  <SheetTitle className="text-lg">{instance.name}</SheetTitle>
                  <SheetDescription className="mt-1">
                    {instance.description || 'No description provided'}
                  </SheetDescription>
                </div>
                {activeInstanceId === instance.id ? (
                  <Badge variant="default" className="text-xs">
                    Active
                  </Badge>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => setActiveInstance(instance.id, instance.name)}
                  >
                    Set Active
                  </Button>
                )}
              </div>
            </SheetHeader>

            <div className="mt-6 space-y-6">
              {/* Instance Details */}
              <div>
                <h3 className="mb-3 text-sm font-medium">Details</h3>
                <dl className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <dt className="text-muted-foreground">ID</dt>
                    <dd className="flex items-center gap-1 font-mono text-xs">
                      {instance.id.slice(0, 8)}...
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={copyId}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Created</dt>
                    <dd>{formatDateTime(instance.created_at)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Updated</dt>
                    <dd>{formatDateTime(instance.updated_at)}</dd>
                  </div>
                </dl>
              </div>

              <Separator />

              {/* Namespaces */}
              <div>
                <h3 className="mb-3 text-sm font-medium">
                  Namespaces ({namespaces.length})
                </h3>
                {loadingKbs ? (
                  <div className="space-y-2">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-3/4" />
                  </div>
                ) : namespaces.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {namespaces.map((ns) => (
                      <Badge key={ns} variant="secondary" className="text-xs">
                        {ns}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No namespaces yet
                  </p>
                )}
              </div>

              <Separator />

              {/* Knowledge Bases */}
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-medium">
                    Knowledge Bases ({knowledgeBases?.length ?? 0})
                  </h3>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/knowledge-bases?instance=${instance.id}`}>
                      View all
                      <ExternalLink className="ml-1.5 h-3 w-3" />
                    </Link>
                  </Button>
                </div>
                {loadingKbs ? (
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-14 w-full" />
                    ))}
                  </div>
                ) : knowledgeBases && knowledgeBases.length > 0 ? (
                  <div className="space-y-2">
                    {knowledgeBases.slice(0, 5).map((kb) => (
                      <div
                        key={kb.id}
                        className="flex items-center justify-between rounded-md border p-3"
                      >
                        <div className="flex items-center gap-2">
                          <Database className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">{kb.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {kb.namespace_id}
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {kb.status}
                        </Badge>
                      </div>
                    ))}
                    {knowledgeBases.length > 5 && (
                      <p className="text-center text-xs text-muted-foreground">
                        + {knowledgeBases.length - 5} more
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No knowledge bases yet
                  </p>
                )}
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
