import { Skeleton } from "@/components/ui/skeleton"

export function PublicPageSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading">
      <div className="h-[320px] bg-brand-dark" />
      <div className="container-page grid gap-5 py-14 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-80" />
        ))}
      </div>
    </div>
  )
}
