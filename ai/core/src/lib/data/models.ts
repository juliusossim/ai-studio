import { SessionProfile } from '@org/types';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

export interface Conversation {
  id: string;
  messages: ChatCompletionMessageParam[];
  profile?: SessionProfile;
  createdAt: Date;
  updatedAt: Date;
}
