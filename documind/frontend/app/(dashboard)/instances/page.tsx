'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Plus, Search, Check, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
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
import { CreateInstanceDialog } from '@/components/dialogs/create-instance-dialog'
import { InstanceDetailSheet } from '@/components/sheets/instance-detail-sheet'
import { useAppContext } from '@/lib/context'
import api from '@/lib/api'
import { formatDistanceToNow } from '@/lib/format'
import type { Instance } from '@/lib/types'

export default function InstancesPage() {
  const [createOpen, setCreateOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [selectedInstance, setSelectedInstance] = useState<Instance | null>(null)

  const { activeInstanceId, setActiveInstance } = useAppContext()

  const { data: instances, isLoading } = useQuery({
    queryKey: ['instances'],
    queryFn: () => api.getInstances(),
  })

  const filteredInstances = instances?.filter(
    (instance) =>
      instance.name.toLowerCase().includes(search.toLowerCase()) ||
      instance.description?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-6">
      <PageHeader
        title="Instances"
        description="Manage your DocuMind instances"
        actions={
          <Button size="sm" onClick={() => setCreateOpen(true)}>
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            Create Instance
          </Button>
        }
      />

      {/* Search & Filters */}
      <div className="mb-6 flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search instances..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Instances Table */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-5 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-48" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-20" />
                  </TableCell>
                </TableRow>
              ))
            ) : filteredInstances && filteredInstances.length > 0 ? (
              filteredInstances.map((instance, index) => (
                <TableRow
                  key={instance.id}
                  className="group cursor-pointer"
                  style={{
                    animationDelay: `${index * 35}ms`,
                  }}
                  onClick={() => setSelectedInstance(instance)}
                >
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{instance.name}</span>
                      {activeInstanceId === instance.id && (
                        <Badge variant="secondary" className="text-xs">
                          Active
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {instance.description || (
                      <span className="italic">No description</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDistanceToNow(instance.created_at)}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDistanceToNow(instance.updated_at)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          setActiveInstance(instance.id, instance.name)
                        }}
                        disabled={activeInstanceId === instance.id}
                      >
                        {activeInstanceId === instance.id ? (
                          <Check className="h-3.5 w-3.5" />
                        ) : (
                          'Set Active'
                        )}
                      </Button>
                      <Button variant="ghost" size="sm" asChild>
                        <Link
                          href={`/knowledge-bases?instance=${instance.id}`}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <p>No instances found</p>
                    <Button
                      variant="link"
                      size="sm"
                      onClick={() => setCreateOpen(true)}
                    >
                      Create your first instance
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Dialogs & Sheets */}
      <CreateInstanceDialog open={createOpen} onOpenChange={setCreateOpen} />
      <InstanceDetailSheet
        instance={selectedInstance}
        onClose={() => setSelectedInstance(null)}
      />
    </div>
  )
}
