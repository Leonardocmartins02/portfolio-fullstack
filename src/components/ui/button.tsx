import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Botões do DESIGN.md: pílula em todas as variantes de ação, rótulo 14px/600,
// 44px de altura (alvo de toque). O hover só existe com mouse
// (hoverOnlyWhenSupported); no toque fica o :active, que encolhe 3%.
const buttonVariants = cva(
  [
    "group/button relative inline-flex shrink-0 select-none items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold",
    "transition-[background-color,color,border-color,box-shadow,transform] duration-200 ease-out",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  ].join(" "),
  {
    variants: {
      variant: {
        // button-primary: verde MongoDB com texto teal profundo.
        default: "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-hover",
        // button-secondary-on-dark: pílula vazada com contorno fino.
        outline:
          "border border-foreground/30 bg-transparent text-foreground hover:border-foreground/70 hover:bg-foreground/5",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        // button-ghost: retângulo de raio 8px, sem fundo em repouso.
        ghost: "rounded-md text-foreground hover:bg-accent hover:text-accent-foreground",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        // button-link: texto sublinhado, traço na cor da marca.
        link: "h-auto rounded-sm px-0 font-medium text-foreground underline decoration-primary/60 decoration-1 underline-offset-[0.3em] hover:decoration-primary hover:decoration-2 active:scale-100",
      },
      size: {
        default: "h-11 px-[22px] text-sm",
        sm: "h-9 px-4 text-[13px]",
        lg: "h-12 px-7 text-base",
        icon: "size-11",
      },
    },
    compoundVariants: [{ variant: "link", className: "h-auto px-0" }],
    defaultVariants: { variant: "default", size: "default" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
