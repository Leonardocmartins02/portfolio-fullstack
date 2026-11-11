import * as React from "react";
import { cn } from "@/lib/utils";

// Mesmo campo do Input, em várias linhas.
const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "flex min-h-[120px] w-full rounded-md border border-input bg-background/40 px-4 py-3 text-base leading-relaxed text-foreground",
        "transition-[border-color,box-shadow,background-color] duration-200 ease-out",
        "placeholder:text-muted-foreground/80 hover:border-foreground/60",
        "focus-visible:border-ring focus-visible:bg-background/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
        "aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-destructive",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  ),
);
Textarea.displayName = "Textarea";

export { Textarea };
