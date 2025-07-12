'use client';

import * as React from 'react';
import { useChat } from '@/hooks/use-chat';
import { useToast } from '@/hooks/use-toast';
import { ChatLayout } from '@/components/chat/chat-layout';
import { Skeleton } from '@/components/ui/skeleton';

function ChatPageContent() {
  const {
    messages,
    input,
    isLoading,
    mode,
    setInput,
    handleSendMessage,
    handleSuggestionClick,
    handleSummarize,
    handleNewChat,
    model,
    setModel,
  } = useChat();
  const { toast } = useToast();

  const handleAttach = () => {
    toast({
      title: 'Feature not implemented',
      description: 'File uploads are not yet available.',
    });
  };

  const handleMic = () => {
    toast({
      title: 'Feature not implemented',
      description: 'Voice input is not yet available.',
    });
  };
  
  const handleSettings = () => {
    toast({
      title: 'Feature not implemented',
      description: 'Settings functionality is not yet available.',
    });
  };

  const handleExport = () => {
    if (messages.length === 0) return;
    const chatLog = messages
      .map(
        (msg) =>
          `[${msg.createdAt?.toLocaleString()}] ${msg.role.toUpperCase()}: ${
            msg.content
          }`
      )
      .join('\n\n');

    const blob = new Blob([chatLog], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `eloquent-ai-chat-${new Date().toISOString()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast({
      title: 'Success',
      description: 'Chat log has been exported.',
    });
  };

  return (
    <main className="flex h-screen flex-col items-center bg-black">
      <ChatLayout
        messages={messages}
        input={input}
        handleInputChange={(e) => setInput(e.target.value)}
        handleSendMessage={handleSendMessage}
        isLoading={isLoading}
        onSummarize={handleSummarize}
        onNewChat={handleNewChat}
        onExport={handleExport}
        mode={mode}
        onSuggestionClick={handleSuggestionClick}
        onAttach={handleAttach}
        onMic={handleMic}
        onSettings={handleSettings}
        model={model}
        setModel={setModel}
      />
    </main>
  );
}

function LoadingFallback() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-black">
      <div className="flex flex-col items-center gap-4">
        <Skeleton className="h-24 w-24 rounded-full" />
        <Skeleton className="h-8 w-48" />
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <React.Suspense fallback={<LoadingFallback />}>
      <ChatPageContent />
    </React.Suspense>
  );
}
