import { useEffect, useState } from "react";
import { IContact } from "../types";
import { getDealsByContact } from "@/services/models/dealsModel";
import AddDealDialog from "../../pipeline/components/AddDealDialog";
import { Button } from "@/components/ui/button";
import { Kanban, Plus } from "lucide-react";
import { PageSpinner, StatusBadge } from "@/components/custom";
import { IDeal } from "../../pipeline/types";
import { getFmtCurrencyVal } from "@/utils";

const DealsTab = ({ contact }: { contact: IContact }) => {
  const [deals, setDeals] = useState<IDeal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getDealsByContact(contact._id).then((res) => {
      if (Array.isArray(res)) setDeals(res);
      setLoading(false);
    });
  }, [contact._id]);

  const totalValue = deals
    .filter((d) => d.stage !== "lost")
    .reduce((sum, d) => sum + d.value, 0);

  if (loading) {
    return <PageSpinner />;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        {deals.length > 0 && (
          <p className="text-xs text-muted-foreground">
            {deals.length} deal{deals.length !== 1 ? "s" : ""} ·{" "}
            {getFmtCurrencyVal(totalValue, "USD")} pipeline
          </p>
        )}
        <AddDealDialog
          defaultContactId={contact._id}
          defaultContactName={contact.name}
          onCreated={(deal) => setDeals((prev) => [deal, ...prev])}
          trigger={
            <Button size="sm" variant="outline" className="ml-auto">
              <Plus className="size-4 mr-1" />
              Add Deal
            </Button>
          }
        />
      </div>

      {deals.length === 0 ? (
        <div className="flex flex-col items-center py-10 text-muted-foreground gap-2">
          <Kanban className="h-8 w-8 opacity-30" />
          <p className="text-sm">No deals yet</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {deals.map((deal) => (
            <li key={deal._id} className="rounded-lg border bg-card p-3">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-medium leading-snug">{deal.title}</p>
                <span className="text-sm font-semibold text-primary shrink-0">
                  {getFmtCurrencyVal(deal.value, deal.currency)}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1.5">
                <StatusBadge value={deal.stage} />
                {deal.expectedClose && (
                  <>
                    <span className="text-muted-foreground/40 text-xs">·</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(deal.expectedClose).toLocaleDateString(
                        undefined,
                        { month: "short", day: "numeric", year: "numeric" },
                      )}
                    </span>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DealsTab;
