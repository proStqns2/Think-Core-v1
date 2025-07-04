'use server';

/**
 * @fileOverview A collaboration-focused AI agent.
 *
 * - collaborationChatResponse - A function that handles the collaboration chat process.
 * - CollaborationChatInput - The input type for the collaborationChatResponse function.
 * - CollaborationChatOutput - The return type for the collaborationChatResponse function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CollaborationChatInputSchema = z.object({
  prompt: z.string().describe('The prompt from the user.'),
});
export type CollaborationChatInput = z.infer<typeof CollaborationChatInputSchema>;

const CollaborationChatOutputSchema = z.object({
  response: z.string().describe('The response from the collaboration AI.'),
});
export type CollaborationChatOutput = z.infer<typeof CollaborationChatOutputSchema>;

export async function collaborationChatResponse(input: CollaborationChatInput): Promise<CollaborationChatOutput> {
  return collaborationChatResponseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'collaborationChatResponsePrompt',
  input: {schema: CollaborationChatInputSchema},
  output: {schema: CollaborationChatOutputSchema},
  prompt: `You are a collaboration assistant AI. Your goal is to help teams communicate effectively, plan projects, and integrate with developer tools.

Respond to the user's prompt in a helpful and concise manner.`,
});

const collaborationChatResponseFlow = ai.defineFlow(
  {
    name: 'collaborationChatResponseFlow',
    inputSchema: CollaborationChatInputSchema,
    outputSchema: CollaborationChatOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
