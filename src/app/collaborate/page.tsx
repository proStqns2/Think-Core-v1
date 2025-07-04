'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Sidebar } from '@/components/sidebar';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { nanoid } from 'nanoid';
import { ArrowRight, Bot, Github, Loader2, User, Gitlab } from 'lucide-react';
import { CollaborationLogo } from '@/components/ui/collaboration-logo';
import CollaborationAnimation from '@/components/collaboration-animation';
import { AzureDevopsLogo } from '@/components/ui/azure-devops-logo';
import { collaborationChatResponse } from '@/ai/flows/collaboration-chat-response';


type CollabMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

export default function CollaboratePage() {
  const [messages, setMessages] = React.useState<CollabMessage[]>([]);
  const [input, setInput] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();
  const viewportRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    document.body.classList.add('collaboration-mode');
    document.body.classList.remove('advanced-mode', 'imagera-mode', 'cuda-mode');
    return () => {
      document.body.classList.remove('collaboration-mode');
    };
  }, []);
  
  React.useEffect(() => {
    viewportRef.current?.scrollTo({ top: viewportRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isLoading]);
  
  const handleConnect = (service: string) => {
    toast({
      title: 'Feature not implemented',
      description: `${service} connection is not yet available.`,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: CollabMessage = { id: nanoid(), role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      const { response } = await collaborationChatResponse({ prompt: currentInput });
      const assistantMessage: CollabMessage = { id: nanoid(), role: 'assistant', content: response };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      toast({
        title: 'Error',
        description: 'Failed to get a response from the AI. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-background">
      <CollaborationAnimation />
      <Sidebar />
      <div className="relative z-10 flex h-screen flex-1 pl-16">
        {/* Chat Panel */}
        <div className="flex w-2/3 flex-col border-r border-border/20">
          <header className="flex h-16 shrink-0 items-center gap-3 border-b border-border/20 bg-background/50 px-6 backdrop-blur-sm">
            <CollaborationLogo className="h-7 w-7 text-primary" />
            <h1 className="text-xl font-semibold tracking-tight">Collaboration Hub</h1>
          </header>
          <main className="flex-1 overflow-hidden">
            <ScrollArea className="h-full" viewportRef={viewportRef}>
              <div className="mx-auto max-w-4xl space-y-8 p-4 md:p-6 lg:p-8">
                {messages.length === 0 && !isLoading ? (
                   <div className="flex h-[calc(100vh-17rem)] flex-col items-center justify-center rounded-lg p-12 text-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                       <CollaborationLogo className="h-10 w-10 text-primary" />
                    </div>
                    <h2 className="text-3xl font-semibold tracking-tight">Team Collaboration Space</h2>
                    <p className="mt-2 text-lg text-muted-foreground">
                      Chat with your team and connect to your favorite dev tools.
                    </p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div key={message.id} className={cn('group flex w-full items-start gap-4', message.role === 'user' && 'justify-end')}>
                      {message.role === 'assistant' && (
                        <Avatar className="h-9 w-9 border bg-background shadow-sm">
                          <AvatarFallback><Bot className="h-5 w-5" /></AvatarFallback>
                        </Avatar>
                      )}
                      <div className={cn('max-w-2xl rounded-lg p-3', message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-card/80 backdrop-blur-sm')}>
                         <p className="whitespace-pre-wrap">{message.content}</p>
                      </div>
                      {message.role === 'user' && (
                         <Avatar className="h-9 w-9 border bg-muted shadow-sm">
                          <AvatarFallback><User className="h-5 w-5 text-muted-foreground" /></AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))
                )}
                 {isLoading && (
                  <div className="flex items-start gap-4">
                     <Avatar className="h-9 w-9 border bg-background shadow-sm">
                      <AvatarFallback><Bot className="h-5 w-5 animate-pulse" /></AvatarFallback>
                    </Avatar>
                    <div className="flex items-center gap-2 rounded-lg border bg-card/80 p-3">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span className="text-sm text-muted-foreground">Thinking...</span>
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
                  placeholder="Ask your collaboration assistant..."
                  className="resize-none border-0 bg-transparent pr-12 shadow-none focus-visible:ring-0"
                  rows={1}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); e.currentTarget.form?.requestSubmit(); }
                  }}
                />
                <Button type="submit" size="icon" className="absolute bottom-3 right-3 h-8 w-8" disabled={isLoading || !input.trim()}>
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </div>
            </form>
          </footer>
        </div>
        
        {/* Connections Panel */}
        <div className="w-1/3 flex-col bg-background/30 backdrop-blur-sm">
           <header className="flex h-16 shrink-0 items-center gap-3 border-b border-border/20 px-6">
            <h2 className="text-lg font-semibold tracking-tight">Connect Services</h2>
          </header>
          <div className="space-y-6 p-6">
            <Card className="bg-card/80">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Github /> GitHub</CardTitle>
                <CardDescription>Connect your repositories for seamless integration.</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button className="w-full" onClick={() => handleConnect('GitHub')}>Connect</Button>
              </CardFooter>
            </Card>
            <Card className="bg-card/80">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Gitlab /> GitLab</CardTitle>
                <CardDescription>Link your projects and pipelines.</CardDescription>
              </CardHeader>
               <CardFooter>
                <Button className="w-full" onClick={() => handleConnect('GitLab')}>Connect</Button>
              </CardFooter>
            </Card>
            <Card className="bg-card/80">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><AzureDevopsLogo className="h-5 w-5" /> Azure DevOps</CardTitle>
                <CardDescription>Integrate your boards and repos from Azure.</CardDescription>
              </CardHeader>
               <CardFooter>
                <Button className="w-full" onClick={() => handleConnect('Azure DevOps')}>Connect</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
