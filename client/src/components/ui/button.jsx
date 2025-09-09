// src/components/ui/button.jsx
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 select-none",
    "whitespace-nowrap",
    "rounded-[var(--radius)] text-sm font-medium",
    "transition-[background,box-shadow,transform,color] duration-150",
    "focus-visible:outline-none",
    "focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))]",
    "focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--background))]",
    "disabled:pointer-events-none disabled:opacity-50",
    "active:translate-y-[1px]",
  ].join(" "),
  {
    variants: {
      variant: {
        default: [
          "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]",
          "shadow-sm hover:shadow-md",
          "hover:brightness-[1.02]",
        ].join(" "),
        destructive: [
          "bg-[hsl(var(--destructive))] text-[hsl(var(--destructive-foreground))]",
          "shadow-sm hover:bg-[hsl(var(--destructive))]/90",
        ].join(" "),
        outline: [
          "border border-[hsl(var(--border))]",
          "bg-[hsl(var(--card))] text-[hsl(var(--foreground))]",
          "shadow-sm hover:bg-[hsl(var(--secondary))]",
        ].join(" "),
        secondary: [
          "bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))]",
          "border border-[hsl(var(--border))]",
          "shadow-sm hover:bg-[hsl(var(--secondary))]/80",
        ].join(" "),
        ghost: [
          "bg-transparent",
          "text-[hsl(var(--foreground))]",
          "hover:bg-[hsl(var(--secondary))]",
        ].join(" "),
        link: [
          "bg-transparent",
          "text-[hsl(var(--primary))] underline-offset-4 hover:underline",
        ].join(" "),
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-[calc(var(--radius)-2px)] px-3 text-xs",
        lg: "h-10 rounded-[calc(var(--radius)+2px)] px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
