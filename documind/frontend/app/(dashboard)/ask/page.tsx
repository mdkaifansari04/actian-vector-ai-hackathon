'use client'

import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  MessageCircleQuestion,
  Loader2,
  ChevronDown,
  AlertCircle,
  FileText,
  Clock,
  Sparkles,
  AlertTriangle,
  X,
  Plus,
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Slider } from '@/components/ui/slider'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { FieldGroup, Field, FieldLabel, FieldError } from '@/components/ui/field'
import { PageHeader } from '@/components/page-header'
import { useAppContext } from '@/lib/context'
import api from '@/lib/api'
import type { QueryInstanceResponse, ApiError, FilterClause } from '@/lib/types'

const askSchema = z.object({
  question: z.string().min(1, 'Question is required'),
  top_k: z.number().min(1).max(50).default(5),
})

type AskForm = z.infer<typeof askSchema>

export default function AskPage() {
  const {
    activeInstanceId,
    activeNamespaceId,
    activeInstanceName,
    hasContext,
  } = useAppContext()

  const [advancedOpen, setAdvancedOpen] = useState(false)
  const [response, setResponse] = useState<QueryInstanceResponse | null>(null)
  const [expandedSources, setExpandedSources] = useState<Set<string | number>>(
    new Set()
  )

  // Advanced settings
  const [mode, setMode] = useState<'semantic' | 'hybrid'>('semantic')
  const [hybridMethod, setHybridMethod] = useState<'rrf' | 'dbsf'>('rrf')
  const [denseWeight, setDenseWeight] = useState(0.7)
  const [keywordWeight, setKeywordWeight] = useState(0.3)
  const [filters, setFilters] = useState<FilterClause[]>([])

  const form = useForm<AskForm>({
    resolver: zodResolver(askSchema),
    defaultValues: {
      question: '',
      top_k: 5,
    },
  })

  const askMutation = useMutation({
    mutationFn: async (data: AskForm) => {
      if (!activeInstanceId || !activeNamespaceId) {
        throw new Error('Context not set')
      }

      if (advancedOpen) {
        return api.queryAdvanced({
          instance_id: activeInstanceId,
          namespace_id: activeNamespaceId,
          question: data.question,
          top_k: data.top_k,
          mode,
          hybrid:
            mode === 'hybrid'
              ? {
                  method: hybridMethod,
                  dense_weight: denseWeight,
                  keyword_weight: keywordWeight,
                }
              : undefined,
          filters: filters.length > 0 ? { must: filters } : undefined,
        })
      }

      return api.queryInstance({
        instance_id: activeInstanceId,
        namespace_id: activeNamespaceId,
        question: data.question,
        top_k: data.top_k,
      })
    },
    onSuccess: (data) => {
      setResponse(data)
    },
    onError: (error: ApiError) => {
      toast.error('Query failed', {
        description: error.message,
      })
    },
  })

  const onSubmit = (data: AskForm) => {
    askMutation.mutate(data)
  }

  const toggleSourceExpand = (id: string | number) => {
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

  const addFilter = () => {
    setFilters([...filters, { field: '', op: 'eq', value: '' }])
  }

  const removeFilter = (index: number) => {
    setFilters(filters.filter((_, i) => i !== index))
  }

  const updateFilter = (
    index: number,
    updates: Partial<FilterClause>
  ) => {
    setFilters(
      filters.map((f, i) => (i === index ? { ...f, ...updates } : f))
    )
  }

  const isNoAnswer =
    response?.answer?.toLowerCase().includes("i don't know") ||
    response?.answer?.toLowerCase().includes('i do not know')

  if (!hasContext) {
    return (
      <div className="p-6">
        <PageHeader
          title="Ask"
          description="Ask questions about your documents"
        />
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Context Required</AlertTitle>
          <AlertDescription>
            Please select an instance and namespace from the top bar to ask
            questions.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="p-6">
      <PageHeader
        title="Ask"
        description={`Ask questions about ${activeInstanceName} / ${activeNamespaceId}`}
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
        {/* Question Form */}
        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <FieldGroup className="gap-4">
                  <Field>
                    <FieldLabel>Your Question</FieldLabel>
                    <Textarea
                      placeholder="What would you like to know about your documents?"
                      rows={4}
                      {...form.register('question')}
                    />
                    {form.formState.errors.question && (
                      <FieldError>
                        {form.formState.errors.question.message}
                      </FieldError>
                    )}
                  </Field>

                  <div className="flex items-end gap-4">
                    <Field className="w-32">
                      <FieldLabel>Top K</FieldLabel>
                      <Input
                        type="number"
                        min={1}
                        max={50}
                        {...form.register('top_k', { valueAsNumber: true })}
                      />
                    </Field>
                    <Button
                      type="submit"
                      size="sm"
                      disabled={askMutation.isPending}
                    >
                      {askMutation.isPending && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      <MessageCircleQuestion className="mr-2 h-4 w-4" />
                      Ask
                    </Button>
                  </div>
                </FieldGroup>
              </form>
            </CardContent>
          </Card>

          {/* Advanced Options */}
          <Collapsible open={advancedOpen} onOpenChange={setAdvancedOpen}>
            <Card>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-muted/50">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">
                      Advanced Options
                    </CardTitle>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${advancedOpen ? 'rotate-180' : ''}`}
                    />
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field>
                      <FieldLabel>Mode</FieldLabel>
                      <Select
                        value={mode}
                        onValueChange={(v: 'semantic' | 'hybrid') => setMode(v)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="semantic">Semantic</SelectItem>
                          <SelectItem value="hybrid">Hybrid</SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>

                    {mode === 'hybrid' && (
                      <Field>
                        <FieldLabel>Hybrid Method</FieldLabel>
                        <Select
                          value={hybridMethod}
                          onValueChange={(v: 'rrf' | 'dbsf') =>
                            setHybridMethod(v)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="rrf">RRF</SelectItem>
                            <SelectItem value="dbsf">DBSF</SelectItem>
                          </SelectContent>
                        </Select>
                      </Field>
                    )}
                  </div>

                  {mode === 'hybrid' && (
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field>
                        <FieldLabel>
                          Dense Weight: {denseWeight.toFixed(2)}
                        </FieldLabel>
                        <Slider
                          value={[denseWeight]}
                          onValueChange={([v]) => setDenseWeight(v)}
                          min={0}
                          max={1}
                          step={0.05}
                        />
                      </Field>
                      <Field>
                        <FieldLabel>
                          Keyword Weight: {keywordWeight.toFixed(2)}
                        </FieldLabel>
                        <Slider
                          value={[keywordWeight]}
                          onValueChange={([v]) => setKeywordWeight(v)}
                          min={0}
                          max={1}
                          step={0.05}
                        />
                      </Field>
                    </div>
                  )}

                  {/* Filters */}
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <FieldLabel>Filters (must)</FieldLabel>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={addFilter}
                      >
                        <Plus className="mr-1 h-3 w-3" />
                        Add Filter
                      </Button>
                    </div>
                    {filters.length > 0 ? (
                      <div className="space-y-2">
                        {filters.map((filter, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 rounded-md border p-2"
                          >
                            <Input
                              placeholder="Field"
                              value={filter.field}
                              onChange={(e) =>
                                updateFilter(index, { field: e.target.value })
                              }
                              className="flex-1"
                            />
                            <Select
                              value={filter.op}
                              onValueChange={(
                                op: FilterClause['op']
                              ) => updateFilter(index, { op })}
                            >
                              <SelectTrigger className="w-24">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="eq">eq</SelectItem>
                                <SelectItem value="ne">ne</SelectItem>
                                <SelectItem value="gt">gt</SelectItem>
                                <SelectItem value="gte">gte</SelectItem>
                                <SelectItem value="lt">lt</SelectItem>
                                <SelectItem value="lte">lte</SelectItem>
                                <SelectItem value="any_of">any_of</SelectItem>
                                <SelectItem value="contains">
                                  contains
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <Input
                              placeholder="Value"
                              value={String(filter.value)}
                              onChange={(e) =>
                                updateFilter(index, { value: e.target.value })
                              }
                              className="flex-1"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFilter(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground">
                        No filters added
                      </p>
                    )}
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          {/* Answer Panel */}
          {(askMutation.isPending || response) && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    Answer
                  </CardTitle>
                  {response && (
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {response.response_ms}ms
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {response.llm_profile}
                      </Badge>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {askMutation.isPending ? (
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-5/6" />
                  </div>
                ) : response ? (
                  <>
                    {isNoAnswer && (
                      <Alert className="mb-4" variant="default">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Unable to find an answer</AlertTitle>
                        <AlertDescription>
                          The system could not find relevant information to
                          answer this question. Try rephrasing or check if the
                          information exists in your documents.
                        </AlertDescription>
                      </Alert>
                    )}
                    <p className="text-sm leading-relaxed">{response.answer}</p>
                  </>
                ) : null}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sources Panel */}
        <Card className="h-fit lg:sticky lg:top-20">
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Sources ({response?.sources?.length ?? 0})
            </CardTitle>
            <CardDescription className="text-xs">
              Citations used to generate the answer
            </CardDescription>
          </CardHeader>
          <CardContent>
            {askMutation.isPending ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-24 w-full" />
                ))}
              </div>
            ) : response?.sources && response.sources.length > 0 ? (
              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-3">
                  {response.sources.map((source, index) => (
                    <div
                      key={source.id}
                      className="rounded-md border p-3 transition-colors hover:bg-muted/50"
                      style={{ animationDelay: `${index * 35}ms` }}
                    >
                      <div className="mb-2 flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                          <span className="text-sm font-medium truncate">
                            {source.source_ref}
                          </span>
                        </div>
                        <Badge variant="secondary" className="shrink-0 text-xs">
                          {source.score.toFixed(3)}
                        </Badge>
                      </div>
                      <div className="mb-2 flex flex-wrap gap-1.5">
                        <Badge variant="outline" className="text-xs">
                          {source.namespace_id}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          Chunk {source.chunk_index}
                        </Badge>
                      </div>
                      <p
                        className={`text-xs text-muted-foreground ${
                          expandedSources.has(source.id) ? '' : 'line-clamp-3'
                        }`}
                      >
                        {source.text}
                      </p>
                      {source.text.length > 150 && (
                        <Button
                          variant="link"
                          size="sm"
                          className="h-auto p-0 text-xs"
                          onClick={() => toggleSourceExpand(source.id)}
                        >
                          {expandedSources.has(source.id)
                            ? 'Show less'
                            : 'Show more'}
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <MessageCircleQuestion className="mb-4 h-8 w-8 text-muted-foreground" />
                <p className="text-sm font-medium">No sources yet</p>
                <p className="text-xs text-muted-foreground">
                  Ask a question to see relevant sources
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
