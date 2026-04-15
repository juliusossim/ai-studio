import { ChatCompletion, ChatCompletionMessageParam, ChatCompletionMessageToolCall } from "openai/resources";
import { ToolHandler } from "../types.js";

const functionTools = (response: ChatCompletion, toolHandlers: Map<string, ToolHandler>): ChatCompletionMessageParam[] => {
    const message = response.choices[0]?.message;

    if (!message) {
        throw new Error("No response from the agent");
    }

    if (!message.tool_calls || message.tool_calls.length === 0) {
        throw new Error("Agent did not call any tools");
    }

    return message.tool_calls.map((toolCall: ChatCompletionMessageToolCall) => {
        if (toolCall.type !== "function") {
            throw new Error(`Unexpected tool call type: ${toolCall.type}`);
        }
        if (toolCall.function.name !== "calculator") {
            throw new Error(`Agent called an unexpected tool: ${toolCall.function.name}`);
        }
        const toolArgs = JSON.parse(toolCall.function.arguments);
        const handler = toolHandlers.get(toolCall.function.name);
        if (!handler) {
            throw new Error(`No handler found for tool: ${toolCall.function.name}`);
        }
        const result = handler(toolArgs);
        return {
            role: "tool" as const,
            tool_call_id: toolCall.id,
            content: JSON.stringify({ result }),
        };
    });
}

export default functionTools;

