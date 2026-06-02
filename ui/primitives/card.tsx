import { forwardRef, type HTMLAttributes } from "react";

import { cn } from "@/ui/lib/cn";

/**
 * Card primitive matching the repeated pattern in demo1:
 * border border-[var(--color-line)] bg-white rounded-[2px]
 */
const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "border border-[var(--color-line)] bg-white rounded-[2px] overflow-hidden",
        className
      )}
      {...props}
    />
  )
);
Card.displayName = "Card";

const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("px-6 py-5 border-b border-[var(--color-line)]", className)}
      {...props}
    />
  )
);
CardHeader.displayName = "CardHeader";

const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("px-6 py-5", className)} {...props} />
  )
);
CardContent.displayName = "CardContent";

const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "px-6 py-4 border-t border-[var(--color-line)] bg-[var(--color-bg-soft)]",
        className
      )}
      {...props}
    />
  )
);
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardContent, CardFooter };
