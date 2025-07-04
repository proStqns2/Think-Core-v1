import Link from 'next/link';
import {
  BrainCircuit,
  Github,
  Users,
} from 'lucide-react';
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
import { CollaborationLogo } from './ui/collaboration-logo';


export function Sidebar() {
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
        <Separator className="w-4/5" />
      </div>

      <nav className="flex flex-1 flex-col items-center gap-2 p-2">
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Link href="/chat?mode=standard">
                        <Button variant="ghost" size="icon" aria-label="Standard Chat">
                            <BrainCircuit className="h-5 w-5" />
                        </Button>
                    </Link>
                </TooltipTrigger>
                <TooltipContent side="right">Standard Chat</TooltipContent>
            </Tooltip>

            <Tooltip>
                <TooltipTrigger asChild>
                    <Link href="/cuda">
                        <Button variant="outline" size="icon" className="bg-sidebar-accent text-sidebar-accent-foreground" aria-label="Cuda">
                            <CudaLogo className="h-7 w-7" />
                        </Button>
                    </Link>
                </TooltipTrigger>
                <TooltipContent side="right">Cuda (Code)</TooltipContent>
            </Tooltip>
          
            <Tooltip>
                <TooltipTrigger asChild>
                    <Link href="/imagera">
                        <Button variant="ghost" size="icon" aria-label="Imagera">
                            <ImageraLogo className="h-6 w-6" />
                        </Button>
                    </Link>
                </TooltipTrigger>
                <TooltipContent side="right">Imagera (Image)</TooltipContent>
            </Tooltip>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Link href="/collaborate">
                        <Button variant="ghost" size="icon" aria-label="Collaborate">
                            <Users className="h-5 w-5" />
                        </Button>
                    </Link>
                </TooltipTrigger>
                <TooltipContent side="right">Collaborate</TooltipContent>
            </Tooltip>
        </TooltipProvider>
      </nav>
      
      <div className="mt-auto flex flex-col items-center gap-2 p-2">
        <ThemeToggle />
         <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Link href="https://github.com/ManimCommunity/manim.git" target="_blank">
                        <Button variant="ghost" size="icon" aria-label="GitHub">
                            <Github className="h-5 w-5" />
                        </Button>
                    </Link>
                </TooltipTrigger>
                <TooltipContent side="right">Inspired by Manim</TooltipContent>
            </Tooltip>
        </TooltipProvider>
        <Avatar className="h-9 w-9">
            <AvatarFallback>R</AvatarFallback>
        </Avatar>
      </div>
    </aside>
  );
}
