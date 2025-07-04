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
      <g>
        <rect width="100" height="100" rx="15" fill="hsl(var(--primary))" />
        <path d="M 20 0 V 20 M 40 0 V 20 M 60 0 V 20 M 80 0 V 20" stroke="hsl(var(--primary-foreground))" strokeWidth="4" opacity="0.5"/>
        <path d="M 20 100 V 80 M 40 100 V 80 M 60 100 V 80 M 80 100 V 80" stroke="hsl(var(--primary-foreground))" strokeWidth="4" opacity="0.5"/>
        <path d="M 0 20 H 20 M 0 40 H 20 M 0 60 H 20 M 0 80 H 20" stroke="hsl(var(--primary-foreground))" strokeWidth="4" opacity="0.5"/>
        <path d="M 100 20 H 80 M 100 40 H 80 M 100 60 H 80 M 100 80 H 80" stroke="hsl(var(--primary-foreground))" strokeWidth="4" opacity="0.5"/>
        <style>{`.cuda-logo-text { font-family: monospace; font-weight: bold; font-size: 45px; fill: hsl(var(--primary-foreground)); }`}</style>
        <text x="50" y="62" textAnchor="middle" className="cuda-logo-text">
          &lt;/&gt;
        </text>
      </g>
    </svg>
  )
);
CudaLogo.displayName = "CudaLogo";
