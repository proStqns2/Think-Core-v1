import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import { initialAIChatResponse } from '@/ai/flows/initial-ai-chat-response';
import { advancedAIChatResponse } from '@/ai/flows/advanced-ai-chat-response';
import { summarizeChatHistory } from '@/ai/flows/summarize-chat-history';
import { useToast } from '@/hooks/use-toast';
import type { Message } from '@/lib/types';
import { nanoid } from 'nanoid';

export function useChat() {
  const searchParams = useSearchParams();
  const initialMode = searchParams.get('mode') === 'advanced' ? 'advanced' : 'standard';

  const [messages, setMessages] = React.useState<Message[]>([]);
  const [input, setInput] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [mode, setMode] = React.useState(initialMode);
  const [model, setModel] = React.useState('gemini-1.5-flash');
  const { toast } = useToast();

  React.useEffect(() => {
    const newMode = searchParams.get('mode') === 'advanced' ? 'advanced' : 'standard';
    setMode(newMode);
  }, [searchParams]);

  React.useEffect(() => {
    // Clean up other potential mode classes
    document.body.classList.remove('cuda-mode', 'imagera-mode', 'collaboration-mode');

    if (mode === 'advanced') {
      document.body.classList.add('advanced-mode');
    } else {
      document.body.classList.remove('advanced-mode');
    }
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
      const aiResponse = await aiFlow({ prompt: messageContent, model: model });

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

  const handleNewChat = () => {
    setMessages([]);
    toast({
      title: 'New Chat Started',
      description: 'The conversation has been cleared.',
    });
  };

  return {
    messages,
    input,
    isLoading,
    mode,
    model,
    setInput,
    setModel,
    handleSendMessage,
    handleSuggestionClick,
    handleSummarize,
    handleNewChat,
  };
}
