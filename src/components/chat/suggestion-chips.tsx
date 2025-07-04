'use client';

import { Button } from '@/components/ui/button';
import { Presentation, Image as ImageIcon, Film, Globe, BookOpen } from 'lucide-react';

interface SuggestionChipsProps {
  onSuggestionClick: (prompt: string) => void;
}

const suggestions = [
  { icon: Presentation, text: 'Slides', prompt: 'Create a 5-slide presentation outline about the future of AI.' },
  { icon: ImageIcon, text: 'Image', prompt: 'Generate an image of a serene zen garden with a cherry blossom tree.' },
  { icon: Film, text: 'Video', prompt: 'Write a short script for a promotional video for a new coffee shop.' },
  { icon: Globe, text: 'Webpage', prompt: 'Summarize the main points of the Wikipedia page for "React (JavaScript library)".' },
  { icon: BookOpen, text: 'Playbook', prompt: 'Create a step-by-step playbook for launching a new podcast.' },
];


export function SuggestionChips({ onSuggestionClick }: SuggestionChipsProps) {
  return (
    <div className="mb-4 flex flex-wrap justify-center gap-2 px-4 max-w-4xl mx-auto">
      {suggestions.map((suggestion, index) => (
        <Button
          key={index}
          variant="outline"
          className="rounded-full bg-background/50 backdrop-blur-sm"
          onClick={() => onSuggestionClick(suggestion.prompt)}
        >
          <suggestion.icon className="mr-2 h-4 w-4" />
          {suggestion.text}
        </Button>
      ))}
    </div>
  );
}
