'use server';

/**
 * @fileOverview Responds to user prompts intelligently and conversationally.
 *
 * - initialAIChatResponse - A function that handles the AI chat response process.
 * - InitialAIChatResponseInput - The input type for the initialAIChatResponse function.
 * - InitialAIChatResponseOutput - The return type for the initialAIChatResponse function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const InitialAIChatResponseInputSchema = z.object({
  prompt: z.string().describe('The prompt from the user.'),
});
export type InitialAIChatResponseInput = z.infer<typeof InitialAIChatResponseInputSchema>;

const InitialAIChatResponseOutputSchema = z.object({
  response: z.string().describe('The response from the AI.'),
});
export type InitialAIChatResponseOutput = z.infer<typeof InitialAIChatResponseOutputSchema>;

export async function initialAIChatResponse(input: InitialAIChatResponseInput): Promise<InitialAIChatResponseOutput> {
  return initialAIChatResponseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'initialAIChatResponsePrompt',
  input: {schema: InitialAIChatResponseInputSchema},
  output: {schema: InitialAIChatResponseOutputSchema},
  prompt: `You are a helpful and intelligent AI assistant. Respond to the following prompt from the user:

{{{prompt}}}`, config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
    ],
  }
});

const initialAIChatResponseFlow = ai.defineFlow(
  {
    name: 'initialAIChatResponseFlow',
    inputSchema: InitialAIChatResponseInputSchema,
    outputSchema: InitialAIChatResponseOutputSchema,
  },
  async input => {
    const {text} = await ai.generate({
      prompt: prompt,
      input
    });
    return {response: text!};
  }
);
