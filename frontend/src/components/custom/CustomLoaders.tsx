import { Skeleton } from "../ui/skeleton";

interface KanbanSkeletonProps {
  columns?: number;
  columnWidth?: string;
}

export const KanbanSkeleton = ({
  columns = 4,
  columnWidth = "w-60",
}: KanbanSkeletonProps) => (
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

export const PageSpinner = () => (
  <div className="flex items-center justify-center py-24">
    <svg
      className="h-8 w-8 animate-spin text-primary"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  </div>
);

interface TableSkeletonProps {
  rows?: number;
  cols?: number;
}

export const TableSkeleton = ({ rows = 6, cols = 5 }: TableSkeletonProps) => {
  return (
    <div className="rounded-lg border bg-card">
      {/* toolbar */}
      <div className="flex items-center justify-between p-4 border-b gap-4">
        <Skeleton className="h-5 w-32" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-8" />
        </div>
      </div>

      {/* header row */}
      <div
        className="grid gap-4 px-4 py-3 border-b"
        style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
      >
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-3/4" />
        ))}
      </div>

      {/* data rows */}
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div
          key={rowIdx}
          className="grid gap-4 px-4 py-3 border-b last:border-0"
          style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
        >
          {Array.from({ length: cols }).map((_, colIdx) => (
            <Skeleton
              key={colIdx}
              className="h-4"
              style={{ width: `${60 + ((rowIdx * cols + colIdx) % 3) * 15}%` }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};
