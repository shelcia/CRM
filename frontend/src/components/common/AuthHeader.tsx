interface AuthHeaderProps {
  title: string;
  description: string;
  className?: string;
}

export const AuthHeader = ({ title, description, className }: AuthHeaderProps) => (
  <div className={`flex flex-col gap-1 mb-2 ${className ?? ""}`}>
    <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
    <p className="text-sm text-muted-foreground">{description}</p>
  </div>
);
