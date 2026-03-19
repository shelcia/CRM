import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import useTheme from "@/hooks/useTheme";

const CustomToggle = () => {
  const { isDark, toggle } = useTheme();

  return (
    <Button size="icon-sm" variant="ghost" onClick={toggle} aria-label="toggle theme">
      {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4 text-yellow-400" />}
    </Button>
  );
};

export default CustomToggle;
