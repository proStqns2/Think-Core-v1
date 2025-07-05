'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { BrainCircuit, Github, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ThemeToggle } from '@/components/theme-toggle';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { CudaLogo } from '@/components/ui/cuda-logo';
import { ImageraLogo } from '@/components/ui/imagera-logo';
import { Logo } from '@/components/ui/logo';
import { cn } from '@/lib/utils';
import { CollaborationLogo } from './ui/collaboration-logo';

const navItems = [
  { href: '/chat', label: 'Standard Chat', icon: Logo, iconClassName: 'h-6 w-6', query: { mode: 'standard' } },
  { href: '/chat', label: 'Advanced Chat', icon: BrainCircuit, iconClassName: 'h-5 w-5', query: { mode: 'advanced' } },
  { href: '/cuda', label: 'Cuda (Code)', icon: CudaLogo, iconClassName: 'h-7 w-7' },
  { href: '/imagera', label: 'Imagera (Image)', icon: ImageraLogo, iconClassName: 'h-6 w-6' },
  { href: '/collaborate', label: 'Collaborate', icon: CollaborationLogo, iconClassName: 'h-6 w-6' },
];

export function Sidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  return (
    <aside className="fixed inset-y-0 left-0 z-20 flex h-full w-16 flex-col border-r bg-sidebar text-sidebar-foreground">
      <div className="flex flex-col items-center p-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href="/">
                <Button variant="ghost" size="icon" className="mb-2">
                  <Logo className="h-7 w-7" />
                  <span className="sr-only">Home</span>
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Home</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Separator className="bg-sidebar-border" />
      </div>

      <nav className="flex flex-1 flex-col items-center gap-2 p-2">
        <TooltipProvider>
          {navItems.map((item) => {
            const currentMode = searchParams.get('mode');
            let isActive: boolean;

            if (item.href === '/chat') {
              // This logic handles the two chat modes correctly
              isActive = pathname === '/chat' && currentMode === item.query?.mode;
            } else {
              isActive = pathname.startsWith(item.href);
            }
            
            const Icon = item.icon;
            return (
              <Tooltip key={item.label}>
                <TooltipTrigger asChild>
                  <Link href={{ pathname: item.href, query: item.query }}>
                    <Button
                      variant={isActive ? 'secondary' : 'ghost'}
                      size="icon"
                      aria-label={item.label}
                      className={cn(
                        'text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground',
                        isActive && 'bg-sidebar-accent text-sidebar-accent-foreground'
                      )}
                    >
                      <Icon className={item.iconClassName} />
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">{item.label}</TooltipContent>
              </Tooltip>
            );
          })}
        </TooltipProvider>
      </nav>

      <div className="mt-auto flex flex-col items-center gap-2 p-2">
        <ThemeToggle />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="https://github.com/proStqns2/Think_Core_AI"
                target="_blank"
              >
                <Button variant="ghost" size="icon" aria-label="GitHub">
                  <Github className="h-5 w-5" />
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">View on GitHub</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Avatar className="h-9 w-9">
          <AvatarFallback>R</AvatarFallback>
        </Avatar>
      </div>
    </aside>
  );
}
