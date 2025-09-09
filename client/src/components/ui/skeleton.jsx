// src/components/ui/skeleton.jsx
import * as React from "react";
import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "animate-pulse",
        "rounded-[var(--radius)]",
        "bg-[hsl(var(--secondary))]",
        "border border-[hsl(var(--border))]",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
