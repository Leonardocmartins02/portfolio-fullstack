import { cn } from "@/lib/utils";

// Skeleton do shadcn com o brilho que corre (.skeleton-shimmer em globals.css).
// Só decoração: o estado de carregamento é anunciado por quem o usa.
function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden="true"
      className={cn("skeleton-shimmer rounded-md bg-foreground/[0.08]", className)}
      {...props}
    />
  );
}

export { Skeleton };
