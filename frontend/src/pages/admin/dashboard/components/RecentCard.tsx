import { CustomEmptyState } from "@/components/custom";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

interface RecentCardProps<T> {
  title: string;
  icon: React.ReactNode;
  viewAllHref: string;
  loading: boolean;
  emptyIcon: LucideIcon;
  emptyTitle: string;
  emptyAction?: React.ReactNode;
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}

const RecentCard = <T extends { _id: string }>({
  title,
  icon,
  viewAllHref,
  loading,
  emptyIcon,
  emptyTitle,
  emptyAction,
  items,
  renderItem,
}: RecentCardProps<T>) => (
  <Card>
    <div className="flex items-center justify-between px-5 py-4 border-b">
      <div className="flex items-center gap-2">
        {icon}
        <span className="font-semibold text-sm">{title}</span>
      </div>
      <Link to={viewAllHref} className="text-sm text-primary hover:underline">
        View all
      </Link>
    </div>
    <CardContent className="pt-4 pb-2">
      {loading ? (
        <p className="text-sm text-muted-foreground py-4 text-center">
          Loading…
        </p>
      ) : !items.length ? (
        <CustomEmptyState
          compact
          icon={emptyIcon}
          title={emptyTitle}
          className="py-8"
          action={emptyAction}
        />
      ) : (
        <ul className="divide-y">{items.map(renderItem)}</ul>
      )}
    </CardContent>
  </Card>
);

export default RecentCard;
