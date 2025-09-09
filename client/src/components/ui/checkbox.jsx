// src/components/ui/checkbox.jsx
import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";

const Checkbox = React.forwardRef(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      [
        "peer h-4 w-4 shrink-0",
        "rounded-[calc(var(--radius)-4px)]",
        "border border-[hsl(var(--border))]",
        "bg-[hsl(var(--card))] text-[hsl(var(--foreground))]",
        "shadow-sm",
        "transition-[background,border,color,box-shadow,transform] duration-150",
        "focus-visible:outline-none",
        "focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))]",
        "focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--background))]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "data-[state=checked]:bg-[hsl(var(--primary))] data-[state=checked]:text-[hsl(var(--primary-foreground))] data-[state=checked]:border-[hsl(var(--primary))]",
        "data-[state=indeterminate]:bg-[hsl(var(--primary))] data-[state=indeterminate]:text-[hsl(var(--primary-foreground))] data-[state=indeterminate]:border-[hsl(var(--primary))]",
      ].join(" "),
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
      <CheckIcon className="h-3.5 w-3.5" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
