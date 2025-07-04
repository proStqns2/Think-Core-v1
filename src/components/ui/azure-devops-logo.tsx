import * as React from "react";
import { cn } from "@/lib/utils";

export const AzureDevopsLogo = React.forwardRef<SVGSVGElement, React.SVGProps<SVGSVGElement>>(
  ({ className, ...props }, ref) => (
    <svg 
      ref={ref}
      viewBox="0 0 24 24" 
      xmlns="http://www.w3.org/2000/svg" 
      className={cn("w-6 h-6", className)}
      {...props}
      fill="currentColor"
    >
        <path d="M18.258 8.143L12.39 2.275a1.53 1.53 0 00-2.164 0L.734 11.767a.51.51 0 00.36.868h3.35L14.73 2.35l7.153 7.153a.51.51 0 00.36-.86zM5.21 13.518l5.868 5.868a1.53 1.53 0 002.164 0l9.492-9.492a.51.51 0 00-.36-.868h-3.35L8.73 19.313l-4.286-4.287a.51.51 0 00-.868.36v7.154a.51.51 0 00.868.36L23.27 3.348a.51.51 0 00-.36-.868h-7.153l-4.286 4.286-1.02-1.02L5.21 1.46V13.52z"/>
    </svg>
  )
);
AzureDevopsLogo.displayName = "AzureDevopsLogo";
