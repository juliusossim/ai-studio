import { ChatCompletionMessageParam } from 'openai/resources';
import { Conversation } from './models.js';
import { SessionProfile } from '@org/types';

export class MemoryStore {
  private readonly conversations: Map<string, Conversation> = new Map();

  getOrCreateConversation(id: string, systemPrompt: string): Conversation {
    let conversation = this.conversations.get(id);
    if (!conversation) {
      conversation = {
        id,
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.conversations.set(id, conversation);
    }
    return conversation;
  }

  addMessage(conversationId: string, message: ChatCompletionMessageParam): void {
    const conversation = this.conversations.get(conversationId);
    if (conversation) {
      conversation.messages.push(message);
      conversation.updatedAt = new Date();
    }
  }

  getMessages(conversationId: string): ChatCompletionMessageParam[] | undefined {
    const conversation = this.conversations.get(conversationId);
    return conversation?.messages;
  }

  updateProfile(conversationId: string, patch: Partial<SessionProfile>): void {
    const conversation = this.conversations.get(conversationId);
    if (conversation) {
      conversation.profile = { ...conversation.profile, ...patch };
      conversation.updatedAt = new Date();
    }
  }

  getProfile(conversationId: string): SessionProfile | undefined {
    const conversation = this.conversations.get(conversationId);
    return conversation?.profile;
  }

  getTrimmedMessages(
    conversationId: string,
    maxTokens: number,
  ): ChatCompletionMessageParam[] | undefined {
    const messages = this.getMessages(conversationId);
    if (!messages) {
      return undefined;
    }
    if (messages?.length <= maxTokens) {
      return messages;
    }
    const systemMessage = messages.filter(
      (msg: ChatCompletionMessageParam) => msg.role === 'system',
    );
    const userAndAssistantMessages = messages.filter(
      (msg: ChatCompletionMessageParam) => msg.role !== 'system',
    );
    const recentMessages = userAndAssistantMessages.slice(-(maxTokens - systemMessage.length));
    return [...systemMessage, ...recentMessages];
  }

  deleteConversation(conversationId: string): void {
    this.conversations.delete(conversationId);
  }
}

export const memoryStore = new MemoryStore();
