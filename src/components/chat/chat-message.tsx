'use client';

import { cn } from '@/lib/utils';
import type { Message } from '@/lib/types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { BrainCircuit, User, Copy } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import { Logo } from '../ui/logo';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import Orb from '../orb';

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
        <Avatar className="h-9 w-9 border bg-black overflow-hidden">
          <Orb forceHoverState={true} hue={210} />
        </Avatar>
        <div className="flex flex-col gap-2 pt-1">
          <p className="text-sm text-muted-foreground animate-pulse">
            EloquentAI is thinking...
          </p>
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
            'max-w-md rounded-lg p-3 shadow-md',
            isUser
              ? 'bg-primary text-primary-foreground'
              : isSystem
              ? 'bg-accent/20 border border-accent/50'
              : 'bg-card border'
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
