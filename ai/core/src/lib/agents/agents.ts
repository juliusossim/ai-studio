import type { BaseAgent } from './types.js';

export interface AgentResponse {
  model: string;
  tools: string[];
}

export async function createAgent({ model, tools }: BaseAgent): Promise<AgentResponse> {
  return {
    model,
    tools,
  };
}
