import * as React from "react";
import { cn } from "@/lib/utils";

export const CollaborationLogo = React.forwardRef<SVGSVGElement, React.SVGProps<SVGSVGElement>>(
  ({ className, ...props }, ref) => (
    <svg
      ref={ref}
      viewBox="0 0 100 100"
      className={cn("w-8 h-8", className)}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
        <defs>
            <linearGradient id="collabGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{stopColor: 'hsl(var(--accent))'}} />
            <stop offset="100%" style={{stopColor: 'hsl(var(--primary))'}} />
            </linearGradient>
        </defs>
        
        {/* Left Shape */}
        <path 
            d="M 50 10 C 20 10, 10 40, 10 50 C 10 60, 20 90, 50 90" 
            fill="url(#collabGradient)"
            stroke="hsl(var(--primary-foreground) / 0.2)"
            strokeWidth="2"
        />
        
        {/* Right Shape (mirrored) */}
        <path 
            d="M 50 10 C 80 10, 90 40, 90 50 C 90 60, 80 90, 50 90" 
            fill="url(#collabGradient)"
            stroke="hsl(var(--primary-foreground) / 0.2)"
            strokeWidth="2"
        />

        {/* Center Connection Lines */}
        <line x1="40" y1="30" x2="60" y2="30" stroke="hsl(var(--primary-foreground))" strokeWidth="3" strokeLinecap="round" />
        <line x1="35" y1="50" x2="65" y2="50" stroke="hsl(var(--primary-foreground))" strokeWidth="3" strokeLinecap="round" />
        <line x1="40" y1="70" x2="60" y2="70" stroke="hsl(var(--primary-foreground))" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
);
CollaborationLogo.displayName = "CollaborationLogo";
