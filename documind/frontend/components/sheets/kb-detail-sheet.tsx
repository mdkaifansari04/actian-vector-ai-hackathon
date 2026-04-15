'use client'

import { Copy, Check } from 'lucide-react'
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
import { useAppContext } from '@/lib/context'
import { formatDateTime } from '@/lib/format'
import type { KnowledgeBase } from '@/lib/types'

interface KnowledgeBaseDetailSheetProps {
  knowledgeBase: KnowledgeBase | null
  onClose: () => void
}

export function KnowledgeBaseDetailSheet({
  knowledgeBase,
  onClose,
}: KnowledgeBaseDetailSheetProps) {
  const { activeKbId, setActiveKb, activeInstanceId, activeNamespaceId } =
    useAppContext()

  const copyId = () => {
    if (knowledgeBase) {
      navigator.clipboard.writeText(knowledgeBase.id)
      toast.success('Knowledge Base ID copied to clipboard')
    }
  }

  const isActive = activeKbId === knowledgeBase?.id
  const canSetActive =
    knowledgeBase &&
    activeInstanceId === knowledgeBase.instance_id &&
    activeNamespaceId === knowledgeBase.namespace_id

  return (
    <Sheet open={!!knowledgeBase} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="overflow-y-auto sm:max-w-lg">
        {knowledgeBase && (
          <>
            <SheetHeader>
              <div className="flex items-start justify-between">
                <div>
                  <SheetTitle className="text-lg">
                    {knowledgeBase.name}
                  </SheetTitle>
                  <SheetDescription className="mt-1">
                    {knowledgeBase.namespace_id}
                  </SheetDescription>
                </div>
                <Badge
                  variant={
                    knowledgeBase.status === 'active' ? 'default' : 'secondary'
                  }
                  className="text-xs"
                >
                  {knowledgeBase.status}
                </Badge>
              </div>
            </SheetHeader>

            <div className="mt-6 space-y-6">
              {/* Actions */}
              {canSetActive && (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={isActive ? 'outline' : 'default'}
                    onClick={() =>
                      setActiveKb(isActive ? null : knowledgeBase.id)
                    }
                    className="flex-1"
                  >
                    {isActive ? (
                      <>
                        <Check className="mr-1.5 h-3.5 w-3.5" />
                        Active KB
                      </>
                    ) : (
                      'Set as Active KB'
                    )}
                  </Button>
                </div>
              )}

              {/* Details */}
              <div>
                <h3 className="mb-3 text-sm font-medium">Details</h3>
                <dl className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <dt className="text-muted-foreground">ID</dt>
                    <dd className="flex items-center gap-1 font-mono text-xs">
                      {knowledgeBase.id.slice(0, 8)}...
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
                    <dt className="text-muted-foreground">Instance ID</dt>
                    <dd className="font-mono text-xs">
                      {knowledgeBase.instance_id.slice(0, 8)}...
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Namespace</dt>
                    <dd>
                      <Badge variant="outline" className="text-xs">
                        {knowledgeBase.namespace_id}
                      </Badge>
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Collection</dt>
                    <dd className="font-mono text-xs">
                      {knowledgeBase.collection_name}
                    </dd>
                  </div>
                </dl>
              </div>

              <Separator />

              {/* Embedding Configuration */}
              <div>
                <h3 className="mb-3 text-sm font-medium">
                  Embedding Configuration
                </h3>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Model</dt>
                    <dd className="font-mono text-xs">
                      {knowledgeBase.embedding_model}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Dimensions</dt>
                    <dd>{knowledgeBase.embedding_dim}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Distance Metric</dt>
                    <dd className="capitalize">
                      {knowledgeBase.distance_metric}
                    </dd>
                  </div>
                  {knowledgeBase.embedding_profile && (
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">
                        Embedding Profile
                      </dt>
                      <dd>{knowledgeBase.embedding_profile}</dd>
                    </div>
                  )}
                </dl>
              </div>

              <Separator />

              {/* LLM Configuration */}
              <div>
                <h3 className="mb-3 text-sm font-medium">LLM Configuration</h3>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Profile</dt>
                    <dd>{knowledgeBase.llm_profile || 'Not set'}</dd>
                  </div>
                </dl>
              </div>

              <Separator />

              {/* Timestamps */}
              <div>
                <h3 className="mb-3 text-sm font-medium">Timestamps</h3>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Created</dt>
                    <dd>{formatDateTime(knowledgeBase.created_at)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Updated</dt>
                    <dd>{formatDateTime(knowledgeBase.updated_at)}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
