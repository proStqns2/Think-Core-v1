import * as React from "react";
import { cn } from "@/lib/utils";

export const Logo = React.forwardRef<SVGSVGElement, React.SVGProps<SVGSVGElement>>(
  ({ className, ...props }, ref) => (
    <svg
      ref={ref}
      viewBox="0 0 100 100"
      className={cn("w-8 h-8", className)}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g transform="translate(5, 5) scale(0.9)">
        <polygon
          points="50,0 100,28 50,56 0,28"
          fill="hsl(var(--primary) / 0.5)"
        />
        <polygon points="0,28 50,56 50,100 0,72" fill="hsl(var(--primary))" />
        <polygon
          points="50,56 100,28 100,72 50,100"
          fill="hsl(var(--primary) / 0.7)"
        />

        {/* Cuts on left face */}
        <polygon points="10,39 40,56 40,66 10,49" fill="hsl(var(--background))" />
        <polygon points="10,61 40,78 40,88 10,71" fill="hsl(var(--background))" />

        {/* Cuts on top face */}
        <polygon points="20,14 60,14 70,22 30,22" fill="hsl(var(--background))" />
        <polygon points="60,36 20,36 30,44 70,44" fill="hsl(var(--background))" />
        
          {/* Cuts on right face */}
        <polygon points="60,39 90,22 90,32 60,49" fill="hsl(var(--background))" />
        <polygon points="60,70 90,53 90,63 60,80" fill="hsl(var(--background))" />

      </g>
    </svg>
  )
);
Logo.displayName = "Logo";
