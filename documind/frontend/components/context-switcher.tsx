'use client'

import { useState } from 'react'
import { Check, ChevronRight, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { useAppContext } from '@/lib/context'
import { useInstances, useKnowledgeBases } from '@/hooks/queries'

interface ContextSwitcherProps {
  onClose: () => void
}

export function ContextSwitcher({ onClose }: ContextSwitcherProps) {
  const {
    activeInstanceId,
    activeNamespaceId,
    activeKbId,
    setActiveInstance,
    setActiveNamespace,
    setActiveKb,
    clearContext,
  } = useAppContext()

  const [step, setStep] = useState<'instance' | 'namespace' | 'kb'>('instance')
  const [selectedInstance, setSelectedInstance] = useState<{
    id: string
    name: string
  } | null>(
    activeInstanceId
      ? { id: activeInstanceId, name: '' }
      : null
  )

  const { data: instances, isLoading: loadingInstances } = useInstances()

  const { data: knowledgeBases, isLoading: loadingKbs } = useKnowledgeBases(
    selectedInstance?.id
  )

  // Get unique namespaces from knowledge bases
  const namespaces = knowledgeBases
    ? [...new Set(knowledgeBases.map((kb) => kb.namespace_id))]
    : []

  const handleInstanceSelect = (id: string, name: string) => {
    setSelectedInstance({ id, name })
    setActiveInstance(id, name)
    setStep('namespace')
  }

  const handleNamespaceSelect = (namespaceId: string) => {
    setActiveNamespace(namespaceId)
    setStep('kb')
  }

  const handleKbSelect = (kbId: string | null) => {
    setActiveKb(kbId)
    onClose()
  }

  const handleClear = () => {
    clearContext()
    setSelectedInstance(null)
    setStep('instance')
  }

  if (step === 'instance') {
    return (
      <div className="p-2">
        <div className="mb-2 px-2 py-1.5">
          <h4 className="text-sm font-medium">Select Instance</h4>
          <p className="text-xs text-muted-foreground">
            Choose an instance to work with
          </p>
        </div>
        <ScrollArea className="h-[200px]">
          {loadingInstances ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : instances && instances.length > 0 ? (
            <div className="space-y-1">
              {instances.map((instance) => (
                <button
                  key={instance.id}
                  onClick={() =>
                    handleInstanceSelect(instance.id, instance.name)
                  }
                  className={cn(
                    'flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-accent',
                    activeInstanceId === instance.id && 'bg-accent'
                  )}
                >
                  <div className="flex flex-col items-start">
                    <span className="font-medium">{instance.name}</span>
                    {instance.description && (
                      <span className="text-xs text-muted-foreground line-clamp-1">
                        {instance.description}
                      </span>
                    )}
                  </div>
                  {activeInstanceId === instance.id ? (
                    <Check className="h-4 w-4 text-primary" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="px-2 py-8 text-center text-sm text-muted-foreground">
              No instances found. Create one to get started.
            </div>
          )}
        </ScrollArea>
        {activeInstanceId && (
          <div className="mt-2 border-t pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="w-full justify-start text-muted-foreground"
            >
              Clear context
            </Button>
          </div>
        )}
      </div>
    )
  }

  if (step === 'namespace') {
    return (
      <div className="p-2">
        <div className="mb-2 px-2 py-1.5">
          <button
            onClick={() => setStep('instance')}
            className="mb-1 text-xs text-muted-foreground hover:text-foreground"
          >
            ← Back to instances
          </button>
          <h4 className="text-sm font-medium">Select Namespace</h4>
          <p className="text-xs text-muted-foreground">
            Choose a namespace within {selectedInstance?.name}
          </p>
        </div>
        <ScrollArea className="h-[200px]">
          {loadingKbs ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : namespaces.length > 0 ? (
            <div className="space-y-1">
              {namespaces.map((namespace) => (
                <button
                  key={namespace}
                  onClick={() => handleNamespaceSelect(namespace)}
                  className={cn(
                    'flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-accent',
                    activeNamespaceId === namespace && 'bg-accent'
                  )}
                >
                  <span>{namespace}</span>
                  {activeNamespaceId === namespace ? (
                    <Check className="h-4 w-4 text-primary" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="px-2 py-8 text-center text-sm text-muted-foreground">
              No namespaces found. Create a Knowledge Base to add one.
            </div>
          )}
        </ScrollArea>
      </div>
    )
  }

  // KB selection step
  const kbsInNamespace = knowledgeBases?.filter(
    (kb) => kb.namespace_id === activeNamespaceId
  )

  return (
    <div className="p-2">
      <div className="mb-2 px-2 py-1.5">
        <button
          onClick={() => setStep('namespace')}
          className="mb-1 text-xs text-muted-foreground hover:text-foreground"
        >
          ← Back to namespaces
        </button>
        <h4 className="text-sm font-medium">Select Knowledge Base (Optional)</h4>
        <p className="text-xs text-muted-foreground">
          Optionally filter by a specific KB
        </p>
      </div>
      <ScrollArea className="h-[200px]">
        <div className="space-y-1">
          <button
            onClick={() => handleKbSelect(null)}
            className={cn(
              'flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-accent',
              !activeKbId && 'bg-accent'
            )}
          >
            <span>All Knowledge Bases</span>
            {!activeKbId && <Check className="h-4 w-4 text-primary" />}
          </button>
          {kbsInNamespace?.map((kb) => (
            <button
              key={kb.id}
              onClick={() => handleKbSelect(kb.id)}
              className={cn(
                'flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-accent',
                activeKbId === kb.id && 'bg-accent'
              )}
            >
              <div className="flex flex-col items-start">
                <span>{kb.name}</span>
                <span className="text-xs text-muted-foreground">
                  {kb.collection_name}
                </span>
              </div>
              {activeKbId === kb.id && (
                <Check className="h-4 w-4 text-primary" />
              )}
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
