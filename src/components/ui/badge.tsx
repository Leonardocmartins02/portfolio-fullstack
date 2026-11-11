import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Selos do DESIGN.md: caption 13px/600. "default" é o badge-green (raio 6px),
// "soft" o badge-green-soft em pílula, "outline" a etiqueta de contorno fino.
const badgeVariants = cva(
  "inline-flex items-center gap-1 whitespace-nowrap font-semibold leading-none transition-[background-color,color,border-color] duration-200 ease-out",
  {
    variants: {
      variant: {
        default: "rounded-sm bg-primary px-2 py-1 text-primary-foreground",
        soft: "rounded-full bg-primary/15 px-2.5 py-1 text-primary",
        secondary: "rounded-full bg-secondary px-2.5 py-1 text-secondary-foreground",
        outline:
          "rounded-full border border-border px-3 py-1.5 font-medium text-foreground hover:border-foreground hover:bg-foreground hover:text-background",
      },
      size: {
        default: "text-[13px]",
        lg: "text-sm",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, size }), className)} {...props} />;
}

export { Badge, badgeVariants };
