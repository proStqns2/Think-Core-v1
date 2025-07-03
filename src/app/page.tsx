'use client';

import * as React from 'react';
import { initialAIChatResponse } from '@/ai/flows/initial-ai-chat-response';
import { summarizeChatHistory } from '@/ai/flows/summarize-chat-history';
import { useToast } from '@/hooks/use-toast';
import type { Message } from '@/lib/types';
import { ChatLayout } from '@/components/chat/chat-layout';
import { nanoid } from 'nanoid';

export default function Home() {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [input, setInput] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: nanoid(),
      role: 'user',
      content: input,
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const aiResponse = await initialAIChatResponse({ prompt: input });
      const assistantMessage: Message = {
        id: nanoid(),
        role: 'assistant',
        content: aiResponse.response,
        createdAt: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      toast({
        title: 'Error',
        description: 'Failed to get a response from the AI. Please try again.',
        variant: 'destructive',
      });
      setMessages((prev) => prev.slice(0, -1)); // Remove user message on error
    } finally {
      setIsLoading(false);
    }
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
    link.download = `think-code-ai-chat-${new Date().toISOString()}.txt`;
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
    <main className="flex h-screen flex-col items-center justify-center p-4 md:p-6 bg-transparent">
      <ChatLayout
        messages={messages}
        input={input}
        handleInputChange={(e) => setInput(e.target.value)}
        handleSendMessage={handleSendMessage}
        isLoading={isLoading}
        onSummarize={handleSummarize}
        onExport={handleExport}
      />
    </main>
  );
}
