import { ReactNode } from "react";

interface AuthCardProps {
  children: ReactNode;
}

const AuthCard = ({ children }: AuthCardProps) => (
  <div className="w-full max-w-[425px] rounded-xl border bg-card shadow-sm overflow-hidden">
    <div className="p-6 flex flex-col gap-3">{children}</div>
  </div>
);

export default AuthCard;
