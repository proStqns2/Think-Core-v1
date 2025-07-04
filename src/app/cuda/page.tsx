'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { CudaLogo } from '@/components/ui/cuda-logo';
import LetterGlitch from '@/components/letter-glitch';
import { ArrowRight, Bot, User, Copy, Loader2, Sparkles } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { cudaCodeResponse } from '@/ai/flows/cuda-code-response';
import { nanoid } from 'nanoid';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import Link from 'next/link';

type CudaMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

export default function CudaPage() {
  const [messages, setMessages] = React.useState<CudaMessage[]>([]);
  const [input, setInput] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    document.body.classList.add('cuda-mode');
    document.body.classList.remove('advanced-mode', 'imagera-mode');
    return () => {
      document.body.classList.remove('cuda-mode');
    };
  }, []);
  
  React.useEffect(() => {
    const viewport = scrollAreaRef.current?.querySelector('div[data-radix-scroll-area-viewport]');
    if (viewport) {
      viewport.scrollTo({
        top: viewport.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: CudaMessage = { id: nanoid(), role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      const { code } = await cudaCodeResponse({ prompt: currentInput });
      const assistantMessage: CudaMessage = { id: nanoid(), role: 'assistant', content: code };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error generating code:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate code. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (content: string) => {
    const codeToCopy = content.replace(/```.*\n/g, '').replace(/```/g, '');
    navigator.clipboard.writeText(codeToCopy);
    toast({
      title: 'Copied!',
      description: 'The code has been copied to your clipboard.',
    });
  };

  return (
    <div className="relative h-screen">
      <LetterGlitch
        glitchColors={['#ff8c00', '#e67300', '#ffa500']}
        glitchSpeed={50}
        centerVignette={false}
        outerVignette={true}
        smooth={true}
      />
      <div className="relative z-10 flex h-screen flex-col bg-transparent">
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-orange-500/20 px-4">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <CudaLogo className="h-8 w-8" />
            <span className="text-lg">Cuda Code Generation</span>
          </Link>
        </header>

        <main className="flex-1 overflow-hidden">
          <ScrollArea className="h-full" ref={scrollAreaRef}>
            <div className="mx-auto max-w-4xl space-y-8 p-4 md:p-6">
              {messages.length === 0 && !isLoading ? (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-orange-500/30 p-12 text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <Sparkles className="h-8 w-8 text-primary" />
                  </div>
                  <h2 className="text-2xl font-semibold">Welcome to Cuda</h2>
                  <p className="mt-2 text-muted-foreground">
                    Ask for any code snippet, function, or component you need.
                  </p>
                </div>
              ) : (
                messages.map((message) => (
                  <div key={message.id} className={cn('group flex items-start gap-4', message.role === 'user' && 'justify-end')}>
                    {message.role === 'assistant' && (
                      <Avatar className="h-9 w-9 border bg-background">
                        <AvatarFallback>
                          <Bot className="h-5 w-5 text-primary" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div className={cn('max-w-2xl rounded-lg', message.role === 'user' ? 'bg-primary p-3 text-primary-foreground' : 'bg-card')}>
                      {message.role === 'user' ? (
                        <p className="whitespace-pre-wrap">{message.content}</p>
                      ) : (
                        <div className="relative">
                           <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-1 top-1 h-7 w-7 opacity-0 transition-opacity group-hover:opacity-100"
                            onClick={() => handleCopy(message.content)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <pre className="overflow-x-auto rounded-md bg-black/80 p-4 font-code text-sm text-green-300">
                            <code>{message.content.replace(/```.*\n/g, '').replace(/```/g, '')}</code>
                          </pre>
                        </div>
                      )}
                    </div>
                    {message.role === 'user' && (
                       <Avatar className="h-9 w-9 border bg-muted">
                        <AvatarFallback>
                          <User className="h-5 w-5 text-muted-foreground" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))
              )}
               {isLoading && (
                <div className="flex items-start gap-4">
                  <Avatar className="h-9 w-9 border bg-background">
                    <AvatarFallback>
                      <Bot className="h-5 w-5 text-primary" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="rounded-lg bg-card p-3">
                    <Loader2 className="h-5 w-5 animate-spin" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </main>

        <footer className="shrink-0 border-t border-orange-500/20 bg-transparent p-4">
          <form onSubmit={handleSubmit} className="mx-auto max-w-4xl">
            <div className="relative">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="e.g., 'Write a React hook to fetch data from an API'"
                className="resize-none rounded-lg pr-12 min-h-[48px] bg-background/80"
                rows={1}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    e.currentTarget.form?.requestSubmit();
                  }
                }}
              />
              <Button type="submit" size="icon" className="absolute bottom-2 right-2 h-8 w-8" disabled={isLoading || !input.trim()}>
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          </form>
        </footer>
      </div>
    </div>
  );
}
