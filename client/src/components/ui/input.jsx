// src/components/ui/input.jsx
import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef(({ className, type = "text", ...props }, ref) => {
  return (
    <input
      type={type}
      ref={ref}
      className={cn(
        [
          "flex h-9 w-full",
          "rounded-[var(--radius)]",
          "border border-[hsl(var(--border))]",
          "bg-[hsl(var(--card))] text-[hsl(var(--foreground))]",
          "placeholder:text-[hsl(var(--muted-foreground))]",
          "px-3 py-1 text-sm shadow-sm",
          "transition-[border,box-shadow,background,color] duration-150",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-[hsl(var(--foreground))]",
          "focus-visible:outline-none",
          "focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))]",
          "focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--background))]",
          "disabled:cursor-not-allowed disabled:opacity-50",
        ].join(" "),
        className
      )}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };
