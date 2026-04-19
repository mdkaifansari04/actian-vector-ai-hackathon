import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

interface TableRowsSkeletonProps {
  rows?: number
  gridClassName: string
  cellClassNames: string[]
  rowClassName?: string
  containerClassName?: string
}

export function TableRowsSkeleton({
  rows = 3,
  gridClassName,
  cellClassNames,
  rowClassName,
  containerClassName,
}: TableRowsSkeletonProps) {
  const totalRows = Math.max(1, rows)
  return (
    <div className={cn('flex flex-col gap-px px-1 pb-1.5', containerClassName)}>
      {Array.from({ length: totalRows }).map((_, index) => (
        <div
          key={index}
          className={cn(
            gridClassName,
            'items-center gap-2 bg-[#141414] px-4 py-3',
            index === 0 && 'rounded-t-lg',
            index === totalRows - 1 && 'rounded-b-lg',
            rowClassName
          )}
        >
          {cellClassNames.map((cellClassName, cellIndex) => (
            <Skeleton
              key={`${index}-${cellIndex}`}
              className={cn('h-4 rounded-md bg-white/3', cellClassName)}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

interface CardStackSkeletonProps {
  items?: number
  itemClassName?: string
  containerClassName?: string
}

export function CardStackSkeleton({
  items = 3,
  itemClassName = 'h-24 w-full rounded-lg bg-white/3',
  containerClassName = 'space-y-3',
}: CardStackSkeletonProps) {
  return (
    <div className={containerClassName}>
      {Array.from({ length: Math.max(1, items) }).map((_, index) => (
        <Skeleton key={index} className={itemClassName} />
      ))}
    </div>
  )
}

export function TwoPanelSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.35fr_1fr]">
      <div className="space-y-4">
        <Skeleton className="h-8 w-44 rounded-md bg-white/3" />
        <Skeleton className="h-36 w-full rounded-xl border border-white/6 bg-white/3" />
        <CardStackSkeleton items={2} />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-8 w-36 rounded-md bg-white/3" />
        <CardStackSkeleton items={3} />
      </div>
    </div>
  )
}

export function ChatLayoutSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
      <div className="space-y-3 rounded-xl border border-white/6 bg-[#111] p-4">
        <Skeleton className="h-4 w-2/3 rounded-md bg-white/3" />
        <Skeleton className="h-12 w-full rounded-lg bg-white/3" />
        <Skeleton className="h-12 w-5/6 rounded-lg bg-white/3" />
        <Skeleton className="h-10 w-full rounded-lg bg-white/3" />
      </div>
      <div className="space-y-3 rounded-xl border border-white/6 bg-[#111] p-4">
        <Skeleton className="h-4 w-28 rounded-md bg-white/3" />
        <CardStackSkeleton
          items={3}
          itemClassName="h-20 w-full rounded-lg bg-white/3"
          containerClassName="space-y-2"
        />
      </div>
    </div>
  )
}
