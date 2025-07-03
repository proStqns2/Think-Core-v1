import Link from 'next/link';
import {
  MessageSquareQuote,
  Download,
  Upload,
  User,
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
      <h1 className="text-xl font-bold tracking-tight text-primary">EloquentAI</h1>
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
        <Link href="/login" passHref>
          <Button variant="ghost" size="icon" asChild>
            <div>
              <User className="h-5 w-5" />
              <span className="sr-only">Login/Signup</span>
            </div>
          </Button>
        </Link>
      </div>
    </header>
  );
}
