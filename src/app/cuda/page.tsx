'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { CudaLogo } from '@/components/ui/cuda-logo';
import { ArrowRight, Bot, User, Copy, Loader2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { cudaCodeResponse } from '@/ai/flows/cuda-code-response';
import { nanoid } from 'nanoid';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import CodeNetworkAnimation from '@/components/code-network-animation';
import { Sidebar } from '@/components/sidebar';

type CudaMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

function CudaPageContent() { // Renamed and extracted content
  const [messages, setMessages] = React.useState<CudaMessage[]>([]);
  const [input, setInput] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();
  const viewportRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    document.body.classList.add('cuda-mode');
    document.body.classList.remove('advanced-mode', 'imagera-mode', 'collaboration-mode');
    return () => {
      document.body.classList.remove('cuda-mode');
    };
  }, []);
  
  React.useEffect(() => {
    const viewport = viewportRef.current;
    if (viewport) {
      viewport.scrollTo({
        top: viewport.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, isLoading]);

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
      const assistantMessage: CudaMessage = { id: nanoid(), role: 'assistant', content: 'Sorry, there was an error generating the code.' };
      setMessages((prev) => [...prev, assistantMessage]);
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
    <div className="flex h-screen w-full bg-background">
        <CodeNetworkAnimation />
        <Sidebar />
      <div className="relative z-10 flex h-screen flex-1 flex-col pl-16">
         <header className="flex h-16 shrink-0 items-center gap-4 border-b border-border/20 bg-background/50 px-6 backdrop-blur-sm">
          <CudaLogo className="h-8 w-8 text-primary" />
          <h1 className="text-xl font-semibold tracking-tight">Cuda Code Generation</h1>
        </header>
        <main className="flex-1 overflow-hidden">
          <ScrollArea className="h-full" viewportRef={viewportRef}>
            <div className="mx-auto max-w-4xl space-y-8 p-4 md:p-6 lg:p-8">
              {messages.length === 0 && !isLoading ? (
                <div className="flex h-[calc(100vh-19rem)] flex-col items-center justify-center rounded-lg p-12 text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <CudaLogo className="h-10 w-10 text-primary" />
                  </div>
                  <h2 className="text-3xl font-semibold tracking-tight">Cuda Code Generation</h2>
                  <p className="mt-2 text-lg text-muted-foreground">
                    Generate code snippets in React, Rust, and more.
                  </p>
                   <p className="mt-4 text-sm text-muted-foreground">
                      Try asking: <em className='text-foreground/80'>"Write a Rust function to find the median of a vector"</em>
                    </p>
                </div>
              ) : (
                messages.map((message) => (
                  <div key={message.id} className={cn('group flex w-full items-start gap-4', message.role === 'user' && 'justify-end')}>
                    {message.role === 'assistant' && (
                      <Avatar className="h-9 w-9 border bg-background shadow-sm">
                        <AvatarFallback>
                          <CudaLogo className="h-6 w-6" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div className={cn('max-w-2xl rounded-lg', message.role === 'user' ? 'bg-primary p-3 text-primary-foreground' : 'border bg-card/80 backdrop-blur-sm')}>
                      {message.role === 'user' ? (
                        <p className="whitespace-pre-wrap p-1">{message.content}</p>
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
                            <code>{message.content.replace(/```.*\n|```/g, '')}</code>
                          </pre>
                        </div>
                      )}
                    </div>
                    {message.role === 'user' && (
                       <Avatar className="h-9 w-9 border bg-muted shadow-sm">
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
                  <Avatar className="h-9 w-9 border bg-background shadow-sm">
                     <AvatarFallback>
                        <CudaLogo className="h-6 w-6 animate-pulse" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex items-center gap-2 rounded-lg border bg-card/80 p-3">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span className="text-sm text-muted-foreground">Generating...</span>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </main>

        <footer className="shrink-0 bg-transparent p-4">
          <form onSubmit={handleSubmit} className="mx-auto max-w-4xl">
            <div className="relative rounded-lg border bg-card/80 p-2 shadow-lg backdrop-blur-sm focus-within:ring-2 focus-within:ring-primary/80">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="e.g., 'Write a React hook to fetch data from an API'"
                className="resize-none border-0 bg-transparent pr-12 shadow-none focus-visible:ring-0"
                rows={1}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    e.currentTarget.form?.requestSubmit();
                  }
                }}
              />
              <Button type="submit" size="icon" className="absolute bottom-3 right-3 h-8 w-8" disabled={isLoading || !input.trim()}>
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          </form>
        </footer>
      </div>
    </div>
  );
}

function LoadingCudaFallback() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
    </div>
  );
}

export default function CudaPage() {
  return (
    <React.Suspense fallback={<LoadingCudaFallback />}>
      <CudaPageContent />
    </React.Suspense>
  );
}
