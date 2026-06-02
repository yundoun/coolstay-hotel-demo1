import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/ui/lib/cn";

/**
 * Button variants built on top of existing .btn CSS classes in globals.css.
 * Uses CVA for type-safe variant composition.
 */
const buttonVariants = cva("btn", {
  variants: {
    variant: {
      primary: "btn-primary",
      secondary: "btn-secondary",
      tertiary: "btn-tertiary",
    },
    size: {
      default: "",
      sm: "btn-sm",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "default",
  },
});

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
);
Button.displayName = "Button";

export { Button, buttonVariants };
export type { ButtonProps };
