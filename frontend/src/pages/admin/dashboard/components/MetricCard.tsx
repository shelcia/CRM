import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Metric } from "../types";

const MetricCard = ({
  label,
  value,
  icon,
  href,
  color,
}: Omit<Metric, "permission">) => (
  <Link to={href}>
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <CardContent className="pt-6 flex items-center gap-4">
        <div
          className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 ${color}`}
        >
          {icon}
        </div>
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-sm text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  </Link>
);

export default MetricCard;
