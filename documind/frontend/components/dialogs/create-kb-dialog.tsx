'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { FieldGroup, Field, FieldLabel, FieldError } from '@/components/ui/field'
import api from '@/lib/api'
import { useAppContext } from '@/lib/context'
import type { ApiError } from '@/lib/types'

const createKbSchema = z.object({
  instance_id: z.string().min(1, 'Instance is required'),
  namespace_id: z.string().min(1, 'Namespace is required'),
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  embedding_profile: z.string().optional(),
  embedding_model: z.string().optional(),
  llm_profile: z.string().optional(),
  distance_metric: z.enum(['cosine', 'euclidean', 'dot']).optional(),
})

type CreateKbForm = z.infer<typeof createKbSchema>

interface CreateKnowledgeBaseDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateKnowledgeBaseDialog({
  open,
  onOpenChange,
}: CreateKnowledgeBaseDialogProps) {
  const queryClient = useQueryClient()
  const { activeInstanceId } = useAppContext()

  const { data: instances } = useQuery({
    queryKey: ['instances'],
    queryFn: () => api.getInstances(),
  })

  const form = useForm<CreateKbForm>({
    resolver: zodResolver(createKbSchema),
    defaultValues: {
      instance_id: activeInstanceId || '',
      namespace_id: '',
      name: '',
      embedding_profile: 'general_text_search',
      distance_metric: 'cosine',
    },
  })

  const createMutation = useMutation({
    mutationFn: api.createKnowledgeBase.bind(api),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['knowledge-bases'] })
      toast.success('Knowledge Base created', {
        description: `"${data.name}" has been created successfully.`,
      })
      onOpenChange(false)
      form.reset()
    },
    onError: (error: ApiError) => {
      toast.error('Failed to create Knowledge Base', {
        description: error.message || 'An unexpected error occurred.',
      })
    },
  })

  const onSubmit = (data: CreateKbForm) => {
    createMutation.mutate(data)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Knowledge Base</DialogTitle>
          <DialogDescription>
            Create a new knowledge base to store and query documents.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="gap-4 py-4">
            <Field>
              <FieldLabel htmlFor="instance_id">Instance</FieldLabel>
              <Select
                value={form.watch('instance_id')}
                onValueChange={(value) => form.setValue('instance_id', value)}
              >
                <SelectTrigger id="instance_id">
                  <SelectValue placeholder="Select an instance" />
                </SelectTrigger>
                <SelectContent>
                  {instances?.map((instance) => (
                    <SelectItem key={instance.id} value={instance.id}>
                      {instance.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.instance_id && (
                <FieldError>
                  {form.formState.errors.instance_id.message}
                </FieldError>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="namespace_id">Namespace</FieldLabel>
              <Input
                id="namespace_id"
                placeholder="e.g., engineering-docs"
                {...form.register('namespace_id')}
              />
              {form.formState.errors.namespace_id && (
                <FieldError>
                  {form.formState.errors.namespace_id.message}
                </FieldError>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <Input
                id="name"
                placeholder="e.g., Engineering Documentation"
                {...form.register('name')}
              />
              {form.formState.errors.name && (
                <FieldError>{form.formState.errors.name.message}</FieldError>
              )}
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="embedding_profile">
                  Embedding Profile
                </FieldLabel>
                <Select
                  value={form.watch('embedding_profile')}
                  onValueChange={(value) =>
                    form.setValue('embedding_profile', value)
                  }
                >
                  <SelectTrigger id="embedding_profile">
                    <SelectValue placeholder="Select profile" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general_text_search">
                      General Text Search
                    </SelectItem>
                    <SelectItem value="code_search">Code Search</SelectItem>
                    <SelectItem value="qa">Q&A</SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel htmlFor="distance_metric">Distance Metric</FieldLabel>
                <Select
                  value={form.watch('distance_metric')}
                  onValueChange={(value: 'cosine' | 'euclidean' | 'dot') =>
                    form.setValue('distance_metric', value)
                  }
                >
                  <SelectTrigger id="distance_metric">
                    <SelectValue placeholder="Select metric" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cosine">Cosine</SelectItem>
                    <SelectItem value="euclidean">Euclidean</SelectItem>
                    <SelectItem value="dot">Dot Product</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <Field>
              <FieldLabel htmlFor="llm_profile">LLM Profile</FieldLabel>
              <Select
                value={form.watch('llm_profile') || ''}
                onValueChange={(value) => form.setValue('llm_profile', value)}
              >
                <SelectTrigger id="llm_profile">
                  <SelectValue placeholder="Select LLM profile (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="balanced">Balanced</SelectItem>
                  <SelectItem value="fast">Fast</SelectItem>
                  <SelectItem value="accurate">Accurate</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </FieldGroup>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={createMutation.isPending}>
              {createMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Create Knowledge Base
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
