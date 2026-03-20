import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import useTheme from "@/hooks/useTheme";

const CustomToggle = () => {
  const { isDark, toggle } = useTheme();

  return (
    <Button
      size="icon"
      variant="ghost"
      onClick={toggle}
      aria-label="toggle theme"
    >
      {isDark ? (
        <Moon className="size-5" />
      ) : (
        <Sun className="size-5 text-amber-500" />
      )}
    </Button>
  );
};

export default CustomToggle;
