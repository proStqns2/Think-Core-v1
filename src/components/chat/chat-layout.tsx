import type React from 'react';
import type { Message } from '@/lib/types';
import { ChatHeader } from './chat-header';
import { ChatMessages } from './chat-messages';
import { ChatInput } from './chat-input';

interface ChatLayoutProps {
  messages: Message[];
  input: string;
  mode: string;
  onModeChange: (mode: string) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSendMessage: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  onSummarize: () => void;
  onExport: () => void;
  onNewChat: () => void;
}

export function ChatLayout({
  messages,
  input,
  mode,
  onModeChange,
  handleInputChange,
  handleSendMessage,
  isLoading,
  onSummarize,
  onExport,
  onNewChat,
}: ChatLayoutProps) {
  return (
    <div className="flex flex-col h-full w-full">
      <ChatHeader
        onSummarize={onSummarize}
        onExport={onExport}
        onNewChat={onNewChat}
        mode={mode}
        onModeChange={onModeChange}
      />
      <ChatMessages messages={messages} isLoading={isLoading} />
      <ChatInput
        input={input}
        handleInputChange={handleInputChange}
        handleSendMessage={handleSendMessage}
        isLoading={isLoading}
      />
    </div>
  );
}
