'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Sidebar } from '@/components/sidebar';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { nanoid } from 'nanoid';
import { ArrowRight, Bot, Github, Loader2, User, Gitlab, Settings, GitPullRequest } from 'lucide-react';
import { CollaborationLogo } from '@/components/ui/collaboration-logo';
import CollaborationAnimation from '@/components/collaboration-animation';
import { AzureDevopsLogo } from '@/components/ui/azure-devops-logo';
import { collaborationChatResponse } from '@/ai/flows/collaboration-chat-response';


type GithubUser = {
  name: string;
  publicRepos: number;
  followers: number;
}

type GithubIssue = {
  id: number;
  title: string;
  author: string;
}

type CollabMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  data?: any;
  dataType?: 'githubUser' | 'githubIssues';
};

function GithubUserCard({ user }: { user: GithubUser }) {
  return (
    <Card className="mt-3 border-primary/20 bg-primary/5">
      <CardHeader className='pb-3'>
        <CardTitle className="flex items-center gap-2 text-base">
          <Github className="h-5 w-5" /> {user.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex gap-4 text-sm">
        <div><strong>Public Repos:</strong> {user.publicRepos}</div>
        <div><strong>Followers:</strong> {user.followers}</div>
      </CardContent>
    </Card>
  );
}

// Define a simple loading skeleton or fallback UI
function LoadingCollaborateFallback() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
    </div>
  );
}

export default function CollaboratePage() {
  return (
    <React.Suspense fallback={<LoadingCollaborateFallback />}>
      <CollaboratePageContent />
    </React.Suspense>
  );
}

function GithubIssuesList({ issues }: { issues: GithubIssue[] }) {
  return (
    <Card className="mt-3 border-primary/20 bg-primary/5">
      <CardHeader className='pb-3'>
        <CardTitle className="flex items-center gap-2 text-base">
          <GitPullRequest className="h-5 w-5" /> Open Issues
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 text-sm">
          {issues.map(issue => (
            <li key={issue.id} className="border-b border-border/50 pb-2 last:border-b-0">
              <span className="font-medium">#{issue.id}: {issue.title}</span>
              <span className="block text-xs text-muted-foreground">by {issue.author}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}


function CollaboratePageContent() { // Renamed and extracted content
  const [messages, setMessages] = React.useState<CollabMessage[]>([]);
  const [input, setInput] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();
  const viewportRef = React.useRef<HTMLDivElement>(null);
  const [connectedServices, setConnectedServices] = React.useState<Record<string, boolean>>({});

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
    const isConnected = !!connectedServices[service];
    setConnectedServices(prev => ({ ...prev, [service]: !isConnected }));
    toast({
      title: isConnected ? `${service} Disconnected` : `${service} Connected`,
      description: `You have ${isConnected ? 'disconnected from' : 'connected to'} ${service}. (Simulated)`,
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
      const result = await collaborationChatResponse({ prompt: currentInput });
      
      let dataType: 'githubUser' | 'githubIssues' | undefined = undefined;
      let data: any = undefined;

      if (result.githubUser) {
        dataType = 'githubUser';
        data = result.githubUser;
      } else if (result.githubIssues && result.githubIssues.length > 0) {
        dataType = 'githubIssues';
        data = result.githubIssues;
      }

      const assistantMessage: CollabMessage = { 
        id: nanoid(), 
        role: 'assistant', 
        content: result.responseText,
        dataType,
        data,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      toast({
        title: 'Error',
        description: 'Failed to get a response from the AI. Please try again.',
        variant: 'destructive',
      });
      const assistantMessage: CollabMessage = { id: nanoid(), role: 'assistant', content: "Sorry, I couldn't get a response. Please try again." };
      setMessages((prev) => [...prev, assistantMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-background">
      <CollaborationAnimation />
      <Sidebar /> {/* Sidebar is kept here, but if it was the one causing direct issues with useSearchParams in page content, the content part would be wrapped */}
      <div className="relative z-10 flex h-screen flex-1 flex-col pl-16">
          <header className="flex h-16 shrink-0 items-center gap-4 border-b border-border/20 bg-background/50 px-6 backdrop-blur-sm">
            <CollaborationLogo className="h-7 w-7 text-primary" />
            <h1 className="text-xl font-semibold tracking-tight">Collaboration Hub</h1>
            
            <div className="ml-auto flex items-center gap-4">
              <div className="flex items-center gap-2 border-r pr-4 mr-2 border-border/50">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger><Github className={cn('h-5 w-5 transition-colors', connectedServices['GitHub'] ? 'text-primary' : 'text-muted-foreground/50')} /></TooltipTrigger>
                    <TooltipContent>GitHub: {connectedServices['GitHub'] ? 'Connected' : 'Disconnected'}</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger><Gitlab className={cn('h-5 w-5 transition-colors', connectedServices['GitLab'] ? 'text-primary' : 'text-muted-foreground/50')} /></TooltipTrigger>
                    <TooltipContent>GitLab: {connectedServices['GitLab'] ? 'Connected' : 'Disconnected'}</TooltipContent>
                  </Tooltip>
                   <Tooltip>
                    <TooltipTrigger><AzureDevopsLogo className={cn('h-5 w-5 transition-colors', connectedServices['Azure DevOps'] ? 'text-primary' : 'text-muted-foreground/50')} /></TooltipTrigger>
                    <TooltipContent>Azure DevOps: {connectedServices['Azure DevOps'] ? 'Connected' : 'Disconnected'}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline"><Settings className="mr-2 h-4 w-4" /> Manage Connections</Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Connect Services</SheetTitle>
                    <SheetDescription>
                      Manage your connections to third-party developer services.
                    </SheetDescription>
                  </SheetHeader>
                  <div className="space-y-6 py-6">
                    <Card className={cn('bg-card/80 transition-all', connectedServices['GitHub'] && 'border-primary')}>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Github /> GitHub</CardTitle>
                        <CardDescription>Connect your repositories for seamless integration.</CardDescription>
                      </CardHeader>
                      <CardFooter>
                        <Button className="w-full" onClick={() => handleConnect('GitHub')} variant={connectedServices['GitHub'] ? 'secondary' : 'default'}>
                          {connectedServices['GitHub'] ? 'Disconnect' : 'Connect'}
                        </Button>
                      </CardFooter>
                    </Card>
                    <Card className={cn('bg-card/80 transition-all', connectedServices['GitLab'] && 'border-primary')}>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Gitlab /> GitLab</CardTitle>
                        <CardDescription>Link your projects and pipelines.</CardDescription>
                      </CardHeader>
                      <CardFooter>
                        <Button className="w-full" onClick={() => handleConnect('GitLab')} variant={connectedServices['GitLab'] ? 'secondary' : 'default'}>
                          {connectedServices['GitLab'] ? 'Disconnect' : 'Connect'}
                        </Button>
                      </CardFooter>
                    </Card>
                    <Card className={cn('bg-card/80 transition-all', connectedServices['Azure DevOps'] && 'border-primary')}>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2"><AzureDevopsLogo className="h-5 w-5" /> Azure DevOps</CardTitle>
                        <CardDescription>Integrate your boards and repos from Azure.</CardDescription>
                      </CardHeader>
                      <CardFooter>
                        <Button className="w-full" onClick={() => handleConnect('Azure DevOps')} variant={connectedServices['Azure DevOps'] ? 'secondary' : 'default'}>
                          {connectedServices['Azure DevOps'] ? 'Disconnect' : 'Connect'}
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
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
                      Connect your developer tools and start collaborating with your team.
                    </p>
                     <p className="mt-4 text-sm text-muted-foreground">
                      Try asking: <em className='text-foreground/80'>"List issues for google/genkit"</em> or <em className='text-foreground/80'>"Get details for proStqns2"</em>
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
                      <div className={cn('max-w-2xl rounded-lg', message.role === 'user' ? 'bg-primary p-3 text-primary-foreground' : 'border bg-card/80 p-3 backdrop-blur-sm')}>
                         <p className="whitespace-pre-wrap">{message.content}</p>
                         {message.dataType === 'githubUser' && message.data && <GithubUserCard user={message.data} />}
                         {message.dataType === 'githubIssues' && message.data && <GithubIssuesList issues={message.data} />}
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
                  placeholder="Ask about a GitHub user or repository..."
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
    </div>
  );
}
