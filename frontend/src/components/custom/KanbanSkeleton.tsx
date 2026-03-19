import { Skeleton } from "@/components/ui/skeleton";

interface KanbanSkeletonProps {
  columns?: number;
  columnWidth?: string;
}

const KanbanSkeleton = ({ columns = 4, columnWidth = "w-60" }: KanbanSkeletonProps) => (
  <div className="flex gap-3 overflow-x-auto pb-4 items-start">
    {Array.from({ length: columns }).map((_, i) => (
      <div key={i} className={`flex-shrink-0 ${columnWidth}`}>
        <div className="rounded-xl bg-muted/50 border flex flex-col p-3 gap-3">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-24 w-full rounded-lg" />
          <Skeleton className="h-20 w-full rounded-lg" />
          <Skeleton className="h-16 w-full rounded-lg" />
        </div>
      </div>
    ))}
  </div>
);

export default KanbanSkeleton;
