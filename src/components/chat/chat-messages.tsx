'use client';

import * as React from 'react';
import type { Message } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatMessage } from './chat-message';

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
  mode: 'standard' | 'advanced';
  onDeleteMessage?: (messageId: string) => void; // Added onDeleteMessage prop
}

export function ChatMessages({ messages, isLoading, mode, onDeleteMessage }: ChatMessagesProps) { // Added onDeleteMessage prop
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);
  const viewportRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const viewport = viewportRef.current;
    if (viewport) {
      viewport.scrollTo({
        top: viewport.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, isLoading]);

  return (
    <ScrollArea className="flex-1 w-full" viewportRef={viewportRef}>
      <div className="p-4 md:p-6 max-w-4xl mx-auto">
        {messages.length === 0 && !isLoading ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-20">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground/90 tracking-tight">
              Hello!
            </h1>
            <h2 className="mt-2 text-2xl md:text-3xl text-muted-foreground">
              What can I do for you?
            </h2>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                mode={mode}
                onDeleteMessage={onDeleteMessage} // Pass onDeleteMessage
              />
            ))}
            {isLoading && <ChatMessage isLoading mode={mode} />} {/* onDeleteMessage not needed for loading skeleton */}
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
