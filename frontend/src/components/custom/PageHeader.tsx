import { ArrowLeft } from "lucide-react";
import { ReactNode } from "react";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  isBackButton?: boolean;
}

const PageHeader = ({
  title,
  description,
  actions,
  isBackButton = false,
}: PageHeaderProps) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-3">
      {isBackButton && (
        <Link to="/dashboard/users">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="size-4" />
          </Button>
        </Link>
      )}
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
    {actions && <div className="flex items-center gap-2">{actions}</div>}
  </div>
);

export default PageHeader;
