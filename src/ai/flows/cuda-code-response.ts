'use server';

/**
 * @fileOverview A code generation AI agent called Cuda.
 *
 * - cudaCodeResponse - A function that handles the code generation process.
 * - CudaCodeResponseInput - The input type for the cudaCodeResponse function.
 * - CudaCodeResponseOutput - The return type for the cudaCodeResponse function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CudaCodeResponseInputSchema = z.object({
  prompt: z.string().describe('The prompt from the user describing the code to generate.'),
});
export type CudaCodeResponseInput = z.infer<typeof CudaCodeResponseInputSchema>;

const CudaCodeResponseOutputSchema = z.object({
  code: z.string().describe('The generated code snippet, formatted in a markdown block.'),
});
export type CudaCodeResponseOutput = z.infer<typeof CudaCodeResponseOutputSchema>;

export async function cudaCodeResponse(input: CudaCodeResponseInput): Promise<CudaCodeResponseOutput> {
  return cudaCodeResponseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'cudaCodeResponsePrompt',
  input: {schema: CudaCodeResponseInputSchema},
  output: {schema: CudaCodeResponseOutputSchema},
  prompt: `You are Cuda, an expert AI specializing in code generation, with deep knowledge of the patterns and examples found in the NVIDIA CUDALibrarySamples (https://github.com/NVIDIA/CUDALibrarySamples.git). Your responses must be concise, accurate, and contain only the requested code snippet, reflecting best practices from that repository.

The code should be wrapped in a single markdown code block. Do not include any explanations, conversational text, or introductions outside of the code block.

Generate code for the following prompt:
{{{prompt}}}`,
});

const cudaCodeResponseFlow = ai.defineFlow(
  {
    name: 'cudaCodeResponseFlow',
    inputSchema: CudaCodeResponseInputSchema,
    outputSchema: CudaCodeResponseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
