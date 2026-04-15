'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Loader2, Upload, FileText, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { FieldGroup, Field, FieldLabel, FieldError } from '@/components/ui/field'
import { PageHeader } from '@/components/page-header'
import { useAppContext } from '@/lib/context'
import api from '@/lib/api'
import { formatDistanceToNow } from '@/lib/format'
import type { ApiError } from '@/lib/types'

const ingestSchema = z.object({
  source_type: z.enum(['text', 'markdown', 'pdf', 'html', 'docx']),
  content: z.string().min(1, 'Content is required'),
  source_ref: z.string().min(1, 'Source reference is required'),
  user_id: z.string().optional(),
  session_id: z.string().optional(),
})

type IngestForm = z.infer<typeof ingestSchema>

const STATUS_COLORS = {
  processing: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  done: 'bg-green-500/10 text-green-500 border-green-500/20',
  failed: 'bg-red-500/10 text-red-500 border-red-500/20',
}

export default function ResourcesPage() {
  const queryClient = useQueryClient()
  const {
    activeInstanceId,
    activeNamespaceId,
    activeInstanceName,
    hasContext,
  } = useAppContext()

  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [uploadSourceType, setUploadSourceType] = useState<string>('pdf')
  const [uploadSourceRef, setUploadSourceRef] = useState('')

  const form = useForm<IngestForm>({
    resolver: zodResolver(ingestSchema),
    defaultValues: {
      source_type: 'text',
      content: '',
      source_ref: '',
      user_id: '',
      session_id: '',
    },
  })

  const { data: resources, isLoading: loadingResources } = useQuery({
    queryKey: ['resources', activeInstanceId, activeNamespaceId],
    queryFn: () =>
      api.getResources({
        instance_id: activeInstanceId || undefined,
        namespace_id: activeNamespaceId || undefined,
      }),
    enabled: hasContext,
  })

  const ingestMutation = useMutation({
    mutationFn: (data: IngestForm) =>
      api.ingestResource({
        ...data,
        instance_id: activeInstanceId!,
        namespace_id: activeNamespaceId!,
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['resources'] })
      toast.success('Resource ingested', {
        description: `Indexed ${data.chunks_indexed} chunks successfully.`,
      })
      form.reset()
    },
    onError: (error: ApiError) => {
      toast.error('Failed to ingest resource', {
        description: error.message,
      })
    },
  })

  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (!uploadFile || !activeInstanceId || !activeNamespaceId) return
      const formData = new FormData()
      formData.append('file', uploadFile)
      formData.append('instance_id', activeInstanceId)
      formData.append('namespace_id', activeNamespaceId)
      formData.append('source_type', uploadSourceType)
      formData.append('source_ref', uploadSourceRef || uploadFile.name)
      return api.uploadResource(formData)
    },
    onSuccess: (data) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: ['resources'] })
        toast.success('File uploaded', {
          description: `Indexed ${data.chunks_indexed} chunks successfully.`,
        })
        setUploadFile(null)
        setUploadSourceRef('')
      }
    },
    onError: (error: ApiError) => {
      toast.error('Failed to upload file', {
        description: error.message,
      })
    },
  })

  const onSubmit = (data: IngestForm) => {
    ingestMutation.mutate(data)
  }

  if (!hasContext) {
    return (
      <div className="p-6">
        <PageHeader
          title="Resources"
          description="Ingest and manage your document resources"
        />
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Context Required</AlertTitle>
          <AlertDescription>
            Please select an instance and namespace from the top bar to manage
            resources.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="p-6">
      <PageHeader
        title="Resources"
        description={`Ingest and manage resources for ${activeInstanceName} / ${activeNamespaceId}`}
      />

      <Tabs defaultValue="ingest" className="space-y-6">
        <TabsList>
          <TabsTrigger value="ingest" className="text-sm">
            Ingest Text/Markdown
          </TabsTrigger>
          <TabsTrigger value="upload" className="text-sm">
            Upload File
          </TabsTrigger>
          <TabsTrigger value="list" className="text-sm">
            View Resources
          </TabsTrigger>
        </TabsList>

        {/* Ingest Text/Markdown Tab */}
        <TabsContent value="ingest">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Ingest Content</CardTitle>
              <CardDescription>
                Add text or markdown content to your knowledge base
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <FieldGroup className="gap-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field>
                      <FieldLabel>Source Type</FieldLabel>
                      <Select
                        value={form.watch('source_type')}
                        onValueChange={(
                          value: 'text' | 'markdown' | 'pdf' | 'html' | 'docx'
                        ) => form.setValue('source_type', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="text">Text</SelectItem>
                          <SelectItem value="markdown">Markdown</SelectItem>
                          <SelectItem value="html">HTML</SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                    <Field>
                      <FieldLabel>Source Reference</FieldLabel>
                      <Input
                        placeholder="e.g., deploy-notes.md"
                        {...form.register('source_ref')}
                      />
                      {form.formState.errors.source_ref && (
                        <FieldError>
                          {form.formState.errors.source_ref.message}
                        </FieldError>
                      )}
                    </Field>
                  </div>

                  <Field>
                    <FieldLabel>Content</FieldLabel>
                    <Textarea
                      placeholder="Paste your content here..."
                      rows={10}
                      {...form.register('content')}
                    />
                    {form.formState.errors.content && (
                      <FieldError>
                        {form.formState.errors.content.message}
                      </FieldError>
                    )}
                  </Field>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field>
                      <FieldLabel>User ID (Optional)</FieldLabel>
                      <Input
                        placeholder="e.g., user_123"
                        {...form.register('user_id')}
                      />
                    </Field>
                    <Field>
                      <FieldLabel>Session ID (Optional)</FieldLabel>
                      <Input
                        placeholder="e.g., sess_001"
                        {...form.register('session_id')}
                      />
                    </Field>
                  </div>

                  <Button
                    type="submit"
                    size="sm"
                    disabled={ingestMutation.isPending}
                  >
                    {ingestMutation.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Ingest Content
                  </Button>
                </FieldGroup>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Upload File Tab */}
        <TabsContent value="upload">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Upload File</CardTitle>
              <CardDescription>
                Upload a PDF, DOCX, or other document file
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup className="gap-4">
                <Field>
                  <FieldLabel>File</FieldLabel>
                  <div className="flex items-center gap-4">
                    <Input
                      type="file"
                      accept=".pdf,.docx,.doc,.txt,.md,.html"
                      onChange={(e) =>
                        setUploadFile(e.target.files?.[0] || null)
                      }
                      className="flex-1"
                    />
                    {uploadFile && (
                      <Badge variant="secondary" className="text-xs">
                        {uploadFile.name}
                      </Badge>
                    )}
                  </div>
                </Field>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field>
                    <FieldLabel>Source Type</FieldLabel>
                    <Select
                      value={uploadSourceType}
                      onValueChange={setUploadSourceType}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">PDF</SelectItem>
                        <SelectItem value="docx">DOCX</SelectItem>
                        <SelectItem value="text">Text</SelectItem>
                        <SelectItem value="markdown">Markdown</SelectItem>
                        <SelectItem value="html">HTML</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field>
                    <FieldLabel>Source Reference (Optional)</FieldLabel>
                    <Input
                      placeholder="Leave empty to use filename"
                      value={uploadSourceRef}
                      onChange={(e) => setUploadSourceRef(e.target.value)}
                    />
                  </Field>
                </div>

                <Button
                  size="sm"
                  disabled={!uploadFile || uploadMutation.isPending}
                  onClick={() => uploadMutation.mutate()}
                >
                  {uploadMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  <Upload className="mr-2 h-4 w-4" />
                  Upload File
                </Button>
              </FieldGroup>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Resources List Tab */}
        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Resources</CardTitle>
              <CardDescription>
                All resources in the current context
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingResources ? (
                <div className="space-y-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : resources && resources.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Source Reference</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Chunks</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {resources.map((resource) => (
                        <TableRow key={resource.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">
                                {resource.source_ref}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-xs">
                              {resource.source_type}
                            </Badge>
                          </TableCell>
                          <TableCell>{resource.chunks_indexed}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={`text-xs ${STATUS_COLORS[resource.status]}`}
                            >
                              {resource.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {formatDistanceToNow(resource.created_at)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <FileText className="mb-4 h-8 w-8 text-muted-foreground" />
                  <p className="text-sm font-medium">No resources yet</p>
                  <p className="text-xs text-muted-foreground">
                    Ingest content or upload files to add resources
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
