import Link from 'next/link';
import {
  MessageSquareQuote,
  Download,
  Upload,
  ChevronDown,
  BrainCircuit,
  Star,
  FilePlus,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Logo } from '../ui/logo';

interface ChatHeaderProps {
  mode: string;
  onModeChange: (mode: string) => void;
  onSummarize: () => void;
  onExport: () => void;
  onNewChat: () => void;
}

export function ChatHeader({
  mode,
  onModeChange,
  onSummarize,
  onExport,
  onNewChat,
}: ChatHeaderProps) {
  return (
    <header className="flex items-center justify-between p-4 border-b bg-background/50 backdrop-blur-sm">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="gap-1.5 pl-1.5 text-base md:text-lg"
          >
            <Logo className="h-6 w-6 text-primary shrink-0" />
            <span className="font-bold tracking-tight">EloquentAI</span>
            <span className="text-muted-foreground font-normal capitalize">
              {mode}
            </span>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-60">
          <DropdownMenuLabel>Select a model</DropdownMenuLabel>
          <DropdownMenuRadioGroup value={mode} onValueChange={onModeChange}>
            <DropdownMenuRadioItem value="standard">
              <div className="flex items-center gap-3">
                <BrainCircuit className="h-5 w-5" />
                <div className="flex flex-col">
                  <span className="font-semibold">Standard</span>
                  <span className="text-xs text-muted-foreground">
                    For everyday tasks
                  </span>
                </div>
              </div>
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="advanced">
              <div className="flex items-center gap-3">
                <Star className="h-5 w-5" />
                <div className="flex flex-col">
                  <span className="font-semibold">Advanced</span>
                  <span className="text-xs text-muted-foreground">
                    Our most capable model
                  </span>
                </div>
              </div>
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="flex items-center gap-4">
        <nav className="hidden md:flex items-center gap-4 text-sm font-medium">
          <Link
            href="/login"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Sign Up
          </Link>
        </nav>
        <Separator orientation="vertical" className="h-6 hidden md:block" />
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
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" disabled>
                  <Upload className="h-5 w-5" />
                  <span className="sr-only">Upload File</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Upload File (coming soon)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Separator orientation="vertical" className="h-6" />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
