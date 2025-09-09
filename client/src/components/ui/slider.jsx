// src/components/ui/slider.jsx
import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

const Slider = React.forwardRef(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      "data-[disabled]:opacity-50 data-[disabled]:pointer-events-none",
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track
      className={cn(
        "relative h-1.5 w-full grow overflow-hidden rounded-full",
        "bg-[hsl(var(--secondary))]",
        "border border-[hsl(var(--border))]"
      )}
    >
      <SliderPrimitive.Range className="absolute h-full bg-[hsl(var(--primary))]" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb
      className={cn(
        "block h-4 w-4 rounded-full",
        "bg-[hsl(var(--card))] border border-[hsl(var(--border))]",
        "shadow-sm transition-all duration-150",
        "hover:shadow-md active:scale-95",
        "focus-visible:outline-none",
        "focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))]",
        "focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--background))]",
        "data-[disabled]:pointer-events-none"
      )}
    />
  </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
