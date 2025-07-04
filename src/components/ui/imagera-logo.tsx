import * as React from "react";
import { cn } from "@/lib/utils";

export const ImageraLogo = React.forwardRef<SVGSVGElement, React.SVGProps<SVGSVGElement>>(
  ({ className, ...props }, ref) => (
    <svg
      ref={ref}
      viewBox="0 0 100 100"
      className={cn("w-8 h-8", className)}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect width="100" height="100" rx="15" fill="hsl(var(--primary))" />
      <rect x="15" y="15" width="70" height="50" rx="5" fill="hsl(var(--background))" />
      <path d="M 25 55 L 45 35 L 60 50 L 75 30 L 85 45 L 85 65 L 15 65 Z" fill="hsl(var(--primary-foreground))" />
      <circle cx="75" cy="30" r="7" fill="hsl(var(--accent))" />
    </svg>
  )
);
ImageraLogo.displayName = "ImageraLogo";
