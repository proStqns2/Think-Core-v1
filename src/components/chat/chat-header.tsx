import Link from 'next/link';
import {
  MessageSquareQuote,
  Download,
  FilePlus,
  Coins,
  Home,
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
    <header className="flex h-14 items-center justify-between gap-4 border-b bg-background/50 px-4 backdrop-blur-sm">
      {/* Left side: Tabs */}
      <div className="flex items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href="/">
                <Button variant="ghost" size="icon">
                  <Home className="h-5 w-5" />
                  <span className="sr-only">Home</span>
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>Back to Home</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div className="flex items-center gap-2 rounded-md bg-muted/50 p-1 pr-3">
          <div
            className={cn(
              'h-2 w-2 rounded-full',
              isAdvanced ? 'bg-blue-500' : 'bg-green-500'
            )}
          />
          <span className="text-sm font-medium text-foreground">
            EloquentAI Chat
          </span>
        </div>
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

        <Separator orientation="vertical" className="h-6" />

        <ThemeToggle />
        
        <Separator orientation="vertical" className="h-6" />

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
