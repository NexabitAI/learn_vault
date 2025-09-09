// src/components/ui/tabs.jsx
import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      [
        "inline-flex h-9 items-center justify-center gap-1",
        "rounded-[var(--radius)]",
        "bg-[hsl(var(--secondary))] text-[hsl(var(--muted-foreground))]",
        "p-1",
        "border border-[hsl(var(--border))]",
      ].join(" "),
      className
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      [
        "inline-flex items-center justify-center whitespace-nowrap",
        "rounded-[calc(var(--radius)-6px)]",
        "px-3 py-1 text-sm font-medium",
        "transition-all",
        "focus-visible:outline-none",
        "focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))]",
        "focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--background))]",
        "disabled:pointer-events-none disabled:opacity-50",
        "data-[state=inactive]:text-[hsl(var(--muted-foreground))]",
        "data-[state=active]:bg-[hsl(var(--card))] data-[state=active]:text-[hsl(var(--foreground))] data-[state=active]:shadow-sm",
        "border border-transparent data-[state=active]:border-[hsl(var(--border))]",
      ].join(" "),
      className
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      [
        "mt-2",
        "focus-visible:outline-none",
        "focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))]",
        "focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--background))]",
      ].join(" "),
      className
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
