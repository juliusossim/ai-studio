import { buildSystemPrompt } from '@org/prompts';
import { ChatCompletion } from 'openai/resources';
import { baseAgent } from './agents/agents.js';
import { MemoryStore } from './data/service.js';
import type { SendMessageInputs, ToolCallHandlerInputs, ToolHandler } from './types.js';
import functionTools from './operations/functionTools.js';

export class ChatEngine {
  private readonly toolHandlers: Map<string, ToolHandler> = new Map();

  constructor(private readonly memoryStore: MemoryStore) {}

  registerTool(name: string, handler: ToolHandler): void {
    this.toolHandlers.set(name, handler);
  }

 async sendMessage(sendMessageInputs: SendMessageInputs): Promise<ChatCompletion> {
    const { conversationId, profile, input, rules, ...baseAgentInputs } = sendMessageInputs;
    const storedProfile = this.memoryStore.getProfile(sendMessageInputs.conversationId);
    const systemPrompt = buildSystemPrompt({
      input,
      rules,
      profile: profile || storedProfile,
    });
    this.memoryStore.getOrCreateConversation(conversationId, systemPrompt);

    this.memoryStore.addMessage(conversationId, { role: 'user', content: input });

    if (input.toLowerCase().includes('my name is')) {
      const name = input.toLowerCase().split('my name is')[1].trim().split(' ')[0];
      this.memoryStore.updateProfile(conversationId, { userName: name });
    }

    if (input.toLowerCase().includes('i prefer')) {
      const language = input.toLowerCase().split('i prefer')[1].trim().split(' ')[0];
      this.memoryStore.updateProfile(conversationId, { preferredLanguage: language });
    }

    const messages = this.memoryStore.getTrimmedMessages(conversationId, 10);
    if (!messages) {
      throw new Error('No messages found');
    }

    const response = await baseAgent({ ...baseAgentInputs, messages });
    if (!response.choices || response.choices.length === 0) {
      throw new Error('No response from agent');
    }

    // Handle tool calls if the model requested them
    const currentResponse = await this.handleToolCalls({ conversationId, response, baseAgentInputs });

    this.memoryStore.addMessage(conversationId, { role: 'assistant', content: currentResponse.choices[0].message.content ?? '' });
    return currentResponse;
  }

  private async handleToolCalls({conversationId, response, baseAgentInputs}: ToolCallHandlerInputs
  ): Promise<ChatCompletion> {
    let currentResponse = response;

    while (currentResponse.choices[0].message.tool_calls?.length) {
      const msg = currentResponse.choices[0].message;
      if (!msg.content) {
        msg.content = '';
      }
      this.memoryStore.addMessage(conversationId, msg);

      const toolResults = functionTools(currentResponse, this.toolHandlers);
      for (const toolResult of toolResults) {
        this.memoryStore.addMessage(conversationId, toolResult);
      }

      const updatedMessages = this.memoryStore.getTrimmedMessages(conversationId, 20);
      if (!updatedMessages) {
        throw new Error('No messages found after tool execution');
      }

      currentResponse = await baseAgent({ ...baseAgentInputs, messages: updatedMessages });
      if (!currentResponse.choices || currentResponse.choices.length === 0) {
        throw new Error('No response from agent after tool execution');
      }
    }

    return currentResponse;
  }

   chat(inputs: ChatCompletion, choice = 0): string {
    return inputs.choices[choice]?.message.content ?? '';
  }

  chatChoices(input: ChatCompletion): ChatCompletion.Choice[] {
    if (!input.choices) {
      throw new Error('No chat choices available');
    }
    return input.choices;
  }




}