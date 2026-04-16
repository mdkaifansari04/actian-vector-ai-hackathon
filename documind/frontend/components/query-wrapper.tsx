'use client'

import type { ReactNode } from 'react'
import type { UseQueryResult } from '@tanstack/react-query'
import { AlertCircle, Loader2 } from 'lucide-react'

interface QueryWrapperProps<TData = unknown>
  extends Partial<
    Pick<UseQueryResult<TData>, 'isPending' | 'error' | 'data' | 'isFetching'>
  > {
  view: ReactNode
  loadingView?: ReactNode
  className?: string
}

export function QueryWrapper<TData = unknown>(props: QueryWrapperProps<TData>) {
  const canShowView = Boolean(props.data) && !props.error && !props.isPending
  const isErrored = Boolean(props.error) && !props.isFetching && !props.isPending

  if (props.isPending) {
    return (
      <>
        {props.loadingView ?? (
          <div className="flex items-center gap-2 text-xs text-muted-foreground/55">
            <Loader2 className="h-3.5 w-3.5 animate-spin" strokeWidth={1.5} />
            Loading...
          </div>
        )}
      </>
    )
  }

  if (isErrored) {
    return (
      <div
        className={
          props.className ??
          'flex items-start gap-2 rounded-lg border border-white/6 bg-[#111] px-3 py-2 text-xs text-red-200/80'
        }
      >
        <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" strokeWidth={1.5} />
        <span>{props.error instanceof Error ? props.error.message : 'Request failed'}</span>
      </div>
    )
  }

  if (canShowView) {
    return <>{props.view}</>
  }

  return null
}

