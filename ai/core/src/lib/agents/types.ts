import OpenAI from 'openai';
import { ChatModel } from 'openai/resources';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

export interface BaseAgent {
  messages: ChatCompletionMessageParam[];
  model?: ChatModel;
  tools?: OpenAI.Chat.Completions.ChatCompletionTool[];
  maxTokens?: number;
  temperature?: number;
}
