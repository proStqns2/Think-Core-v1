'use server';

/**
 * @fileOverview An image generation AI agent called Imagera.
 *
 * - imageraImageResponse - A function that handles the image generation process.
 * - ImageraImageResponseInput - The input type for the imageraImageResponse function.
 * - ImageraImageResponseOutput - The return type for the imageraImageResponse function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ImageraImageResponseInputSchema = z.object({
  prompt: z.string().describe('The prompt from the user describing the image to generate.'),
  imageDataUri: z.optional(z.string().describe("An optional reference image as a data URI. Expected format: 'data:<mimetype>;base64,<encoded_data>'.")),
});
export type ImageraImageResponseInput = z.infer<typeof ImageraImageResponseInputSchema>;

const ImageraImageResponseOutputSchema = z.object({
  imageUrl: z.string().describe("The generated image as a data URI. Expected format: 'data:image/png;base64,<encoded_data>'."),
});
export type ImageraImageResponseOutput = z.infer<typeof ImageraImageResponseOutputSchema>;

export async function imageraImageResponse(input: ImageraImageResponseInput): Promise<ImageraImageResponseOutput> {
  return imageraImageResponseFlow(input);
}

const imageraImageResponseFlow = ai.defineFlow(
  {
    name: 'imageraImageResponseFlow',
    inputSchema: ImageraImageResponseInputSchema,
    outputSchema: ImageraImageResponseOutputSchema,
  },
  async ({ prompt, imageDataUri }) => {
    const finalPrompt = imageDataUri
      ? [{ media: { url: imageDataUri } }, { text: prompt }]
      : prompt;

    const { media } = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: finalPrompt,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!media || !media.url) {
      throw new Error('Image generation failed.');
    }

    return { imageUrl: media.url };
  }
);
