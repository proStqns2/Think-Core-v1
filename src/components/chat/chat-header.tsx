import Link from 'next/link';
import {
  MessageSquareQuote,
  Download,
  Upload,
  BrainCircuit,
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

interface ChatHeaderProps {
  onSummarize: () => void;
  onExport: () => void;
}

export function ChatHeader({ onSummarize, onExport }: ChatHeaderProps) {
  return (
    <header className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center gap-2">
        <BrainCircuit className="h-6 w-6 text-primary" />
        <h1 className="text-xl font-bold tracking-tight text-primary">Think Code AI</h1>
      </div>
      <div className="flex items-center gap-4">
        <nav className="hidden md:flex items-center gap-4 text-sm font-medium">
          <Link href="/login" className="text-muted-foreground hover:text-foreground transition-colors">
            Login
          </Link>
          <Link href="/signup" className="text-muted-foreground hover:text-foreground transition-colors">
            Sign Up
          </Link>
        </nav>
        <Separator orientation="vertical" className="h-6 hidden md:block" />
        <div className="flex items-center gap-2">
          <TooltipProvider>
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
