import * as React from "react";
import { cn } from "@/lib/utils";

// text-input do DESIGN.md: 44px, raio 8px, contorno 1px (≥ 3:1 com o fundo) e,
// no foco, 2px na cor de foco do capítulo. Fonte de 16px: o iOS não dá zoom.
const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      ref={ref}
      className={cn(
        "flex h-11 w-full min-w-0 rounded-md border border-input bg-background/40 px-4 py-2 text-base text-foreground",
        "transition-[border-color,box-shadow,background-color] duration-200 ease-out",
        "placeholder:text-muted-foreground/80 hover:border-foreground/60",
        "focus-visible:border-ring focus-visible:bg-background/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
        "aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-destructive",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "file:border-0 file:bg-transparent file:text-sm file:font-medium",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";

export { Input };
