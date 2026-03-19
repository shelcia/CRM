import React from "react";
import { cn } from "@/lib/utils";

interface AuthorAvatarProps {
  name: string;
  image?: string;
  className?: string;
}

const AuthorAvatar = ({ name, image, className }: AuthorAvatarProps) => {
  const [imgError, setImgError] = React.useState(false);
  const initials = name
    ? name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  if (image && !imgError) {
    return (
      <img
        src={image}
        alt={name}
        className={cn("h-6 w-6 rounded-full object-cover bg-muted shrink-0", className)}
        onError={() => setImgError(true)}
      />
    );
  }

  return (
    <span
      className={cn(
        "h-6 w-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] font-bold shrink-0",
        className,
      )}
    >
      {initials}
    </span>
  );
};

export default AuthorAvatar;
