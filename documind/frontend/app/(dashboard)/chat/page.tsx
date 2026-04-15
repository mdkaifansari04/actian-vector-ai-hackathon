'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import {
  Send,
  Loader2,
  Settings2,
  Trash2,
  ChevronRight,
  FileText,
  Clock,
  AlertCircle,
  Info,
  Check,
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Slider } from '@/components/ui/slider'
import { cn } from '@/lib/utils'
import api from '@/lib/api'
import type {
  ChatMessage,
  ChatScope,
  SearchResult,
  ApiError,
  Instance,
  KnowledgeBase,
} from '@/lib/types'

function generateId() {
  return Math.random().toString(36).substring(2, 15)
}

export default function ChatWorkspacePage() {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState('')
  const [expandedSources, setExpandedSources] = useState<Set<string>>(new Set())
  const [inspectorOpen, setInspectorOpen] = useState(false)
  const [selectedMessageSources, setSelectedMessageSources] = useState<
    SearchResult[]
  >([])

  // Scope state
  const [selectedInstanceId, setSelectedInstanceId] = useState<string | null>(
    null
  )
  const [selectedNamespaces, setSelectedNamespaces] = useState<string[]>([])
  const [selectedKbs, setSelectedKbs] = useState<string[]>([])
  const [allNamespaces, setAllNamespaces] = useState(false)
  const [useAdvanced, setUseAdvanced] = useState(false)
  const [topK, setTopK] = useState(5)

  // Fetch data
  const { data: instances } = useQuery({
    queryKey: ['instances'],
    queryFn: () => api.getInstances(),
  })

  const { data: knowledgeBases } = useQuery({
    queryKey: ['knowledge-bases', selectedInstanceId],
    queryFn: () => api.getKnowledgeBases(selectedInstanceId || undefined),
    enabled: !!selectedInstanceId,
  })

  // Get unique namespaces for selected instance
  const namespaces =
    knowledgeBases && selectedInstanceId
      ? [...new Set(knowledgeBases.map((kb) => kb.namespace_id))]
      : []

  // Filter KBs by selected namespaces
  const availableKbs = knowledgeBases?.filter(
    (kb) =>
      selectedNamespaces.length === 0 ||
      selectedNamespaces.includes(kb.namespace_id)
  )

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  const getCurrentScope = (): ChatScope => {
    const hasMultiSelect =
      selectedNamespaces.length > 1 || selectedKbs.length > 1

    return {
      mode: hasMultiSelect ? 'multi_scope' : 'single_scope',
      instanceId: selectedInstanceId,
      namespaceIds: allNamespaces ? namespaces : selectedNamespaces,
      kbIds: selectedKbs,
      useAdvanced,
    }
  }

  const hasValidScope = selectedInstanceId && selectedNamespaces.length > 0

  const isMultiScope =
    selectedNamespaces.length > 1 || selectedKbs.length > 1 || allNamespaces

  const queryMutation = useMutation({
    mutationFn: async (question: string) => {
      if (!selectedInstanceId || selectedNamespaces.length === 0) {
        throw new Error('Please select an instance and namespace')
      }

      // For multi-scope, we'll use the first namespace (primary scope)
      // and show a banner indicating preview mode
      const primaryNamespace = selectedNamespaces[0]

      if (useAdvanced) {
        return api.queryAdvanced({
          instance_id: selectedInstanceId,
          namespace_id: primaryNamespace,
          question,
          top_k: topK,
          mode: 'hybrid',
          hybrid: {
            method: 'rrf',
            dense_weight: 0.7,
            keyword_weight: 0.3,
          },
        })
      }

      return api.queryInstance({
        instance_id: selectedInstanceId,
        namespace_id: primaryNamespace,
        question,
        top_k: topK,
      })
    },
    onSuccess: (data, question) => {
      const scope = getCurrentScope()

      // Add assistant message
      const assistantMessage: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: data.answer,
        createdAt: new Date().toISOString(),
        scopeSnapshot: scope,
        responseMs: data.response_ms,
        llmProfile: data.llm_profile,
        sources: data.sources,
      }

      setMessages((prev) => [...prev, assistantMessage])
    },
    onError: (error: ApiError) => {
      toast.error('Failed to get response', {
        description: error.message,
      })

      // Remove the user message on error
      setMessages((prev) => prev.slice(0, -1))
    },
  })

  const handleSubmit = () => {
    const trimmedInput = inputValue.trim()
    if (!trimmedInput || queryMutation.isPending) return

    if (!hasValidScope) {
      toast.error('Scope required', {
        description: 'Please select an instance and at least one namespace',
      })
      return
    }

    const scope = getCurrentScope()

    // Add user message
    const userMessage: ChatMessage = {
      id: generateId(),
      role: 'user',
      content: trimmedInput,
      createdAt: new Date().toISOString(),
      scopeSnapshot: scope,
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue('')
    queryMutation.mutate(trimmedInput)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const clearChat = () => {
    setMessages([])
  }

  const toggleNamespace = (namespace: string) => {
    setSelectedNamespaces((prev) =>
      prev.includes(namespace)
        ? prev.filter((n) => n !== namespace)
        : [...prev, namespace]
    )
    setSelectedKbs([]) // Reset KB selection when namespace changes
  }

  const toggleKb = (kbId: string) => {
    setSelectedKbs((prev) =>
      prev.includes(kbId)
        ? prev.filter((id) => id !== kbId)
        : [...prev, kbId]
    )
  }

  const openSourceInspector = (sources: SearchResult[]) => {
    setSelectedMessageSources(sources)
    setInspectorOpen(true)
  }

  const toggleSourceExpand = (id: string) => {
    setExpandedSources((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  return (
    <TooltipProvider>
      <div className="flex h-[calc(100vh-3.5rem)] overflow-hidden">
        {/* Scope Rail */}
        <div className="w-64 shrink-0 border-r bg-muted/30">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-6">
              {/* Instance Selector */}
              <div>
                <h3 className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Instance
                </h3>
                <Select
                  value={selectedInstanceId || ''}
                  onValueChange={(value) => {
                    setSelectedInstanceId(value)
                    setSelectedNamespaces([])
                    setSelectedKbs([])
                    setAllNamespaces(false)
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select instance" />
                  </SelectTrigger>
                  <SelectContent>
                    {instances?.map((instance) => (
                      <SelectItem key={instance.id} value={instance.id}>
                        {instance.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedInstanceId && (
                <>
                  <Separator />

                  {/* Namespace Selector */}
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Namespaces
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          All
                        </span>
                        <Switch
                          checked={allNamespaces}
                          onCheckedChange={(checked) => {
                            setAllNamespaces(checked)
                            if (checked) {
                              setSelectedNamespaces(namespaces)
                            } else {
                              setSelectedNamespaces([])
                            }
                          }}
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      {namespaces.map((namespace) => (
                        <label
                          key={namespace}
                          className={cn(
                            'flex items-center gap-2 rounded-md px-2 py-1.5 text-sm cursor-pointer transition-colors',
                            selectedNamespaces.includes(namespace)
                              ? 'bg-primary/10 text-primary'
                              : 'hover:bg-muted'
                          )}
                        >
                          <Checkbox
                            checked={
                              allNamespaces ||
                              selectedNamespaces.includes(namespace)
                            }
                            onCheckedChange={() => toggleNamespace(namespace)}
                            disabled={allNamespaces}
                          />
                          <span className="truncate">{namespace}</span>
                        </label>
                      ))}
                      {namespaces.length === 0 && (
                        <p className="text-xs text-muted-foreground py-2">
                          No namespaces found
                        </p>
                      )}
                    </div>
                  </div>

                  <Separator />

                  {/* KB Selector */}
                  <div>
                    <h3 className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Knowledge Bases (Optional)
                    </h3>
                    <div className="space-y-1">
                      {availableKbs?.map((kb) => (
                        <label
                          key={kb.id}
                          className={cn(
                            'flex items-center gap-2 rounded-md px-2 py-1.5 text-sm cursor-pointer transition-colors',
                            selectedKbs.includes(kb.id)
                              ? 'bg-primary/10 text-primary'
                              : 'hover:bg-muted'
                          )}
                        >
                          <Checkbox
                            checked={selectedKbs.includes(kb.id)}
                            onCheckedChange={() => toggleKb(kb.id)}
                          />
                          <span className="truncate">{kb.name}</span>
                        </label>
                      ))}
                      {(!availableKbs || availableKbs.length === 0) && (
                        <p className="text-xs text-muted-foreground py-2">
                          {selectedNamespaces.length === 0
                            ? 'Select namespaces first'
                            : 'No knowledge bases found'}
                        </p>
                      )}
                    </div>
                  </div>

                  <Separator />

                  {/* Settings */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Advanced Retrieval</span>
                      <Switch
                        checked={useAdvanced}
                        onCheckedChange={setUseAdvanced}
                      />
                    </div>
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-sm">Top K</span>
                        <span className="text-xs text-muted-foreground">
                          {topK}
                        </span>
                      </div>
                      <Slider
                        value={[topK]}
                        onValueChange={([v]) => setTopK(v)}
                        min={1}
                        max={20}
                        step={1}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Chat Thread */}
        <div className="flex flex-1 flex-col">
          {/* Multi-scope banner */}
          {isMultiScope && hasValidScope && (
            <Alert className="mx-4 mt-4 border-primary/20 bg-primary/5">
              <Info className="h-4 w-4" />
              <AlertDescription className="text-xs">
                Multi-scope orchestration is in preview mode; currently
                executing primary scope only.
              </AlertDescription>
            </Alert>
          )}

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            {messages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <div className="mb-4 rounded-full bg-primary/10 p-4">
                  <Settings2 className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">
                  Chat Workspace
                </h3>
                <p className="max-w-md text-sm text-muted-foreground">
                  {hasValidScope
                    ? 'Start asking questions about your documents. Your responses will include citations from your knowledge base.'
                    : 'Select an instance and namespace from the scope rail to start chatting.'}
                </p>
              </div>
            ) : (
              <div className="space-y-4 pb-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      'flex gap-3',
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    )}
                  >
                    <div
                      className={cn(
                        'max-w-[80%] rounded-lg px-4 py-3',
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      )}
                    >
                      <p className="text-sm whitespace-pre-wrap">
                        {message.content}
                      </p>

                      {/* Message metadata */}
                      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs opacity-70">
                        <span>
                          {new Date(message.createdAt).toLocaleTimeString()}
                        </span>
                        {message.responseMs && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {message.responseMs}ms
                          </span>
                        )}
                        {message.llmProfile && (
                          <Badge
                            variant="outline"
                            className="h-5 text-[10px] border-current"
                          >
                            {message.llmProfile}
                          </Badge>
                        )}
                      </div>

                      {/* Source citations */}
                      {message.sources && message.sources.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {message.sources.slice(0, 3).map((source, i) => (
                            <Badge
                              key={i}
                              variant="secondary"
                              className="cursor-pointer text-xs hover:bg-secondary/80"
                              onClick={() =>
                                openSourceInspector(message.sources!)
                              }
                            >
                              <FileText className="mr-1 h-3 w-3" />
                              {source.source_ref}
                            </Badge>
                          ))}
                          {message.sources.length > 3 && (
                            <Badge
                              variant="outline"
                              className="cursor-pointer text-xs"
                              onClick={() =>
                                openSourceInspector(message.sources!)
                              }
                            >
                              +{message.sources.length - 3} more
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* Loading indicator */}
                {queryMutation.isPending && (
                  <div className="flex justify-start">
                    <div className="flex items-center gap-2 rounded-lg bg-muted px-4 py-3">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm text-muted-foreground">
                        Thinking...
                      </span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            )}
          </ScrollArea>

          {/* Composer */}
          <div className="border-t bg-background p-4">
            {!hasValidScope && (
              <Alert className="mb-3">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  Select an instance and namespace to start chatting
                </AlertDescription>
              </Alert>
            )}
            <div className="flex items-end gap-2">
              <div className="relative flex-1">
                <Textarea
                  ref={textareaRef}
                  placeholder={
                    hasValidScope
                      ? 'Ask a question... (Enter to send, Shift+Enter for new line)'
                      : 'Configure scope to start chatting...'
                  }
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={!hasValidScope || queryMutation.isPending}
                  rows={2}
                  className="resize-none pr-20"
                />
                <div className="absolute bottom-2 right-2 flex items-center gap-1">
                  {messages.length > 0 && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0"
                          onClick={clearChat}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Clear chat</TooltipContent>
                    </Tooltip>
                  )}
                </div>
              </div>
              <Button
                size="sm"
                onClick={handleSubmit}
                disabled={
                  !hasValidScope ||
                  !inputValue.trim() ||
                  queryMutation.isPending
                }
              >
                {queryMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>

            {/* Scope chips */}
            {hasValidScope && (
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                <span className="text-xs text-muted-foreground">Scope:</span>
                {instances?.find((i) => i.id === selectedInstanceId) && (
                  <Badge variant="secondary" className="text-xs">
                    {instances.find((i) => i.id === selectedInstanceId)?.name}
                  </Badge>
                )}
                {selectedNamespaces.slice(0, 2).map((ns) => (
                  <Badge key={ns} variant="outline" className="text-xs">
                    {ns}
                  </Badge>
                ))}
                {selectedNamespaces.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{selectedNamespaces.length - 2}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Source Inspector Sheet */}
        <Sheet open={inspectorOpen} onOpenChange={setInspectorOpen}>
          <SheetContent className="sm:max-w-lg">
            <SheetHeader>
              <SheetTitle>Source Citations</SheetTitle>
              <SheetDescription>
                Documents used to generate this response
              </SheetDescription>
            </SheetHeader>
            <ScrollArea className="mt-4 h-[calc(100vh-10rem)]">
              <div className="space-y-3 pr-4">
                {selectedMessageSources.map((source, index) => (
                  <Card key={source.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <CardTitle className="text-sm">
                            {source.source_ref}
                          </CardTitle>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {source.score.toFixed(3)}
                        </Badge>
                      </div>
                      <CardDescription className="flex gap-2 text-xs">
                        <Badge variant="outline" className="text-xs">
                          {source.namespace_id}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          Chunk {source.chunk_index}
                        </Badge>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p
                        className={cn(
                          'text-xs text-muted-foreground',
                          expandedSources.has(String(source.id))
                            ? ''
                            : 'line-clamp-4'
                        )}
                      >
                        {source.text}
                      </p>
                      {source.text.length > 200 && (
                        <Button
                          variant="link"
                          size="sm"
                          className="h-auto p-0 text-xs"
                          onClick={() => toggleSourceExpand(String(source.id))}
                        >
                          {expandedSources.has(String(source.id))
                            ? 'Show less'
                            : 'Show more'}
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </SheetContent>
        </Sheet>
      </div>
    </TooltipProvider>
  )
}
