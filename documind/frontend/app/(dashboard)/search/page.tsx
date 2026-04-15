'use client'

import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Search,
  Loader2,
  ChevronDown,
  AlertCircle,
  FileText,
  X,
  Plus,
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import { FieldGroup, Field, FieldLabel, FieldError } from '@/components/ui/field'
import { PageHeader } from '@/components/page-header'
import { useAppContext } from '@/lib/context'
import api from '@/lib/api'
import type { SearchResult, ApiError, FilterClause } from '@/lib/types'

const searchSchema = z.object({
  query: z.string().min(1, 'Query is required'),
  top_k: z.number().min(1).max(50).default(5),
})

type SearchForm = z.infer<typeof searchSchema>

export default function SearchPage() {
  const {
    activeInstanceId,
    activeNamespaceId,
    activeInstanceName,
    hasContext,
  } = useAppContext()

  const [advancedOpen, setAdvancedOpen] = useState(false)
  const [results, setResults] = useState<SearchResult[]>([])
  const [expandedResults, setExpandedResults] = useState<Set<string | number>>(
    new Set()
  )

  // Advanced settings
  const [mode, setMode] = useState<'semantic' | 'hybrid'>('semantic')
  const [hybridMethod, setHybridMethod] = useState<'rrf' | 'dbsf'>('rrf')
  const [denseWeight, setDenseWeight] = useState(0.7)
  const [keywordWeight, setKeywordWeight] = useState(0.3)
  const [filters, setFilters] = useState<FilterClause[]>([])

  const form = useForm<SearchForm>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      query: '',
      top_k: 5,
    },
  })

  const searchMutation = useMutation({
    mutationFn: async (data: SearchForm) => {
      if (!activeInstanceId || !activeNamespaceId) {
        throw new Error('Context not set')
      }

      if (advancedOpen) {
        return api.searchAdvanced({
          instance_id: activeInstanceId,
          namespace_id: activeNamespaceId,
          query: data.query,
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

      return api.searchInstance({
        instance_id: activeInstanceId,
        namespace_id: activeNamespaceId,
        query: data.query,
        top_k: data.top_k,
      })
    },
    onSuccess: (data) => {
      setResults(data.results)
      if (data.results.length === 0) {
        toast.info('No results found', {
          description: 'Try adjusting your query or filters.',
        })
      }
    },
    onError: (error: ApiError) => {
      toast.error('Search failed', {
        description: error.message,
      })
    },
  })

  const onSubmit = (data: SearchForm) => {
    searchMutation.mutate(data)
  }

  const toggleResultExpand = (id: string | number) => {
    setExpandedResults((prev) => {
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

  if (!hasContext) {
    return (
      <div className="p-6">
        <PageHeader title="Search" description="Search your knowledge bases" />
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Context Required</AlertTitle>
          <AlertDescription>
            Please select an instance and namespace from the top bar to search.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="p-6">
      <PageHeader
        title="Search"
        description={`Search within ${activeInstanceName} / ${activeNamespaceId}`}
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
        {/* Search Form */}
        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <FieldGroup className="gap-4">
                  <Field>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Enter your search query..."
                        className="pl-9"
                        {...form.register('query')}
                      />
                    </div>
                    {form.formState.errors.query && (
                      <FieldError>
                        {form.formState.errors.query.message}
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
                      disabled={searchMutation.isPending}
                    >
                      {searchMutation.isPending && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Search
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
        </div>

        {/* Results */}
        <Card className="h-fit lg:sticky lg:top-20">
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Results ({results.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {searchMutation.isPending ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-24 w-full" />
                ))}
              </div>
            ) : results.length > 0 ? (
              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-3">
                  {results.map((result, index) => (
                    <div
                      key={result.id}
                      className="rounded-md border p-3 transition-colors hover:bg-muted/50"
                      style={{ animationDelay: `${index * 35}ms` }}
                    >
                      <div className="mb-2 flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                          <span className="text-sm font-medium truncate">
                            {result.source_ref}
                          </span>
                        </div>
                        <Badge variant="secondary" className="shrink-0 text-xs">
                          {result.score.toFixed(3)}
                        </Badge>
                      </div>
                      <div className="mb-2 flex flex-wrap gap-1.5">
                        <Badge variant="outline" className="text-xs">
                          {result.namespace_id}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          Chunk {result.chunk_index}
                        </Badge>
                      </div>
                      <p
                        className={`text-xs text-muted-foreground ${
                          expandedResults.has(result.id)
                            ? ''
                            : 'line-clamp-3'
                        }`}
                      >
                        {result.text}
                      </p>
                      {result.text.length > 150 && (
                        <Button
                          variant="link"
                          size="sm"
                          className="h-auto p-0 text-xs"
                          onClick={() => toggleResultExpand(result.id)}
                        >
                          {expandedResults.has(result.id)
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
                <Search className="mb-4 h-8 w-8 text-muted-foreground" />
                <p className="text-sm font-medium">No results yet</p>
                <p className="text-xs text-muted-foreground">
                  Enter a query to search your knowledge base
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
