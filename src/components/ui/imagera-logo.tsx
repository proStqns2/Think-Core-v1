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
        <defs>
            <radialGradient id="grad1" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" style={{stopColor: 'hsl(var(--accent))', stopOpacity:1}} />
            <stop offset="100%" style={{stopColor: 'hsl(var(--primary))', stopOpacity:1}} />
            </radialGradient>
        </defs>
        {/* Camera Body */}
        <rect x="10" y="10" width="80" height="80" rx="15" style={{ fill: 'hsl(var(--card-foreground))' }} />
        <rect x="5" y="18" width="10" height="15" rx="5" style={{ fill: 'hsl(var(--card-foreground))' }} />

        {/* Lens Outer Ring */}
        <circle cx="50" cy="50" r="35" style={{ fill: 'hsl(var(--background))' }} />

        {/* Colorful Iris */}
        <circle cx="50" cy="50" r="30" fill="url(#grad1)" />

        {/* Aperture blades */}
        <path d="M50 20 L35 43 H65 Z" style={{ fill: 'hsla(var(--background-hsl, 0 0% 0%) / 0.5)' }} />
        <path d="M29 65 L50 80 L50 60 Z" transform="rotate(60 50 50)" style={{ fill: 'hsla(var(--background-hsl, 0 0% 0%) / 0.5)' }} />
        <path d="M29 65 L50 80 L50 60 Z" transform="rotate(120 50 50)" style={{ fill: 'hsla(var(--background-hsl, 0 0% 0%) / 0.5)' }} />
        <path d="M29 65 L50 80 L50 60 Z" transform="rotate(180 50 50)" style={{ fill: 'hsla(var(--background-hsl, 0 0% 0%) / 0.5)' }} />
        <path d="M29 65 L50 80 L50 60 Z" transform="rotate(240 50 50)" style={{ fill: 'hsla(var(--background-hsl, 0 0% 0%) / 0.5)' }} />
        <path d="M29 65 L50 80 L50 60 Z" transform="rotate(300 50 50)" style={{ fill: 'hsla(var(--background-hsl, 0 0% 0%) / 0.5)' }} />

        {/* Lens Pupil */}
        <circle cx="50" cy="50" r="10" style={{ fill: 'hsl(var(--background))' }} />

        {/* Glint */}
        <path d="M 60 30 A 20 20, 0, 0, 1, 70 45 A 25 25, 0, 0, 0, 60 30 Z" fill="white" opacity="0.7" />
    </svg>
  )
);
ImageraLogo.displayName = "ImageraLogo";
