import Link from 'next/link';
import {
  MessageSquareQuote,
  Download,
  FilePlus,
  Coins,
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
import { cn } from '@/lib/utils';
import { Logo } from '@/components/ui/logo';
import { BrainCircuit } from 'lucide-react';

interface ChatHeaderProps {
  mode: string;
  onSummarize: () => void;
  onExport: () => void;
  onNewChat: () => void;
}

export function ChatHeader({
  mode,
  onSummarize,
  onExport,
  onNewChat,
}: ChatHeaderProps) {
  const isAdvanced = mode === 'advanced';

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b border-border/20 bg-background/50 px-4 backdrop-blur-sm">
      {/* Left side: Title */}
      <div className="flex items-center gap-3">
        {isAdvanced ? (
          <BrainCircuit className="h-7 w-7 text-primary" />
        ) : (
          <Logo className="h-7 w-7 text-primary" />
        )}
        <h1 className="text-xl font-semibold tracking-tight">
          {isAdvanced ? 'Advanced Chat' : 'Standard Chat'}
        </h1>
      </div>

      {/* Right side: Actions & User Info */}
      <div className="flex items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={onNewChat}>
                <FilePlus className="h-5 w-5" />
                <span className="sr-only">New Chat</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>New Chat</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={onSummarize}>
                <MessageSquareQuote className="h-5 w-5" />
                <span className="sr-only">Summarize Chat</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Summarize Chat</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={onExport}>
                <Download className="h-5 w-5" />
                <span className="sr-only">Export Chat</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Export Chat</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <Separator orientation="vertical" className="mx-2 h-6" />

        <div className="flex items-center gap-2 rounded-full bg-muted/50 p-1 pr-3">
          <Coins className="h-5 w-5 text-amber-500" />
          <span className="text-sm font-semibold">10.00</span>
        </div>

        <Avatar className="h-8 w-8">
          <AvatarFallback>R</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
