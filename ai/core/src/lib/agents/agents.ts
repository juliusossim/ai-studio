import { OpenAI } from 'openai';
import type { BaseAgent } from './types.js';
import { requireEnv } from '@org/config';
import { ChatCompletion } from 'openai/resources';

const openai = new OpenAI({
  apiKey: requireEnv('OPENAI_API_KEY'),
});

export async function baseAgent({
  model = 'gpt-4o-mini',
  tools,
  messages,
}: BaseAgent): Promise<ChatCompletion> {
  const response = await openai.chat.completions.create({
    model,
    messages,
    tools,
    temperature: 0,
    max_tokens: 1000,
  });
  return response;
}
