import { config } from 'dotenv';
config();

import '@/ai/flows/initial-ai-chat-response.ts';
import '@/ai/flows/summarize-chat-history.ts';
import '@/ai/flows/advanced-ai-chat-response.ts';
import '@/ai/flows/cuda-code-response.ts';
import '@/ai/flows/imagera-image-response.ts';
import '@/ai/flows/collaboration-chat-response.ts';
