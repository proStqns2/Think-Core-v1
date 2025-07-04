import * as React from "react";
import { cn } from "@/lib/utils";

export const CudaLogo = React.forwardRef<SVGSVGElement, React.SVGProps<SVGSVGElement>>(
  ({ className, ...props }, ref) => (
    <svg
      ref={ref}
      viewBox="0 0 100 100"
      className={cn("w-8 h-8", className)}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <style>{`.cuda-logo-text { font-family: monospace; font-weight: bold; font-size: 50px; fill: hsl(var(--primary-foreground)); }`}</style>
      <rect width="100" height="100" rx="15" fill="hsl(var(--primary))" />
      <text x="50" y="65" textAnchor="middle" className="cuda-logo-text">
        &lt;/&gt;
      </text>
    </svg>
  )
);
CudaLogo.displayName = "CudaLogo";
