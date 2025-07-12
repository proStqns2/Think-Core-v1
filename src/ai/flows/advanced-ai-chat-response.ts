'use server';

/**
 * @fileOverview Responds to user prompts with advanced, in-depth analysis.
 *
 * - advancedAIChatResponse - A function that handles the advanced AI chat response process.
 * - AdvancedAIChatResponseInput - The input type for the advancedAIChatResponse function.
 * - AdvancedAIChatResponseOutput - The return type for the advancedAIChatResponse function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AdvancedAIChatResponseInputSchema = z.object({
  prompt: z.string().describe('The prompt from the user.'),
  model: z.string().optional().describe('The model to use for the response.'),
});
export type AdvancedAIChatResponseInput = z.infer<typeof AdvancedAIChatResponseInputSchema>;

const AdvancedAIChatResponseOutputSchema = z.object({
  response: z.string().describe('The advanced response from the AI.'),
});
export type AdvancedAIChatResponseOutput = z.infer<typeof AdvancedAIChatResponseOutputSchema>;

export async function advancedAIChatResponse(input: AdvancedAIChatResponseInput): Promise<AdvancedAIChatResponseOutput> {
  return advancedAIChatResponseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'advancedAIChatResponsePrompt',
  input: {schema: AdvancedAIChatResponseInputSchema},
  output: {schema: AdvancedAIChatResponseOutputSchema},
  prompt: `You are EloquentAI Advanced, a sophisticated AI assistant capable of deep analysis and providing comprehensive, well-structured answers. Your capabilities are similar to Gemini Advanced.

When the user asks a question, perform a 'deep search' of your knowledge to give the most thorough and insightful response possible. Break down complex topics into understandable parts, use examples, and provide detailed explanations.`,
  config: {
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
  },
});

const advancedAIChatResponseFlow = ai.defineFlow(
  {
    name: 'advancedAIChatResponseFlow',
    inputSchema: AdvancedAIChatResponseInputSchema,
    outputSchema: AdvancedAIChatResponseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
