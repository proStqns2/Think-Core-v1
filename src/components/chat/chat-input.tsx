'use client';

import * as React from 'react';
import { Send, Paperclip, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface ChatInputProps {
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSendMessage: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  onAttach: () => void;
  onMic: () => void;
}

export function ChatInput({
  input,
  handleInputChange,
  handleSendMessage,
  isLoading,
  onAttach,
  onMic,
}: ChatInputProps) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    if (textareaRef.current) {
      const maxHeight = 192; // 12rem
      textareaRef.current.style.height = 'auto'; // Reset height
      const scrollHeight = textareaRef.current.scrollHeight;
      if (scrollHeight > maxHeight) {
        textareaRef.current.style.height = `${maxHeight}px`;
        textareaRef.current.style.overflowY = 'auto';
      } else {
        textareaRef.current.style.height = `${scrollHeight}px`;
        textareaRef.current.style.overflowY = 'hidden';
      }
    }
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      // a bit of a hack to submit the form
      e.currentTarget.form?.requestSubmit();
    }
  };

  return (
    <div className="p-4 bg-transparent">
      <form
        onSubmit={handleSendMessage}
        className="max-w-4xl mx-auto"
      >
        <div className="flex flex-col rounded-2xl border bg-background/70 p-2 shadow-lg backdrop-blur-sm">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Assign a task or ask anything"
            className="flex-1 resize-none border-0 bg-transparent px-2 pt-2 shadow-none focus-visible:ring-0"
            rows={1}
            disabled={isLoading}
            aria-label="Chat input"
          />
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" type="button" onClick={onAttach} className="text-muted-foreground">
                <Paperclip className="h-5 w-5" />
                <span className="sr-only">Attach file</span>
              </Button>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" type="button" onClick={onMic} className="text-muted-foreground">
                <Mic className="h-5 w-5" />
                <span className="sr-only">Use microphone</span>
              </Button>
              <Button type="submit" size="icon" disabled={isLoading || !input.trim()} aria-label="Send message">
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
