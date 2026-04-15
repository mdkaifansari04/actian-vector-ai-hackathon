'use client'

import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'
import { Plus, Search, LayoutGrid, List, Database } from 'lucide-react'
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { PageHeader } from '@/components/page-header'
import { CreateKnowledgeBaseDialog } from '@/components/dialogs/create-kb-dialog'
import { KnowledgeBaseDetailSheet } from '@/components/sheets/kb-detail-sheet'
import api from '@/lib/api'
import { formatDistanceToNow } from '@/lib/format'
import type { KnowledgeBase } from '@/lib/types'

export default function KnowledgeBasesPage() {
  const searchParams = useSearchParams()
  const initialInstanceFilter = searchParams.get('instance') || 'all'

  const [createOpen, setCreateOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')
  const [instanceFilter, setInstanceFilter] = useState(initialInstanceFilter)
  const [namespaceFilter, setNamespaceFilter] = useState('all')
  const [selectedKb, setSelectedKb] = useState<KnowledgeBase | null>(null)

  const { data: instances } = useQuery({
    queryKey: ['instances'],
    queryFn: () => api.getInstances(),
  })

  const { data: knowledgeBases, isLoading } = useQuery({
    queryKey: ['knowledge-bases'],
    queryFn: () => api.getKnowledgeBases(),
  })

  // Get unique namespaces
  const namespaces = useMemo(() => {
    if (!knowledgeBases) return []
    return [...new Set(knowledgeBases.map((kb) => kb.namespace_id))]
  }, [knowledgeBases])

  // Filter knowledge bases
  const filteredKbs = useMemo(() => {
    if (!knowledgeBases) return []
    return knowledgeBases.filter((kb) => {
      const matchesSearch =
        kb.name.toLowerCase().includes(search.toLowerCase()) ||
        kb.namespace_id.toLowerCase().includes(search.toLowerCase())
      const matchesInstance =
        instanceFilter === 'all' || kb.instance_id === instanceFilter
      const matchesNamespace =
        namespaceFilter === 'all' || kb.namespace_id === namespaceFilter
      return matchesSearch && matchesInstance && matchesNamespace
    })
  }, [knowledgeBases, search, instanceFilter, namespaceFilter])

  return (
    <div className="p-6">
      <PageHeader
        title="Knowledge Bases"
        description="Manage your knowledge bases and their configurations"
        actions={
          <Button size="sm" onClick={() => setCreateOpen(true)}>
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            Create Knowledge Base
          </Button>
        }
      />

      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search knowledge bases..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={instanceFilter} onValueChange={setInstanceFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by instance" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Instances</SelectItem>
            {instances?.map((instance) => (
              <SelectItem key={instance.id} value={instance.id}>
                {instance.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={namespaceFilter} onValueChange={setNamespaceFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by namespace" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Namespaces</SelectItem>
            {namespaces.map((ns) => (
              <SelectItem key={ns} value={ns}>
                {ns}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center gap-1 rounded-md border p-1">
          <Button
            variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
            size="sm"
            className="h-7 w-7 p-0"
            onClick={() => setViewMode('grid')}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'table' ? 'secondary' : 'ghost'}
            size="sm"
            className="h-7 w-7 p-0"
            onClick={() => setViewMode('table')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        viewMode === 'grid' ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-5 w-32" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border">
            <Table>
              <TableBody>
                {Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )
      ) : filteredKbs.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredKbs.map((kb, index) => (
              <Card
                key={kb.id}
                className="cursor-pointer transition-all hover:border-primary/50 hover:shadow-sm"
                style={{ animationDelay: `${index * 35}ms` }}
                onClick={() => setSelectedKb(kb)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Database className="h-4 w-4 text-muted-foreground" />
                      <CardTitle className="text-sm font-medium">
                        {kb.name}
                      </CardTitle>
                    </div>
                    <Badge
                      variant={kb.status === 'active' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {kb.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span>Namespace</span>
                      <Badge variant="outline" className="text-xs font-normal">
                        {kb.namespace_id}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span>Model</span>
                      <span className="font-mono text-xs">{kb.embedding_model}</span>
                    </div>
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span>Metric</span>
                      <span className="capitalize">{kb.distance_metric}</span>
                    </div>
                    <div className="pt-2 text-xs text-muted-foreground">
                      Created {formatDistanceToNow(kb.created_at)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Namespace</TableHead>
                  <TableHead>Model</TableHead>
                  <TableHead>Metric</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredKbs.map((kb, index) => (
                  <TableRow
                    key={kb.id}
                    className="cursor-pointer"
                    style={{ animationDelay: `${index * 35}ms` }}
                    onClick={() => setSelectedKb(kb)}
                  >
                    <TableCell className="font-medium">{kb.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {kb.namespace_id}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {kb.embedding_model}
                    </TableCell>
                    <TableCell className="capitalize">
                      {kb.distance_metric}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={kb.status === 'active' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {kb.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDistanceToNow(kb.created_at)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Database className="mb-4 h-8 w-8 text-muted-foreground" />
            <p className="mb-2 text-sm font-medium">No knowledge bases found</p>
            <p className="mb-4 text-xs text-muted-foreground">
              {search || instanceFilter !== 'all' || namespaceFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Create your first knowledge base to get started'}
            </p>
            <Button size="sm" onClick={() => setCreateOpen(true)}>
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              Create Knowledge Base
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Dialogs & Sheets */}
      <CreateKnowledgeBaseDialog open={createOpen} onOpenChange={setCreateOpen} />
      <KnowledgeBaseDetailSheet
        knowledgeBase={selectedKb}
        onClose={() => setSelectedKb(null)}
      />
    </div>
  )
}
