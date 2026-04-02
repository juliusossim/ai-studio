import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

export interface BaseAgent {
  model: string;
  tools: string[];
  messages: ChatCompletionMessageParam[];
}
