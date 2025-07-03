import { cn } from '@/lib/utils';
import type { Message } from '@/lib/types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { BrainCircuit, User } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import { Logo } from '../ui/logo';

interface ChatMessageProps {
  message?: Message;
  isLoading?: boolean;
}

export function ChatMessage({ message, isLoading = false }: ChatMessageProps) {
  if (isLoading) {
    return (
      <div className="flex items-start gap-4">
        <Avatar className="h-9 w-9 border">
          <AvatarFallback>
            <Logo className="h-5 w-5 text-primary" />
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>
    );
  }

  if (!message) return null;

  const { role, content, createdAt } = message;
  const isUser = role === 'user';
  const isSystem = role === 'system';

  return (
    <div
      className={cn(
        'flex items-start gap-4',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      {!isUser && (
        <Avatar className="h-9 w-9 border bg-background">
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
          'max-w-md rounded-lg p-3 shadow-md',
          isUser
            ? 'bg-primary text-primary-foreground'
            : isSystem
            ? 'bg-accent/20 border border-accent/50'
            : 'bg-card border'
        )}
      >
        <p className="whitespace-pre-wrap text-sm">{content}</p>
        {createdAt && (
          <p
            className={cn(
              'mt-1 text-xs',
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
      {isUser && (
        <Avatar className="h-9 w-9 border bg-muted">
          <AvatarFallback>
            <User className="h-5 w-5 text-muted-foreground" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
