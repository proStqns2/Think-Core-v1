import type React from 'react';
import type { Message } from '@/lib/types';
import { ChatHeader } from './chat-header';
import { ChatMessages } from './chat-messages';
import { ChatInput } from './chat-input';
import { Card } from '@/components/ui/card';

interface ChatLayoutProps {
  messages: Message[];
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSendMessage: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  onSummarize: () => void;
  onExport: () => void;
}

export function ChatLayout({
  messages,
  input,
  handleInputChange,
  handleSendMessage,
  isLoading,
  onSummarize,
  onExport,
}: ChatLayoutProps) {
  return (
    <Card className="flex flex-col w-full max-w-4xl h-full max-h-[90vh] shadow-2xl">
      <ChatHeader onSummarize={onSummarize} onExport={onExport} />
      <ChatMessages messages={messages} isLoading={isLoading} />
      <ChatInput
        input={input}
        handleInputChange={handleInputChange}
        handleSendMessage={handleSendMessage}
        isLoading={isLoading}
      />
    </Card>
  );
}
