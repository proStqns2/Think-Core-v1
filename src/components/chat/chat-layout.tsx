import type React from 'react';
import type { Message } from '@/lib/types';
import { ChatHeader } from './chat-header';
import { ChatMessages } from './chat-messages';
import { ChatInput } from './chat-input';
import { ModelSelector } from './model-selector';
import { SuggestionChips } from './suggestion-chips';

interface ChatLayoutProps {
  messages: Message[];
  input: string;
  mode: string;
  model: string;
  setModel: (model: string) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSendMessage: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  onSummarize: () => void;
  onExport: () => void;
  onNewChat: () => void;
  onSuggestionClick: (prompt: string) => void;
  onAttach: () => void;
  onMic: () => void;
  onSettings: () => void;
}

export function ChatLayout({
  messages,
  input,
  mode,
  model,
  setModel,
  handleInputChange,
  handleSendMessage,
  isLoading,
  onSummarize,
  onExport,
  onNewChat,
  onSuggestionClick,
  onAttach,
  onMic,
  onSettings,
}: ChatLayoutProps) {
  return (
    <div className="flex flex-col h-full w-full max-w-4xl mx-auto">
      <ChatHeader
        onSummarize={onSummarize}
        onExport={onExport}
        onNewChat={onNewChat}
        mode={mode}
      >
        <ModelSelector model={model} setModel={setModel} />
      </ChatHeader>
      <div className="flex-1 overflow-hidden flex flex-col">
        <ChatMessages messages={messages} isLoading={isLoading} />
        <div className="mt-auto w-full">
          {messages.length === 0 && !isLoading && (
            <SuggestionChips onSuggestionClick={onSuggestionClick} />
          )}
          <ChatInput
            input={input}
            handleInputChange={handleInputChange}
            handleSendMessage={handleSendMessage}
            isLoading={isLoading}
            onAttach={onAttach}
            onMic={onMic}
            onSettings={onSettings}
          />
        </div>
      </div>
    </div>
  );
}
