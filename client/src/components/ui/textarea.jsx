// src/components/ui/textarea.jsx
import * as React from "react";
import { cn } from "@/lib/utils";

const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        [
          "flex min-h-[100px] w-full",
          "rounded-[var(--radius)]",
          "border border-[hsl(var(--border))]",
          "bg-[hsl(var(--card))] text-[hsl(var(--foreground))]",
          "placeholder:text-[hsl(var(--muted-foreground))]",
          "px-3 py-2 text-sm shadow-sm",
          "transition-[border,box-shadow,background,color] duration-150",
          "focus-visible:outline-none",
          "focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))]",
          "focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--background))]",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "resize-y",
        ].join(" "),
        className
      )}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
