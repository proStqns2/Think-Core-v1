'use client';

import { cn } from '@/lib/utils';
import type { Message } from '@/lib/types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { BrainCircuit, User, Copy, Loader2 } from 'lucide-react';
import { Logo } from '../ui/logo';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';

import { Trash2 } from 'lucide-react'; // Added Trash2 icon

interface ChatMessageProps {
  message?: Message;
  isLoading?: boolean;
  mode?: 'standard' | 'advanced';
  onDeleteMessage?: (messageId: string) => void; // Added onDeleteMessage prop
}

export function ChatMessage({ message, isLoading = false, mode = 'standard', onDeleteMessage }: ChatMessageProps) {
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
            'max-w-md rounded-lg p-3 shadow-md flex flex-col', // Added flex flex-col
            isUser
              ? 'bg-primary text-primary-foreground'
              : isSystem
              ? 'bg-accent/20 border border-accent/50'
              : 'bg-card border'
          )}
        >
          {/* Sender Name */}
          <p className={cn(
            "text-xs font-medium mb-1",
            isUser ? "text-primary-foreground/80" : "text-muted-foreground"
          )}>
            {isUser ? "You" : isAssistant ? (mode === 'advanced' ? "EloquentAI Advanced" : "EloquentAI") : "System"}
          </p>
          <p className="whitespace-pre-wrap text-sm">{content}</p>
          <div className="mt-1 flex items-center justify-end gap-2 self-end"> {/* Added self-end */}
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
        {/* Reactions Section */}
        {isAssistant && !isLoading && (
          <div className="flex gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity items-center">
            {['👍', '❤️', '😂', '😮'].map((emoji) => (
              <Button
                key={emoji}
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-xs hover:bg-muted/50"
                onClick={() => {
                  toast({ title: `Reacted with ${emoji}` });
                  // TODO: Implement actual reaction state update if needed
                }}
              >
                {emoji}
              </Button>
            ))}
          </div>
        )}
        {/* Delete Button for User messages */}
        {isUser && onDeleteMessage && message && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => onDeleteMessage(message.id)}
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete message</span>
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
