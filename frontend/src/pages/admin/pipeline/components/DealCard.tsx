import { Pencil, Trash2 } from "lucide-react";
import { AuthorAvatar } from "@/components/common";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import AddDealDialog from "./AddDealDialog";
import { IDeal } from "../types";
import { convertDateToDateWithoutTime, getFmtCurrencyVal } from "@/utils";

const DealCard = ({
  deal,
  provided,
  isDragging,
  onDelete,
  onUpdated,
}: {
  deal: IDeal;
  provided: any;
  isDragging: boolean;
  onDelete: () => void;
  onUpdated: (deal: IDeal) => void;
}) => {
  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      style={provided.draggableProps.style}
      className={cn(
        "rounded-lg border bg-card p-3 shadow-sm group transition-shadow cursor-grab active:cursor-grabbing",
        isDragging && "shadow-lg ring-1 ring-primary/20",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium leading-snug flex-1">{deal.title}</p>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all shrink-0">
          <AddDealDialog
            deal={deal}
            onUpdated={onUpdated}
            trigger={
              <Button
                size="icon-sm"
                variant="ghost"
                onClick={(e) => e.stopPropagation()}
              >
                <Pencil className="size-4" />
              </Button>
            }
          />
          <Button
            size="icon-sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>

      {deal.contactName && (
        <p className="text-xs text-muted-foreground mt-1 truncate">
          {deal.contactName}
        </p>
      )}

      <div className="flex items-center justify-between mt-3">
        <span className="text-sm font-semibold text-primary">
          {getFmtCurrencyVal(deal.value, deal.currency)}
        </span>
        {deal.expectedClose && (
          <span className="text-xs text-muted-foreground">
            {convertDateToDateWithoutTime(deal.expectedClose)}
          </span>
        )}
      </div>

      {deal.assignedTo && (
        <div className="flex items-center gap-1.5 mt-2">
          <AuthorAvatar name={deal.assignedTo} className="h-5 w-5 text-[9px]" />
          <span className="text-xs text-muted-foreground truncate">
            {deal.assignedTo}
          </span>
        </div>
      )}
    </div>
  );
};

export default DealCard;
