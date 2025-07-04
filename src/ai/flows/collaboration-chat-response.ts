'use server';

/**
 * @fileOverview A collaboration-focused AI agent that can use tools.
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

const getGithubUserDetails = ai.defineTool(
  {
    name: 'getGithubUserDetails',
    description: 'Get details for a specific GitHub user.',
    inputSchema: z.object({
      username: z.string().describe('The GitHub username.'),
    }),
    outputSchema: z.object({
      name: z.string().describe("The user's display name."),
      publicRepos: z.number().describe('Number of public repositories.'),
      followers: z.number().describe('Number of followers.'),
    }),
  },
  async ({ username }) => {
    // In a real app, you'd call the GitHub API here.
    // For this demo, we'll return mock data.
    console.log(`Tool: Faking GitHub API call for user: ${username}`);
    return {
      name: username,
      publicRepos: Math.floor(Math.random() * 50) + 1,
      followers: Math.floor(Math.random() * 1000),
    };
  }
);

const listGithubIssues = ai.defineTool(
  {
    name: 'listGithubIssues',
    description: 'List open issues for a given GitHub repository.',
    inputSchema: z.object({
      owner: z.string().describe("The repository owner's username."),
      repo: z.string().describe('The name of the repository.'),
    }),
    outputSchema: z.array(z.object({
      id: z.number(),
      title: z.string(),
      author: z.string(),
    })),
  },
  async ({ owner, repo }) => {
    // In a real app, you'd call the GitHub API here.
    console.log(`Tool: Faking GitHub API call for issues in ${owner}/${repo}`);
    return [
      { id: 1, title: 'Fix the login button style', author: 'mockuser1' },
      { id: 2, title: 'Add dark mode support to new component', author: 'mockuser2' },
      { id: 3, title: 'Improve API response time', author: 'mockuser1' },
    ];
  }
);

export async function collaborationChatResponse(input: CollaborationChatInput): Promise<CollaborationChatOutput> {
  return collaborationChatResponseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'collaborationChatResponsePrompt',
  input: {schema: CollaborationChatInputSchema},
  output: {schema: CollaborationChatOutputSchema},
  tools: [getGithubUserDetails, listGithubIssues],
  prompt: `You are a collaboration assistant AI. Your goal is to help teams communicate effectively and plan projects.

If the user asks about GitHub (e.g., user details, repository issues), use the provided tools to get the information. Otherwise, respond to the user's prompt in a helpful and concise manner.

User prompt: {{{prompt}}}`,
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
