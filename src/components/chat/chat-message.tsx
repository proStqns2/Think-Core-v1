'use client';

import { cn } from '@/lib/utils';
import type { Message } from '@/lib/types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { BrainCircuit, User, Copy, Loader2 } from 'lucide-react';
import { Logo } from '../ui/logo';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';

interface ChatMessageProps {
  message?: Message;
  isLoading?: boolean;
}

export function ChatMessage({ message, isLoading = false }: ChatMessageProps) {
  const { toast } = useToast();

  const handleCopy = (content: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(content);
      toast({
        title: 'Copied!',
        description: 'The message has been copied to your clipboard.',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-start gap-4">
        <Avatar className="h-9 w-9 border bg-background shadow-sm">
          <AvatarFallback>
            <Logo className="h-5 w-5 animate-pulse text-primary" />
          </AvatarFallback>
        </Avatar>
        <div className="flex items-center gap-2 rounded-lg border bg-card p-3">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="text-sm text-muted-foreground">Thinking...</span>
        </div>
      </div>
    );
  }

  if (!message) return null;

  const { role, content, createdAt, status } = message;
  const isUser = role === 'user';
  const isSystem = role === 'system';
  const isAssistant = role === 'assistant';

  return (
    <div
      className={cn(
        'group flex w-full items-start gap-4',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      {!isUser && (
        <Avatar className="h-9 w-9 border bg-background self-start">
          <AvatarFallback>
            {isSystem ? (
              <BrainCircuit className="h-5 w-5 text-accent" />
            ) : (
              <Logo className="h-5 w-5 text-primary" />
            )}
          </AvatarFallback>
        </Avatar>
      )}

      <div
        className={cn(
          'flex items-end gap-1',
          isUser ? 'flex-row-reverse' : 'flex-row'
        )}
      >
        <div
          className={cn(
          'max-w-md rounded-xl p-4 shadow-lg transition-shadow duration-300 hover:shadow-xl',
            isUser
            ? 'bg-blue-600 text-white'
              : isSystem
            ? 'bg-purple-500/20 border border-purple-500/50'
            : 'bg-white dark:bg-gray-800'
          )}
        >
          <p className="whitespace-pre-wrap text-sm">{content}</p>
          <div className="mt-1 flex items-center justify-end gap-2">
            {isAssistant && status && (
              <div
                className={cn('h-2 w-2 rounded-full', {
                  'bg-green-500': status === 'ok',
                  'bg-red-500': status === 'error',
                })}
                title={status === 'ok' ? 'Success' : 'Error'}
              />
            )}
            {createdAt && (
              <p
                className={cn(
                  'text-xs',
                  isUser
                    ? 'text-primary-foreground/70'
                    : 'text-muted-foreground/70'
                )}
              >
                {new Date(createdAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            )}
          </div>
        </div>

        {isAssistant && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => handleCopy(content)}
          >
            <Copy className="h-4 w-4" />
            <span className="sr-only">Copy message</span>
          </Button>
        )}
      </div>

      {isUser && (
        <Avatar className="h-9 w-9 border bg-muted self-start">
          <AvatarFallback>
            <User className="h-5 w-5 text-muted-foreground" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
