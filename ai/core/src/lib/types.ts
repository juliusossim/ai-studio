import { SystemPrompt } from "@org/types";
import { BaseAgent } from "./agents/types.js";
import { OpenAI } from "openai/client";
import { ChatCompletion } from "openai/resources";

export interface SendMessageInputs extends SystemPrompt, Omit<BaseAgent, "messages"> {
    conversationId: string;
}
export type ToolHandler = (toolCall: OpenAI.Chat.Completions.ChatCompletionMessageToolCall) => string | Promise<string>;

export interface ToolCallHandlerInputs {
        conversationId: string;
        response: ChatCompletion;
        baseAgentInputs: Omit<BaseAgent, 'messages'>;
}