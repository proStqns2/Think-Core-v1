'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import { initialAIChatResponse } from '@/ai/flows/initial-ai-chat-response';
import { advancedAIChatResponse } from '@/ai/flows/advanced-ai-chat-response';
import { summarizeChatHistory } from '@/ai/flows/summarize-chat-history';
import { useToast } from '@/hooks/use-toast';
import type { Message } from '@/lib/types';
import { ChatLayout } from '@/components/chat/chat-layout';
import { nanoid } from 'nanoid';
import NeuralNetworkAnimation from '@/components/neural-network-animation';
import DigitalRainAnimation from '@/components/digital-rain-animation';
import { Skeleton } from '@/components/ui/skeleton';

function ChatPageContent() {
  const searchParams = useSearchParams();
  const initialMode = searchParams.get('mode') === 'advanced' ? 'advanced' : 'standard';

  const [messages, setMessages] = React.useState<Message[]>([]);
  const [input, setInput] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [mode] = React.useState(initialMode);
  const { toast } = useToast();

  React.useEffect(() => {
    if (mode === 'advanced') {
      document.body.classList.add('advanced-mode');
    } else {
      document.body.classList.remove('advanced-mode');
    }
    return () => {
      document.body.classList.remove('advanced-mode');
    };
  }, [mode]);

  const submitMessage = async (messageContent: string) => {
    if (!messageContent.trim() || isLoading) return;

    const userMessage: Message = {
      id: nanoid(),
      role: 'user',
      content: messageContent,
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const aiFlow =
        mode === 'advanced'
          ? advancedAIChatResponse
          : initialAIChatResponse;
      const aiResponse = await aiFlow({ prompt: messageContent });

      const assistantMessage: Message = {
        id: nanoid(),
        role: 'assistant',
        content: aiResponse.response,
        createdAt: new Date(),
        status: 'ok',
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage: Message = {
        id: nanoid(),
        role: 'assistant',
        content:
          'Sorry, I encountered an error. Please try again.',
        createdAt: new Date(),
        status: 'error',
      };
      setMessages((prev) => [...prev, errorMessage]);

      toast({
        title: 'Error',
        description: 'Failed to get a response from the AI. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await submitMessage(input);
  };
  
  const handleSuggestionClick = async (prompt: string) => {
    await submitMessage(prompt);
  };
  
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


  const handleSummarize = async () => {
    if (messages.length === 0 || isLoading) return;

    setIsLoading(true);
    try {
      const chatHistory = messages
        .map((msg) => `${msg.role}: ${msg.content}`)
        .join('\n');
      
      const { summary } = await summarizeChatHistory({ chatHistory });

      const summaryMessage: Message = {
        id: nanoid(),
        role: 'system',
        content: `Conversation summary:\n${summary}`,
        createdAt: new Date(),
      };
      setMessages((prev) => [...prev, summaryMessage]);
    } catch (error) {
      console.error('Error summarizing chat:', error);
      toast({
        title: 'Error',
        description: 'Failed to summarize the conversation.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
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

  const handleNewChat = () => {
    setMessages([]);
    toast({
      title: 'New Chat Started',
      description: 'The conversation has been cleared.',
    });
  };

  return (
    <>
      <div className="absolute inset-0 z-0">
        {mode === 'advanced' ? <NeuralNetworkAnimation /> : <DigitalRainAnimation />}
      </div>
      <main className="relative z-10 flex h-screen flex-col bg-transparent">
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
        />
      </main>
    </>
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
