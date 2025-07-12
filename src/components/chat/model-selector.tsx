'use client';

import * as React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ModelSelectorProps {
  model: string;
  setModel: (model: string) => void;
}

export function ModelSelector({ model, setModel }: ModelSelectorProps) {
  return (
    <Select value={model} onValueChange={setModel}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a model" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="gemini-1.5-flash">Gemini 1.5 Flash</SelectItem>
        <SelectItem value="gemini-pro">Gemini Pro</SelectItem>
      </SelectContent>
    </Select>
  );
}
